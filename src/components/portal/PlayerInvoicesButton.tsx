import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { FileText, ExternalLink, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Invoice {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  status: string;
  invoice_due_date: string | null;
  stripe_payment_link_url: string | null;
  created_at: string;
}

interface Props {
  playerId?: string;
}

export const PlayerInvoicesButton = ({ playerId }: Props) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    if (!playerId) return;
    const { data } = await supabase
      .from("pay_links")
      .select("id,title,description,amount,currency,status,invoice_due_date,stripe_payment_link_url,created_at")
      .eq("player_id", playerId)
      .eq("is_invoice", true)
      .neq("status", "completed")
      .order("created_at", { ascending: false });
    setInvoices((data || []) as Invoice[]);
  };

  useEffect(() => {
    if (!playerId) return;
    fetchInvoices();

    const channel = supabase
      .channel(`player-invoices-${playerId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pay_links", filter: `player_id=eq.${playerId}` },
        () => fetchInvoices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

  if (!playerId || invoices.length === 0) return null;

  const totalDue = invoices.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const currency = invoices[0]?.currency || "GBP";
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "";

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 relative bg-gold text-black hover:bg-gold/90 border-2 border-gold shadow-lg animate-pulse"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Invoices</span>
        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {invoices.length}
        </span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold" />
              Outstanding Invoices
            </SheetTitle>
            <SheetDescription>
              {invoices.length} unpaid · Total {symbol}{totalDue.toFixed(2)}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-3">
            {loading && <Loader2 className="h-5 w-5 animate-spin mx-auto" />}
            {invoices.map((inv) => {
              const sym = inv.currency === "GBP" ? "£" : inv.currency === "USD" ? "$" : inv.currency === "EUR" ? "€" : "";
              const overdue = inv.invoice_due_date && new Date(inv.invoice_due_date) < new Date();
              return (
                <div key={inv.id} className="border-2 border-gold/40 rounded-lg p-4 bg-card space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{inv.title}</p>
                      {inv.description && (
                        <p className="text-xs text-muted-foreground mt-1">{inv.description}</p>
                      )}
                    </div>
                    <p className="text-lg font-bold text-gold whitespace-nowrap">{sym}{Number(inv.amount).toFixed(2)}</p>
                  </div>
                  {inv.invoice_due_date && (
                    <p className={`text-xs ${overdue ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                      Due {format(new Date(inv.invoice_due_date), "dd MMM yyyy")}{overdue ? " (overdue)" : ""}
                    </p>
                  )}
                  {inv.stripe_payment_link_url ? (
                    <Button
                      className="w-full bg-gold text-black hover:bg-gold/90"
                      onClick={() => window.open(inv.stripe_payment_link_url!, "_blank")}
                    >
                      Pay Now <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Awaiting payment link from staff</p>
                  )}
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
