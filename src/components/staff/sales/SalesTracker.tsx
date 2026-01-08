import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Target, Package, TrendingUp, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { format, subMonths, addMonths, parseISO, startOfMonth } from "date-fns";

interface SalesGoal {
  id: string;
  month: string;
  packages_target: number;
  revenue_target: number;
  packages_actual: number;
  revenue_actual: number;
  notes: string | null;
}

export function SalesTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [goals, setGoals] = useState<SalesGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    packages_target: 0,
    revenue_target: 0,
    packages_actual: 0,
    revenue_actual: 0,
    notes: "",
  });

  const currentMonth = format(currentDate, "yyyy-MM");

  useEffect(() => {
    fetchGoals();
  }, [currentMonth]);

  const fetchGoals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sales_goals")
      .select("*")
      .eq("month", currentMonth)
      .single();

    if (data) {
      setGoals(data);
      setFormData({
        packages_target: data.packages_target,
        revenue_target: data.revenue_target,
        packages_actual: data.packages_actual,
        revenue_actual: data.revenue_actual,
        notes: data.notes || "",
      });
    } else {
      setGoals(null);
      setFormData({
        packages_target: 0,
        revenue_target: 0,
        packages_actual: 0,
        revenue_actual: 0,
        notes: "",
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      notes: formData.notes || null,
    };

    if (goals) {
      const { error } = await supabase
        .from("sales_goals")
        .update(payload)
        .eq("month", currentMonth);

      if (error) {
        toast.error("Failed to update goals");
      } else {
        toast.success("Goals updated");
        fetchGoals();
      }
    } else {
      const { error } = await supabase
        .from("sales_goals")
        .insert({ ...payload, month: currentMonth });

      if (error) {
        toast.error("Failed to set goals");
      } else {
        toast.success("Goals set");
        fetchGoals();
      }
    }

    setDialogOpen(false);
  };

  const updateActual = async (field: "packages_actual" | "revenue_actual", increment: number) => {
    if (!goals) {
      // Create goals first
      const { error } = await supabase
        .from("sales_goals")
        .insert({ 
          month: currentMonth,
          [field]: increment > 0 ? increment : 0,
        });

      if (!error) {
        fetchGoals();
      }
      return;
    }

    const newValue = Math.max(0, (goals[field] || 0) + increment);
    const { error } = await supabase
      .from("sales_goals")
      .update({ [field]: newValue })
      .eq("month", currentMonth);

    if (!error) {
      fetchGoals();
    }
  };

  const packagesProgress = goals && goals.packages_target > 0 
    ? Math.min(100, (goals.packages_actual / goals.packages_target) * 100) 
    : 0;
  
  const revenueProgress = goals && goals.revenue_target > 0 
    ? Math.min(100, (goals.revenue_actual / goals.revenue_target) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Packages Sold */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              Packages Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold">{goals?.packages_actual || 0}</p>
                  <p className="text-muted-foreground">of {goals?.packages_target || 0} target</p>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateActual("packages_actual", -1)}
                    disabled={!goals || goals.packages_actual <= 0}
                  >
                    -1
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => updateActual("packages_actual", 1)}
                  >
                    +1
                  </Button>
                </div>
              </div>
              <Progress value={packagesProgress} className="h-3" />
              <p className="text-sm text-muted-foreground text-right">
                {packagesProgress.toFixed(0)}% of goal
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold">£{(goals?.revenue_actual || 0).toLocaleString()}</p>
                  <p className="text-muted-foreground">of £{(goals?.revenue_target || 0).toLocaleString()} target</p>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateActual("revenue_actual", -100)}
                    disabled={!goals || goals.revenue_actual <= 0}
                  >
                    -£100
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => updateActual("revenue_actual", 100)}
                  >
                    +£100
                  </Button>
                </div>
              </div>
              <Progress value={revenueProgress} className="h-3" />
              <p className="text-sm text-muted-foreground text-right">
                {revenueProgress.toFixed(0)}% of goal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">
              {goals?.packages_target ? (goals.packages_target - goals.packages_actual) : 0}
            </p>
            <p className="text-sm text-muted-foreground">Packages to go</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-500">
              £{goals?.revenue_target ? ((goals.revenue_target - goals.revenue_actual)).toLocaleString() : 0}
            </p>
            <p className="text-sm text-muted-foreground">Revenue to go</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {goals?.packages_actual && goals?.packages_actual > 0 
                ? `£${Math.round(goals.revenue_actual / goals.packages_actual).toLocaleString()}`
                : "£0"}
            </p>
            <p className="text-sm text-muted-foreground">Avg per package</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className={`text-3xl font-bold ${revenueProgress >= 100 ? 'text-green-500' : revenueProgress >= 75 ? 'text-yellow-500' : 'text-red-500'}`}>
              {revenueProgress >= 100 ? '🎉' : revenueProgress >= 75 ? '📈' : '💪'}
            </p>
            <p className="text-sm text-muted-foreground">
              {revenueProgress >= 100 ? 'Goal smashed!' : revenueProgress >= 75 ? 'Nearly there!' : 'Keep pushing!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Set Goals Button */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Target className="h-4 w-4 mr-2" />
            {goals ? "Edit" : "Set"} Monthly Goals
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Goals for {format(currentDate, "MMMM yyyy")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Packages Target</Label>
                <Input
                  type="number"
                  value={formData.packages_target}
                  onChange={(e) => setFormData({ ...formData, packages_target: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Revenue Target (£)</Label>
                <Input
                  type="number"
                  value={formData.revenue_target}
                  onChange={(e) => setFormData({ ...formData, revenue_target: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Packages Actual</Label>
                <Input
                  type="number"
                  value={formData.packages_actual}
                  onChange={(e) => setFormData({ ...formData, packages_actual: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Revenue Actual (£)</Label>
                <Input
                  type="number"
                  value={formData.revenue_actual}
                  onChange={(e) => setFormData({ ...formData, revenue_actual: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any notes about this month's goals..."
              />
            </div>
            <Button type="submit" className="w-full">Save Goals</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
