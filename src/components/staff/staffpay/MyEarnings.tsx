import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AddEarningDialog } from "./AddEarningDialog";
import { format } from "date-fns";

interface Props { staffUserId: string; isAdmin?: boolean; }

const formatMoney = (amount: number, currency: string) => {
  const sym = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
  return `${sym}${amount.toFixed(2)}`;
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  received: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  paid_out: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
};

export const MyEarnings = ({ staffUserId, isAdmin }: Props) => {
  const [period, setPeriod] = useState(() => format(new Date(), 'yyyy-MM'));
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('staff_client_earnings')
      .select('*')
      .eq('staff_user_id', staffUserId)
      .eq('period_month', period)
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    setRows(data || []);
    setLoading(false);
  }, [staffUserId, period]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).from('staff_pay_settings').select('*').eq('staff_user_id', staffUserId).maybeSingle();
      setSettings(data);
    })();
  }, [staffUserId]);

  const totals = useMemo(() => {
    const sum = (st: string) => rows.filter(r => r.status === st).reduce((a, r) => a + Number(r.amount_due || 0), 0);
    return { pending: sum('pending'), received: sum('received'), paidOut: sum('paid_out'), currency: rows[0]?.currency || settings?.preferred_currency || 'GBP' };
  }, [rows, settings]);

  const setStatus = async (row: any, status: string) => {
    const patch: any = { status };
    if (status === 'received') patch.received_at = new Date().toISOString().slice(0, 10);
    if (status === 'paid_out') patch.paid_out_at = new Date().toISOString().slice(0, 10);
    const { error } = await (supabase as any).from('staff_client_earnings').update(patch).eq('id', row.id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Marked as ${status.replace('_', ' ')}`);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this earning record?")) return;
    const { error } = await (supabase as any).from('staff_client_earnings').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Period</label>
          <Input type="month" value={period} onChange={e => setPeriod(e.target.value)} className="w-40" />
        </div>
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Client Earning
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pending</div>
          <div className="text-xl font-bold text-amber-600">{formatMoney(totals.pending, totals.currency)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Received (awaiting payout)</div>
          <div className="text-xl font-bold text-emerald-600">{formatMoney(totals.received, totals.currency)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Paid Out</div>
          <div className="text-xl font-bold text-blue-600">{formatMoney(totals.paidOut, totals.currency)}</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="w-5 h-5 animate-spin" /></div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No earnings logged for this month yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{r.client_name}</div>
                      {r.notes && <div className="text-xs text-muted-foreground line-clamp-1">{r.notes}</div>}
                    </TableCell>
                    <TableCell className="text-xs">
                      {r.earning_type === 'work_75' ? 'Work 75%' : r.earning_type === 'commission_10' ? 'Commission 10%' : `Manual ${r.percentage}%`}
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatMoney(Number(r.amount_due), r.currency)}</TableCell>
                    <TableCell><Badge variant="outline" className={STATUS_COLORS[r.status]}>{r.status.replace('_', ' ')}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {r.status === 'pending' && (
                          <Button size="sm" variant="ghost" onClick={() => setStatus(r, 'received')} title="Mark received">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </Button>
                        )}
                        {isAdmin && r.status === 'received' && (
                          <Button size="sm" variant="ghost" onClick={() => setStatus(r, 'paid_out')} title="Mark paid out">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddEarningDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        staffUserId={staffUserId}
        defaultPeriod={period}
        defaultCurrency={settings?.preferred_currency || 'GBP'}
        defaultEarningType={settings?.default_earning_type || 'work_75'}
        onSaved={load}
        initial={editing}
      />
    </div>
  );
};
