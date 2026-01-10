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

    const { serviceId, selectedOption, customerEmail, customerName, paymentMode, recurringInterval, intervalCount } = await req.json();
    logStep("Request body", { serviceId, selectedOption, paymentMode, recurringInterval, intervalCount });

    if (!serviceId) throw new Error("Service ID is required");

    // Fetch service details
    const { data: service, error: serviceError } = await supabaseClient
      .from('service_catalog')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      logStep("Service not found", { error: serviceError });
      throw new Error("Service not found");
    }
    logStep("Service found", { name: service.name, price: service.price });

    // Calculate final price based on selected option
    let finalPrice = service.price;
    let optionName = null;
    
    if (selectedOption && service.options) {
      const options = Array.isArray(service.options) ? service.options : [];
      const option = options.find((o: any) => o.name === selectedOption);
      if (option) {
        finalPrice = service.price + (option.surcharge || 0);
        optionName = option.name;
        logStep("Option selected", { optionName, surcharge: option.surcharge, finalPrice });
      }
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check for existing customer if email provided
    let customerId;
    const email = customerEmail || undefined;
    
    if (email) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Existing customer found", { customerId });
      }
    }

    // Determine if this is a subscription
    const isSubscription = paymentMode === 'subscription';
    
    // Create product with image
    logStep("Creating Stripe product for service");
    
    const productName = optionName 
      ? `${service.name} - ${optionName}` 
      : service.name;
    
    // Build product params with optional image
    const productParams: Stripe.ProductCreateParams = {
      name: productName,
      description: service.description?.replace(/<[^>]*>/g, '').substring(0, 500) || undefined,
    };
    
    // Add image if available (Stripe requires absolute HTTPS URL)
    if (service.image_url) {
      // Handle relative URLs by converting to absolute
      let imageUrl = service.image_url;
      if (imageUrl.startsWith('/')) {
        imageUrl = `https://fuelforfootball.com${imageUrl}`;
      } else if (!imageUrl.startsWith('http')) {
        imageUrl = `https://fuelforfootball.com/${imageUrl}`;
      }
      productParams.images = [imageUrl];
      logStep("Adding product image", { imageUrl });
    }
    
    const product = await stripe.products.create(productParams);
    logStep("Product created", { productId: product.id, hasImage: !!productParams.images });

    // Create price - convert pounds to pence
    const priceAmount = Math.round(finalPrice * 100);
    
    // Build price params
    const priceParams: Stripe.PriceCreateParams = {
      product: product.id,
      unit_amount: priceAmount,
      currency: 'gbp',
    };

    // Add recurring config for subscriptions
    if (isSubscription && recurringInterval) {
      priceParams.recurring = {
        interval: recurringInterval as Stripe.PriceCreateParams.Recurring.Interval,
        interval_count: intervalCount || 1,
      };
      logStep("Creating subscription price", { interval: recurringInterval, intervalCount: intervalCount || 1 });
    }

    const price = await stripe.prices.create(priceParams);
    logStep("Price created", { priceId: price.id, amount: priceAmount, isSubscription });

    const origin = req.headers.get("origin") || "https://fuelforfootball.com";

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/services`,
      metadata: {
        service_id: serviceId,
        service_name: service.name,
        selected_option: optionName || '',
        is_subscription: isSubscription ? 'true' : 'false',
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, url: session.url, mode: sessionParams.mode });

    // Create order record
    const { error: orderError } = await supabaseClient
      .from('service_orders')
      .insert({
        service_id: serviceId,
        customer_email: email || 'guest@checkout.com',
        customer_name: customerName || null,
        amount: finalPrice,
        currency: 'GBP',
        status: 'pending',
        stripe_session_id: session.id,
        selected_option: optionName,
      });

    if (orderError) {
      logStep("Order creation warning", { error: orderError.message });
    }

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
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