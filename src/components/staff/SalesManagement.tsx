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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Copy, Link, FileText, TrendingUp, Eye, Trash2, Check, Clock, X, CreditCard, CalendarDays, Repeat, Package } from "lucide-react";

interface PayLink {
  id: string;
  title: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  created_at: string;
  expires_at: string | null;
  payment_type?: string;
  installment_count?: number;
  recurring_interval?: string;
  product_id?: string;
  customer_name?: string;
  customer_email?: string;
  invoice_notes?: string;
  stripe_payment_link_url?: string;
}

interface PayLinkItem {
  id?: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
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

interface ServiceProduct {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface SalesManagementProps {
  isAdmin: boolean;
}

export const SalesManagement = ({ isAdmin }: SalesManagementProps) => {
  const [payLinks, setPayLinks] = useState<PayLink[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [payLinkDialogOpen, setPayLinkDialogOpen] = useState(false);
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  
  // Multi-product state
  const [payLinkItems, setPayLinkItems] = useState<PayLinkItem[]>([]);
  
  const [payLinkForm, setPayLinkForm] = useState({
    title: "",
    currency: "GBP",
    description: "",
    payment_type: "one_off" as "one_off" | "subscription" | "installments",
    installment_count: "",
    recurring_interval: "month",
    customer_name: "",
    customer_email: "",
    invoice_notes: "",
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
    await Promise.all([fetchPayLinks(), fetchSales(), fetchProducts()]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("service_catalog")
      .select("id, name, price, category")
      .order("name");
    
    if (error) {
      console.error("Error fetching products:", error);
      return;
    }
    setProducts(data || []);
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

  const addPayLinkItem = () => {
    setPayLinkItems([...payLinkItems, { product_id: null, product_name: "", quantity: 1, unit_price: 0 }]);
  };

  const updatePayLinkItem = (index: number, field: keyof PayLinkItem, value: any) => {
    const updated = [...payLinkItems];
    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === value);
      if (product) {
        updated[index] = {
          ...updated[index],
          product_id: value,
          product_name: product.name,
          unit_price: product.price
        };
      }
    } else {
      (updated[index] as any)[field] = value;
    }
    setPayLinkItems(updated);
  };

  const removePayLinkItem = (index: number) => {
    setPayLinkItems(payLinkItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return payLinkItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  };

  const handleCreatePayLink = async () => {
    if (!payLinkForm.title) {
      toast.error("Please fill in a title");
      return;
    }

    if (payLinkItems.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    const totalAmount = calculateTotal();

    // Create pay link
    const { data: payLinkData, error: payLinkError } = await supabase.from("pay_links").insert({
      title: payLinkForm.title,
      amount: totalAmount,
      currency: payLinkForm.currency,
      description: payLinkForm.description || null,
      status: "active",
      payment_type: payLinkForm.payment_type,
      recurring_interval: payLinkForm.payment_type === 'subscription' ? payLinkForm.recurring_interval : null,
      installment_count: payLinkForm.payment_type === 'installments' && payLinkForm.installment_count ? parseInt(payLinkForm.installment_count) : null,
      customer_name: payLinkForm.customer_name || null,
      customer_email: payLinkForm.customer_email || null,
      invoice_notes: payLinkForm.invoice_notes || null,
    }).select().single();

    if (payLinkError) {
      console.error("Error creating pay link:", payLinkError);
      toast.error(`Failed to create pay link: ${payLinkError.message}`);
      return;
    }

    // Create pay link items
    const itemsToInsert = payLinkItems.map(item => ({
      pay_link_id: payLinkData.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabase.from("pay_link_items").insert(itemsToInsert);

    if (itemsError) {
      console.error("Error creating pay link items:", itemsError);
      toast.error(`Pay link created but items failed to save: ${itemsError.message}`);
    }

    toast.success("Pay link created!");
    setPayLinkDialogOpen(false);
    resetPayLinkForm();
    fetchPayLinks();
  };

  const resetPayLinkForm = () => {
    setPayLinkForm({ 
      title: "", 
      currency: "GBP", 
      description: "",
      payment_type: "one_off",
      installment_count: "",
      recurring_interval: "month",
      customer_name: "",
      customer_email: "",
      invoice_notes: "",
    });
    setPayLinkItems([]);
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
      toast.error(`Failed to record sale: ${error.message}`);
      return;
    }

    toast.success("Sale recorded!");
    setSaleDialogOpen(false);
    setSaleForm({ customer_name: "", customer_email: "", amount: "", currency: "GBP", payment_method: "bank_transfer", notes: "" });
    fetchSales();
  };

  const copyPayLink = (link: PayLink) => {
    const slug = (link as any).slug || link.id;
    const url = `${window.location.origin}/pay/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Pay link copied to clipboard!");
  };

  const duplicatePayLink = async (link: PayLink) => {
    const slug = link.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const { data: newLink, error } = await supabase.from("pay_links").insert({
      title: link.title,
      amount: link.amount,
      currency: link.currency,
      description: link.description,
      status: "active",
      payment_type: link.payment_type || "one_off",
      recurring_interval: link.recurring_interval,
      installment_count: link.installment_count,
      customer_name: null,
      customer_email: null,
      invoice_notes: link.invoice_notes,
      slug: slug + '-' + Date.now().toString(36),
    }).select().single();

    if (error) {
      toast.error(`Failed to duplicate: ${error.message}`);
      return;
    }

    // Also duplicate pay_link_items
    const { data: items } = await supabase.from("pay_link_items").select("*").eq("pay_link_id", link.id);
    if (items && items.length > 0 && newLink) {
      await supabase.from("pay_link_items").insert(
        items.map(item => ({
          pay_link_id: newLink.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      );
    }

    toast.success("Pay link duplicated!");
    fetchPayLinks();
  };

  const deletePayLink = async (id: string) => {
    const { error } = await supabase.from("pay_links").delete().eq("id", id);
    if (error) {
      toast.error(`Failed to delete pay link: ${error.message}`);
      return;
    }
    toast.success("Pay link deleted");
    fetchPayLinks();
  };

  const updatePayLinkStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("pay_links").update({ status }).eq("id", id);
    if (error) {
      toast.error(`Failed to update status: ${error.message}`);
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
                    <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Plus className="w-4 h-4 mr-1" /> Create Pay Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Create Pay Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      {/* Title and Customer Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Title *</Label>
                          <Input
                            value={payLinkForm.title}
                            onChange={(e) => setPayLinkForm({ ...payLinkForm, title: e.target.value })}
                            placeholder="e.g., Monthly Package - John Smith"
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

                      {/* Payment Type */}
                      <div>
                        <Label>Payment Type</Label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => setPayLinkForm({ ...payLinkForm, payment_type: "one_off" })}
                            className={`p-2 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${payLinkForm.payment_type === 'one_off' ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                          >
                            <CreditCard className="w-4 h-4" />
                            <span className="text-xs">One-Off</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPayLinkForm({ ...payLinkForm, payment_type: "subscription" })}
                            className={`p-2 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${payLinkForm.payment_type === 'subscription' ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                          >
                            <Repeat className="w-4 h-4" />
                            <span className="text-xs">Subscription</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPayLinkForm({ ...payLinkForm, payment_type: "installments" })}
                            className={`p-2 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${payLinkForm.payment_type === 'installments' ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`}
                          >
                            <CalendarDays className="w-4 h-4" />
                            <span className="text-xs">Installments</span>
                          </button>
                        </div>
                      </div>

                      {/* Subscription/Installment options */}
                      {payLinkForm.payment_type === 'subscription' && (
                        <div>
                          <Label>Billing Interval</Label>
                          <Select value={payLinkForm.recurring_interval} onValueChange={(v) => setPayLinkForm({ ...payLinkForm, recurring_interval: v })}>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="week">Weekly</SelectItem>
                              <SelectItem value="month">Monthly</SelectItem>
                              <SelectItem value="year">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {payLinkForm.payment_type === 'installments' && (
                        <div>
                          <Label>Number of Installments</Label>
                          <Input
                            type="number"
                            value={payLinkForm.installment_count}
                            onChange={(e) => setPayLinkForm({ ...payLinkForm, installment_count: e.target.value })}
                            placeholder="e.g., 3"
                            className="bg-background/50"
                          />
                        </div>
                      )}

                      {/* Products Section */}
                      <div className="border rounded-lg p-4 bg-background/30">
                        <div className="flex items-center justify-between mb-3">
                          <Label className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Products / Services
                          </Label>
                          <Button type="button" variant="outline" size="sm" onClick={addPayLinkItem}>
                            <Plus className="w-3 h-3 mr-1" /> Add Product
                          </Button>
                        </div>

                        {payLinkItems.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No products added. Click "Add Product" to start.
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {payLinkItems.map((item, index) => (
                              <div key={index} className="grid grid-cols-12 gap-2 items-end bg-background/50 p-3 rounded-lg">
                                <div className="col-span-5">
                                  <Label className="text-xs">Product</Label>
                                  <Select 
                                    value={item.product_id || "custom"} 
                                    onValueChange={(v) => {
                                      if (v === "custom") {
                                        updatePayLinkItem(index, 'product_id', null);
                                      } else {
                                        updatePayLinkItem(index, 'product_id', v);
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="bg-background/50 h-9">
                                      <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="custom">Custom Item</SelectItem>
                                      {products.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name} - £{p.price}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {!item.product_id && (
                                  <div className="col-span-3">
                                    <Label className="text-xs">Name</Label>
                                    <Input
                                      value={item.product_name}
                                      onChange={(e) => updatePayLinkItem(index, 'product_name', e.target.value)}
                                      placeholder="Item name"
                                      className="bg-background/50 h-9"
                                    />
                                  </div>
                                )}
                                <div className={item.product_id ? "col-span-2" : "col-span-1"}>
                                  <Label className="text-xs">Qty</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updatePayLinkItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                    className="bg-background/50 h-9"
                                  />
                                </div>
                                <div className={item.product_id ? "col-span-3" : "col-span-2"}>
                                  <Label className="text-xs">Unit Price (£)</Label>
                                  <Input
                                    type="number"
                                    value={item.unit_price}
                                    onChange={(e) => updatePayLinkItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                    className="bg-background/50 h-9"
                                  />
                                </div>
                                <div className="col-span-1">
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removePayLinkItem(index)}
                                    className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="col-span-12 text-right text-sm text-muted-foreground">
                                  Subtotal: £{(item.unit_price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            ))}
                            
                            {/* Total */}
                            <div className="flex justify-between items-center pt-3 border-t">
                              <span className="font-medium">Total</span>
                              <span className="text-xl font-bold text-accent">
                                {formatCurrency(calculateTotal(), payLinkForm.currency)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Customer Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Customer Name</Label>
                          <Input
                            value={payLinkForm.customer_name}
                            onChange={(e) => setPayLinkForm({ ...payLinkForm, customer_name: e.target.value })}
                            placeholder="John Doe"
                            className="bg-background/50"
                          />
                        </div>
                        <div>
                          <Label>Customer Email</Label>
                          <Input
                            type="email"
                            value={payLinkForm.customer_email}
                            onChange={(e) => setPayLinkForm({ ...payLinkForm, customer_email: e.target.value })}
                            placeholder="john@example.com"
                            className="bg-background/50"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description / Invoice Notes</Label>
                        <Textarea
                          value={payLinkForm.description}
                          onChange={(e) => setPayLinkForm({ ...payLinkForm, description: e.target.value })}
                          placeholder="Details about this payment..."
                          className="bg-background/50"
                          rows={2}
                        />
                      </div>

                      <Button 
                        onClick={handleCreatePayLink} 
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        disabled={payLinkItems.length === 0}
                      >
                        Create Pay Link ({formatCurrency(calculateTotal(), payLinkForm.currency)})
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
                        <p className="text-lg font-bold text-accent mt-1">
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
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-1" /> Record Sale
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-card border-border">
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
                      <Button onClick={handleRecordSale} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
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
                      <p className="text-lg font-bold text-accent">
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
