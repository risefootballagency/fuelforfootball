import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[NOTIFY-PAY-LINK] ${step}${detailsStr}`);
};

const STAFF_EMAIL = "hello@fuelforfootball.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY is not set");

    const { event, payLinkTitle, payLinkAmount, payLinkCurrency, payLinkId, ipAddress, userAgent, location, customerName, customerEmail } = await req.json();
    logStep("Request body", { event, payLinkTitle, payLinkId, ipAddress });

    const timestamp = new Date().toLocaleString("en-GB", { 
      timeZone: "Europe/London",
      weekday: "short",
      day: "numeric", 
      month: "short", 
      year: "numeric",
      hour: "2-digit", 
      minute: "2-digit",
      second: "2-digit"
    });

    const formatCurrency = (amount: number, currency: string) => {
      return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
    };

    let subject = "";
    let htmlBody = "";

    if (event === "opened") {
      subject = `👀 Pay Link Opened: ${payLinkTitle}`;
      htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #b8860b; margin-bottom: 16px;">👀 Pay Link Opened</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">Link Title</td><td style="padding: 8px 0; font-weight: bold;">${payLinkTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Amount</td><td style="padding: 8px 0; font-weight: bold;">${formatCurrency(payLinkAmount, payLinkCurrency)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Time</td><td style="padding: 8px 0;">${timestamp}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">IP Address</td><td style="padding: 8px 0; font-family: monospace;">${ipAddress || "Unknown"}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">User Agent</td><td style="padding: 8px 0; font-size: 12px; color: #888;">${userAgent || "Unknown"}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Location</td><td style="padding: 8px 0;">${location || "Unknown"}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">Pay Link ID: ${payLinkId}</p>
        </div>
      `;
    } else if (event === "completed") {
      subject = `💰 Payment Completed: ${payLinkTitle}`;
      htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #22c55e; margin-bottom: 16px;">💰 Payment Completed!</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; width: 140px;">Link Title</td><td style="padding: 8px 0; font-weight: bold;">${payLinkTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Amount</td><td style="padding: 8px 0; font-weight: bold; color: #22c55e;">${formatCurrency(payLinkAmount, payLinkCurrency)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Customer</td><td style="padding: 8px 0; font-weight: bold;">${customerName || "Unknown"}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${customerEmail || "Unknown"}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Time</td><td style="padding: 8px 0;">${timestamp}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">IP Address</td><td style="padding: 8px 0; font-family: monospace;">${ipAddress || "Unknown"}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Location</td><td style="padding: 8px 0;">${location || "Unknown"}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">Pay Link ID: ${payLinkId}</p>
        </div>
      `;
    } else {
      throw new Error(`Unknown event type: ${event}`);
    }

    // Send email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Fuel For Football <notifications@fuelforfootball.com>",
        to: [STAFF_EMAIL],
        subject,
        html: htmlBody,
      }),
    });

    const emailResult = await emailRes.json();
    logStep("Email sent", { status: emailRes.status, result: emailResult });

    if (!emailRes.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(emailResult)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
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
