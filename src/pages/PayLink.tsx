import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { PortalPaymentMethods } from "@/components/portal/PortalPaymentMethods";
import { invokeEdgeFunction } from "@/lib/edgeFunctionHelper";

interface PayLink {
  id: string;
  title: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  stripe_payment_link_url: string | null;
}

export default function PayLink() {
  const { slug } = useParams();
  const [payLink, setPayLink] = useState<PayLink | null>(null);
  const [loading, setLoading] = useState(true);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (slug) fetchPayLink();
  }, [slug]);

  const fetchPayLink = async () => {
    // Try slug first, then fall back to ID for backwards compatibility
    let query = supabase.from("pay_links").select("*");
    
    // If it looks like a UUID, search by ID; otherwise by slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug || "");
    if (isUuid) {
      query = query.eq("id", slug);
    } else {
      query = query.eq("slug", slug);
    }
    
    const { data, error } = await query.single();

    if (error) {
      console.error("Error fetching pay link:", error);
    } else {
      setPayLink(data);
    }
    setLoading(false);

    // Notify staff about the pay link being opened
    if (data && data.status === "active" && !notifiedRef.current) {
      notifiedRef.current = true;
      try {
        // Get IP info for location
        let ipAddress = "Unknown";
        let location = "Unknown";
        try {
          const ipRes = await fetch("https://ipapi.co/json/");
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            ipAddress = ipData.ip || "Unknown";
            location = [ipData.city, ipData.region, ipData.country_name].filter(Boolean).join(", ") || "Unknown";
          }
        } catch { /* silent */ }

        await invokeEdgeFunction("notify-pay-link", {
          body: {
            event: "opened",
            payLinkTitle: data.title,
            payLinkAmount: data.amount,
            payLinkCurrency: data.currency,
            payLinkId: data.id,
            ipAddress,
            userAgent: navigator.userAgent,
            location,
          },
        });
      } catch { /* non-critical */ }
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!payLink) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-card/50 border-border/50 max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Payment Link Not Found</h2>
            <p className="text-muted-foreground">This payment link may have expired or doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (payLink.status !== "active") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Helmet>
          <title>Payment - {payLink.title}</title>
        </Helmet>
        <Card className="bg-card/50 border-border/50 max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Badge className="mb-4 bg-muted text-muted-foreground">
              {payLink.status === "completed" ? "Payment Completed" : "Link Expired"}
            </Badge>
            <h2 className="text-xl font-bold text-foreground mb-2">{payLink.title}</h2>
            <p className="text-muted-foreground">
              {payLink.status === "completed"
                ? "This payment has already been completed. Thank you!"
                : "This payment link is no longer active."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <Helmet>
        <title>Pay {formatCurrency(payLink.amount, payLink.currency)} - {payLink.title}</title>
        <meta name="description" content={payLink.description || `Complete your payment of ${formatCurrency(payLink.amount, payLink.currency)}`} />
      </Helmet>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Payment Summary */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="text-center pb-2">
            <Badge className="mx-auto mb-2 bg-accent/20 text-accent border-accent/30">
              Payment Request
            </Badge>
            <CardTitle className="text-2xl text-foreground">{payLink.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-accent mb-4">
              {formatCurrency(payLink.amount, payLink.currency)}
            </p>
            {payLink.description && (
              <p className="text-muted-foreground">{payLink.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground text-center">Choose a Payment Method</h3>
          <PortalPaymentMethods 
            amount={payLink.amount} 
            currency={payLink.currency} 
            stripePaymentLinkUrl={payLink.stripe_payment_link_url}
            payLinkId={payLink.id}
            title={payLink.title}
            description={payLink.description || undefined}
          />
        </div>
      </div>
    </div>
  );
}
