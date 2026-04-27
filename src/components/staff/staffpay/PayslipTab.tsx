import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Send, Loader2, Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { insertStaffNotification } from "@/lib/staffNotifications";

interface Props { staffUserId: string; staffEmail?: string; }

const formatMoney = (n: number, c: string) => `${c === 'GBP' ? '£' : c === 'USD' ? '$' : '€'}${n.toFixed(2)}`;

const defaultPeriod = () => {
  const now = new Date();
  // After the 28th, default to current month being closed; otherwise prev month
  const day = now.getDate();
  const target = day >= 28 ? now : new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return format(target, 'yyyy-MM');
};

export const PayslipTab = ({ staffUserId, staffEmail }: Props) => {
  const [period, setPeriod] = useState(defaultPeriod());
  const [earnings, setEarnings] = useState<any[]>([]);
  const [payslip, setPayslip] = useState<any>(null);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [eRes, pRes, sRes] = await Promise.all([
      (supabase as any).from('staff_client_earnings').select('*').eq('staff_user_id', staffUserId).eq('period_month', period).eq('status', 'received'),
      (supabase as any).from('staff_payslips').select('*').eq('staff_user_id', staffUserId).eq('period_month', period).maybeSingle(),
      (supabase as any).from('staff_pay_settings').select('*').eq('staff_user_id', staffUserId).maybeSingle(),
    ]);
    setEarnings(eRes.data || []);
    setPayslip(pRes.data || null);
    setSettings(sRes.data || null);
    setTaxRate(pRes.data?.tax_rate ?? sRes.data?.default_tax_rate ?? 20);
    setLoading(false);
  }, [staffUserId, period]);

  useEffect(() => { load(); }, [load]);

  const summary = useMemo(() => {
    const currency = earnings[0]?.currency || settings?.preferred_currency || 'GBP';
    const gross = earnings.reduce((a, r) => a + Number(r.amount_due || 0), 0);
    const tax = Number(((gross * taxRate) / 100).toFixed(2));
    const net = Number((gross - tax).toFixed(2));
    return { gross, tax, net, currency };
  }, [earnings, taxRate, settings]);

  const grouped = useMemo(() => {
    const m: Record<string, { client: string; total: number; count: number }> = {};
    for (const e of earnings) {
      const k = e.client_name;
      if (!m[k]) m[k] = { client: k, total: 0, count: 0 };
      m[k].total += Number(e.amount_due || 0);
      m[k].count += 1;
    }
    return Object.values(m).sort((a, b) => b.total - a.total);
  }, [earnings]);

  const today = new Date();
  const showAutoPrompt = today.getDate() >= 28 && !payslip;

  const submit = async () => {
    if (summary.gross <= 0) { toast.error("No received earnings to submit for this month"); return; }
    setSubmitting(true);
    try {
      const payload = {
        staff_user_id: staffUserId,
        period_month: period,
        gross_amount: summary.gross,
        tax_estimate: summary.tax,
        net_amount: summary.net,
        tax_rate: taxRate,
        currency: summary.currency,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      };
      const { data, error } = await (supabase as any)
        .from('staff_payslips')
        .upsert(payload, { onConflict: 'staff_user_id,period_month' })
        .select()
        .single();
      if (error) throw error;
      await insertStaffNotification({
        eventType: 'payslip_submitted',
        title: 'Payslip submitted for review',
        body: `${staffEmail || 'A staff member'} submitted a payslip for ${period} — ${formatMoney(summary.net, summary.currency)} net`,
        eventData: { payslip_id: data.id, staff_user_id: staffUserId, period_month: period, gross: summary.gross, net: summary.net, currency: summary.currency },
        dedupeKey: `payslip:${staffUserId}:${period}`,
      });
      toast.success("Payslip submitted to admin");
      setPayslip(data);
    } catch (err: any) {
      toast.error(err?.message || "Submission failed");
    } finally { setSubmitting(false); }
  };

  const saveTaxRate = async () => {
    const { error } = await (supabase as any).from('staff_pay_settings').upsert({
      staff_user_id: staffUserId,
      default_tax_rate: taxRate,
      preferred_currency: settings?.preferred_currency || 'GBP',
      default_earning_type: settings?.default_earning_type || 'work_75',
    }, { onConflict: 'staff_user_id' });
    if (error) toast.error(error.message); else toast.success("Default tax rate saved");
  };

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  const statusColor = payslip?.status === 'paid' ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
    : payslip?.status === 'approved' ? 'bg-blue-500/15 text-blue-700 border-blue-500/30'
    : payslip?.status === 'submitted' ? 'bg-amber-500/15 text-amber-700 border-amber-500/30'
    : 'bg-muted text-muted-foreground';

  return (
    <div className="space-y-4">
      {showAutoPrompt && (
        <div className="flex items-start gap-3 p-3 rounded border border-amber-500/40 bg-amber-500/10">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium">It's payslip time</div>
            <div className="text-muted-foreground">It's the 28th or later — submit your monthly payslip to admin when ready.</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label>Period</Label>
          <Input type="month" value={period} onChange={e => setPeriod(e.target.value)} className="w-40" />
        </div>
        <div>
          <Label>Tax Rate (%)</Label>
          <div className="flex gap-2">
            <Input type="number" step="0.5" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="w-24" disabled={!!payslip && payslip.status !== 'draft'} />
            <Button variant="outline" size="sm" onClick={saveTaxRate}><Save className="w-4 h-4" /></Button>
          </div>
        </div>
        {payslip && <Badge variant="outline" className={statusColor}>{payslip.status.toUpperCase()}</Badge>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Gross</div><div className="text-xl font-bold">{formatMoney(summary.gross, summary.currency)}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tax Estimate ({taxRate}%)</div><div className="text-xl font-bold text-rose-600">-{formatMoney(summary.tax, summary.currency)}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-[10px] uppercase tracking-wider text-muted-foreground">Net Take-Home</div><div className="text-xl font-bold text-emerald-600">{formatMoney(summary.net, summary.currency)}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Breakdown by Client</CardTitle></CardHeader>
        <CardContent className="p-0">
          {grouped.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground text-center">No received earnings for this month.</div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Client</TableHead><TableHead className="text-right">Items</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
              <TableBody>
                {grouped.map(g => (
                  <TableRow key={g.client}><TableCell className="font-medium">{g.client}</TableCell><TableCell className="text-right">{g.count}</TableCell><TableCell className="text-right font-mono">{formatMoney(g.total, summary.currency)}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded border bg-muted/20">
        <div className="text-sm">
          {payslip
            ? <span>Submitted on {payslip.submitted_at ? format(new Date(payslip.submitted_at), 'PP') : '—'}{payslip.admin_notes ? ` • ${payslip.admin_notes}` : ''}</span>
            : <span className="text-muted-foreground">When you're ready, push this to admin for approval.</span>}
        </div>
        <Button onClick={submit} disabled={submitting || (!!payslip && payslip.status !== 'draft')}>
          {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          {payslip ? (payslip.status === 'draft' ? 'Submit to Admin' : 'Already Submitted') : 'Submit to Admin'}
        </Button>
      </div>
    </div>
  );
};
