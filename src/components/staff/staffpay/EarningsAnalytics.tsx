import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from "recharts";
import { useStaffList } from "./useStaffList";
import { format, subMonths } from "date-fns";

interface Props { staffUserId: string; isAdmin?: boolean; }

const fmt = (n: number, c: string) => `${c === 'GBP' ? '£' : c === 'USD' ? '$' : '€'}${n.toFixed(2)}`;

export const EarningsAnalytics = ({ staffUserId, isAdmin }: Props) => {
  const { staff } = useStaffList();
  const [scope, setScope] = useState<string>(staffUserId);
  const [months, setMonths] = useState<number>(12);
  const [rows, setRows] = useState<any[]>([]);
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const since = format(subMonths(new Date(), months - 1), 'yyyy-MM');
      let q1 = (supabase as any).from('staff_client_earnings').select('*').gte('period_month', since);
      let q2 = (supabase as any).from('staff_payslips').select('*').gte('period_month', since);
      if (scope !== 'all') {
        q1 = q1.eq('staff_user_id', scope);
        q2 = q2.eq('staff_user_id', scope);
      }
      const [eRes, pRes] = await Promise.all([q1, q2]);
      if (!active) return;
      setRows(eRes.data || []);
      setPayslips(pRes.data || []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [scope, months]);

  const currency = rows[0]?.currency || 'GBP';

  const monthly = useMemo(() => {
    const map: Record<string, { period: string; earned: number; received: number; paidOut: number; pending: number }> = {};
    for (let i = months - 1; i >= 0; i--) {
      const k = format(subMonths(new Date(), i), 'yyyy-MM');
      map[k] = { period: k, earned: 0, received: 0, paidOut: 0, pending: 0 };
    }
    for (const r of rows) {
      const k = r.period_month;
      if (!map[k]) map[k] = { period: k, earned: 0, received: 0, paidOut: 0, pending: 0 };
      const amt = Number(r.amount_due || 0);
      map[k].earned += amt;
      if (r.status === 'received') map[k].received += amt;
      else if (r.status === 'paid_out') map[k].paidOut += amt;
      else map[k].pending += amt;
    }
    return Object.values(map).sort((a, b) => a.period.localeCompare(b.period));
  }, [rows, months]);

  const totals = useMemo(() => {
    const earned = rows.reduce((a, r) => a + Number(r.amount_due || 0), 0);
    const received = rows.filter(r => r.status === 'received').reduce((a, r) => a + Number(r.amount_due || 0), 0);
    const paidOut = rows.filter(r => r.status === 'paid_out').reduce((a, r) => a + Number(r.amount_due || 0), 0);
    const pending = rows.filter(r => r.status === 'pending').reduce((a, r) => a + Number(r.amount_due || 0), 0);
    const tax = payslips.reduce((a, p) => a + Number(p.tax_estimate || 0), 0);
    const ytd = rows.filter(r => r.period_month.startsWith(String(new Date().getFullYear()))).reduce((a, r) => a + Number(r.amount_due || 0), 0);
    return { earned, received, paidOut, pending, tax, ytd };
  }, [rows, payslips]);

  const byClient = useMemo(() => {
    const m: Record<string, number> = {};
    rows.forEach(r => { m[r.client_name] = (m[r.client_name] || 0) + Number(r.amount_due || 0); });
    return Object.entries(m).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total).slice(0, 8);
  }, [rows]);

  const cumulative = useMemo(() => {
    let run = 0;
    return monthly.map(m => { run += m.paidOut; return { period: m.period, cumulative: Number(run.toFixed(2)) }; });
  }, [monthly]);

  const exportCsv = () => {
    const header = "period,client,type,amount,currency,status,received_at,paid_out_at,notes\n";
    const body = rows.map(r => [r.period_month, JSON.stringify(r.client_name || ''), r.earning_type, r.amount_due, r.currency, r.status, r.received_at || '', r.paid_out_at || '', JSON.stringify(r.notes || '')].join(',')).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `staff-earnings-${scope}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        {isAdmin && (
          <div>
            <div className="text-xs text-muted-foreground">Scope</div>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All staff</SelectItem>
                {staff.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <div className="text-xs text-muted-foreground">Range</div>
          <Select value={String(months)} onValueChange={v => setMonths(Number(v))}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Last 3 months</SelectItem>
              <SelectItem value="6">Last 6 months</SelectItem>
              <SelectItem value="12">Last 12 months</SelectItem>
              <SelectItem value="24">Last 24 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-3"><div className="text-[10px] uppercase text-muted-foreground">Earned</div><div className="text-lg font-bold">{fmt(totals.earned, currency)}</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] uppercase text-muted-foreground">YTD {new Date().getFullYear()}</div><div className="text-lg font-bold">{fmt(totals.ytd, currency)}</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] uppercase text-muted-foreground">Pending</div><div className="text-lg font-bold text-amber-600">{fmt(totals.pending, currency)}</div></CardContent></Card>
        <Card><CardContent className="p-3"><div className="text-[10px] uppercase text-muted-foreground">Paid Out</div><div className="text-lg font-bold text-blue-600">{fmt(totals.paidOut, currency)}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Earnings</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="period" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v: any) => fmt(Number(v), currency)} />
              <Legend />
              <Bar dataKey="paidOut" stackId="a" name="Paid Out" fill="hsl(217 91% 60%)" />
              <Bar dataKey="received" stackId="a" name="Received" fill="hsl(142 71% 45%)" />
              <Bar dataKey="pending" stackId="a" name="Pending" fill="hsl(38 92% 50%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Cumulative Paid Out</CardTitle></CardHeader>
          <CardContent className="h-60">
            <ResponsiveContainer>
              <LineChart data={cumulative}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="period" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: any) => fmt(Number(v), currency)} />
                <Line type="monotone" dataKey="cumulative" stroke="hsl(47 100% 51%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Top Clients</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {byClient.length === 0 && <div className="text-xs text-muted-foreground">No data.</div>}
            {byClient.map(c => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="truncate mr-2">{c.name}</span>
                <Badge variant="outline" className="font-mono">{fmt(c.total, currency)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
