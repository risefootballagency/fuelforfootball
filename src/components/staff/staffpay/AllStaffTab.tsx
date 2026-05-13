import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Check, BadgeCheck, Banknote, Eye, EyeOff, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { insertStaffNotification } from "@/lib/staffNotifications";
import { useStaffList } from "./useStaffList";

const formatMoney = (n: number, c: string) => `${c === 'GBP' ? '£' : c === 'USD' ? '$' : '€'}${Number(n).toFixed(2)}`;

export const AllStaffTab = () => {
  const { staff, loading: staffLoading, setHidden } = useStaffList({ includeHidden: true });
  const [payslips, setPayslips] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentForm, setPaymentForm] = useState({ staff_user_id: '', period_month: format(new Date(), 'yyyy-MM'), amount: '', currency: 'GBP', payment_method: 'bank_transfer', reference: '', notes: '', payment_date: new Date().toISOString().slice(0, 10) });

  const users = useMemo(() => {
    const map: Record<string, { email: string; full_name?: string; hidden?: boolean }> = {};
    staff.forEach(s => { map[s.id] = { email: s.email, full_name: s.name, hidden: s.hidden }; });
    return map;
  }, [staff]);

  const load = useCallback(async () => {
    setLoading(true);
    const [pRes, eRes, payRes] = await Promise.all([
      (supabase as any).from('staff_payslips').select('*').order('submitted_at', { ascending: false, nullsFirst: false }).limit(200),
      (supabase as any).from('staff_client_earnings').select('*').order('created_at', { ascending: false }).limit(500),
      (supabase as any).from('staff_payments').select('*').order('payment_date', { ascending: false }).limit(500),
    ]);
    setPayslips(pRes.data || []);
    setEarnings(eRes.data || []);
    setPayments(payRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updatePayslip = async (ps: any, status: 'approved' | 'paid', notes?: string) => {
    const patch: any = { status };
    if (status === 'approved') patch.approved_at = new Date().toISOString();
    if (status === 'paid') patch.paid_at = new Date().toISOString();
    if (notes !== undefined) patch.admin_notes = notes;
    const { error } = await (supabase as any).from('staff_payslips').update(patch).eq('id', ps.id);
    if (error) { toast.error(error.message); return; }

    if (status === 'paid') {
      // Flip period earnings to paid_out and create a payments OUT row to keep global financials in sync.
      await (supabase as any).from('staff_client_earnings')
        .update({ status: 'paid_out', paid_out_at: new Date().toISOString().slice(0, 10) })
        .eq('staff_user_id', ps.staff_user_id)
        .eq('period_month', ps.period_month)
        .eq('status', 'received');

      const staffName = users[ps.staff_user_id]?.full_name || users[ps.staff_user_id]?.email || 'Staff';
      await supabase.from('payments').insert({
        type: 'out',
        amount: Number(ps.net_amount),
        currency: ps.currency,
        description: `Staff salary ${staffName} (${ps.period_month})`,
        payment_method: 'staff_salary',
        reference: ps.id,
        payment_date: new Date().toISOString().slice(0, 10),
      } as any);
    }

    await insertStaffNotification({
      eventType: status === 'paid' ? 'payslip_paid' : 'payslip_approved',
      title: status === 'paid' ? 'Payslip marked paid' : 'Payslip approved',
      body: `${users[ps.staff_user_id]?.full_name || users[ps.staff_user_id]?.email || 'Staff'} — ${ps.period_month} — ${formatMoney(Number(ps.net_amount), ps.currency)}`,
      eventData: { payslip_id: ps.id, staff_user_id: ps.staff_user_id, period_month: ps.period_month, status },
    });

    toast.success(`Payslip ${status}`);
    load();
  };

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  const totalsByStaff: Record<string, { staff: string; gross: number; net: number; outstanding: number; currency: string }> = {};
  for (const ps of payslips) {
    const k = ps.staff_user_id;
    const name = users[k]?.full_name || users[k]?.email || k.slice(0, 8);
    if (!totalsByStaff[k]) totalsByStaff[k] = { staff: name, gross: 0, net: 0, outstanding: 0, currency: ps.currency };
    totalsByStaff[k].gross += Number(ps.gross_amount);
    totalsByStaff[k].net += Number(ps.net_amount);
    if (ps.status !== 'paid') totalsByStaff[k].outstanding += Number(ps.net_amount);
  }

  return (
    <Tabs defaultValue="payslips">
      <TabsList>
        <TabsTrigger value="payslips">Payslips</TabsTrigger>
        <TabsTrigger value="ledger">Earnings Ledger</TabsTrigger>
        <TabsTrigger value="staff">By Staff</TabsTrigger>
      </TabsList>

      <TabsContent value="payslips">
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Staff</TableHead><TableHead>Period</TableHead><TableHead className="text-right">Gross</TableHead><TableHead className="text-right">Net</TableHead><TableHead>Status</TableHead><TableHead>Submitted</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {payslips.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground p-6">No payslips submitted yet.</TableCell></TableRow>}
              {payslips.map(ps => (
                <TableRow key={ps.id}>
                  <TableCell>{users[ps.staff_user_id]?.full_name || users[ps.staff_user_id]?.email || '—'}</TableCell>
                  <TableCell className="font-mono text-xs">{ps.period_month}</TableCell>
                  <TableCell className="text-right font-mono">{formatMoney(Number(ps.gross_amount), ps.currency)}</TableCell>
                  <TableCell className="text-right font-mono">{formatMoney(Number(ps.net_amount), ps.currency)}</TableCell>
                  <TableCell><Badge variant="outline">{ps.status}</Badge></TableCell>
                  <TableCell className="text-xs">{ps.submitted_at ? format(new Date(ps.submitted_at), 'PP') : '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {ps.status === 'submitted' && (
                        <Button size="sm" variant="outline" onClick={() => updatePayslip(ps, 'approved')}>
                          <BadgeCheck className="w-4 h-4 mr-1" />Approve
                        </Button>
                      )}
                      {(ps.status === 'approved' || ps.status === 'submitted') && (
                        <Button size="sm" onClick={() => updatePayslip(ps, 'paid')}>
                          <Banknote className="w-4 h-4 mr-1" />Mark Paid
                        </Button>
                      )}
                      {ps.status === 'paid' && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </TabsContent>

      <TabsContent value="ledger">
        <Card><CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Staff</TableHead><TableHead>Period</TableHead><TableHead>Client</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {earnings.slice(0, 200).map(e => (
                <TableRow key={e.id}>
                  <TableCell className="text-xs">{users[e.staff_user_id]?.full_name || users[e.staff_user_id]?.email || '—'}</TableCell>
                  <TableCell className="font-mono text-xs">{e.period_month}</TableCell>
                  <TableCell>{e.client_name}</TableCell>
                  <TableCell className="text-xs">{e.earning_type}</TableCell>
                  <TableCell className="text-right font-mono">{formatMoney(Number(e.amount_due), e.currency)}</TableCell>
                  <TableCell><Badge variant="outline">{e.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </TabsContent>

      <TabsContent value="staff">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(totalsByStaff).map(([k, t]) => (
            <Card key={k}><CardHeader className="pb-2"><CardTitle className="text-sm">{t.staff}</CardTitle></CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Gross (lifetime)</span><span className="font-mono">{formatMoney(t.gross, t.currency)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Net</span><span className="font-mono">{formatMoney(t.net, t.currency)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Outstanding</span><span className="font-mono text-amber-600">{formatMoney(t.outstanding, t.currency)}</span></div>
              </CardContent>
            </Card>
          ))}
          {Object.keys(totalsByStaff).length === 0 && <div className="text-sm text-muted-foreground">No data yet.</div>}
        </div>
      </TabsContent>
    </Tabs>
  );
};
