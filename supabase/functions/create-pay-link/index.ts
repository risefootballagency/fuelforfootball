import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAY-LINK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { title, amount, currency, description, payLinkId } = await req.json();
    logStep("Request body", { title, amount, currency, payLinkId });

    if (!title || !amount) throw new Error("Title and amount are required");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Create a product for this pay link
    const product = await stripe.products.create({
      name: title,
      description: description || undefined,
    });
    logStep("Product created", { productId: product.id });

    // Create a price (convert to smallest currency unit)
    const priceAmount = Math.round(amount * 100);
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: priceAmount,
      currency: (currency || 'GBP').toLowerCase(),
    });
    logStep("Price created", { priceId: price.id });

    // Create a payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
    });
    logStep("Payment link created", { linkId: paymentLink.id, url: paymentLink.url });

    // Update pay_links record if ID provided
    if (payLinkId) {
      const { error } = await supabaseClient
        .from('pay_links')
        .update({
          stripe_payment_link_id: paymentLink.id,
          stripe_payment_link_url: paymentLink.url,
        })
        .eq('id', payLinkId);

      if (error) {
        logStep("Warning: Failed to update pay_links", { error: error.message });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      paymentLinkId: paymentLink.id,
      url: paymentLink.url,
    }), {
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
