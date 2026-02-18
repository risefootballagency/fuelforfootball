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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Settings, CreditCard, Package, ExternalLink, Copy, Check, FileText, Plus, Trash2 } from "lucide-react";

interface Player {
  id: string;
  name: string;
  email: string;
  club?: string;
}

interface PortalSettings {
  id?: string;
  player_id: string;
  hub_widget_type: "aphorisms" | "sales_box";
  current_package_name: string | null;
  current_package_price: number | null;
  current_package_currency: string;
  current_package_features: string[] | null;
  upgrade_product_id: string | null;
  upgrade_message: string | null;
}

interface PayLink {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  stripe_payment_link_url: string | null;
  customer_name: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string;
  player_id: string;
}

interface ServiceProduct {
  id: string;
  name: string;
  price: number;
  category: string | null;
}

export function PortalManagement() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [settings, setSettings] = useState<PortalSettings | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payLinks, setPayLinks] = useState<PayLink[]>([]);
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState("");

  // Form state for settings
  const [formData, setFormData] = useState<{
    hub_widget_type: "aphorisms" | "sales_box";
    current_package_name: string;
    current_package_price: string;
    current_package_currency: string;
    current_package_features: string[];
    upgrade_product_id: string;
    upgrade_message: string;
  }>({
    hub_widget_type: "aphorisms",
    current_package_name: "",
    current_package_price: "",
    current_package_currency: "GBP",
    current_package_features: [],
    upgrade_product_id: "",
    upgrade_message: "",
  });

  useEffect(() => {
    fetchPlayers();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedPlayerId) {
      fetchPlayerData(selectedPlayerId);
    }
  }, [selectedPlayerId]);

  const fetchPlayers = async () => {
    const { data } = await supabase
      .from("players")
      .select("id, name, email, club")
      .order("name");
    if (data) setPlayers(data);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("service_catalog")
      .select("id, name, price, category")
      .eq("visible", true)
      .order("name");
    if (data) setProducts(data);
  };

  const fetchPlayerData = async (playerId: string) => {
    setLoading(true);

    // Fetch portal settings
    const { data: settingsData } = await supabase
      .from("player_portal_settings")
      .select("*")
      .eq("player_id", playerId)
      .maybeSingle();

    if (settingsData) {
      setSettings({ ...settingsData, hub_widget_type: settingsData.hub_widget_type as "aphorisms" | "sales_box" });
      setFormData({
        hub_widget_type: settingsData.hub_widget_type as "aphorisms" | "sales_box",
        current_package_name: settingsData.current_package_name || "",
        current_package_price: settingsData.current_package_price?.toString() || "",
        current_package_currency: settingsData.current_package_currency || "GBP",
        current_package_features: settingsData.current_package_features || [],
        upgrade_product_id: settingsData.upgrade_product_id || "",
        upgrade_message: settingsData.upgrade_message || "",
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
      });
    }

    // Fetch invoices for this player
    const { data: invoiceData } = await supabase
      .from("invoices")
      .select("*")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false });
    setInvoices(invoiceData || []);

    // Fetch pay links (filter by customer name matching player name)
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

    const payload = {
      player_id: selectedPlayerId,
      hub_widget_type: formData.hub_widget_type,
      current_package_name: formData.current_package_name || null,
      current_package_price: formData.current_package_price ? parseFloat(formData.current_package_price) : null,
      current_package_currency: formData.current_package_currency,
      current_package_features: formData.current_package_features.length > 0 ? formData.current_package_features : null,
      upgrade_product_id: formData.upgrade_product_id || null,
      upgrade_message: formData.upgrade_message || null,
    };

    if (settings?.id) {
      const { error } = await supabase
        .from("player_portal_settings")
        .update(payload)
        .eq("id", settings.id);
      if (error) toast.error("Failed to save settings");
      else toast.success("Settings saved");
    } else {
      const { error } = await supabase
        .from("player_portal_settings")
        .insert(payload);
      if (error) toast.error("Failed to save settings");
      else toast.success("Settings saved");
    }

    setSaving(false);
    fetchPlayerData(selectedPlayerId);
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormData(prev => ({
      ...prev,
      current_package_features: [...prev.current_package_features, newFeature.trim()],
    }));
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      current_package_features: prev.current_package_features.filter((_, i) => i !== index),
    }));
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);
  const upgradeProduct = products.find(p => p.id === formData.upgrade_product_id);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Portal Management</h2>
          <p className="text-muted-foreground">Manage player invoices, pay links, and hub widget settings</p>
        </div>
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
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Sales Box instead of Aphorisms</p>
                    <p className="text-sm text-muted-foreground">
                      Display package details and upgrade options at the bottom of the player's hub
                    </p>
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
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Current Package</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                        <Button variant="outline" size="sm" onClick={addFeature}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.current_package_features.map((f, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            {f}
                            <button onClick={() => removeFeature(i)} className="ml-1 hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Upgrade Offer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Upgrade Product</Label>
                      <Select
                        value={formData.upgrade_product_id || "none"}
                        onValueChange={v => setFormData(prev => ({ ...prev, upgrade_product_id: v === "none" ? "" : v }))}
                      >
                        <SelectTrigger><SelectValue placeholder="Select upgrade product..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {products.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} — £{p.price}/mo
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {upgradeProduct && formData.current_package_price && (
                      <div className="bg-accent/10 rounded-lg p-3 text-sm">
                        <p className="font-medium text-accent">
                          Upgrade difference: +£{(upgradeProduct.price - parseFloat(formData.current_package_price)).toFixed(2)}/mo
                        </p>
                      </div>
                    )}
                    <div>
                      <Label>Custom Upgrade Message</Label>
                      <Textarea
                        value={formData.upgrade_message}
                        onChange={e => setFormData(prev => ({ ...prev, upgrade_message: e.target.value }))}
                        placeholder="e.g. Upgrade to Elite Performance and get nutrition coaching, video analysis, and more!"
                        rows={3}
                      />
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
            {invoices.length === 0 ? (
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
            {payLinks.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pay links for {selectedPlayer?.name}. Create one in Sales & Pay Links.
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(link.stripe_payment_link_url!, link.id)}
                        >
                          {copiedField === link.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
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
