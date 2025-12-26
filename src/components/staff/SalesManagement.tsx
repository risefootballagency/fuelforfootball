import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import { Plus, Copy, Link, FileText, TrendingUp, Eye, Trash2, Check, Clock, X } from "lucide-react";

interface PayLink {
  id: string;
  title: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  created_at: string;
  expires_at: string | null;
}

interface Sale {
  id: string;
  pay_link_id: string | null;
  invoice_id: string | null;
  customer_name: string;
  customer_email: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  completed_at: string | null;
}

interface SalesManagementProps {
  isAdmin: boolean;
}

export const SalesManagement = ({ isAdmin }: SalesManagementProps) => {
  const [payLinks, setPayLinks] = useState<PayLink[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [payLinkDialogOpen, setPayLinkDialogOpen] = useState(false);
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  
  const [payLinkForm, setPayLinkForm] = useState({
    title: "",
    amount: "",
    currency: "GBP",
    description: "",
  });

  const [saleForm, setSaleForm] = useState({
    customer_name: "",
    customer_email: "",
    amount: "",
    currency: "GBP",
    payment_method: "bank_transfer",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchPayLinks(), fetchSales()]);
    setLoading(false);
  };

  const fetchPayLinks = async () => {
    const { data, error } = await supabase
      .from("pay_links")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching pay links:", error);
      return;
    }
    setPayLinks(data || []);
  };

  const fetchSales = async () => {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching sales:", error);
      return;
    }
    setSales(data || []);
  };

  const handleCreatePayLink = async () => {
    if (!payLinkForm.title || !payLinkForm.amount) {
      toast.error("Please fill in title and amount");
      return;
    }

    const { error } = await supabase.from("pay_links").insert({
      title: payLinkForm.title,
      amount: parseFloat(payLinkForm.amount),
      currency: payLinkForm.currency,
      description: payLinkForm.description || null,
      status: "active",
    });

    if (error) {
      console.error("Error creating pay link:", error);
      toast.error("Failed to create pay link");
      return;
    }

    toast.success("Pay link created!");
    setPayLinkDialogOpen(false);
    setPayLinkForm({ title: "", amount: "", currency: "GBP", description: "" });
    fetchPayLinks();
  };

  const handleRecordSale = async () => {
    if (!saleForm.customer_name || !saleForm.amount) {
      toast.error("Please fill in customer name and amount");
      return;
    }

    const { error } = await supabase.from("sales").insert({
      customer_name: saleForm.customer_name,
      customer_email: saleForm.customer_email || null,
      amount: parseFloat(saleForm.amount),
      currency: saleForm.currency,
      payment_method: saleForm.payment_method,
      notes: saleForm.notes || null,
      status: "completed",
      completed_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error recording sale:", error);
      toast.error("Failed to record sale");
      return;
    }

    toast.success("Sale recorded!");
    setSaleDialogOpen(false);
    setSaleForm({ customer_name: "", customer_email: "", amount: "", currency: "GBP", payment_method: "bank_transfer", notes: "" });
    fetchSales();
  };

  const copyPayLink = (id: string) => {
    const url = `${window.location.origin}/pay/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Pay link copied to clipboard!");
  };

  const deletePayLink = async (id: string) => {
    const { error } = await supabase.from("pay_links").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete pay link");
      return;
    }
    toast.success("Pay link deleted");
    fetchPayLinks();
  };

  const updatePayLinkStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("pay_links").update({ status }).eq("id", id);
    if (error) {
      toast.error("Failed to update status");
      return;
    }
    toast.success("Status updated");
    fetchPayLinks();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><Clock className="w-3 h-3 mr-1" />Active</Badge>;
      case "completed":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30"><Check className="w-3 h-3 mr-1" />Completed</Badge>;
      case "expired":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30"><X className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalSales = sales.filter(s => s.status === "completed").reduce((sum, s) => sum + s.amount, 0);
  const activeLinks = payLinks.filter(p => p.status === "active").length;

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading sales data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSales, "GBP")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Link className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Pay Links</p>
                <p className="text-2xl font-bold text-foreground">{activeLinks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold text-foreground">{sales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pay-links" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="pay-links">Pay Links</TabsTrigger>
          <TabsTrigger value="sales">Sales History</TabsTrigger>
        </TabsList>

        <TabsContent value="pay-links" className="mt-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Pay Links</CardTitle>
              {isAdmin && (
                <Dialog open={payLinkDialogOpen} onOpenChange={setPayLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-light-green text-background hover:bg-light-green/90">
                      <Plus className="w-4 h-4 mr-1" /> Create Pay Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Create Pay Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Title *</Label>
                        <Input
                          value={payLinkForm.title}
                          onChange={(e) => setPayLinkForm({ ...payLinkForm, title: e.target.value })}
                          placeholder="e.g., Monthly Subscription"
                          className="bg-background/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Amount *</Label>
                          <Input
                            type="number"
                            value={payLinkForm.amount}
                            onChange={(e) => setPayLinkForm({ ...payLinkForm, amount: e.target.value })}
                            placeholder="0.00"
                            className="bg-background/50"
                          />
                        </div>
                        <div>
                          <Label>Currency</Label>
                          <Select value={payLinkForm.currency} onValueChange={(v) => setPayLinkForm({ ...payLinkForm, currency: v })}>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={payLinkForm.description}
                          onChange={(e) => setPayLinkForm({ ...payLinkForm, description: e.target.value })}
                          placeholder="Optional description..."
                          className="bg-background/50"
                        />
                      </div>
                      <Button onClick={handleCreatePayLink} className="w-full bg-light-green text-background hover:bg-light-green/90">
                        Create Pay Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              {payLinks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pay links created yet</p>
              ) : (
                <div className="space-y-3">
                  {payLinks.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{link.title}</h4>
                          {getStatusBadge(link.status)}
                        </div>
                        <p className="text-lg font-bold text-light-green mt-1">
                          {formatCurrency(link.amount, link.currency)}
                        </p>
                        {link.description && (
                          <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyPayLink(link.id)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(`/pay/${link.id}`, "_blank")}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {isAdmin && link.status === "active" && (
                          <Button variant="outline" size="sm" onClick={() => updatePayLinkStatus(link.id, "completed")}>
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {isAdmin && (
                          <Button variant="destructive" size="sm" onClick={() => deletePayLink(link.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="mt-4">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Sales History</CardTitle>
              {isAdmin && (
                <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-light-green text-background hover:bg-light-green/90">
                      <Plus className="w-4 h-4 mr-1" /> Record Sale
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Record Manual Sale</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Customer Name *</Label>
                        <Input
                          value={saleForm.customer_name}
                          onChange={(e) => setSaleForm({ ...saleForm, customer_name: e.target.value })}
                          placeholder="Customer name"
                          className="bg-background/50"
                        />
                      </div>
                      <div>
                        <Label>Customer Email</Label>
                        <Input
                          type="email"
                          value={saleForm.customer_email}
                          onChange={(e) => setSaleForm({ ...saleForm, customer_email: e.target.value })}
                          placeholder="customer@email.com"
                          className="bg-background/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Amount *</Label>
                          <Input
                            type="number"
                            value={saleForm.amount}
                            onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                            placeholder="0.00"
                            className="bg-background/50"
                          />
                        </div>
                        <div>
                          <Label>Currency</Label>
                          <Select value={saleForm.currency} onValueChange={(v) => setSaleForm({ ...saleForm, currency: v })}>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Payment Method</Label>
                        <Select value={saleForm.payment_method} onValueChange={(v) => setSaleForm({ ...saleForm, payment_method: v })}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Textarea
                          value={saleForm.notes}
                          onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })}
                          placeholder="Optional notes..."
                          className="bg-background/50"
                        />
                      </div>
                      <Button onClick={handleRecordSale} className="w-full bg-light-green text-background hover:bg-light-green/90">
                        Record Sale
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              {sales.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No sales recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {sales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{sale.customer_name}</h4>
                          {getStatusBadge(sale.status)}
                        </div>
                        {sale.customer_email && (
                          <p className="text-sm text-muted-foreground">{sale.customer_email}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(sale.created_at).toLocaleDateString()} • {sale.payment_method?.replace("_", " ")}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-light-green">
                        {formatCurrency(sale.amount, sale.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
