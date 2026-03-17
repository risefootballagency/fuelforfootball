import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    
    let event: Stripe.Event;
    
    // Verify webhook signature if secret is configured
    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
      } catch (err: any) {
        logStep("Webhook signature verification failed", { error: err.message });
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
      }
    } else {
      // For development, parse without verification
      event = JSON.parse(body);
    }
    
    logStep("Event received", { type: event.type, id: event.id });

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentLinkId = (session as any).payment_link as string | null;
      logStep("Checkout session completed", { 
        sessionId: session.id, 
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        paymentLinkId
      });

      // Update service_orders status
      const { error: updateError } = await supabaseClient
        .from('service_orders')
        .update({ 
          status: 'completed',
          stripe_payment_intent_id: session.payment_intent as string,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', session.id);

      if (updateError) {
        logStep("Failed to update service order", { error: updateError.message });
      } else {
        logStep("Service order updated to completed");
      }

      // If this checkout came from a payment link, update the pay_links record
      let payLinkTitle = '';
      if (paymentLinkId) {
        const { data: payLink, error: payLinkError } = await supabaseClient
          .from('pay_links')
          .update({ status: 'completed', updated_at: new Date().toISOString() })
          .eq('stripe_payment_link_id', paymentLinkId)
          .select('title, customer_name, customer_email, description')
          .maybeSingle();

        if (payLinkError) {
          logStep("Failed to update pay link", { error: payLinkError.message });
        } else if (payLink) {
          payLinkTitle = payLink.title;
          logStep("Pay link marked as completed", { title: payLink.title });

          // Notify staff about completed payment via email
          try {
            await supabaseClient.functions.invoke('notify-pay-link', {
              body: {
                event: 'completed',
                payLinkTitle: payLink.title,
                payLinkAmount: amount,
                payLinkCurrency: session.currency?.toUpperCase() || 'GBP',
                payLinkId: paymentLinkId,
                customerName: session.customer_details?.name || payLink.customer_name || 'Unknown',
                customerEmail: session.customer_email || payLink.customer_email || 'Unknown',
                ipAddress: session.customer_details?.address?.country || 'Unknown',
                location: [session.customer_details?.address?.city, session.customer_details?.address?.country].filter(Boolean).join(', ') || 'Unknown',
              }
            });
            logStep("Pay link completion email sent");
          } catch (emailErr) {
            logStep("Failed to send pay link completion email", { error: emailErr });
          }
        }
      }

      // Get service details from metadata or pay link
      const serviceName = session.metadata?.service_name || payLinkTitle || 'Unknown Service';
      const selectedOption = session.metadata?.selected_option || '';
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      // Create sales record
      const { error: salesError } = await supabaseClient
        .from('sales')
        .insert({
          customer_name: session.customer_details?.name || 'Customer',
          customer_email: session.customer_email || 'unknown@email.com',
          amount: amount,
          currency: session.currency?.toUpperCase() || 'GBP',
          status: 'completed',
          payment_method: 'stripe',
          notes: `${serviceName}${selectedOption ? ` - ${selectedOption}` : ''}`,
          completed_at: new Date().toISOString()
        });

      if (salesError) {
        logStep("Failed to create sales record", { error: salesError.message });
      } else {
        logStep("Sales record created successfully");
      }

      // Notify staff about the purchase
      try {
        await supabaseClient.functions.invoke('notify-staff', {
          body: {
            type: 'purchase',
            title: '💰 New Purchase!',
            message: `${session.customer_details?.name || session.customer_email || 'A customer'} purchased ${serviceName}${selectedOption ? ` (${selectedOption})` : ''} for £${amount.toFixed(2)}`
          }
        });
        logStep("Staff notification sent");
      } catch (notifyError) {
        logStep("Failed to notify staff", { error: notifyError });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
