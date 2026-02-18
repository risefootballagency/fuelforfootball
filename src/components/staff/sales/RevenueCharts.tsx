import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { TrendingUp, DollarSign, Package, Target } from "lucide-react";
import { format, subMonths } from "date-fns";

interface SalesGoal {
  month: string;
  packages_target: number;
  revenue_target: number;
  packages_actual: number;
  revenue_actual: number;
}

export function RevenueCharts() {
  const [data, setData] = useState<SalesGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const months = Array.from({ length: 12 }, (_, i) => format(subMonths(new Date(), 11 - i), "yyyy-MM"));
    
    const { data: goals, error } = await supabase
      .from("sales_goals")
      .select("*")
      .in("month", months)
      .order("month", { ascending: true });

    if (!error) {
      const mapped = months.map(m => {
        const goal = goals?.find(g => g.month === m);
        return {
          month: m,
          label: format(new Date(m + "-01"), "MMM"),
          packages_target: goal?.packages_target || 0,
          revenue_target: goal?.revenue_target || 0,
          packages_actual: goal?.packages_actual || 0,
          revenue_actual: goal?.revenue_actual || 0,
        };
      });
      setData(mapped);
    }
    setLoading(false);
  };

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue_actual, 0);
  const totalTarget = data.reduce((sum, d) => sum + d.revenue_target, 0);
  const totalPackages = data.reduce((sum, d) => sum + d.packages_actual, 0);
  const avgDealSize = totalPackages > 0 ? Math.round(totalRevenue / totalPackages) : 0;
  const conversionRate = totalTarget > 0 ? Math.round((totalRevenue / totalTarget) * 100) : 0;

  if (loading) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-card border border-border rounded-lg p-2 text-xs shadow-lg">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}: {entry.name.includes("Revenue") ? `£${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="border-accent/20">
          <CardContent className="p-3 text-center">
            <DollarSign className="h-4 w-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-accent">£{totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Total Revenue (12mo)</p>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="p-3 text-center">
            <Package className="h-4 w-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold">{totalPackages}</p>
            <p className="text-[10px] text-muted-foreground">Packages Sold</p>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-4 w-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold">£{avgDealSize.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">Avg Deal Size</p>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="p-3 text-center">
            <Target className="h-4 w-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold">{conversionRate}%</p>
            <p className="text-[10px] text-muted-foreground">Target Hit Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue vs Target Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-accent" />
            Revenue vs Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `£${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue_target"
                  name="Target"
                  stroke="hsl(var(--muted-foreground))"
                  fill="hsl(var(--muted))"
                  strokeDasharray="5 5"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="revenue_actual"
                  name="Revenue"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Packages Sold Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Package className="h-4 w-4 text-accent" />
            Packages Sold vs Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="packages_target" name="Target" fill="hsl(var(--muted))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="packages_actual" name="Packages Sold" fill="hsl(var(--accent))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
