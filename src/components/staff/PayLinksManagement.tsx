import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { invokeEdgeFunction } from "@/lib/edgeFunctionHelper";
import { ProductCombobox } from "./ProductCombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlayerCombobox, PlayerOption } from "./PlayerCombobox";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, ExternalLink, Link2, Loader2, FileText, Package, X, Lightbulb } from "lucide-react";
import { format } from "date-fns";

interface PayLink {
  id: string;
  title: string;
  amount: number;
  currency: string;
  description: string | null;
  status: string;
  expires_at: string | null;
  stripe_payment_link_url: string | null;
  stripe_payment_link_id: string | null;
  payment_type: string | null;
  recurring_interval: string | null;
  created_at: string;
  is_invoice?: boolean;
  invoice_kind?: string;
  invoice_due_date?: string | null;
  invoice_paid_at?: string | null;
  player_id?: string | null;
}

interface LineItem {
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const symbolFor = (c: string) => c === 'GBP' ? '£' : c === 'EUR' ? '€' : c === 'USD' ? '$' : '';

export const PayLinksManagement = ({ isAdmin, defaultIsInvoice = false }: { isAdmin: boolean; defaultIsInvoice?: boolean }) => {
  const [payLinks, setPayLinks] = useState<PayLink[]>([]);
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPayLink, setEditingPayLink] = useState<PayLink | null>(null);
  const [creatingStripeLink, setCreatingStripeLink] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'GBP',
    description: '',
    expires_at: '',
    payment_type: 'one_off' as string,
    recurring_interval: 'month' as string,
    is_invoice: defaultIsInvoice,
    invoice_kind: 'agreed' as 'agreed' | 'suggestion',
    invoice_due_date: '',
    player_id: '',
  });

  useEffect(() => {
    fetchPayLinks();
    fetchPlayers();
    fetchProducts();
  }, []);

  const fetchPlayers = async () => {
    const [localRes, sharedRes] = await Promise.all([
      supabase.from('players').select('id, name, position, image_url, club, representation_status').order('name'),
      sharedSupabase.from('players').select('id, name, position, image_url, club, representation_status').order('name'),
    ]);
    const byId = new Map<string, PlayerOption>();
    // Shared first, then local overrides so local data wins on collision
    (sharedRes.data || []).forEach((p: any) => byId.set(p.id, p as PlayerOption));
    (localRes.data || []).forEach((p: any) => byId.set(p.id, p as PlayerOption));
    const merged = Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
    setPlayers(merged);
  };

  // Ensures a player row exists in the local DB so FK constraints (pay_links.player_id → players.id)
  // succeed when the staff invoices a player who currently only exists in the shared DB.
  const ensureLocalPlayer = async (playerId: string): Promise<boolean> => {
    const { data: existing } = await supabase.from('players').select('id').eq('id', playerId).maybeSingle();
    if (existing) return true;
    const { data: shared } = await sharedSupabase
      .from('players')
      .select('id, name, position, age, nationality, image_url, club, representation_status, email')
      .eq('id', playerId)
      .maybeSingle();
    if (!shared) return false;
    const allowedStatuses = new Set(['represented', 'mandated', 'other']);
    const repStatus = allowedStatuses.has((shared as any).representation_status)
      ? (shared as any).representation_status
      : 'other';
    const { error } = await supabase.from('players').insert({
      id: (shared as any).id,
      name: (shared as any).name,
      position: (shared as any).position || 'Unknown',
      age: (shared as any).age ?? 0,
      nationality: (shared as any).nationality || 'Unknown',
      image_url: (shared as any).image_url,
      club: (shared as any).club,
      email: (shared as any).email,
      representation_status: repStatus,
    } as any);
    if (error) {
      toast.error(`Could not link player locally: ${error.message}`);
      return false;
    }
    return true;
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('service_catalog')
      .select('id, name, price')
      .order('name');
    setProducts((data || []) as Product[]);
  };

  const fetchPayLinks = async () => {
    const { data, error } = await supabase
      .from('pay_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(`Error fetching pay links: ${error.message}`);
      return;
    }
    setPayLinks((data || []) as PayLink[]);
    setLoading(false);
  };

  const lineItemsTotal = () => lineItems.reduce((sum, i) => sum + (Number(i.unit_price) || 0) * (Number(i.quantity) || 0), 0);

  const useLineItems = lineItems.length > 0;
  const computedAmount = useLineItems ? lineItemsTotal() : parseFloat(formData.amount) || 0;
  const computedTitle = formData.title || (lineItems[0]?.product_name ?? '');

  const addLineItem = () => setLineItems([...lineItems, { product_id: null, product_name: '', quantity: 1, unit_price: 0 }]);

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const next = [...lineItems];
    if (field === 'product_id') {
      if (value === 'custom' || !value) {
        next[index] = { ...next[index], product_id: null };
      } else {
        const product = products.find(p => p.id === value);
        if (product) {
          next[index] = { ...next[index], product_id: value, product_name: product.name, unit_price: Number(product.price) || 0 };
        }
      }
    } else {
      (next[index] as any)[field] = value;
    }
    setLineItems(next);
  };

  const removeLineItem = (index: number) => setLineItems(lineItems.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalTitle = (computedTitle || '').trim();
    if (!finalTitle) {
      toast.error('Please add a title or product');
      return;
    }
    if (computedAmount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    if (formData.is_invoice && !formData.player_id) {
      toast.error('Please select a player for the invoice');
      return;
    }
    if (formData.is_invoice && formData.player_id) {
      const ok = await ensureLocalPlayer(formData.player_id);
      if (!ok) return;
    }
    if (useLineItems && lineItems.some(i => !i.product_name.trim())) {
      toast.error('Each line item needs a name');
      return;
    }

    const payLinkData: any = {
      title: finalTitle,
      amount: computedAmount,
      currency: formData.currency,
      description: formData.description || null,
      expires_at: formData.expires_at || null,
      payment_type: formData.payment_type,
      recurring_interval: formData.payment_type === 'subscription' ? formData.recurring_interval : null,
      status: 'active',
      is_invoice: formData.is_invoice,
      invoice_kind: formData.is_invoice ? formData.invoice_kind : 'agreed',
      invoice_due_date: formData.is_invoice && formData.invoice_due_date ? formData.invoice_due_date : null,
      player_id: formData.is_invoice && formData.player_id ? formData.player_id : null,
    };

    if (editingPayLink) {
      const { error } = await supabase.from('pay_links').update(payLinkData).eq('id', editingPayLink.id);
      if (error) {
        toast.error(`Error updating pay link: ${error.message}`);
        return;
      }
      // Replace line items
      await supabase.from('pay_link_items').delete().eq('pay_link_id', editingPayLink.id);
      if (useLineItems) {
        await supabase.from('pay_link_items').insert(lineItems.map(i => ({
          pay_link_id: editingPayLink.id,
          product_id: i.product_id,
          product_name: i.product_name,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })));
      }
      toast.success(formData.is_invoice ? 'Invoice updated' : 'Pay link updated');
    } else {
      const { data, error } = await supabase.from('pay_links').insert([payLinkData]).select().single();
      if (error) {
        toast.error(`Error creating pay link: ${error.message}`);
        return;
      }
      if (useLineItems && data) {
        await supabase.from('pay_link_items').insert(lineItems.map(i => ({
          pay_link_id: data.id,
          product_id: i.product_id,
          product_name: i.product_name,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })));
      }
      if (data) {
        await createStripePaymentLink(data.id, payLinkData);
      }
      toast.success(formData.is_invoice ? 'Invoice sent to player' : 'Pay link created');
    }

    setDialogOpen(false);
    resetForm();
    fetchPayLinks();
  };

  const createStripePaymentLink = async (payLinkId: string, data: any) => {
    setCreatingStripeLink(true);
    try {
      const { data: result, error } = await invokeEdgeFunction('create-pay-link', {
        body: {
          payLinkId,
          title: data.title,
          amount: data.amount,
          currency: data.currency,
          description: data.description,
          paymentType: data.payment_type || 'one_off',
          recurringInterval: data.payment_type === 'subscription' ? (data.recurring_interval || 'month') : undefined,
        },
      });
      if (error) throw error;
      if (result?.url) {
        toast.success('Stripe payment link created!');
        fetchPayLinks();
      }
    } catch (error: any) {
      console.error('Error creating Stripe link:', error);
      toast.error('Failed to create Stripe payment link');
    } finally {
      setCreatingStripeLink(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this pay link?')) return;
    const { error } = await supabase.from('pay_links').delete().eq('id', id);
    if (error) {
      toast.error(`Error deleting pay link: ${error.message}`);
      return;
    }
    toast.success('Pay link deleted');
    fetchPayLinks();
  };

  const resetForm = () => {
    setEditingPayLink(null);
    setLineItems([]);
    setFormData({
      title: '',
      amount: '',
      currency: 'GBP',
      description: '',
      expires_at: '',
      payment_type: 'one_off',
      recurring_interval: 'month',
      is_invoice: defaultIsInvoice,
      invoice_kind: 'agreed',
      invoice_due_date: '',
      player_id: '',
    });
  };

  const openDialog = async (payLink?: PayLink, defaults?: Partial<typeof formData>) => {
    if (payLink) {
      setEditingPayLink(payLink);
      setFormData({
        title: payLink.title,
        amount: payLink.amount.toString(),
        currency: payLink.currency,
        description: payLink.description || '',
        expires_at: payLink.expires_at ? payLink.expires_at.split('T')[0] : '',
        payment_type: payLink.payment_type || 'one_off',
        recurring_interval: payLink.recurring_interval || 'month',
        is_invoice: !!payLink.is_invoice,
        invoice_kind: (payLink.invoice_kind as any) || 'agreed',
        invoice_due_date: payLink.invoice_due_date || '',
        player_id: payLink.player_id || '',
      });
      const { data: items } = await supabase.from('pay_link_items').select('*').eq('pay_link_id', payLink.id);
      setLineItems((items || []).map((i: any) => ({
        product_id: i.product_id,
        product_name: i.product_name,
        quantity: i.quantity,
        unit_price: Number(i.unit_price),
      })));
    } else {
      resetForm();
      if (defaults) {
        setFormData(prev => ({ ...prev, ...defaults }));
      }
    }
    setDialogOpen(true);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-500',
      expired: 'bg-yellow-500/20 text-yellow-500',
      paid: 'bg-blue-500/20 text-blue-500',
      completed: 'bg-blue-500/20 text-blue-500',
      cancelled: 'bg-red-500/20 text-red-500',
    };
    return <Badge variant="outline" className={colors[status] || ''}>{status}</Badge>;
  };

  const totalActive = payLinks.filter(p => p.status === 'active').reduce((sum, p) => sum + Number(p.amount), 0);
  const sym = symbolFor(formData.currency);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h3 className="text-lg font-semibold">Pay Links & Invoices</h3>
        {isAdmin && (
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => openDialog(undefined, { is_invoice: true, invoice_kind: 'agreed' })}>
              <FileText className="h-4 w-4 mr-2" />
              Invoice Player
            </Button>
            <Button size="sm" variant="outline" onClick={() => openDialog(undefined, { is_invoice: true, invoice_kind: 'suggestion' })}>
              <Lightbulb className="h-4 w-4 mr-2" />
              Suggest Invoice
            </Button>
            <Button size="sm" onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Pay Link
            </Button>
          </div>
        )}
      </div>

      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Pay Links Value</span>
            <span className="text-lg font-bold text-primary">£{totalActive.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-2 sm:p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Player / Kind</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Created</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : payLinks.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No pay links created yet</TableCell></TableRow>
                ) : (
                  payLinks.map((payLink) => {
                    const playerName = payLink.player_id ? players.find(p => p.id === payLink.player_id)?.name : null;
                    return (
                      <TableRow key={payLink.id}>
                        <TableCell className="font-medium">
                          <div>
                            {payLink.title}
                            {payLink.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{payLink.description}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {payLink.is_invoice ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm">{playerName || '—'}</span>
                              <Badge variant="outline" className={payLink.invoice_kind === 'suggestion' ? 'bg-gold/20 text-gold text-[10px] w-fit' : 'bg-primary/20 text-primary text-[10px] w-fit'}>
                                {payLink.invoice_kind === 'suggestion' ? 'Suggestion' : 'Invoice'}
                              </Badge>
                            </div>
                          ) : <span className="text-xs text-muted-foreground">Pay link</span>}
                        </TableCell>
                        <TableCell className="font-medium">
                          {symbolFor(payLink.currency)}{Number(payLink.amount).toFixed(2)}{payLink.payment_type === 'subscription' ? `/${payLink.recurring_interval === 'week' ? 'wk' : payLink.recurring_interval === 'year' ? 'yr' : 'mo'}` : ''}
                        </TableCell>
                        <TableCell>{getStatusBadge(payLink.status)}</TableCell>
                        <TableCell>
                          {payLink.stripe_payment_link_url ? (
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" onClick={() => copyLink(payLink.stripe_payment_link_url!)}><Copy className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => window.open(payLink.stripe_payment_link_url!, '_blank')}><ExternalLink className="h-4 w-4" /></Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => createStripePaymentLink(payLink.id, payLink)} disabled={creatingStripeLink}>
                              {creatingStripeLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4 mr-1" />}
                              Generate
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{format(new Date(payLink.created_at), 'dd/MM/yyyy')}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => openDialog(payLink)}><Pencil className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDelete(payLink.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3">
            {loading ? (
              <div className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
            ) : payLinks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No pay links created yet</div>
            ) : (
              payLinks.map((payLink) => (
                <div key={payLink.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{payLink.title}</p>
                      {payLink.is_invoice && (
                        <Badge variant="outline" className={payLink.invoice_kind === 'suggestion' ? 'bg-gold/20 text-gold text-[10px] mt-1' : 'bg-primary/20 text-primary text-[10px] mt-1'}>
                          {payLink.invoice_kind === 'suggestion' ? 'Suggestion' : 'Invoice'}
                        </Badge>
                      )}
                    </div>
                    {getStatusBadge(payLink.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{symbolFor(payLink.currency)}{Number(payLink.amount).toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(payLink.created_at), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t">
                    {payLink.stripe_payment_link_url ? (
                      <>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => copyLink(payLink.stripe_payment_link_url!)}><Copy className="h-4 w-4 mr-1" />Copy</Button>
                        <Button size="sm" variant="outline" onClick={() => window.open(payLink.stripe_payment_link_url!, '_blank')}><ExternalLink className="h-4 w-4" /></Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => createStripePaymentLink(payLink.id, payLink)} disabled={creatingStripeLink}>
                        {creatingStripeLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4 mr-1" />}
                        Generate Link
                      </Button>
                    )}
                    {isAdmin && (
                      <>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openDialog(payLink)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(payLink.id)}><Trash2 className="h-4 w-4" /></Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPayLink ? 'Edit' : 'Create'} {formData.is_invoice ? (formData.invoice_kind === 'suggestion' ? 'Suggested Invoice' : 'Invoice') : 'Pay Link'}
            </DialogTitle>
            {formData.is_invoice && (
              <DialogDescription>
                {formData.invoice_kind === 'suggestion'
                  ? "Suggested invoices appear on the player's hub as optional — they can pay if they'd like, even without prior discussion."
                  : 'Agreed invoices appear on the player\'s hub and will pulse gold until paid.'}
              </DialogDescription>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/40">
              <input
                id="is_invoice"
                type="checkbox"
                checked={formData.is_invoice}
                onChange={(e) => setFormData(prev => ({ ...prev, is_invoice: e.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              <Label htmlFor="is_invoice" className="cursor-pointer mb-0">
                Invoice a specific player (shows in their portal)
              </Label>
            </div>

            {formData.is_invoice && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Player *</Label>
                    <PlayerCombobox
                      players={players}
                      value={formData.player_id || null}
                      onChange={(v) => setFormData(prev => ({ ...prev, player_id: v }))}
                      placeholder="Type to search player..."
                      groupedByStatus
                      showClub
                    />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={formData.invoice_due_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, invoice_due_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Invoice Type</Label>
                  <RadioGroup
                    value={formData.invoice_kind}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, invoice_kind: v as 'agreed' | 'suggestion' }))}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2"
                  >
                    <label className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer ${formData.invoice_kind === 'agreed' ? 'border-primary bg-primary/5' : ''}`}>
                      <RadioGroupItem value="agreed" className="mt-1" />
                      <div>
                        <p className="font-medium text-sm">Agreed Invoice</p>
                        <p className="text-xs text-muted-foreground">Standard invoice the player has agreed to.</p>
                      </div>
                    </label>
                    <label className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer ${formData.invoice_kind === 'suggestion' ? 'border-gold bg-gold/5' : ''}`}>
                      <RadioGroupItem value="suggestion" className="mt-1" />
                      <div>
                        <p className="font-medium text-sm flex items-center gap-1"><Lightbulb className="h-3 w-3" /> Suggestion</p>
                        <p className="text-xs text-muted-foreground">Optional. Shows on hub as a suggestion; not yet discussed.</p>
                      </div>
                    </label>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Line items */}
            <div className="border rounded-md p-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 mb-0"><Package className="h-4 w-4" /> Line Items {useLineItems && <span className="text-xs text-muted-foreground">(amount auto-calculated)</span>}</Label>
                <Button type="button" size="sm" variant="outline" onClick={addLineItem}>
                  <Plus className="h-3 w-3 mr-1" /> Add Item
                </Button>
              </div>
              {lineItems.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No line items. Use the amount field below for a single charge, or add items to itemise.</p>
              ) : (
                <div className="space-y-2">
                  {lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-start">
                      <div className="col-span-12 md:col-span-4">
                        <Select value={item.product_id || 'custom'} onValueChange={(v) => updateLineItem(index, 'product_id', v)}>
                          <SelectTrigger className="h-9"><SelectValue placeholder="Product" /></SelectTrigger>
                          <SelectContent className="max-h-72">
                            <SelectItem value="custom">Custom item</SelectItem>
                            {products.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name} — {sym}{Number(p.price).toFixed(2)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <Input
                          placeholder="Item name"
                          value={item.product_name}
                          onChange={(e) => updateLineItem(index, 'product_name', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-1">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="h-9"
                          placeholder="Price"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-1 text-right font-medium pt-1.5 text-sm">
                        {sym}{(item.quantity * item.unit_price).toFixed(2)}
                      </div>
                      <div className="col-span-1">
                        <Button type="button" size="icon" variant="ghost" className="h-9 w-9" onClick={() => removeLineItem(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end font-semibold text-base pt-2 border-t">
                    Total: {sym}{lineItemsTotal().toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title {useLineItems && <span className="text-xs text-muted-foreground">(optional — auto-fills from first item)</span>}</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={formData.is_invoice ? 'e.g. October Coaching' : 'e.g. Consultation Fee'}
                  required={!useLineItems}
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={formData.currency} onValueChange={(v) => setFormData(prev => ({ ...prev, currency: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!useLineItems && (
              <div>
                <Label>Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Payment Type</Label>
                <Select value={formData.payment_type} onValueChange={(v) => setFormData(prev => ({ ...prev, payment_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_off">One-Off</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.payment_type === 'subscription' && (
                <div>
                  <Label>Interval</Label>
                  <Select value={formData.recurring_interval} onValueChange={(v) => setFormData(prev => ({ ...prev, recurring_interval: v }))}>
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
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                placeholder="Optional description for the payment"
              />
            </div>

            <div>
              <Label>Expires On (Optional)</Label>
              <Input
                type="date"
                value={formData.expires_at}
                onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
              />
            </div>

            <div className="flex justify-between items-center gap-2 pt-2 border-t">
              <div className="text-sm">
                <span className="text-muted-foreground">Total: </span>
                <span className="font-bold text-lg">{sym}{computedAmount.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingPayLink ? 'Update' : 'Create'}</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
