import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Settings, CreditCard, Package, ExternalLink, Copy, Check, FileText, Plus, Trash2, Eye, Link } from "lucide-react";

interface Player {
  id: string;
  name: string;
  email: string;
  club?: string;
}

interface ServiceProduct {
  id: string;
  name: string;
  price: number;
  category: string | null;
  description: string | null;
  image_url: string | null;
  options: any[] | null;
}

export function PortalManagement() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [settings, setSettings] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payLinks, setPayLinks] = useState<any[]>([]);
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [newUpgradeFeature, setNewUpgradeFeature] = useState("");
  const [previewProduct, setPreviewProduct] = useState<ServiceProduct | null>(null);

  // Invoice creation form
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: "",
    amount: "",
    currency: "GBP",
    description: "",
    due_date: "",
    invoice_date: new Date().toISOString().split("T")[0],
  });

  // Pay link creation form
  const [showPayLinkForm, setShowPayLinkForm] = useState(false);
  const [payLinkForm, setPayLinkForm] = useState({
    title: "",
    amount: "",
    currency: "GBP",
    description: "",
  });
  const [creatingPayLink, setCreatingPayLink] = useState(false);

  // Widget form state
  const [formData, setFormData] = useState({
    hub_widget_type: "aphorisms" as "aphorisms" | "sales_box",
    current_package_name: "",
    current_package_price: "",
    current_package_currency: "GBP",
    current_package_features: [] as string[],
    upgrade_product_id: "",
    upgrade_message: "",
    upgrade_name: "",
    upgrade_price: "",
    upgrade_currency: "GBP",
    upgrade_features: [] as string[],
    upgrade_pay_link_url: "",
  });

  useEffect(() => {
    fetchPlayers();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedPlayerId) fetchPlayerData(selectedPlayerId);
  }, [selectedPlayerId]);

  const fetchPlayers = async () => {
    const { data } = await supabase.from("players").select("id, name, email, club").order("name");
    if (data) setPlayers(data);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("service_catalog")
      .select("id, name, price, category, description, image_url, options")
      .eq("visible", true)
      .order("name");
    if (data) setProducts(data as ServiceProduct[]);
  };

  const fetchPlayerData = async (playerId: string) => {
    setLoading(true);

    const { data: settingsData } = await supabase
      .from("player_portal_settings")
      .select("*")
      .eq("player_id", playerId)
      .maybeSingle();

    if (settingsData) {
      setSettings(settingsData);
      setFormData({
        hub_widget_type: settingsData.hub_widget_type as "aphorisms" | "sales_box",
        current_package_name: settingsData.current_package_name || "",
        current_package_price: settingsData.current_package_price?.toString() || "",
        current_package_currency: settingsData.current_package_currency || "GBP",
        current_package_features: settingsData.current_package_features || [],
        upgrade_product_id: settingsData.upgrade_product_id || "",
        upgrade_message: settingsData.upgrade_message || "",
        upgrade_name: (settingsData as any).upgrade_name || "",
        upgrade_price: (settingsData as any).upgrade_price?.toString() || "",
        upgrade_currency: (settingsData as any).upgrade_currency || "GBP",
        upgrade_features: (settingsData as any).upgrade_features || [],
        upgrade_pay_link_url: (settingsData as any).upgrade_pay_link_url || "",
      });
    } else {
      setSettings(null);
      setFormData({
        hub_widget_type: "aphorisms",
        current_package_name: "",
        current_package_price: "",
        current_package_currency: "GBP",
        current_package_features: [],
        upgrade_product_id: "",
        upgrade_message: "",
        upgrade_name: "",
        upgrade_price: "",
        upgrade_currency: "GBP",
        upgrade_features: [],
        upgrade_pay_link_url: "",
      });
    }

    const { data: invoiceData } = await supabase
      .from("invoices")
      .select("*")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false });
    setInvoices(invoiceData || []);

    const player = players.find(p => p.id === playerId);
    if (player) {
      const { data: payLinkData } = await supabase
        .from("pay_links")
        .select("*")
        .or(`customer_name.ilike.%${player.name}%,customer_email.ilike.%${player.email}%`)
        .order("created_at", { ascending: false });
      setPayLinks(payLinkData || []);
    }

    setLoading(false);
  };

  const saveSettings = async () => {
    if (!selectedPlayerId) return;
    setSaving(true);

    const payload: any = {
      player_id: selectedPlayerId,
      hub_widget_type: formData.hub_widget_type,
      current_package_name: formData.current_package_name || null,
      current_package_price: formData.current_package_price ? parseFloat(formData.current_package_price) : null,
      current_package_currency: formData.current_package_currency,
      current_package_features: formData.current_package_features.length > 0 ? formData.current_package_features : null,
      upgrade_product_id: formData.upgrade_product_id || null,
      upgrade_message: formData.upgrade_message || null,
      upgrade_name: formData.upgrade_name || null,
      upgrade_price: formData.upgrade_price ? parseFloat(formData.upgrade_price) : null,
      upgrade_currency: formData.upgrade_currency,
      upgrade_features: formData.upgrade_features.length > 0 ? formData.upgrade_features : null,
      upgrade_pay_link_url: formData.upgrade_pay_link_url || null,
    };

    if (settings?.id) {
      const { error } = await supabase.from("player_portal_settings").update(payload).eq("id", settings.id);
      if (error) toast.error("Failed to save settings");
      else toast.success("Settings saved");
    } else {
      const { error } = await supabase.from("player_portal_settings").insert(payload);
      if (error) toast.error("Failed to save settings");
      else toast.success("Settings saved");
    }

    setSaving(false);
    fetchPlayerData(selectedPlayerId);
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormData(prev => ({ ...prev, current_package_features: [...prev.current_package_features, newFeature.trim()] }));
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, current_package_features: prev.current_package_features.filter((_, i) => i !== index) }));
  };

  const addUpgradeFeature = () => {
    if (!newUpgradeFeature.trim()) return;
    setFormData(prev => ({ ...prev, upgrade_features: [...prev.upgrade_features, newUpgradeFeature.trim()] }));
    setNewUpgradeFeature("");
  };

  const removeUpgradeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, upgrade_features: prev.upgrade_features.filter((_, i) => i !== index) }));
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const createInvoice = async () => {
    if (!selectedPlayerId || !invoiceForm.invoice_number || !invoiceForm.amount || !invoiceForm.due_date) {
      toast.error("Fill in invoice number, amount, and due date");
      return;
    }
    const { error } = await supabase.from("invoices").insert({
      player_id: selectedPlayerId,
      invoice_number: invoiceForm.invoice_number,
      amount: parseFloat(invoiceForm.amount),
      currency: invoiceForm.currency,
      description: invoiceForm.description || null,
      due_date: invoiceForm.due_date,
      invoice_date: invoiceForm.invoice_date,
      status: "pending",
    });
    if (error) toast.error("Failed to create invoice");
    else {
      toast.success("Invoice created");
      setShowInvoiceForm(false);
      setInvoiceForm({ invoice_number: "", amount: "", currency: "GBP", description: "", due_date: "", invoice_date: new Date().toISOString().split("T")[0] });
      fetchPlayerData(selectedPlayerId);
    }
  };

  const createPayLink = async () => {
    if (!selectedPlayerId || !payLinkForm.title || !payLinkForm.amount) {
      toast.error("Fill in title and amount");
      return;
    }
    setCreatingPayLink(true);
    const player = players.find(p => p.id === selectedPlayerId);

    // Create local pay_links record
    const { data: newLink, error } = await supabase
      .from("pay_links")
      .insert({
        title: payLinkForm.title,
        amount: parseFloat(payLinkForm.amount),
        currency: payLinkForm.currency,
        description: payLinkForm.description || null,
        customer_name: player?.name || null,
        customer_email: player?.email || null,
        status: "active",
      })
      .select()
      .single();

    if (error || !newLink) {
      toast.error("Failed to create pay link");
      setCreatingPayLink(false);
      return;
    }

    // Create Stripe payment link
    try {
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke("create-pay-link", {
        body: {
          title: payLinkForm.title,
          amount: parseFloat(payLinkForm.amount),
          currency: payLinkForm.currency,
          description: payLinkForm.description,
          payLinkId: newLink.id,
        },
      });

      if (stripeError) throw stripeError;
      toast.success("Pay link created with Stripe");
    } catch (e) {
      toast.warning("Pay link saved locally but Stripe link creation failed");
    }

    setShowPayLinkForm(false);
    setPayLinkForm({ title: "", amount: "", currency: "GBP", description: "" });
    setCreatingPayLink(false);
    fetchPlayerData(selectedPlayerId);
  };

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  const currencySymbol = (c: string) => c === "EUR" ? "€" : c === "USD" ? "$" : "£";

  const prefillFromProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData(prev => ({
        ...prev,
        upgrade_product_id: productId,
        upgrade_name: product.name,
        upgrade_price: product.price.toString(),
        upgrade_features: product.options?.map((o: any) => o.name || o.label || String(o)) || [],
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Portal Management</h2>
        <p className="text-muted-foreground">Manage player invoices, pay links, and hub widget settings</p>
      </div>

      {/* Player Selector */}
      <Card>
        <CardContent className="pt-4">
          <Label>Select Player</Label>
          <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a player..." />
            </SelectTrigger>
            <SelectContent>
              {players.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} {p.club ? `(${p.club})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedPlayerId && !loading && (
        <Tabs defaultValue="widget">
          <TabsList>
            <TabsTrigger value="widget" className="flex items-center gap-1">
              <Settings className="h-4 w-4" /> Hub Widget
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> Invoices
            </TabsTrigger>
            <TabsTrigger value="paylinks" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" /> Pay Links
            </TabsTrigger>
          </TabsList>

          {/* Hub Widget Config */}
          <TabsContent value="widget" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Bottom Widget Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Sales Box instead of Aphorisms</p>
                    <p className="text-sm text-muted-foreground">Display package details and upgrade options</p>
                  </div>
                  <Switch
                    checked={formData.hub_widget_type === "sales_box"}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, hub_widget_type: checked ? "sales_box" : "aphorisms" }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {formData.hub_widget_type === "sales_box" && (
              <>
                {/* Current Package */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Current Package</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!!formData.current_package_name}
                        onCheckedChange={(checked) => {
                          if (!checked) setFormData(prev => ({ ...prev, current_package_name: "", current_package_price: "", current_package_features: [] }));
                          else setFormData(prev => ({ ...prev, current_package_name: "Package" }));
                        }}
                      />
                      <span className="text-sm">{formData.current_package_name ? "On a package" : "Not currently on a package"}</span>
                    </div>

                    {formData.current_package_name && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Package Name</Label>
                            <Input
                              value={formData.current_package_name}
                              onChange={e => setFormData(prev => ({ ...prev, current_package_name: e.target.value }))}
                              placeholder="e.g. Pro Performance"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Price</Label>
                              <Input
                                type="number"
                                value={formData.current_package_price}
                                onChange={e => setFormData(prev => ({ ...prev, current_package_price: e.target.value }))}
                                placeholder="299"
                              />
                            </div>
                            <div>
                              <Label>Currency</Label>
                              <Select
                                value={formData.current_package_currency}
                                onValueChange={v => setFormData(prev => ({ ...prev, current_package_currency: v }))}
                              >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>Package Features</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              value={newFeature}
                              onChange={e => setNewFeature(e.target.value)}
                              placeholder="e.g. Weekly analysis"
                              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
                            />
                            <Button variant="outline" size="sm" onClick={addFeature}><Plus className="h-4 w-4" /></Button>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {formData.current_package_features.map((f, i) => (
                              <Badge key={i} variant="secondary" className="gap-1">
                                {f}
                                <button onClick={() => removeFeature(i)} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Upgrade Offer */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Upgrade Offer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Pre-fill from product */}
                    <div>
                      <Label>Pre-fill from Catalogue Product</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.upgrade_product_id || "none"}
                          onValueChange={v => {
                            if (v === "none") {
                              setFormData(prev => ({ ...prev, upgrade_product_id: "" }));
                            } else {
                              prefillFromProduct(v);
                            }
                          }}
                        >
                          <SelectTrigger><SelectValue placeholder="Select product to pre-fill..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Manual entry</SelectItem>
                            {products.map(p => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name} — {currencySymbol("GBP")}{p.price}/mo
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formData.upgrade_product_id && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => {
                                const p = products.find(x => x.id === formData.upgrade_product_id);
                                if (p) setPreviewProduct(p);
                              }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>{previewProduct?.name}</DialogTitle>
                              </DialogHeader>
                              {previewProduct && (
                                <div className="space-y-3">
                                  {previewProduct.image_url && (
                                    <img src={previewProduct.image_url} alt={previewProduct.name} className="w-full aspect-square object-cover rounded-lg" />
                                  )}
                                  <p className="text-lg font-bold">{currencySymbol("GBP")}{previewProduct.price}/mo</p>
                                  {previewProduct.description && <p className="text-sm text-muted-foreground">{previewProduct.description}</p>}
                                  {previewProduct.options && previewProduct.options.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {previewProduct.options.map((o: any, i: number) => (
                                        <Badge key={i} variant="secondary">{o.name || o.label || String(o)}</Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>

                    {/* Manual upgrade fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Upgrade Package Name</Label>
                        <Input
                          value={formData.upgrade_name}
                          onChange={e => setFormData(prev => ({ ...prev, upgrade_name: e.target.value }))}
                          placeholder="e.g. Elite Performance"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Price</Label>
                          <Input
                            type="number"
                            value={formData.upgrade_price}
                            onChange={e => setFormData(prev => ({ ...prev, upgrade_price: e.target.value }))}
                            placeholder="499"
                          />
                        </div>
                        <div>
                          <Label>Currency</Label>
                          <Select
                            value={formData.upgrade_currency}
                            onValueChange={v => setFormData(prev => ({ ...prev, upgrade_currency: v }))}
                          >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Upgrade features */}
                    <div>
                      <Label>Upgrade Features</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={newUpgradeFeature}
                          onChange={e => setNewUpgradeFeature(e.target.value)}
                          placeholder="e.g. Nutrition coaching"
                          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addUpgradeFeature())}
                        />
                        <Button variant="outline" size="sm" onClick={addUpgradeFeature}><Plus className="h-4 w-4" /></Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.upgrade_features.map((f, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            {f}
                            <button onClick={() => removeUpgradeFeature(i)} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Price difference */}
                    {formData.upgrade_price && formData.current_package_price && (
                      <div className="bg-accent/10 rounded-lg p-3 text-sm">
                        <p className="font-medium text-accent">
                          Upgrade difference: +{currencySymbol(formData.upgrade_currency)}{(parseFloat(formData.upgrade_price) - parseFloat(formData.current_package_price)).toFixed(2)}/mo
                        </p>
                      </div>
                    )}

                    <div>
                      <Label>Custom Upgrade Message</Label>
                      <Textarea
                        value={formData.upgrade_message}
                        onChange={e => setFormData(prev => ({ ...prev, upgrade_message: e.target.value }))}
                        placeholder="e.g. Upgrade to Elite and get nutrition coaching, video analysis, and more!"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Upgrade Payment Link URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.upgrade_pay_link_url}
                          onChange={e => setFormData(prev => ({ ...prev, upgrade_pay_link_url: e.target.value }))}
                          placeholder="https://buy.stripe.com/..."
                        />
                        {formData.upgrade_pay_link_url && (
                          <Button variant="outline" size="icon" onClick={() => window.open(formData.upgrade_pay_link_url, "_blank")}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Paste a Stripe payment link for the player to buy/upgrade directly</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <Button onClick={saveSettings} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Save Widget Settings"}
            </Button>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Invoices for {selectedPlayer?.name}</h3>
              <Button size="sm" onClick={() => setShowInvoiceForm(!showInvoiceForm)}>
                <Plus className="h-4 w-4 mr-1" /> Add Invoice
              </Button>
            </div>

            {showInvoiceForm && (
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Invoice Number</Label>
                      <Input value={invoiceForm.invoice_number} onChange={e => setInvoiceForm(prev => ({ ...prev, invoice_number: e.target.value }))} placeholder="INV-001" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Amount</Label>
                        <Input type="number" value={invoiceForm.amount} onChange={e => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="299" />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Select value={invoiceForm.currency} onValueChange={v => setInvoiceForm(prev => ({ ...prev, currency: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Invoice Date</Label>
                      <Input type="date" value={invoiceForm.invoice_date} onChange={e => setInvoiceForm(prev => ({ ...prev, invoice_date: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input type="date" value={invoiceForm.due_date} onChange={e => setInvoiceForm(prev => ({ ...prev, due_date: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input value={invoiceForm.description} onChange={e => setInvoiceForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Monthly coaching fee" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createInvoice} className="flex-1">Create Invoice</Button>
                    <Button variant="outline" onClick={() => setShowInvoiceForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {invoices.length === 0 && !showInvoiceForm ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No invoices for {selectedPlayer?.name}
                </CardContent>
              </Card>
            ) : (
              invoices.map(inv => (
                <Card key={inv.id}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{inv.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {inv.currency} {inv.amount.toFixed(2)} — Due: {new Date(inv.due_date).toLocaleDateString()}
                      </p>
                      {inv.description && <p className="text-xs text-muted-foreground">{inv.description}</p>}
                    </div>
                    <Badge variant={inv.status === "paid" ? "default" : inv.status === "overdue" ? "destructive" : "secondary"}>
                      {inv.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Pay Links Tab */}
          <TabsContent value="paylinks" className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Pay Links for {selectedPlayer?.name}</h3>
              <Button size="sm" onClick={() => setShowPayLinkForm(!showPayLinkForm)}>
                <Plus className="h-4 w-4 mr-1" /> Create Pay Link
              </Button>
            </div>

            {showPayLinkForm && (
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Title</Label>
                      <Input value={payLinkForm.title} onChange={e => setPayLinkForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Monthly Fee - January" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Amount</Label>
                        <Input type="number" value={payLinkForm.amount} onChange={e => setPayLinkForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="299" />
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <Select value={payLinkForm.currency} onValueChange={v => setPayLinkForm(prev => ({ ...prev, currency: v }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Description (optional)</Label>
                    <Input value={payLinkForm.description} onChange={e => setPayLinkForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Coaching fee for January 2026" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createPayLink} disabled={creatingPayLink} className="flex-1">
                      {creatingPayLink ? "Creating..." : "Create Pay Link"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowPayLinkForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {payLinks.length === 0 && !showPayLinkForm ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pay links for {selectedPlayer?.name}
                </CardContent>
              </Card>
            ) : (
              payLinks.map(link => (
                <Card key={link.id}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{link.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {link.currency} {link.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={link.status === "active" ? "default" : "secondary"}>{link.status}</Badge>
                      {link.stripe_payment_link_url && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(link.stripe_payment_link_url!, link.id)}>
                            {copiedField === link.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => window.open(link.stripe_payment_link_url, "_blank")}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
