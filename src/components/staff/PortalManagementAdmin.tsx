import { useState, useEffect, useMemo, useRef } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { Monitor, Eye, EyeOff, Image, Save, RotateCcw, Upload, Trash2, User, Move, Settings, CreditCard, FileText, Plus, Copy, Check, ExternalLink, Mail, LogIn, Link, Package } from "lucide-react";
import { ImageCropDialog } from "./ImageCropDialog";

interface Player {
  id: string;
  name: string;
  email: string;
  position: string;
  club?: string;
  representation_status: string | null;
  image_url: string | null;
}

interface PortalSettings {
  id?: string;
  player_id: string;
  show_hub: boolean;
  show_analysis: boolean;
  show_programming: boolean;
  show_nutrition: boolean;
  show_highlights: boolean;
  show_transfer_hub: boolean;
  show_key_documents: boolean;
  show_updates: boolean;
  show_view_profile: boolean;
  show_countdown: boolean;
  show_comparisons: boolean;
  show_scouting: boolean;
  show_cognisance: boolean;
  show_injury_log: boolean;
  show_aphorisms: boolean;
  show_quick_stats: boolean;
  show_news_feed: boolean;
  show_r90_chart: boolean;
  show_match_clipper: boolean;
  show_positional_guides: boolean;
  show_video_reports: boolean;
  show_data_tab: boolean;
  show_performance_reports: boolean;
  hero_images: string[];
  hero_focal_points: string[];
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

interface CurrentPackage {
  name: string;
  price: string;
  currency: string;
  frequency: string;
  features: string[];
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
  product_ids: string[];
  payment_type: "one_off" | "subscription";
  recurring_interval: string;
}

const DEFAULT_SETTINGS: Omit<PortalSettings, 'player_id'> = {
  show_hub: true, show_analysis: true, show_programming: true, show_nutrition: true,
  show_highlights: true, show_transfer_hub: true, show_key_documents: true, show_updates: true,
  show_view_profile: true, show_countdown: true, show_comparisons: true, show_scouting: true,
  show_cognisance: true, show_injury_log: true, show_aphorisms: true, show_quick_stats: true,
  show_news_feed: true, show_r90_chart: true, show_match_clipper: true, show_positional_guides: true,
  show_video_reports: true, show_data_tab: true, show_performance_reports: true,
  hero_images: [], hero_focal_points: [],
};

type FeatureItem = { key: string; label: string; description: string };

const SECTION_FEATURES: FeatureItem[] = [
  { key: 'show_hub', label: 'Hub', description: 'Main dashboard hub' },
  { key: 'show_analysis', label: 'Analysis', description: 'Performance analysis section' },
  { key: 'show_programming', label: 'Programming', description: 'S&C programmes' },
  { key: 'show_nutrition', label: 'Nutrition', description: 'Nutrition plans' },
  { key: 'show_highlights', label: 'Highlights', description: 'Video highlights reel' },
  { key: 'show_transfer_hub', label: 'Transfer Hub', description: 'Transfer activity' },
  { key: 'show_key_documents', label: 'Key Documents', description: 'Contracts and documents' },
  { key: 'show_updates', label: 'Updates', description: 'Player communications' },
  { key: 'show_view_profile', label: 'View Profile', description: 'Public profile link' },
  { key: 'show_countdown', label: 'Next Fixture Countdown', description: 'Match countdown timer' },
  { key: 'show_comparisons', label: 'Comparisons', description: 'Peer comparisons' },
  { key: 'show_scouting', label: 'Scouting Reports', description: 'Scouting feedback' },
  { key: 'show_cognisance', label: 'Cognisance', description: 'Mental performance tools' },
  { key: 'show_injury_log', label: 'Injury Log', description: 'Injury tracking' },
];

const COMPONENT_FEATURES: FeatureItem[] = [
  { key: 'show_aphorisms', label: 'Aphorisms', description: 'Inspirational quotes on Hub' },
  { key: 'show_quick_stats', label: 'Quick Stats', description: 'Rotating stat comparisons' },
  { key: 'show_news_feed', label: 'News Feed', description: 'Hub news and updates feed' },
  { key: 'show_r90_chart', label: 'R90 Chart', description: 'R90 performance bar chart' },
  { key: 'show_match_clipper', label: 'Match Clipper', description: 'In-portal match clipping tool' },
  { key: 'show_positional_guides', label: 'Positional Guides', description: 'Position-specific guidance' },
  { key: 'show_video_reports', label: 'Video Reports', description: 'Analysis video reports' },
  { key: 'show_data_tab', label: 'Data Tab', description: 'Statistical data tables' },
  { key: 'show_performance_reports', label: 'Performance Reports', description: 'Downloadable performance PDFs' },
];

const ALL_FEATURES = [...SECTION_FEATURES, ...COMPONENT_FEATURES];

const STATUS_ORDER = ['represented', 'mandated', 'previously_mandated', 'fuel_for_football', 'other', 'scouted'];
const STATUS_LABELS: Record<string, string> = {
  represented: 'Represented', mandated: 'Mandated', previously_mandated: 'Previously Mandated',
  fuel_for_football: 'Fuel for Football', other: 'Other', scouted: 'Scouted',
};

const FOCAL_OPTIONS = [
  { value: "center center", label: "Centre" }, { value: "center top", label: "Top" },
  { value: "center bottom", label: "Bottom" }, { value: "left center", label: "Left" },
  { value: "right center", label: "Right" }, { value: "left top", label: "Top Left" },
  { value: "right top", label: "Top Right" }, { value: "left bottom", label: "Bottom Left" },
  { value: "right bottom", label: "Bottom Right" },
];

export const PortalManagementAdmin = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [settings, setSettings] = useState<PortalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Hero image state
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [editingHeroIndex, setEditingHeroIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sales state
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payLinks, setPayLinks] = useState<any[]>([]);
  const [products, setProducts] = useState<ServiceProduct[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Invoice form
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: "", amount: "", currency: "GBP", description: "",
    due_date: "", invoice_date: new Date().toISOString().split("T")[0],
  });

  // Pay link form
  const [showPayLinkForm, setShowPayLinkForm] = useState(false);
  const [payLinkForm, setPayLinkForm] = useState({
    title: "", amount: "", currency: "GBP", description: "",
    payment_type: "one_off" as "one_off" | "subscription",
    recurring_interval: "month" as "month" | "year" | "week",
  });
  const [creatingPayLink, setCreatingPayLink] = useState(false);

  // Widget form
  const [formData, setFormData] = useState({
    hub_widget_type: "aphorisms" as "aphorisms" | "sales_box",
    current_packages: [] as CurrentPackage[],
    upgrade_offers: [] as UpgradeOffer[],
  });
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<CurrentPackage>({ name: "", price: "", currency: "GBP", frequency: "monthly", features: [] });
  const [newPackageFeature, setNewPackageFeature] = useState("");
  const [newOffer, setNewOffer] = useState<UpgradeOffer>({
    name: "", price: "", currency: "GBP", features: [], message: "", pay_link_url: "", product_id: "",
    product_ids: [], payment_type: "subscription", recurring_interval: "month",
  });
  const [newOfferFeature, setNewOfferFeature] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [creatingOfferLink, setCreatingOfferLink] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<ServiceProduct | null>(null);

  useEffect(() => { fetchPlayers(); fetchProducts(); }, []);
  useEffect(() => {
    if (selectedPlayerId) { fetchSettings(selectedPlayerId); fetchSalesData(selectedPlayerId); }
    else { setSettings(null); setInvoices([]); setPayLinks([]); }
  }, [selectedPlayerId]);

  const fetchPlayers = async () => {
    const { data } = await sharedSupabase
      .from("players" as any)
      .select("id, name, email, position, club, representation_status, image_url")
      .order("name");
    setPlayers((data as any) || []);
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

  const groupedPlayers = useMemo(() => {
    const groups: { status: string; label: string; players: Player[] }[] = [];
    STATUS_ORDER.forEach(status => {
      const matching = players.filter(p => p.representation_status === status);
      if (matching.length > 0) groups.push({ status, label: STATUS_LABELS[status] || status, players: matching });
    });
    const uncategorised = players.filter(p => !p.representation_status || !STATUS_ORDER.includes(p.representation_status));
    if (uncategorised.length > 0) groups.push({ status: 'uncategorised', label: 'Uncategorised', players: uncategorised });
    return groups;
  }, [players]);

  const fetchSettings = async (playerId: string) => {
    // Feature toggles + hero from SHARED db
    const { data } = await sharedSupabase
      .from("player_portal_settings" as any)
      .select("*")
      .eq("player_id", playerId)
      .maybeSingle();

    // Widget/sales data from LOCAL db
    const { data: localData } = await supabase
      .from("player_portal_settings")
      .select("*")
      .eq("player_id", playerId)
      .maybeSingle();

    if (data) {
      const d = data as any;
      setSettings({
        ...d,
        hero_images: (d.hero_images as string[]) || [],
        hero_focal_points: (d.hero_focal_points as string[]) || [],
        show_aphorisms: d.show_aphorisms ?? true,
        show_quick_stats: d.show_quick_stats ?? true,
        show_news_feed: d.show_news_feed ?? true,
        show_r90_chart: d.show_r90_chart ?? true,
        show_match_clipper: d.show_match_clipper ?? true,
        show_positional_guides: d.show_positional_guides ?? true,
        show_video_reports: d.show_video_reports ?? true,
        show_data_tab: d.show_data_tab ?? true,
        show_performance_reports: d.show_performance_reports ?? true,
      } as PortalSettings);

      // Parse widget data from LOCAL db
      const w = localData as any;
      let packages: CurrentPackage[] = [];
      let offers: UpgradeOffer[] = [];
      let widgetType: "aphorisms" | "sales_box" = "aphorisms";

      if (w) {
        widgetType = (w.hub_widget_type as "aphorisms" | "sales_box") || "aphorisms";
        if (w.current_packages && Array.isArray(w.current_packages)) {
          packages = w.current_packages;
        } else if (w.current_package_name) {
          packages = [{ name: w.current_package_name || "", price: w.current_package_price?.toString() || "", currency: w.current_package_currency || "GBP", frequency: "monthly", features: w.current_package_features || [] }];
        }
        if (w.upgrade_offers && Array.isArray(w.upgrade_offers)) {
          offers = w.upgrade_offers.map((o: any) => ({ ...o, product_ids: o.product_ids || (o.product_id ? [o.product_id] : []), payment_type: o.payment_type || "subscription", recurring_interval: o.recurring_interval || "month" }));
        } else if (w.upgrade_name) {
          offers = [{ name: w.upgrade_name || "", price: w.upgrade_price?.toString() || "", currency: w.upgrade_currency || "GBP", features: w.upgrade_features || [], message: w.upgrade_message || "", pay_link_url: w.upgrade_pay_link_url || "", product_id: w.upgrade_product_id || "", product_ids: w.upgrade_product_id ? [w.upgrade_product_id] : [], payment_type: "subscription", recurring_interval: "month" }];
        }
      }
      setFormData({ hub_widget_type: widgetType, current_packages: packages, upgrade_offers: offers });
    } else {
      setSettings({ player_id: playerId, ...DEFAULT_SETTINGS });
      setFormData({ hub_widget_type: "aphorisms", current_packages: [], upgrade_offers: [] });
    }
    setHasChanges(false);
  };

  const fetchSalesData = async (playerId: string) => {
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
        .or(`player_id.eq.${playerId},customer_email.ilike.%${player.email}%`)
        .order("created_at", { ascending: false });
      setPayLinks(payLinkData || []);
    }
  };

  const handleToggle = (key: string, value: boolean) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const { id, ...settingsToSave } = settings;
      if (id) {
        const { error } = await sharedSupabase.from("player_portal_settings" as any).update(settingsToSave as any).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await sharedSupabase.from("player_portal_settings" as any).insert(settingsToSave as any);
        if (error) throw error;
      }
      toast.success("Portal settings saved");
      setHasChanges(false);
      fetchSettings(settings.player_id);
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetAll = () => {
    if (!settings) return;
    setSettings({ ...settings, ...DEFAULT_SETTINGS });
    setHasChanges(true);
  };

  // Hero image handlers
  const handleHeroFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropImageSrc(URL.createObjectURL(file));
    setEditingHeroIndex(null);
    setCropDialogOpen(true);
    e.target.value = "";
  };

  const handleCropComplete = async (blob: Blob) => {
    if (!settings) return;
    const fileName = `hero-${settings.player_id}-${Date.now()}.png`;
    try {
      const { error: uploadError } = await sharedSupabase.storage
        .from("marketing-gallery")
        .upload(`portal-heroes/${fileName}`, blob, { contentType: "image/png", upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = sharedSupabase.storage.from("marketing-gallery").getPublicUrl(`portal-heroes/${fileName}`);
      const newImages = [...settings.hero_images];
      const newFocalPoints = [...settings.hero_focal_points];
      if (editingHeroIndex !== null) {
        newImages[editingHeroIndex] = urlData.publicUrl;
        newFocalPoints[editingHeroIndex] = "center center";
      } else {
        newImages.push(urlData.publicUrl);
        newFocalPoints.push("center center");
      }
      setSettings({ ...settings, hero_images: newImages, hero_focal_points: newFocalPoints });
      setHasChanges(true);
      toast.success("Hero image added");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    }
  };

  const handleRemoveHeroImage = (index: number) => {
    if (!settings) return;
    setSettings({ ...settings, hero_images: settings.hero_images.filter((_, i) => i !== index), hero_focal_points: settings.hero_focal_points.filter((_, i) => i !== index) });
    setHasChanges(true);
  };

  const handleRecropHero = (index: number) => {
    if (!settings) return;
    setCropImageSrc(settings.hero_images[index]);
    setEditingHeroIndex(index);
    setCropDialogOpen(true);
  };

  const handleFocalPointChange = (index: number, focalPoint: string) => {
    if (!settings) return;
    const newFocalPoints = [...settings.hero_focal_points];
    newFocalPoints[index] = focalPoint;
    setSettings({ ...settings, hero_focal_points: newFocalPoints });
    setHasChanges(true);
  };

  // Sales handlers
  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success("Copied");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const currencySymbol = (c: string) => c === "EUR" ? "€" : c === "USD" ? "$" : "£";
  const frequencyLabel = (f: string) => {
    switch (f) { case "weekly": return "/wk"; case "monthly": return "/mo"; case "6-monthly": return "/6mo"; case "annual": return "/yr"; case "one-off": return ""; default: return "/mo"; }
  };

  const addPackage = () => {
    if (!newPackage.name.trim()) return;
    setFormData(prev => ({ ...prev, current_packages: [...prev.current_packages, { ...newPackage }] }));
    setNewPackage({ name: "", price: "", currency: "GBP", frequency: "monthly", features: [] });
    setNewPackageFeature("");
    setShowPackageForm(false);
  };

  const removePackage = (index: number) => {
    setFormData(prev => ({ ...prev, current_packages: prev.current_packages.filter((_, i) => i !== index) }));
  };

  const createInvoice = async () => {
    if (!selectedPlayerId || !invoiceForm.invoice_number || !invoiceForm.amount || !invoiceForm.due_date) {
      toast.error("Fill in invoice number, amount, and due date");
      return;
    }
    const { error } = await supabase.from("invoices").insert({
      player_id: selectedPlayerId, invoice_number: invoiceForm.invoice_number,
      amount: parseFloat(invoiceForm.amount), currency: invoiceForm.currency,
      description: invoiceForm.description || null, due_date: invoiceForm.due_date,
      invoice_date: invoiceForm.invoice_date, status: "pending",
    });
    if (error) toast.error("Failed to create invoice");
    else {
      toast.success("Invoice created");
      setShowInvoiceForm(false);
      setInvoiceForm({ invoice_number: "", amount: "", currency: "GBP", description: "", due_date: "", invoice_date: new Date().toISOString().split("T")[0] });
      fetchSalesData(selectedPlayerId);
    }
  };

  const createPayLink = async () => {
    if (!selectedPlayerId || !payLinkForm.title || !payLinkForm.amount) {
      toast.error("Fill in title and amount");
      return;
    }
    setCreatingPayLink(true);
    const player = players.find(p => p.id === selectedPlayerId);
    const { data: newLink, error } = await supabase.from("pay_links").insert({
      title: payLinkForm.title, amount: parseFloat(payLinkForm.amount), currency: payLinkForm.currency,
      description: payLinkForm.description || null, customer_name: player?.name || null,
      customer_email: player?.email || null, player_id: selectedPlayerId, status: "active",
      payment_type: payLinkForm.payment_type === "subscription" ? "subscription" : "one_off",
      recurring_interval: payLinkForm.payment_type === "subscription" ? payLinkForm.recurring_interval : null,
    }).select().single();

    if (error || !newLink) { toast.error("Failed to create pay link"); setCreatingPayLink(false); return; }

    try {
      const { error: stripeError } = await supabase.functions.invoke("create-pay-link", {
        body: {
          title: payLinkForm.title, amount: parseFloat(payLinkForm.amount), currency: payLinkForm.currency,
          description: payLinkForm.description, payLinkId: newLink.id, paymentType: payLinkForm.payment_type,
          recurringInterval: payLinkForm.payment_type === "subscription" ? payLinkForm.recurring_interval : undefined,
        },
      });
      if (stripeError) throw stripeError;
      toast.success("Pay link created with Stripe");
    } catch { toast.warning("Pay link saved locally but Stripe link creation failed"); }

    setShowPayLinkForm(false);
    setPayLinkForm({ title: "", amount: "", currency: "GBP", description: "", payment_type: "one_off", recurring_interval: "month" });
    setCreatingPayLink(false);
    fetchSalesData(selectedPlayerId);
  };

  const createOfferPayLink = async () => {
    if (!newOffer.name || !newOffer.price) { toast.error("Fill in offer name and price"); return; }
    setCreatingOfferLink(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-pay-link", {
        body: {
          title: newOffer.name, amount: parseFloat(newOffer.price), currency: newOffer.currency,
          description: newOffer.message || `Upgrade to ${newOffer.name}`, paymentType: newOffer.payment_type,
          recurringInterval: newOffer.payment_type === "subscription" ? newOffer.recurring_interval : undefined,
        },
      });
      if (error) throw error;
      if (data?.url) {
        setFormData(prev => ({ ...prev, upgrade_offers: [...prev.upgrade_offers, { ...newOffer, pay_link_url: data.url }] }));
        setNewOffer({ name: "", price: "", currency: "GBP", features: [], message: "", pay_link_url: "", product_id: "", product_ids: [], payment_type: "subscription", recurring_interval: "month" });
        setNewOfferFeature(""); setShowOfferForm(false);
        toast.success("Offer created with payment link");
      } else throw new Error("No URL returned");
    } catch { toast.error("Failed to create payment link for offer"); }
    setCreatingOfferLink(false);
  };

  const removeOffer = (index: number) => {
    setFormData(prev => ({ ...prev, upgrade_offers: prev.upgrade_offers.filter((_, i) => i !== index) }));
  };

  const toggleProductInOffer = (productId: string) => {
    setNewOffer(prev => {
      const ids = prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : [...prev.product_ids, productId];
      // Recalculate name, price, and features from selected products
      const selectedProducts = products.filter(p => ids.includes(p.id));
      const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
      const allFeatures = selectedProducts.flatMap(p => p.options?.map((o: any) => o.name || o.label || String(o)) || [p.name]);
      const combinedName = prev.name || selectedProducts.map(p => p.name).join(' + ');
      return { ...prev, product_ids: ids, product_id: ids[0] || "", price: totalPrice.toString(), features: allFeatures, name: ids.length > 0 ? combinedName : "" };
    });
  };

  const prefillOfferFromProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setNewOffer(prev => ({ ...prev, product_id: productId, product_ids: [productId], name: product.name, price: product.price.toString(), features: product.options?.map((o: any) => o.name || o.label || String(o)) || [] }));
    }
  };

  const saveWidgetSettings = async () => {
    if (!selectedPlayerId) return;
    setSaving(true);
    const firstOffer = formData.upgrade_offers[0];
    const firstPkg = formData.current_packages[0];
    const payload: any = {
      player_id: selectedPlayerId, hub_widget_type: formData.hub_widget_type,
      current_package_name: firstPkg?.name || null, current_package_price: firstPkg?.price ? parseFloat(firstPkg.price) : null,
      current_package_currency: firstPkg?.currency || "GBP", current_package_features: firstPkg?.features?.length ? firstPkg.features : null,
      current_packages: formData.current_packages.length > 0 ? formData.current_packages : null,
      upgrade_product_id: firstOffer?.product_id || null, upgrade_message: firstOffer?.message || null,
      upgrade_name: firstOffer?.name || null, upgrade_price: firstOffer?.price ? parseFloat(firstOffer.price) : null,
      upgrade_currency: firstOffer?.currency || "GBP", upgrade_features: firstOffer?.features?.length ? firstOffer.features : null,
      upgrade_pay_link_url: firstOffer?.pay_link_url || null,
      upgrade_offers: formData.upgrade_offers.length > 0 ? formData.upgrade_offers : null,
    };

    // Save widget data to LOCAL db (has the widget columns)
    const { data: existing } = await supabase
      .from("player_portal_settings")
      .select("id")
      .eq("player_id", selectedPlayerId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from("player_portal_settings").update(payload).eq("player_id", selectedPlayerId);
      if (error) { console.error("Widget save error:", error); toast.error("Failed to save: " + error.message); }
      else toast.success("Widget settings saved");
    } else {
      const { error } = await supabase.from("player_portal_settings").insert(payload);
      if (error) { console.error("Widget save error:", error); toast.error("Failed to save: " + error.message); }
      else toast.success("Widget settings saved");
    }
    setSaving(false);
    fetchSettings(selectedPlayerId);
  };

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);
  const visibleCount = settings ? ALL_FEATURES.filter(f => (settings as any)[f.key] === true).length : 0;
  const portalLoginUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login';

  if (loading) return <LoadingSpinner size="md" className="py-8" />;

  const renderFeatureGrid = (features: FeatureItem[], title: string) => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-muted-foreground">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {features.map(feature => {
          const isVisible = (settings as any)?.[feature.key] as boolean;
          return (
            <div key={feature.key} className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${isVisible ? 'bg-background border-border' : 'bg-muted/50 border-border/50 opacity-70'}`}>
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center gap-2">
                  {isVisible ? <Eye className="h-3.5 w-3.5 text-primary shrink-0" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                  <Label className="text-sm font-medium cursor-pointer" htmlFor={feature.key}>{feature.label}</Label>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 ml-5.5">{feature.description}</p>
              </div>
              <Switch id={feature.key} checked={isVisible} onCheckedChange={(checked) => handleToggle(feature.key, checked)} />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Monitor className="h-5 w-5 md:h-6 md:w-6" />
          Portal Management
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Control features, hero images, invoices, pay links and sales for each player's portal
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
          <SelectTrigger className="w-full sm:w-[320px]">
            <SelectValue placeholder="Select a player..." />
          </SelectTrigger>
          <SelectContent>
            {groupedPlayers.map((group) => (
              <div key={group.status}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{group.label}</div>
                {group.players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted overflow-hidden flex items-center justify-center shrink-0">
                        {player.image_url ? <img src={player.image_url} alt={player.name} className="w-full h-full object-cover" /> : <User className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <span>{player.name}</span>
                      <span className="text-muted-foreground text-xs">({player.position})</span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
        {settings && <Badge variant="outline" className="text-xs">{visibleCount}/{ALL_FEATURES.length} features visible</Badge>}
      </div>

      {!selectedPlayerId && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Select a player to manage their portal settings</CardContent></Card>
      )}

      {selectedPlayerId && settings && (
        <>
          {/* Email + Portal Login Bar */}
          <Card>
            <CardContent className="pt-4">
              <Label className="text-xs text-muted-foreground mb-1 block">Player Email / Portal Login</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 font-mono text-sm truncate">{selectedPlayer?.email || "No email set"}</span>
                </div>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(selectedPlayer?.email || "", "player-email")} title="Copy email">
                  {copiedField === "player-email" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(portalLoginUrl, "_blank")} title="Open portal login">
                  <LogIn className="h-4 w-4 mr-1" /> Portal
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="features">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="features" className="flex items-center gap-1"><Eye className="h-4 w-4" /> Features</TabsTrigger>
              <TabsTrigger value="hero" className="flex items-center gap-1"><Image className="h-4 w-4" /> Hero</TabsTrigger>
              <TabsTrigger value="widget" className="flex items-center gap-1"><Settings className="h-4 w-4" /> Widget</TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-1"><FileText className="h-4 w-4" /> Invoices</TabsTrigger>
              <TabsTrigger value="paylinks" className="flex items-center gap-1"><CreditCard className="h-4 w-4" /> Pay Links</TabsTrigger>
            </TabsList>

            {/* Features Tab */}
            <TabsContent value="features">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5" /> Feature Visibility</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleResetAll}><RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset All</Button>
                      <Button size="sm" onClick={handleSave} disabled={saving || !hasChanges}><Save className="h-3.5 w-3.5 mr-1" /> {saving ? "Saving..." : "Save"}</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {renderFeatureGrid(SECTION_FEATURES, "Portal Sections")}
                  {renderFeatureGrid(COMPONENT_FEATURES, "Individual Components")}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hero Images Tab */}
            <TabsContent value="hero">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2"><Image className="h-5 w-5" /> Hero Images</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="h-3.5 w-3.5 mr-1" /> Add Image</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Images shown in the hero slideshow at the top of the player's Hub.</p>
                </CardHeader>
                <CardContent>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroFileSelect} />
                  {settings.hero_images.length === 0 ? (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                      <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hero images yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {settings.hero_images.map((imgUrl, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden border">
                          <div className="aspect-[16/7] bg-muted">
                            <img src={imgUrl} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" style={{ objectPosition: (settings.hero_focal_points[index] || 'center center').replace('-', ' ') }} />
                          </div>
                          <div className="p-2 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Move className="h-3 w-3 text-muted-foreground shrink-0" />
                              <Select value={settings.hero_focal_points[index] || "center center"} onValueChange={(val) => handleFocalPointChange(index, val)}>
                                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {FOCAL_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => handleRecropHero(index)}>Re-crop</Button>
                              <Button size="sm" variant="destructive" className="h-7 text-xs px-2" onClick={() => handleRemoveHeroImage(index)}><Trash2 className="h-3 w-3" /></Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              {hasChanges && (
                <Button className="w-full mt-3" onClick={handleSave} disabled={saving}><Save className="h-3.5 w-3.5 mr-1" /> {saving ? "Saving..." : "Save Changes"}</Button>
              )}
            </TabsContent>

            {/* Hub Widget Tab */}
            <TabsContent value="widget" className="space-y-4">
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Bottom Widget Type</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Sales Box instead of Aphorisms</p>
                      <p className="text-sm text-muted-foreground">Display package details and upgrade options</p>
                    </div>
                    <Switch checked={formData.hub_widget_type === "sales_box"} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hub_widget_type: checked ? "sales_box" : "aphorisms" }))} />
                  </div>
                </CardContent>
              </Card>

              {formData.hub_widget_type === "sales_box" && (
                <>
                  {/* Current Packages */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Current Packages</CardTitle>
                        <Button size="sm" variant="outline" onClick={() => setShowPackageForm(!showPackageForm)}><Plus className="h-4 w-4 mr-1" /> Add Package</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {formData.current_packages.map((pkg, idx) => (
                        <div key={idx} className="border rounded-lg p-3 relative">
                          <button onClick={() => removePackage(idx)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                          <div className="flex items-center justify-between pr-8">
                            <p className="font-medium">{pkg.name}</p>
                            <p className="text-sm font-bold">{currencySymbol(pkg.currency)}{pkg.price}{frequencyLabel(pkg.frequency)}</p>
                          </div>
                          {pkg.features.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{pkg.features.map((f, i) => <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>)}</div>}
                        </div>
                      ))}
                      {showPackageForm && (
                        <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 space-y-3">
                          <p className="text-sm font-semibold">Add Current Package</p>
                          <div className="grid grid-cols-2 gap-3">
                            <div><Label className="text-xs">Package Name</Label><Input value={newPackage.name} onChange={e => setNewPackage(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Pro Performance" /></div>
                            <div className="grid grid-cols-3 gap-2">
                              <div><Label className="text-xs">Price</Label><Input type="number" value={newPackage.price} onChange={e => setNewPackage(prev => ({ ...prev, price: e.target.value }))} placeholder="299" /></div>
                              <div><Label className="text-xs">Currency</Label><Select value={newPackage.currency} onValueChange={v => setNewPackage(prev => ({ ...prev, currency: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="GBP">GBP</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div>
                              <div><Label className="text-xs">Frequency</Label><Select value={newPackage.frequency} onValueChange={v => setNewPackage(prev => ({ ...prev, frequency: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="6-monthly">6-Monthly</SelectItem><SelectItem value="annual">Annual</SelectItem><SelectItem value="one-off">One-off</SelectItem></SelectContent></Select></div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Features</Label>
                            <div className="flex gap-2 mt-1">
                              <Input value={newPackageFeature} onChange={e => setNewPackageFeature(e.target.value)} placeholder="e.g. Weekly analysis" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newPackageFeature.trim()) { setNewPackage(prev => ({ ...prev, features: [...prev.features, newPackageFeature.trim()] })); setNewPackageFeature(""); } } }} />
                              <Button variant="outline" size="sm" onClick={() => { if (newPackageFeature.trim()) { setNewPackage(prev => ({ ...prev, features: [...prev.features, newPackageFeature.trim()] })); setNewPackageFeature(""); } }}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">{newPackage.features.map((f, i) => <Badge key={i} variant="secondary" className="gap-1 text-xs">{f}<button onClick={() => setNewPackage(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }))} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button></Badge>)}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={addPackage} className="flex-1">Add Package</Button>
                            <Button variant="outline" onClick={() => { setShowPackageForm(false); setNewPackage({ name: "", price: "", currency: "GBP", frequency: "monthly", features: [] }); setNewPackageFeature(""); }}>Cancel</Button>
                          </div>
                        </div>
                      )}
                      {formData.current_packages.length === 0 && !showPackageForm && <p className="text-sm text-muted-foreground text-center py-4">No packages configured.</p>}
                    </CardContent>
                  </Card>

                  {/* Upgrade Offers */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Upgrade Offers</CardTitle>
                        <Button size="sm" variant="outline" onClick={() => setShowOfferForm(!showOfferForm)}><Plus className="h-4 w-4 mr-1" /> Add Offer</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {formData.upgrade_offers.map((offer, idx) => (
                        <div key={idx} className="border rounded-lg p-3 space-y-2 relative">
                          <button onClick={() => removeOffer(idx)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                          <div className="flex items-center justify-between pr-8">
                            <p className="font-medium">{offer.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{offer.payment_type === "subscription" ? `Sub / ${offer.recurring_interval}` : "One-off"}</Badge>
                              <p className="text-sm font-bold text-accent">{currencySymbol(offer.currency)}{offer.price}{offer.payment_type === "subscription" ? `/${offer.recurring_interval === "month" ? "mo" : offer.recurring_interval === "year" ? "yr" : "wk"}` : ""}</p>
                            </div>
                          </div>
                          {offer.features.length > 0 && <div className="flex flex-wrap gap-1">{offer.features.map((f, i) => <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>)}</div>}
                          {offer.message && <p className="text-xs text-muted-foreground">{offer.message}</p>}
                          {offer.pay_link_url && <div className="flex items-center gap-2 text-xs"><Link className="h-3 w-3 text-accent" /><a href={offer.pay_link_url} target="_blank" rel="noopener noreferrer" className="text-accent underline truncate">{offer.pay_link_url}</a></div>}
                        </div>
                      ))}
                      {showOfferForm && (
                        <div className="border-2 border-dashed border-accent/30 rounded-lg p-4 space-y-3">
                          <p className="text-sm font-semibold text-accent">New Upgrade Offer</p>
                          <div>
                            <Label className="text-xs">Bundle Services from Catalogue</Label>
                            <p className="text-xs text-muted-foreground mb-2">Select multiple services to package into one offer</p>
                            <div className="max-h-48 overflow-y-auto border rounded-lg divide-y">
                              {products.map(p => {
                                const isSelected = newOffer.product_ids.includes(p.id);
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => toggleProductInOffer(p.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors ${isSelected ? 'bg-accent/10 font-medium' : 'hover:bg-muted/50'}`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/40'}`}>
                                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                      </div>
                                      <span className="truncate">{p.name}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{currencySymbol("GBP")}{p.price}</span>
                                  </button>
                                );
                              })}
                            </div>
                            {newOffer.product_ids.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">{newOffer.product_ids.length} service{newOffer.product_ids.length > 1 ? 's' : ''} selected — Total: {currencySymbol(newOffer.currency)}{newOffer.price}</p>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><Label className="text-xs">Package Name</Label><Input value={newOffer.name} onChange={e => setNewOffer(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Elite Performance" /></div>
                            <div className="grid grid-cols-2 gap-2">
                              <div><Label className="text-xs">Price</Label><Input type="number" value={newOffer.price} onChange={e => setNewOffer(prev => ({ ...prev, price: e.target.value }))} placeholder="499" /></div>
                              <div><Label className="text-xs">Currency</Label><Select value={newOffer.currency} onValueChange={v => setNewOffer(prev => ({ ...prev, currency: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="GBP">GBP</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><Label className="text-xs">Payment Type</Label><Select value={newOffer.payment_type} onValueChange={v => setNewOffer(prev => ({ ...prev, payment_type: v as "one_off" | "subscription" }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="one_off">One-off Payment</SelectItem><SelectItem value="subscription">Subscription</SelectItem></SelectContent></Select></div>
                            {newOffer.payment_type === "subscription" && (
                              <div><Label className="text-xs">Recurring Interval</Label><Select value={newOffer.recurring_interval} onValueChange={v => setNewOffer(prev => ({ ...prev, recurring_interval: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="week">Weekly</SelectItem><SelectItem value="month">Monthly</SelectItem><SelectItem value="year">Yearly</SelectItem></SelectContent></Select></div>
                            )}
                          </div>
                          <div>
                            <Label className="text-xs">Features</Label>
                            <div className="flex gap-2 mt-1">
                              <Input value={newOfferFeature} onChange={e => setNewOfferFeature(e.target.value)} placeholder="e.g. Nutrition coaching" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (newOfferFeature.trim()) { setNewOffer(prev => ({ ...prev, features: [...prev.features, newOfferFeature.trim()] })); setNewOfferFeature(""); } } }} />
                              <Button variant="outline" size="sm" onClick={() => { if (newOfferFeature.trim()) { setNewOffer(prev => ({ ...prev, features: [...prev.features, newOfferFeature.trim()] })); setNewOfferFeature(""); } }}><Plus className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">{newOffer.features.map((f, i) => <Badge key={i} variant="secondary" className="gap-1 text-xs">{f}<button onClick={() => setNewOffer(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }))} className="ml-1 hover:text-destructive"><Trash2 className="h-3 w-3" /></button></Badge>)}</div>
                          </div>
                          <div><Label className="text-xs">Custom Message</Label><Textarea value={newOffer.message} onChange={e => setNewOffer(prev => ({ ...prev, message: e.target.value }))} placeholder="e.g. Upgrade to get nutrition coaching and more!" rows={2} /></div>
                          <div className="flex gap-2">
                            <Button onClick={createOfferPayLink} disabled={creatingOfferLink} className="flex-1">{creatingOfferLink ? "Creating Link..." : "Create Offer + Payment Link"}</Button>
                            <Button variant="outline" onClick={() => { setShowOfferForm(false); setNewOffer({ name: "", price: "", currency: "GBP", features: [], message: "", pay_link_url: "", product_id: "", product_ids: [], payment_type: "subscription", recurring_interval: "month" }); }}>Cancel</Button>
                          </div>
                        </div>
                      )}
                      {formData.upgrade_offers.length === 0 && !showOfferForm && <p className="text-sm text-muted-foreground text-center py-4">No upgrade offers configured.</p>}
                    </CardContent>
                  </Card>
                </>
              )}
              <Button onClick={saveWidgetSettings} disabled={saving} className="w-full">{saving ? "Saving..." : "Save Widget Settings"}</Button>
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices" className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Invoices for {selectedPlayer?.name}</h3>
                <Button size="sm" onClick={() => setShowInvoiceForm(!showInvoiceForm)}><Plus className="h-4 w-4 mr-1" /> Add Invoice</Button>
              </div>
              {showInvoiceForm && (
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Invoice Number</Label><Input value={invoiceForm.invoice_number} onChange={e => setInvoiceForm(prev => ({ ...prev, invoice_number: e.target.value }))} placeholder="INV-001" /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label>Amount</Label><Input type="number" value={invoiceForm.amount} onChange={e => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="299" /></div>
                        <div><Label>Currency</Label><Select value={invoiceForm.currency} onValueChange={v => setInvoiceForm(prev => ({ ...prev, currency: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="GBP">GBP</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Invoice Date</Label><Input type="date" value={invoiceForm.invoice_date} onChange={e => setInvoiceForm(prev => ({ ...prev, invoice_date: e.target.value }))} /></div>
                      <div><Label>Due Date</Label><Input type="date" value={invoiceForm.due_date} onChange={e => setInvoiceForm(prev => ({ ...prev, due_date: e.target.value }))} /></div>
                    </div>
                    <div><Label>Description</Label><Input value={invoiceForm.description} onChange={e => setInvoiceForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Monthly coaching fee" /></div>
                    <div className="flex gap-2"><Button onClick={createInvoice} className="flex-1">Create Invoice</Button><Button variant="outline" onClick={() => setShowInvoiceForm(false)}>Cancel</Button></div>
                  </CardContent>
                </Card>
              )}
              {invoices.length === 0 && !showInvoiceForm ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No invoices for {selectedPlayer?.name}</CardContent></Card>
              ) : (
                invoices.map(inv => (
                  <Card key={inv.id}>
                    <CardContent className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{inv.invoice_number}</p>
                        <p className="text-sm text-muted-foreground">{inv.currency} {inv.amount.toFixed(2)} — Due: {new Date(inv.due_date).toLocaleDateString()}</p>
                        {inv.description && <p className="text-xs text-muted-foreground">{inv.description}</p>}
                      </div>
                      <Badge variant={inv.status === "paid" ? "default" : inv.status === "overdue" ? "destructive" : "secondary"}>{inv.status}</Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Pay Links Tab */}
            <TabsContent value="paylinks" className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Pay Links for {selectedPlayer?.name}</h3>
                <Button size="sm" onClick={() => setShowPayLinkForm(!showPayLinkForm)}><Plus className="h-4 w-4 mr-1" /> Create Pay Link</Button>
              </div>
              {showPayLinkForm && (
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Title</Label><Input value={payLinkForm.title} onChange={e => setPayLinkForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Monthly Fee - January" /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label>Amount</Label><Input type="number" value={payLinkForm.amount} onChange={e => setPayLinkForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="299" /></div>
                        <div><Label>Currency</Label><Select value={payLinkForm.currency} onValueChange={v => setPayLinkForm(prev => ({ ...prev, currency: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="GBP">GBP</SelectItem><SelectItem value="EUR">EUR</SelectItem><SelectItem value="USD">USD</SelectItem></SelectContent></Select></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Payment Type</Label><Select value={payLinkForm.payment_type} onValueChange={v => setPayLinkForm(prev => ({ ...prev, payment_type: v as "one_off" | "subscription" }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="one_off">One-off Payment</SelectItem><SelectItem value="subscription">Subscription</SelectItem></SelectContent></Select></div>
                      {payLinkForm.payment_type === "subscription" && (
                        <div><Label>Recurring Interval</Label><Select value={payLinkForm.recurring_interval} onValueChange={v => setPayLinkForm(prev => ({ ...prev, recurring_interval: v as "month" | "year" | "week" }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="week">Weekly</SelectItem><SelectItem value="month">Monthly</SelectItem><SelectItem value="year">Yearly</SelectItem></SelectContent></Select></div>
                      )}
                    </div>
                    <div><Label>Description (optional)</Label><Input value={payLinkForm.description} onChange={e => setPayLinkForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Coaching fee for January 2026" /></div>
                    <div className="flex gap-2"><Button onClick={createPayLink} disabled={creatingPayLink} className="flex-1">{creatingPayLink ? "Creating..." : "Create Pay Link"}</Button><Button variant="outline" onClick={() => setShowPayLinkForm(false)}>Cancel</Button></div>
                  </CardContent>
                </Card>
              )}
              {payLinks.length === 0 && !showPayLinkForm ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No pay links for {selectedPlayer?.name}</CardContent></Card>
              ) : (
                payLinks.map(link => (
                  <Card key={link.id}>
                    <CardContent className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{link.title}</p>
                        <p className="text-sm text-muted-foreground">{link.currency} {link.amount.toFixed(2)}{link.payment_type === "subscription" && link.recurring_interval && <span className="ml-1">/ {link.recurring_interval}</span>}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={link.status === "active" ? "default" : "secondary"}>{link.status}</Badge>
                        {link.payment_type && <Badge variant="outline" className="text-xs">{link.payment_type === "subscription" ? "Sub" : "One-off"}</Badge>}
                        {link.stripe_payment_link_url && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(link.stripe_payment_link_url!, link.id)}>
                              {copiedField === link.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => window.open(link.stripe_payment_link_url, "_blank")}><ExternalLink className="h-4 w-4" /></Button>
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

      <ImageCropDialog open={cropDialogOpen} onOpenChange={setCropDialogOpen} imageSrc={cropImageSrc} onCropComplete={handleCropComplete} aspectRatio={16 / 7} title="Crop Hero Image" cropHeight={280} />
    </div>
  );
};
