import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Check, Building2, CreditCard, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

interface PayLink {
  id: string;
  title: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
}

interface BankDetail {
  id: string;
  title: string;
  payment_type: string;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  sort_code: string | null;
  iban: string | null;
  swift_bic: string | null;
  paypal_email: string | null;
  notes: string | null;
}

export default function PayLink() {
  const { id } = useParams();
  const [payLink, setPayLink] = useState<PayLink | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPayLink();
      fetchBankDetails();
    }
  }, [id]);

  const fetchPayLink = async () => {
    const { data, error } = await supabase
      .from("pay_links")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching pay link:", error);
    } else {
      setPayLink(data);
    }
    setLoading(false);
  };

  const fetchBankDetails = async () => {
    const { data, error } = await supabase
      .from("bank_details")
      .select("*")
      .order("is_default", { ascending: false });

    if (error) {
      console.error("Error fetching bank details:", error);
    } else {
      setBankDetails(data || []);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, label)}
      className="h-8 px-2 text-muted-foreground hover:text-foreground"
    >
      {copiedField === label ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );

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
            <Badge className="mb-4 bg-gray-500/20 text-gray-400">
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
            <Badge className="mx-auto mb-2 bg-light-green/20 text-light-green border-light-green/30">
              Payment Request
            </Badge>
            <CardTitle className="text-2xl text-foreground">{payLink.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-light-green mb-4">
              {formatCurrency(payLink.amount, payLink.currency)}
            </p>
            {payLink.description && (
              <p className="text-muted-foreground">{payLink.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground text-center">Choose a Payment Method</h3>
          
          {bankDetails.length === 0 ? (
            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No payment methods available. Please contact support.</p>
              </CardContent>
            </Card>
          ) : (
            bankDetails.map((detail) => (
              <Card key={detail.id} className="bg-card/50 border-border/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {detail.payment_type === "bank_transfer" ? (
                      <Building2 className="w-5 h-5 text-light-green" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-blue-400" />
                    )}
                    <CardTitle className="text-lg text-foreground">{detail.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {detail.payment_type === "bank_transfer" && (
                    <>
                      {detail.bank_name && (
                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                          <div>
                            <p className="text-xs text-muted-foreground">Bank</p>
                            <p className="text-foreground">{detail.bank_name}</p>
                          </div>
                        </div>
                      )}
                      {detail.account_name && (
                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                          <div>
                            <p className="text-xs text-muted-foreground">Account Name</p>
                            <p className="text-foreground">{detail.account_name}</p>
                          </div>
                          <CopyButton text={detail.account_name} label="Account Name" />
                        </div>
                      )}
                      {detail.account_number && (
                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                          <div>
                            <p className="text-xs text-muted-foreground">Account Number</p>
                            <p className="text-foreground font-mono">{detail.account_number}</p>
                          </div>
                          <CopyButton text={detail.account_number} label="Account Number" />
                        </div>
                      )}
                      {detail.sort_code && (
                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                          <div>
                            <p className="text-xs text-muted-foreground">Sort Code</p>
                            <p className="text-foreground font-mono">{detail.sort_code}</p>
                          </div>
                          <CopyButton text={detail.sort_code} label="Sort Code" />
                        </div>
                      )}
                      {detail.iban && (
                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                          <div>
                            <p className="text-xs text-muted-foreground">IBAN</p>
                            <p className="text-foreground font-mono text-sm">{detail.iban}</p>
                          </div>
                          <CopyButton text={detail.iban} label="IBAN" />
                        </div>
                      )}
                      {detail.swift_bic && (
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-xs text-muted-foreground">SWIFT/BIC</p>
                            <p className="text-foreground font-mono">{detail.swift_bic}</p>
                          </div>
                          <CopyButton text={detail.swift_bic} label="SWIFT/BIC" />
                        </div>
                      )}
                    </>
                  )}

                  {detail.payment_type === "paypal" && detail.paypal_email && (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-border/30">
                        <div>
                          <p className="text-xs text-muted-foreground">PayPal Email</p>
                          <p className="text-foreground">{detail.paypal_email}</p>
                        </div>
                        <CopyButton text={detail.paypal_email} label="PayPal Email" />
                      </div>
                      <Button
                        className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white"
                        onClick={() => window.open(`https://paypal.me/${detail.paypal_email}/${payLink.amount}${payLink.currency}`, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Pay with PayPal
                      </Button>
                    </>
                  )}

                  {detail.notes && (
                    <p className="text-sm text-muted-foreground italic pt-2">{detail.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Reference Note */}
        <Card className="bg-light-green/10 border-light-green/30">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-foreground">
              <strong>Important:</strong> Please use <span className="font-mono bg-background/50 px-2 py-1 rounded">{payLink.id.slice(0, 8)}</span> as your payment reference.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
