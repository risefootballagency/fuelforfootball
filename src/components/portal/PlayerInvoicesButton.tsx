import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { FileText, ExternalLink, Lightbulb } from "lucide-react";
import { format } from "date-fns";

interface LineItem {
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Invoice {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  status: string;
  invoice_kind: string | null;
  invoice_due_date: string | null;
  stripe_payment_link_url: string | null;
  created_at: string;
  line_items?: LineItem[];
}

interface Props {
  playerId?: string;
}

const sym = (c: string) => c === 'GBP' ? '£' : c === 'EUR' ? '€' : c === 'USD' ? '$' : '';

export const PlayerInvoicesButton = ({ playerId }: Props) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [open, setOpen] = useState(false);

  const fetchInvoices = async () => {
    if (!playerId) return;
    const { data } = await supabase
      .from("pay_links")
      .select("id,title,description,amount,currency,status,invoice_kind,invoice_due_date,stripe_payment_link_url,created_at")
      .eq("player_id", playerId)
      .eq("is_invoice", true)
      .neq("status", "completed")
      .order("created_at", { ascending: false });

    const rows = (data || []) as Invoice[];
    if (rows.length > 0) {
      const { data: items } = await supabase
        .from("pay_link_items")
        .select("pay_link_id, product_name, quantity, unit_price")
        .in("pay_link_id", rows.map(r => r.id));
      const byLink: Record<string, LineItem[]> = {};
      (items || []).forEach((it: any) => {
        if (!byLink[it.pay_link_id]) byLink[it.pay_link_id] = [];
        byLink[it.pay_link_id].push({
          product_name: it.product_name,
          quantity: it.quantity,
          unit_price: Number(it.unit_price),
        });
      });
      rows.forEach(r => { r.line_items = byLink[r.id] || []; });
    }
    setInvoices(rows);
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

  const agreed = invoices.filter(i => (i.invoice_kind || 'agreed') === 'agreed');
  const suggestions = invoices.filter(i => i.invoice_kind === 'suggestion');
  const agreedTotal = agreed.reduce((s, i) => s + Number(i.amount || 0), 0);
  const currency = invoices[0]?.currency || 'GBP';
  const s = sym(currency);

  const renderCard = (inv: Invoice, isSuggestion: boolean) => {
    const isym = sym(inv.currency);
    const overdue = !isSuggestion && inv.invoice_due_date && new Date(inv.invoice_due_date) < new Date();
    const borderClass = isSuggestion ? 'border-muted' : 'border-gold/40';
    return (
      <div key={inv.id} className={`border-2 ${borderClass} rounded-lg p-4 bg-card space-y-2`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold flex items-center gap-1">
              {isSuggestion && <Lightbulb className="h-3 w-3 text-gold" />}
              {inv.title}
            </p>
            {inv.description && (
              <p className="text-xs text-muted-foreground mt-1">{inv.description}</p>
            )}
          </div>
          <p className={`text-lg font-bold whitespace-nowrap ${isSuggestion ? 'text-foreground' : 'text-gold'}`}>{isym}{Number(inv.amount).toFixed(2)}</p>
        </div>
        {inv.line_items && inv.line_items.length > 0 && (
          <div className="text-xs space-y-0.5 border-t border-border/40 pt-2">
            {inv.line_items.map((li, idx) => (
              <div key={idx} className="flex justify-between text-muted-foreground">
                <span>{li.quantity} × {li.product_name}</span>
                <span>{isym}{(li.quantity * li.unit_price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
        {!isSuggestion && inv.invoice_due_date && (
          <p className={`text-xs ${overdue ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
            Due {format(new Date(inv.invoice_due_date), 'dd MMM yyyy')}{overdue ? ' (overdue)' : ''}
          </p>
        )}
        {isSuggestion && (
          <p className="text-xs italic text-muted-foreground">
            If you'd like this, you can complete payment below — this hasn't been formally discussed yet.
          </p>
        )}
        {inv.stripe_payment_link_url ? (
          <Button
            className={isSuggestion ? 'w-full' : 'w-full bg-gold text-black hover:bg-gold/90'}
            variant={isSuggestion ? 'outline' : 'default'}
            onClick={() => window.open(inv.stripe_payment_link_url!, '_blank')}
          >
            {isSuggestion ? 'I\'d like this — Pay now' : 'Pay Now'} <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <p className="text-xs text-muted-foreground italic">Awaiting payment link from staff</p>
        )}
      </div>
    );
  };

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
              Your Invoices
            </SheetTitle>
            <SheetDescription>
              {agreed.length} outstanding · Total {s}{agreedTotal.toFixed(2)}
              {suggestions.length > 0 && ` · ${suggestions.length} suggested`}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {agreed.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Outstanding</h4>
                {agreed.map(inv => renderCard(inv, false))}
              </div>
            )}
            {suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" /> Suggested
                </h4>
                {suggestions.map(inv => renderCard(inv, true))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
