import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { Plus, Pencil, Trash2, Copy, ExternalLink, Link2, Loader2 } from "lucide-react";
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
  created_at: string;
}

export const PayLinksManagement = ({ isAdmin }: { isAdmin: boolean }) => {
  const [payLinks, setPayLinks] = useState<PayLink[]>([]);
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
  });

  useEffect(() => {
    fetchPayLinks();
  }, []);

  const fetchPayLinks = async () => {
    const { data, error } = await supabase
      .from('pay_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Error fetching pay links");
      return;
    }
    setPayLinks((data || []) as PayLink[]);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payLinkData = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      description: formData.description || null,
      expires_at: formData.expires_at || null,
      status: 'active',
    };

    if (editingPayLink) {
      const { error } = await supabase
        .from('pay_links')
        .update(payLinkData)
        .eq('id', editingPayLink.id);

      if (error) {
        toast.error("Error updating pay link");
        return;
      }
      toast.success("Pay link updated");
    } else {
      const { data, error } = await supabase
        .from('pay_links')
        .insert([payLinkData])
        .select()
        .single();

      if (error) {
        toast.error("Error creating pay link");
        return;
      }

      // Create Stripe payment link
      if (data) {
        await createStripePaymentLink(data.id, payLinkData);
      }

      toast.success("Pay link created");
    }

    setDialogOpen(false);
    resetForm();
    fetchPayLinks();
  };

  const createStripePaymentLink = async (payLinkId: string, data: { title: string; amount: number; currency: string; description: string | null }) => {
    setCreatingStripeLink(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('create-pay-link', {
        body: {
          payLinkId,
          title: data.title,
          amount: data.amount,
          currency: data.currency,
          description: data.description,
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
      toast.error("Error deleting pay link");
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
    });
  };

  const openDialog = (payLink?: PayLink) => {
    if (payLink) {
      setEditingPayLink(payLink);
      setFormData({
        title: payLink.title,
        amount: payLink.amount.toString(),
        currency: payLink.currency,
        description: payLink.description || '',
        expires_at: payLink.expires_at ? payLink.expires_at.split('T')[0] : '',
      });
    } else {
      resetForm();
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
        <h3 className="text-lg font-semibold">Pay Links</h3>
        {isAdmin && (
          <Button size="sm" onClick={() => openDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Pay Link
          </Button>
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
        <CardContent className="p-0">
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
                      £{payLink.amount.toFixed(2)} {payLink.currency !== 'GBP' && payLink.currency}
                    </TableCell>
                    <TableCell>{getStatusBadge(payLink.status)}</TableCell>
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
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPayLink ? 'Edit' : 'Create'} Pay Link</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Consultation Fee"
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
