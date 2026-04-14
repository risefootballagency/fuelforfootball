import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SERVICE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const body = await req.json();
    
    // Support both single-item (legacy) and multi-item cart
    const items: { serviceId: string; selectedOption?: string | null; quantity?: number; paymentMode?: string; recurringInterval?: string; intervalCount?: number }[] = 
      body.items || [{ serviceId: body.serviceId, selectedOption: body.selectedOption, quantity: 1, paymentMode: body.paymentMode, recurringInterval: body.recurringInterval, intervalCount: body.intervalCount }];

    const customerEmail = body.customerEmail;
    const customerName = body.customerName;
    const embeddedMode = body.embedded === true;

    logStep("Request items", { count: items.length, embeddedMode });

    if (items.length === 0 || !items[0].serviceId) throw new Error("At least one service item is required");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check for existing customer if email provided
    let customerId: string | undefined;
    const email = customerEmail || undefined;
    
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    // Determine if any item is a subscription
    const hasSubscription = items.some(i => i.paymentMode === 'subscription');

    // Fetch all services
    const serviceIds = [...new Set(items.map(i => i.serviceId))];
    const { data: services, error: servicesError } = await supabaseClient
      .from('service_catalog')
      .select('*')
      .in('id', serviceIds);

    if (servicesError || !services?.length) {
      logStep("Services not found", { error: servicesError });
      throw new Error("One or more services not found");
    }
    logStep("Services found", { count: services.length });

    const serviceMap = new Map(services.map(s => [s.id, s]));

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const metadataItems: string[] = [];

    for (const item of items) {
      const service = serviceMap.get(item.serviceId);
      if (!service) throw new Error(`Service ${item.serviceId} not found`);

      let finalPrice = service.price;
      let optionName: string | null = null;

      if (item.selectedOption && service.options) {
        const options = Array.isArray(service.options) ? service.options : [];
        const option = options.find((o: any) => o.name === item.selectedOption);
        if (option) {
          finalPrice = service.price + (option.surcharge || 0);
          optionName = option.name;
        }
      }

      const isSubscription = item.paymentMode === 'subscription';
      const productName = optionName ? `${service.name} - ${optionName}` : service.name;

      const productParams: Stripe.ProductCreateParams = {
        name: productName,
        description: service.description?.replace(/<[^>]*>/g, '').substring(0, 500) || undefined,
      };

      if (service.image_url) {
        let imageUrl = service.image_url;
        if (imageUrl.startsWith('/')) imageUrl = `https://fuelforfootball.com${imageUrl}`;
        else if (!imageUrl.startsWith('http')) imageUrl = `https://fuelforfootball.com/${imageUrl}`;
        productParams.images = [imageUrl];
      }

      const product = await stripe.products.create(productParams);

      const priceParams: Stripe.PriceCreateParams = {
        product: product.id,
        unit_amount: Math.round(finalPrice * 100),
        currency: 'gbp',
      };

      if (isSubscription && item.recurringInterval) {
        priceParams.recurring = {
          interval: item.recurringInterval as Stripe.PriceCreateParams.Recurring.Interval,
          interval_count: item.intervalCount || 1,
        };
      }

      const price = await stripe.prices.create(priceParams);

      lineItems.push({
        price: price.id,
        quantity: item.quantity || 1,
      });

      metadataItems.push(`${productName} x${item.quantity || 1}`);
    }

    const origin = req.headers.get("origin") || "https://fuelforfootball.com";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: lineItems,
      mode: hasSubscription ? 'subscription' : 'payment',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/services`,
      metadata: {
        items_summary: metadataItems.join(', ').substring(0, 500),
      },
    };

    // For embedded checkout, use ui_mode
    if (embeddedMode) {
      sessionParams.ui_mode = 'embedded';
      sessionParams.return_url = `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
      delete sessionParams.success_url;
      delete sessionParams.cancel_url;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, mode: sessionParams.mode, embedded: embeddedMode });

    // Create order record for first item (simplified)
    const firstItem = items[0];
    const firstService = serviceMap.get(firstItem.serviceId);
    const { error: orderError } = await supabaseClient
      .from('service_orders')
      .insert({
        service_id: firstItem.serviceId,
        customer_email: email || 'guest@checkout.com',
        customer_name: customerName || null,
        amount: items.reduce((sum, i) => {
          const s = serviceMap.get(i.serviceId);
          return sum + (s ? s.price * (i.quantity || 1) : 0);
        }, 0),
        currency: 'GBP',
        status: 'pending',
        stripe_session_id: session.id,
        selected_option: firstItem.selectedOption || null,
      });

    if (orderError) {
      logStep("Order creation warning", { error: orderError.message });
    }

    const response: any = { sessionId: session.id };
    if (embeddedMode) {
      response.clientSecret = session.client_secret;
    } else {
      response.url = session.url;
    }

    return new Response(JSON.stringify(response), {
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
