import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useStaffList } from "./useStaffList";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  staffUserId: string;
  defaultPeriod: string; // YYYY-MM
  defaultCurrency?: string;
  defaultEarningType?: 'work_75' | 'commission_10' | 'manual';
  onSaved: () => void;
  initial?: any;
  isAdmin?: boolean;
}

interface PlayerOpt { id: string; name: string; }
interface InvoiceOpt { id: string; invoice_number: string; amount: number; amount_paid: number | null; player_id: string; status: string; currency: string; }

export const AddEarningDialog = ({ open, onOpenChange, staffUserId, defaultPeriod, defaultCurrency = 'GBP', defaultEarningType = 'work_75', onSaved, initial, isAdmin }: Props) => {
  const { staff } = useStaffList();
  const [players, setPlayers] = useState<PlayerOpt[]>([]);
  const [invoices, setInvoices] = useState<InvoiceOpt[]>([]);
  const [assignedStaffId, setAssignedStaffId] = useState<string>(staffUserId);
  const [clientName, setClientName] = useState("");
  const [playerId, setPlayerId] = useState<string>("");
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [earningType, setEarningType] = useState<'work_75' | 'commission_10' | 'manual'>(defaultEarningType);
  const [percentage, setPercentage] = useState<number>(75);
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const [manualAmount, setManualAmount] = useState<number>(0);
  const [currency, setCurrency] = useState(defaultCurrency);
  const [period, setPeriod] = useState(defaultPeriod);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const { data: p } = await supabase.from('players').select('id,name').order('name');
      setPlayers(p || []);
      const { data: inv } = await supabase.from('invoices').select('id,invoice_number,amount,amount_paid,player_id,status,currency').order('invoice_date', { ascending: false }).limit(200);
      setInvoices((inv as any) || []);
    })();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setClientName(initial.client_name || "");
      setPlayerId(initial.player_id || "");
      setInvoiceId(initial.invoice_id || "");
      setEarningType(initial.earning_type);
      setPercentage(Number(initial.percentage) || 75);
      setManualAmount(Number(initial.amount_due) || 0);
      setCurrency(initial.currency || defaultCurrency);
      setPeriod(initial.period_month || defaultPeriod);
      setNotes(initial.notes || "");
      setAssignedStaffId(initial.staff_user_id || staffUserId);
    } else {
      setClientName(""); setPlayerId(""); setInvoiceId("");
      setEarningType(defaultEarningType);
      setPercentage(defaultEarningType === 'commission_10' ? 10 : defaultEarningType === 'work_75' ? 75 : 0);
      setManualAmount(0); setInvoiceAmount(0); setCurrency(defaultCurrency); setPeriod(defaultPeriod); setNotes("");
      setAssignedStaffId(staffUserId);
    }
  }, [open, initial, defaultEarningType, defaultCurrency, defaultPeriod]);

  useEffect(() => {
    if (earningType === 'work_75') setPercentage(75);
    else if (earningType === 'commission_10') setPercentage(10);
  }, [earningType]);

  useEffect(() => {
    if (!invoiceId) { setInvoiceAmount(0); return; }
    const inv = invoices.find(i => i.id === invoiceId);
    if (inv) {
      setInvoiceAmount(Number(inv.amount));
      setCurrency(inv.currency || currency);
      if (!playerId && inv.player_id) {
        setPlayerId(inv.player_id);
        const pl = players.find(p => p.id === inv.player_id);
        if (pl && !clientName) setClientName(pl.name);
      }
    }
  }, [invoiceId, invoices]);

  const computedAmount = earningType === 'manual'
    ? manualAmount
    : Number(((invoiceAmount * percentage) / 100).toFixed(2));

  const filteredInvoices = playerId ? invoices.filter(i => i.player_id === playerId) : invoices;

  const handleSave = async () => {
    if (!clientName.trim()) { toast.error("Client name is required"); return; }
    if (computedAmount <= 0) { toast.error("Amount must be greater than zero"); return; }
    setSaving(true);
    try {
      const payload: any = {
        staff_user_id: isAdmin ? assignedStaffId : staffUserId,
        client_name: clientName.trim(),
        player_id: playerId || null,
        invoice_id: invoiceId || null,
        earning_type: earningType,
        amount_due: computedAmount,
        percentage: percentage,
        currency,
        period_month: period,
        notes: notes.trim() || null,
      };
      if (initial?.id) {
        const { error } = await (supabase as any).from('staff_client_earnings').update(payload).eq('id', initial.id);
        if (error) throw error;
        toast.success("Earning updated");
      } else {
        const { error } = await (supabase as any).from('staff_client_earnings').insert(payload);
        if (error) throw error;
        toast.success("Earning added");
      }
      onSaved();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Earning" : "Add Client Earning"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {isAdmin && (
            <div>
              <Label>Assign to Staff Member</Label>
              <Select value={assignedStaffId} onValueChange={setAssignedStaffId}>
                <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                <SelectContent>
                  {staff.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-muted-foreground">No staff accounts found. Create one in Staff Accounts first.</div>
                  ) : staff.map(s => <SelectItem key={s.id} value={s.id}>{s.name}{s.email ? ` — ${s.email}` : ''}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground mt-1">Admins can log earnings on behalf of any staff member.</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Client Name</Label>
              <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. John Smith" />
            </div>
            <div>
              <Label>Linked Player (optional)</Label>
              <Select value={playerId || "none"} onValueChange={v => { setPlayerId(v === "none" ? "" : v); const pl = players.find(p => p.id === v); if (pl) setClientName(pl.name); }}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {players.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Linked Invoice (optional)</Label>
            <Select value={invoiceId || "none"} onValueChange={v => setInvoiceId(v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {filteredInvoices.slice(0, 60).map(inv => (
                  <SelectItem key={inv.id} value={inv.id}>
                    {inv.invoice_number} — {inv.currency} {Number(inv.amount).toFixed(2)} ({inv.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground mt-1">If linked, the earning auto-marks as received when the invoice is paid.</p>
          </div>

          <div>
            <Label>Earning Type</Label>
            <RadioGroup value={earningType} onValueChange={v => setEarningType(v as any)} className="flex flex-col gap-2 mt-1">
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="work_75" /> Did the work (75%)</label>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="commission_10" /> Sale commission (10%)</label>
              <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="manual" /> Manual amount</label>
            </RadioGroup>
          </div>

          {earningType === 'manual' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Amount Owed</Label>
                <Input type="number" step="0.01" value={manualAmount} onChange={e => setManualAmount(Number(e.target.value))} />
              </div>
              <div>
                <Label>Custom % (optional)</Label>
                <Input type="number" step="0.01" value={percentage} onChange={e => setPercentage(Number(e.target.value))} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Invoice Amount</Label>
                <Input type="number" step="0.01" value={invoiceAmount} onChange={e => setInvoiceAmount(Number(e.target.value))} disabled={!!invoiceId} />
              </div>
              <div>
                <Label>You Receive ({percentage}%)</Label>
                <Input value={`${currency} ${computedAmount.toFixed(2)}`} disabled />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GBP">GBP £</SelectItem>
                  <SelectItem value="EUR">EUR €</SelectItem>
                  <SelectItem value="USD">USD $</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Period (month)</Label>
              <Input type="month" value={period} onChange={e => setPeriod(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initial ? "Save Changes" : "Add Earning"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
