import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, X, Building2, CreditCard, Globe, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";
import { invokeEdgeFunction } from "@/lib/edgeFunctionHelper";

interface PortalPaymentMethodsProps {
  amount?: number;
  currency?: string;
  stripePaymentLinkUrl?: string | null;
  payLinkId?: string;
  title?: string;
  description?: string;
}

type PaymentMethod = "revolut" | "paypal" | "card" | "bank" | "international" | null;

const METHODS = [
  {
    id: "revolut" as const,
    label: "Revolut",
    icon: "🔄",
    subtitle: "Instant payment",
    gradient: "from-[hsl(220,80%,50%)] to-[hsl(260,70%,55%)]",
  },
  {
    id: "paypal" as const,
    label: "PayPal",
    icon: "💳",
    subtitle: "Quick & secure",
    gradient: "from-[hsl(210,80%,45%)] to-[hsl(200,90%,40%)]",
  },
  {
    id: "card" as const,
    label: "Card",
    icon: "💎",
    subtitle: "Debit or Credit",
    gradient: "from-[hsl(270,60%,50%)] to-[hsl(300,50%,45%)]",
  },
  {
    id: "bank" as const,
    label: "UK Bank Transfer",
    icon: "🏦",
    subtitle: "Domestic",
    gradient: "from-[hsl(150,50%,35%)] to-[hsl(160,60%,30%)]",
  },
  {
    id: "international" as const,
    label: "International Bank Transfer",
    icon: "🌍",
    subtitle: "IBAN & SWIFT",
    gradient: "from-[hsl(30,70%,45%)] to-[hsl(40,80%,40%)]",
  },
];

export const PortalPaymentMethods = ({ amount, currency, stripePaymentLinkUrl, payLinkId, title, description }: PortalPaymentMethodsProps) => {
  const currencyCode = (currency || 'GBP').toUpperCase();
  const formattedAmount = amount ? new Intl.NumberFormat("en-GB", { style: "currency", currency: currencyCode }).format(amount) : null;
  const [selected, setSelected] = useState<PaymentMethod>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const lang = usePortalLanguage();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyBtn = ({ value, field }: { value: string; field: string }) => (
    <button
      onClick={() => copy(value, field)}
      className="ml-2 p-1 rounded hover:bg-white/10 transition-colors"
    >
      {copiedField === field ? (
        <Check className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </button>
  );

  const DetailRow = ({ label, value, field, mono }: { label: string; value: string; field: string; mono?: boolean }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center">
        <span className={`font-medium text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
        <CopyBtn value={value} field={field} />
      </div>
    </div>
  );

  const handleCardPayment = async () => {
    if (stripePaymentLinkUrl) {
      window.open(stripePaymentLinkUrl, "_blank");
      return;
    }
    if (!amount || !title) { toast.error("Payment details missing"); return; }
    setLoadingCheckout(true);
    try {
      const { data, error } = await invokeEdgeFunction<{ url: string }>("create-pay-checkout", {
        body: { title: title || "Payment", amount, currency: currencyCode, description, payLinkId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
      else throw new Error("No checkout URL returned");
    } catch (e: any) {
      toast.error(e.message || "Failed to create checkout");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const renderDetail = (method: PaymentMethod) => {
    const revolutUrl = "https://revolut.me/fuelforfootball";
    const paypalUrl = amount
      ? `https://paypal.me/fuelforfootball/${amount.toFixed(2)}${currencyCode}`
      : "https://paypal.me/fuelforfootball";

    switch (method) {
      case "revolut":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pay instantly via Revolut — fast, free, and secure.
              {formattedAmount && <span className="font-semibold text-foreground ml-1">{formattedAmount}</span>}
            </p>
            <Button
              className="w-full bg-[hsl(220,80%,50%)] hover:bg-[hsl(220,80%,45%)] text-white"
              onClick={() => window.open(revolutUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Pay {formattedAmount || ''} with Revolut
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        );
      case "paypal":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pay securely via PayPal — no account required.
              {formattedAmount && <span className="font-semibold text-foreground ml-1">{formattedAmount}</span>}
            </p>
            <Button
              className="w-full bg-[hsl(210,80%,45%)] hover:bg-[hsl(210,80%,40%)] text-white"
              onClick={() => window.open(paypalUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Pay {formattedAmount || ''} with PayPal
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        );
      case "card":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pay by debit or credit card via our secure checkout.
              {formattedAmount && <span className="font-semibold text-foreground ml-1">{formattedAmount}</span>}
            </p>
            <Button
              className="w-full bg-[hsl(270,60%,50%)] hover:bg-[hsl(270,60%,45%)] text-white"
              onClick={handleCardPayment}
              disabled={loadingCheckout}
            >
              {loadingCheckout ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CreditCard className="h-4 w-4 mr-2" />}
              {loadingCheckout ? "Creating secure checkout..." : `Pay ${formattedAmount || ''} by Card`}
              {!loadingCheckout && <ArrowRight className="h-4 w-4 ml-auto" />}
            </Button>
          </div>
        );
      case "bank":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">UK bank transfer to Fuel For Football Limited.</p>
            <div className="rounded-lg bg-white/5 p-3">
              <DetailRow label="Account Name" value="Fuel For Football Limited" field="bank-name" />
              <DetailRow label="Sort Code" value="20-03-84" field="bank-sort" mono />
              <DetailRow label="Account Number" value="43613860" field="bank-acc" mono />
            </div>
            <p className="text-xs text-muted-foreground italic">Please use your name and invoice number as the payment reference.</p>
            <div className="pt-1">
              <p className="text-xs text-muted-foreground mb-2">Quick pay via your bank app:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Monzo", url: "https://monzo.com/pay", color: "from-[hsl(350,70%,50%)] to-[hsl(350,70%,40%)]" },
                  { name: "Starling", url: "https://app.starlingbank.com", color: "from-[hsl(260,50%,50%)] to-[hsl(260,50%,40%)]" },
                  { name: "Revolut", url: "https://revolut.com/app", color: "from-[hsl(220,80%,50%)] to-[hsl(220,80%,40%)]" },
                  { name: "HSBC", url: "https://www.hsbc.co.uk/ways-to-bank/mobile-banking/", color: "from-[hsl(0,70%,45%)] to-[hsl(0,70%,35%)]" },
                  { name: "Barclays", url: "https://www.barclays.co.uk/app/", color: "from-[hsl(200,80%,40%)] to-[hsl(200,80%,30%)]" },
                  { name: "Lloyds", url: "https://www.lloydsbank.com/mobile-banking.html", color: "from-[hsl(140,60%,30%)] to-[hsl(140,60%,20%)]" },
                ].map((bank) => (
                  <Button
                    key={bank.name}
                    variant="outline"
                    size="sm"
                    className={`text-xs border-white/10 hover:border-white/30 bg-gradient-to-r ${bank.color} text-white border-0`}
                    onClick={() => window.open(bank.url, "_blank")}
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    {bank.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      case "international":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">International transfer to Fuel For Football Limited.</p>
            <div className="rounded-lg bg-white/5 p-3">
              <DetailRow label="Account Name" value="Fuel For Football Limited" field="intl-name" />
              <DetailRow label="Sort Code" value="20-03-84" field="intl-sort" mono />
              <DetailRow label="Account Number" value="43613860" field="intl-acc" mono />
              <DetailRow label="IBAN" value="GB45 BUKB 2003 8443 6138 60" field="intl-iban" mono />
            </div>
            <p className="text-xs text-muted-foreground italic">Please use your name and invoice number as the payment reference.</p>
            <div className="pt-1">
              <p className="text-xs text-muted-foreground mb-2">Quick pay via your bank app:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Wise", url: "https://wise.com/pay", color: "from-[hsl(155,70%,40%)] to-[hsl(155,70%,30%)]" },
                  { name: "Revolut", url: "https://revolut.com/app", color: "from-[hsl(220,80%,50%)] to-[hsl(220,80%,40%)]" },
                  { name: "N26", url: "https://n26.com/en-eu", color: "from-[hsl(170,60%,35%)] to-[hsl(170,60%,25%)]" },
                ].map((bank) => (
                  <Button
                    key={bank.name}
                    variant="outline"
                    size="sm"
                    className={`text-xs border-white/10 hover:border-white/30 bg-gradient-to-r ${bank.color} text-white border-0`}
                    onClick={() => window.open(bank.url, "_blank")}
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {bank.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const availableMethods = METHODS;

  return (
    <div className="space-y-4">
      <div className={`grid grid-cols-2 sm:grid-cols-3 ${availableMethods.length >= 5 ? 'lg:grid-cols-5' : `lg:grid-cols-${availableMethods.length}`} gap-3`}>
        {availableMethods.map((m) => {
          const isActive = selected === m.id;
          return (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(isActive ? null : m.id)}
              className={`relative rounded-xl p-4 text-left transition-all border-2 overflow-hidden ${
                isActive
                  ? "border-[hsl(var(--accent))] shadow-[0_0_20px_hsl(var(--accent)/0.2)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-${isActive ? "25" : "10"} transition-opacity`} />
              <div className="relative z-10">
                <span className="text-2xl block mb-2">{m.icon}</span>
                <p className="font-heading text-sm font-semibold tracking-wide">{m.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.subtitle}</p>
              </div>
              {isActive && (
                <motion.div
                  layoutId="payment-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--accent))]"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-white/10 bg-card/80 backdrop-blur">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading text-base font-semibold">
                    {METHODS.find((m) => m.id === selected)?.label}
                  </h4>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                {renderDetail(selected)}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <p className="text-center text-sm text-muted-foreground">
          {t(lang, "select_payment_method")}
        </p>
      )}
    </div>
  );
};
