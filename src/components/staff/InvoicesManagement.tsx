import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FileText, Loader2, Send, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface Invoice {
  id: string;
  invoice_number: string;
  player_id: string;
  amount: number;
  amount_paid: number | null;
  currency: string;
  status: string;
  invoice_date: string;
  due_date: string;
  description: string | null;
  billing_month: string | null;
  pdf_url: string | null;
  players?: { name: string } | null;
}

interface Player {
  id: string;
  name: string;
}

export const InvoicesManagement = ({ isAdmin }: { isAdmin: boolean }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    player_id: '',
    amount: '',
    currency: 'GBP',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    description: '',
    billing_month: '',
  });

  useEffect(() => {
    fetchInvoices();
    fetchPlayers();
  }, []);

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, players(name)')
      .order('invoice_date', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      return;
    }
    setInvoices((data || []) as Invoice[]);
    setLoading(false);
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('id, name')
      .order('name');

    if (!error) setPlayers(data || []);
  };

  const generateInvoiceNumber = () => {
    const prefix = 'INV';
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}${month}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invoiceData = {
      player_id: formData.player_id,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      invoice_date: formData.invoice_date,
      due_date: formData.due_date,
      description: formData.description || null,
      billing_month: formData.billing_month || null,
      status: 'pending',
      invoice_number: editingInvoice?.invoice_number || generateInvoiceNumber(),
    };

    if (editingInvoice) {
      const { error } = await supabase
        .from('invoices')
        .update(invoiceData)
        .eq('id', editingInvoice.id);

      if (error) {
        toast.error("Error updating invoice");
        return;
      }
      toast.success("Invoice updated");
    } else {
      const { error } = await supabase
        .from('invoices')
        .insert([invoiceData]);

      if (error) {
        toast.error("Error creating invoice");
        return;
      }
      toast.success("Invoice created");
    }

    setDialogOpen(false);
    resetForm();
    fetchInvoices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;

    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      toast.error("Error deleting invoice");
      return;
    }
    toast.success("Invoice deleted");
    fetchInvoices();
  };

  const handleMarkPaid = async (id: string, amount: number) => {
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'paid', amount_paid: amount })
      .eq('id', id);

    if (error) {
      toast.error("Error updating invoice");
      return;
    }
    toast.success("Invoice marked as paid");
    fetchInvoices();
  };

  const resetForm = () => {
    setEditingInvoice(null);
    setFormData({
      player_id: '',
      amount: '',
      currency: 'GBP',
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: '',
      description: '',
      billing_month: '',
    });
  };

  const openDialog = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        player_id: invoice.player_id,
        amount: invoice.amount.toString(),
        currency: invoice.currency,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        description: invoice.description || '',
        billing_month: invoice.billing_month || '',
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-500',
      sent: 'bg-blue-500/20 text-blue-500',
      paid: 'bg-green-500/20 text-green-500',
      overdue: 'bg-red-500/20 text-red-500',
      cancelled: 'bg-gray-500/20 text-gray-500',
    };
    return <Badge variant="outline" className={colors[status] || ''}>{status}</Badge>;
  };

  const filteredInvoices = invoices.filter(i => 
    statusFilter === 'all' || i.status === statusFilter
  );

  const totalOutstanding = invoices
    .filter(i => i.status === 'pending' || i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + (i.amount_paid || i.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoices
        </h3>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          {isAdmin && (
            <Button size="sm" onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Outstanding</span>
              <span className="text-lg font-bold text-yellow-500">£{totalOutstanding.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Collected</span>
              <span className="text-lg font-bold text-green-500">£{totalPaid.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.invoice_number}</TableCell>
                    <TableCell className="font-medium">{invoice.players?.name || 'Unknown'}</TableCell>
                    <TableCell className="font-medium">
                      £{invoice.amount.toFixed(2)}
                      {invoice.amount_paid && invoice.amount_paid > 0 && (
                        <span className="text-xs text-green-500 block">
                          Paid: £{invoice.amount_paid.toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(invoice.invoice_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(invoice.due_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex gap-1">
                          {invoice.status !== 'paid' && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleMarkPaid(invoice.id, invoice.amount)}
                              title="Mark as Paid"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" onClick={() => openDialog(invoice)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(invoice.id)}>
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
            <DialogTitle>{editingInvoice ? 'Edit' : 'Create'} Invoice</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Player *</Label>
              <Select value={formData.player_id} onValueChange={(v) => setFormData(prev => ({ ...prev, player_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select player" /></SelectTrigger>
                <SelectContent>
                  {players.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Label>Invoice Date *</Label>
                <Input
                  type="date"
                  value={formData.invoice_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, invoice_date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Billing Month</Label>
              <Input
                value={formData.billing_month}
                onChange={(e) => setFormData(prev => ({ ...prev, billing_month: e.target.value }))}
                placeholder="e.g. January 2025"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingInvoice ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
