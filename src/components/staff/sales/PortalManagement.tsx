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
import { Settings, CreditCard, Package, ExternalLink, Copy, Check, FileText, Plus, Trash2, Eye, Link, Mail, LogIn } from "lucide-react";

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

interface UpgradeOffer {
  id?: string;
  name: string;
  price: string;
  currency: string;
  features: string[];
  message: string;
  pay_link_url: string;
  product_id: string;
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
    payment_type: "one_off" as "one_off" | "subscription",
    recurring_interval: "month" as "month" | "year" | "week",
  });
  const [creatingPayLink, setCreatingPayLink] = useState(false);

  // Widget form state
  const [formData, setFormData] = useState({
    hub_widget_type: "aphorisms" as "aphorisms" | "sales_box",
    current_package_name: "",
    current_package_price: "",
    current_package_currency: "GBP",
    current_package_features: [] as string[],
    upgrade_offers: [] as UpgradeOffer[],
  });

  // New offer being edited
  const [newOffer, setNewOffer] = useState<UpgradeOffer>({
    name: "", price: "", currency: "GBP", features: [], message: "", pay_link_url: "", product_id: "",
  });
  const [newOfferFeature, setNewOfferFeature] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [creatingOfferLink, setCreatingOfferLink] = useState(false);

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
      const raw = settingsData as any;
      // Parse upgrade_offers from the stored JSON or build from legacy single-offer fields
      let offers: UpgradeOffer[] = [];
      if (raw.upgrade_offers && Array.isArray(raw.upgrade_offers)) {
        offers = raw.upgrade_offers;
      } else if (raw.upgrade_name) {
        offers = [{
          name: raw.upgrade_name || "",
          price: raw.upgrade_price?.toString() || "",
          currency: raw.upgrade_currency || "GBP",
          features: raw.upgrade_features || [],
          message: settingsData.upgrade_message || "",
          pay_link_url: raw.upgrade_pay_link_url || "",
          product_id: settingsData.upgrade_product_id || "",
        }];
      }
      setFormData({
        hub_widget_type: settingsData.hub_widget_type as "aphorisms" | "sales_box",
        current_package_name: settingsData.current_package_name || "",
        current_package_price: settingsData.current_package_price?.toString() || "",
        current_package_currency: settingsData.current_package_currency || "GBP",
        current_package_features: settingsData.current_package_features || [],
        upgrade_offers: offers,
      });
    } else {
      setSettings(null);
      setFormData({
        hub_widget_type: "aphorisms",
        current_package_name: "",
        current_package_price: "",
        current_package_currency: "GBP",
        current_package_features: [],
        upgrade_offers: [],
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

    // Map first offer to legacy fields for backward compatibility + store all offers
    const firstOffer = formData.upgrade_offers[0];
    const payload: any = {
      player_id: selectedPlayerId,
      hub_widget_type: formData.hub_widget_type,
      current_package_name: formData.current_package_name || null,
      current_package_price: formData.current_package_price ? parseFloat(formData.current_package_price) : null,
      current_package_currency: formData.current_package_currency,
      current_package_features: formData.current_package_features.length > 0 ? formData.current_package_features : null,
      upgrade_product_id: firstOffer?.product_id || null,
      upgrade_message: firstOffer?.message || null,
      upgrade_name: firstOffer?.name || null,
      upgrade_price: firstOffer?.price ? parseFloat(firstOffer.price) : null,
      upgrade_currency: firstOffer?.currency || "GBP",
      upgrade_features: firstOffer?.features?.length ? firstOffer.features : null,
      upgrade_pay_link_url: firstOffer?.pay_link_url || null,
      upgrade_offers: formData.upgrade_offers.length > 0 ? formData.upgrade_offers : null,
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

    const { data: newLink, error } = await supabase
      .from("pay_links")
      .insert({
        title: payLinkForm.title,
        amount: parseFloat(payLinkForm.amount),
        currency: payLinkForm.currency,
        description: payLinkForm.description || null,
        customer_name: player?.name || null,
        customer_email: player?.email || null,
        player_id: selectedPlayerId,
        status: "active",
        payment_type: payLinkForm.payment_type === "subscription" ? "subscription" : "one_off",
        recurring_interval: payLinkForm.payment_type === "subscription" ? payLinkForm.recurring_interval : null,
      })
      .select()
      .single();

    if (error || !newLink) {
      toast.error("Failed to create pay link");
      setCreatingPayLink(false);
      return;
    }

    try {
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke("create-pay-link", {
        body: {
          title: payLinkForm.title,
          amount: parseFloat(payLinkForm.amount),
          currency: payLinkForm.currency,
          description: payLinkForm.description,
          payLinkId: newLink.id,
          paymentType: payLinkForm.payment_type,
          recurringInterval: payLinkForm.payment_type === "subscription" ? payLinkForm.recurring_interval : undefined,
        },
      });

      if (stripeError) throw stripeError;
      toast.success("Pay link created with Stripe");
    } catch (e) {
      toast.warning("Pay link saved locally but Stripe link creation failed");
    }

    setShowPayLinkForm(false);
    setPayLinkForm({ title: "", amount: "", currency: "GBP", description: "", payment_type: "one_off", recurring_interval: "month" });
    setCreatingPayLink(false);
    fetchPlayerData(selectedPlayerId);
  };

  // Create a Stripe payment link for an upgrade offer
  const createOfferPayLink = async () => {
    if (!newOffer.name || !newOffer.price) {
      toast.error("Fill in offer name and price");
      return;
    }
    setCreatingOfferLink(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-pay-link", {
        body: {
          title: newOffer.name,
          amount: parseFloat(newOffer.price),
          currency: newOffer.currency,
          description: newOffer.message || `Upgrade to ${newOffer.name}`,
          paymentType: "subscription",
          recurringInterval: "month",
        },
      });

      if (error) throw error;
      if (data?.url) {
        const offer: UpgradeOffer = {
          ...newOffer,
          pay_link_url: data.url,
        };
        setFormData(prev => ({ ...prev, upgrade_offers: [...prev.upgrade_offers, offer] }));
        setNewOffer({ name: "", price: "", currency: "GBP", features: [], message: "", pay_link_url: "", product_id: "" });
        setNewOfferFeature("");
        setShowOfferForm(false);
        toast.success("Offer created with payment link");
      } else {
        throw new Error("No URL returned");
      }
    } catch (e) {
      toast.error("Failed to create payment link for offer");
    }
    setCreatingOfferLink(false);
  };

  const removeOffer = (index: number) => {
    setFormData(prev => ({ ...prev, upgrade_offers: prev.upgrade_offers.filter((_, i) => i !== index) }));
  };

  const prefillOfferFromProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setNewOffer(prev => ({
        ...prev,
        product_id: productId,
        name: product.name,
        price: product.price.toString(),
        features: product.options?.map((o: any) => o.name || o.label || String(o)) || [],
      }));
    }
  };

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  const currencySymbol = (c: string) => c === "EUR" ? "€" : c === "USD" ? "$" : "£";

  const portalLoginUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login';

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
        <>
          {/* Email + Portal Login Bar */}
          <Card>
            <CardContent className="pt-4">
              <Label className="text-xs text-muted-foreground mb-1 block">Player Email / Portal Login</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={selectedPlayer?.email || ""}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(selectedPlayer?.email || "", "player-email")}
                  title="Copy email"
                >
                  {copiedField === "player-email" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(portalLoginUrl, "_blank")}
                  title="Open portal login"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Portal
                </Button>
              </div>
            </CardContent>
          </Card>

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

                  {/* Upgrade Offers (multiple) */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Upgrade Offers</CardTitle>
                        <Button size="sm" variant="outline" onClick={() => setShowOfferForm(!showOfferForm)}>
                          <Plus className="h-4 w-4 mr-1" /> Add Offer
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Existing offers */}
                      {formData.upgrade_offers.map((offer, idx) => (
                        <div key={idx} className="border rounded-lg p-3 space-y-2 relative">
                          <button
                            onClick={() => removeOffer(idx)}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="flex items-center justify-between pr-8">
                            <p className="font-medium">{offer.name}</p>
                            <p className="text-sm font-bold text-accent">{currencySymbol(offer.currency)}{offer.price}/mo</p>
                          </div>
                          {offer.features.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {offer.features.map((f, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                              ))}
                            </div>
                          )}
                          {offer.message && <p className="text-xs text-muted-foreground">{offer.message}</p>}
                          {offer.pay_link_url && (
                            <div className="flex items-center gap-2 text-xs">
                              <Link className="h-3 w-3 text-accent" />
                              <a href={offer.pay_link_url} target="_blank" rel="noopener noreferrer" className="text-accent underline truncate">{offer.pay_link_url}</a>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* New offer form */}
                      {showOfferForm && (
                        <div className="border-2 border-dashed border-accent/30 rounded-lg p-4 space-y-3">
                          <p className="text-sm font-semibold text-accent">New Upgrade Offer</p>
                          
                          {/* Pre-fill from product */}
                          <div>
                            <Label className="text-xs">Pre-fill from Catalogue</Label>
                            <div className="flex gap-2">
                              <Select
                                value={newOffer.product_id || "none"}
                                onValueChange={v => {
                                  if (v === "none") {
                                    setNewOffer(prev => ({ ...prev, product_id: "" }));
                                  } else {
                                    prefillOfferFromProduct(v);
                                  }
                                }}
                              >
                                <SelectTrigger className="text-sm"><SelectValue placeholder="Select product..." /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Manual entry</SelectItem>
                                  {products.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                      {p.name} — {currencySymbol("GBP")}{p.price}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {newOffer.product_id && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => {
                                      const p = products.find(x => x.id === newOffer.product_id);
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

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Package Name</Label>
                              <Input
                                value={newOffer.name}
                                onChange={e => setNewOffer(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g. Elite Performance"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Price</Label>
                                <Input
                                  type="number"
                                  value={newOffer.price}
                                  onChange={e => setNewOffer(prev => ({ ...prev, price: e.target.value }))}
                                  placeholder="499"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Currency</Label>
                                <Select
                                  value={newOffer.currency}
                                  onValueChange={v => setNewOffer(prev => ({ ...prev, currency: v }))}
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

                          {/* Features */}
                          <div>
                            <Label className="text-xs">Features</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                value={newOfferFeature}
                                onChange={e => setNewOfferFeature(e.target.value)}
                                placeholder="e.g. Nutrition coaching"
                                onKeyDown={e => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (newOfferFeature.trim()) {
                                      setNewOffer(prev => ({ ...prev, features: [...prev.features, newOfferFeature.trim()] }));
                                      setNewOfferFeature("");
                                    }
                                  }
                                }}
                              />
                              <Button variant="outline" size="sm" onClick={() => {
                                if (newOfferFeature.trim()) {
                                  setNewOffer(prev => ({ ...prev, features: [...prev.features, newOfferFeature.trim()] }));
                                  setNewOfferFeature("");
                                }
                              }}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {newOffer.features.map((f, i) => (
                                <Badge key={i} variant="secondary" className="gap-1 text-xs">
                                  {f}
                                  <button onClick={() => setNewOffer(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }))} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs">Custom Message</Label>
                            <Textarea
                              value={newOffer.message}
                              onChange={e => setNewOffer(prev => ({ ...prev, message: e.target.value }))}
                              placeholder="e.g. Upgrade to get nutrition coaching and more!"
                              rows={2}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={createOfferPayLink} disabled={creatingOfferLink} className="flex-1">
                              {creatingOfferLink ? "Creating Link..." : "Create Offer + Payment Link"}
                            </Button>
                            <Button variant="outline" onClick={() => { setShowOfferForm(false); setNewOffer({ name: "", price: "", currency: "GBP", features: [], message: "", pay_link_url: "", product_id: "" }); }}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {formData.upgrade_offers.length === 0 && !showOfferForm && (
                        <p className="text-sm text-muted-foreground text-center py-4">No upgrade offers configured. Add one above.</p>
                      )}
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

                    {/* Payment type */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Payment Type</Label>
                        <Select value={payLinkForm.payment_type} onValueChange={v => setPayLinkForm(prev => ({ ...prev, payment_type: v as "one_off" | "subscription" }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one_off">One-off Payment</SelectItem>
                            <SelectItem value="subscription">Subscription</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {payLinkForm.payment_type === "subscription" && (
                        <div>
                          <Label>Recurring Interval</Label>
                          <Select value={payLinkForm.recurring_interval} onValueChange={v => setPayLinkForm(prev => ({ ...prev, recurring_interval: v as "month" | "year" | "week" }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="week">Weekly</SelectItem>
                              <SelectItem value="month">Monthly</SelectItem>
                              <SelectItem value="year">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
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
                          {link.payment_type === "subscription" && link.recurring_interval && (
                            <span className="ml-1">/ {link.recurring_interval}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={link.status === "active" ? "default" : "secondary"}>{link.status}</Badge>
                        {link.payment_type && (
                          <Badge variant="outline" className="text-xs">{link.payment_type === "subscription" ? "Sub" : "One-off"}</Badge>
                        )}
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
        </>
      )}
    </div>
  );
}
