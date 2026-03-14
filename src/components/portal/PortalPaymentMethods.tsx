import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, X, Building2, CreditCard, Globe, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "@/lib/portalTranslations";
import { usePortalLanguage } from "@/hooks/usePortalLanguage";

interface PortalPaymentMethodsProps {
  amount?: number;
  currency?: string;
  stripePaymentLinkUrl?: string | null;
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

export const PortalPaymentMethods = ({ amount, currency, stripePaymentLinkUrl }: PortalPaymentMethodsProps = {}) => {
  const currencyCode = (currency || 'GBP').toUpperCase();
  const formattedAmount = amount ? new Intl.NumberFormat("en-GB", { style: "currency", currency: currencyCode }).format(amount) : null;
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

  const renderDetail = (method: PaymentMethod) => {
    switch (method) {
      case "revolut":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Pay instantly via Revolut — fast, free, and secure.</p>
            <Button
              className="w-full bg-[hsl(220,80%,50%)] hover:bg-[hsl(220,80%,45%)] text-white"
              onClick={() => window.open("https://checkout.revolut.com/pay/a31abdd1-ff2c-444d-8455-6463398141f9", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Pay with Revolut
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        );
      case "paypal":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Pay securely via PayPal — no account required.</p>
            <Button
              className="w-full bg-[hsl(210,80%,45%)] hover:bg-[hsl(210,80%,40%)] text-white"
              onClick={() => window.open("http://paypal.me/fuelforfootball", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Pay with PayPal
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        );
      case "card":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Pay by debit or credit card via our secure Stripe checkout.</p>
            <p className="text-xs text-muted-foreground">£1 per unit — adjust quantity at checkout to match your invoice amount.</p>
            <Button
              className="w-full bg-[hsl(270,60%,50%)] hover:bg-[hsl(270,60%,45%)] text-white"
              onClick={() => window.open("https://buy.stripe.com/cNidR87Xjgdvcgc505bbG03", "_blank")}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay by Card
              <ArrowRight className="h-4 w-4 ml-auto" />
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {METHODS.map((m) => {
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
