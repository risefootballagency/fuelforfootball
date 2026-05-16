import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { invokeEdgeFunction } from "@/lib/edgeFunctionHelper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Copy, ExternalLink, Link2, Loader2, FileText } from "lucide-react";
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
  invoice_due_date?: string | null;
  invoice_paid_at?: string | null;
  player_id?: string | null;
}

interface PlayerOption {
  id: string;
  name: string;
}

export const PayLinksManagement = ({ isAdmin }: { isAdmin: boolean }) => {
  const [payLinks, setPayLinks] = useState<PayLink[]>([]);
  const [players, setPlayers] = useState<PlayerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPayLink, setEditingPayLink] = useState<PayLink | null>(null);
  const [creatingStripeLink, setCreatingStripeLink] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    currency: 'GBP',
    description: '',
    expires_at: '',
    payment_type: 'one_off' as string,
    recurring_interval: 'month' as string,
    is_invoice: false,
    invoice_due_date: '',
    player_id: '',
  });

  useEffect(() => {
    fetchPayLinks();
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data } = await supabase
      .from('players')
      .select('id, name')
      .order('name');
    setPlayers((data || []) as PlayerOption[]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payLinkData: any = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      description: formData.description || null,
      expires_at: formData.expires_at || null,
      payment_type: formData.payment_type,
      recurring_interval: formData.payment_type === 'subscription' ? formData.recurring_interval : null,
      status: 'active',
      is_invoice: formData.is_invoice,
      invoice_due_date: formData.is_invoice && formData.invoice_due_date ? formData.invoice_due_date : null,
      player_id: formData.is_invoice && formData.player_id ? formData.player_id : null,
    };

    if (editingPayLink) {
      const { error } = await supabase
        .from('pay_links')
        .update(payLinkData)
        .eq('id', editingPayLink.id);

      if (error) {
        toast.error(`Error updating pay link: ${error.message}`);
        return;
      }
      toast.success(formData.is_invoice ? "Invoice updated" : "Pay link updated");
    } else {
      if (formData.is_invoice && !formData.player_id) {
        toast.error("Please select a player for the invoice");
        return;
      }

      const { data, error } = await supabase
        .from('pay_links')
        .insert([payLinkData])
        .select()
        .single();

      if (error) {
        toast.error(`Error creating pay link: ${error.message}`);
        return;
      }

      // Create Stripe payment link
      if (data) {
        await createStripePaymentLink(data.id, payLinkData);
      }

      toast.success(formData.is_invoice ? "Invoice sent to player" : "Pay link created");
    }

    setDialogOpen(false);
    resetForm();
    fetchPayLinks();
  };

  const createStripePaymentLink = async (payLinkId: string, data: { title: string; amount: number; currency: string; description: string | null; payment_type?: string | null; recurring_interval?: string | null }) => {
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
        toast.success("Stripe payment link created!");
        fetchPayLinks();
      }
    } catch (error: any) {
      console.error('Error creating Stripe link:', error);
      toast.error("Failed to create Stripe payment link");
    } finally {
      setCreatingStripeLink(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pay link?")) return;

    const { error } = await supabase.from('pay_links').delete().eq('id', id);
    if (error) {
      toast.error(`Error deleting pay link: ${error.message}`);
      return;
    }
    toast.success("Pay link deleted");
    fetchPayLinks();
  };

  const resetForm = () => {
    setEditingPayLink(null);
    setFormData({
      title: '',
      amount: '',
      currency: 'GBP',
      description: '',
      expires_at: '',
      payment_type: 'one_off',
      recurring_interval: 'month',
      is_invoice: false,
      invoice_due_date: '',
      player_id: '',
    });
  };

  const openDialog = (payLink?: PayLink, defaults?: Partial<typeof formData>) => {
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
        invoice_due_date: payLink.invoice_due_date || '',
        player_id: payLink.player_id || '',
      });
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
    toast.success("Link copied to clipboard");
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-500',
      expired: 'bg-yellow-500/20 text-yellow-500',
      paid: 'bg-blue-500/20 text-blue-500',
      cancelled: 'bg-red-500/20 text-red-500',
    };
    return <Badge variant="outline" className={colors[status] || ''}>{status}</Badge>;
  };

  const totalActive = payLinks.filter(p => p.status === 'active').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pay Links & Invoices</h3>
        {isAdmin && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => openDialog(undefined, { is_invoice: true })}>
              <FileText className="h-4 w-4 mr-2" />
              Invoice Player
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
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Created</TableHead>
                  {isAdmin && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : payLinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No pay links created yet
                    </TableCell>
                  </TableRow>
                ) : (
                  payLinks.map((payLink) => (
                    <TableRow key={payLink.id}>
                      <TableCell className="font-medium">
                        <div>
                          {payLink.title}
                          {payLink.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{payLink.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        £{payLink.amount.toFixed(2)}{payLink.payment_type === 'subscription' ? `/${payLink.recurring_interval === 'week' ? 'wk' : payLink.recurring_interval === 'year' ? 'yr' : 'mo'}` : ''} {payLink.currency !== 'GBP' && payLink.currency}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getStatusBadge(payLink.status)}
                          {payLink.payment_type === 'subscription' && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-500 text-[10px]">Sub</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payLink.stripe_payment_link_url ? (
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => copyLink(payLink.stripe_payment_link_url!)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => window.open(payLink.stripe_payment_link_url!, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => createStripePaymentLink(payLink.id, {
                              title: payLink.title,
                              amount: payLink.amount,
                              currency: payLink.currency,
                              description: payLink.description,
                              payment_type: payLink.payment_type,
                              recurring_interval: payLink.recurring_interval,
                            })}
                            disabled={creatingStripeLink}
                          >
                            {creatingStripeLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4 mr-1" />}
                            Generate
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(payLink.created_at), 'dd/MM/yyyy')}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => openDialog(payLink)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(payLink.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </div>
            ) : payLinks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pay links created yet
              </div>
            ) : (
              payLinks.map((payLink) => (
                <div key={payLink.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{payLink.title}</p>
                      {payLink.description && (
                        <p className="text-xs text-muted-foreground truncate">{payLink.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {getStatusBadge(payLink.status)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">£{payLink.amount.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(payLink.created_at), 'dd/MM/yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t">
                    {payLink.stripe_payment_link_url ? (
                      <>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => copyLink(payLink.stripe_payment_link_url!)}>
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => window.open(payLink.stripe_payment_link_url!, '_blank')}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => createStripePaymentLink(payLink.id, {
                          title: payLink.title,
                          amount: payLink.amount,
                          currency: payLink.currency,
                          description: payLink.description,
                          payment_type: payLink.payment_type,
                          recurring_interval: payLink.recurring_interval,
                        })}
                        disabled={creatingStripeLink}
                      >
                        {creatingStripeLink ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4 mr-1" />}
                        Generate Link
                      </Button>
                    )}
                    {isAdmin && (
                      <>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openDialog(payLink)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(payLink.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPayLink ? 'Edit' : 'Create'} {formData.is_invoice ? 'Invoice' : 'Pay Link'}</DialogTitle>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Player *</Label>
                  <Select
                    value={formData.player_id}
                    onValueChange={(v) => setFormData(prev => ({ ...prev, player_id: v }))}
                  >
                    <SelectTrigger><SelectValue placeholder="Select player" /></SelectTrigger>
                    <SelectContent className="max-h-72">
                      {players.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            )}

            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={formData.is_invoice ? "e.g. October Coaching" : "e.g. Consultation Fee"}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingPayLink ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
