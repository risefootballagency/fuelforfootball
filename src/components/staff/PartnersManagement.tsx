import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Handshake, Globe, Mail, Phone, ExternalLink } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  type: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const PARTNER_TYPES = ['sponsor', 'affiliate', 'media', 'technology', 'other'];
const PARTNER_STATUSES = ['active', 'inactive', 'pending'];

export const PartnersManagement = ({ isAdmin }: { isAdmin: boolean }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const [form, setForm] = useState({
    name: '',
    type: 'sponsor',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    logo_url: '',
    website_url: '',
    description: '',
    status: 'active',
    notes: '',
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setPartners(data || []);
    } catch (error: any) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Please enter a partner name');
      return;
    }

    try {
      const partnerData = {
        name: form.name,
        type: form.type,
        contact_name: form.contact_name || null,
        contact_email: form.contact_email || null,
        contact_phone: form.contact_phone || null,
        logo_url: form.logo_url || null,
        website_url: form.website_url || null,
        description: form.description || null,
        status: form.status,
        notes: form.notes || null,
      };

      if (editingPartner) {
        const { error } = await supabase
          .from('partners')
          .update(partnerData)
          .eq('id', editingPartner.id);

        if (error) throw error;
        toast.success('Partner updated!');
      } else {
        const { error } = await supabase
          .from('partners')
          .insert(partnerData);

        if (error) throw error;
        toast.success('Partner added!');
      }

      resetForm();
      setDialogOpen(false);
      fetchPartners();
    } catch (error: any) {
      console.error('Error saving partner:', error);
      toast.error(error.message || 'Failed to save partner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Partner deleted!');
      fetchPartners();
    } catch (error: any) {
      console.error('Error deleting partner:', error);
      toast.error('Failed to delete partner');
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      type: 'sponsor',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      logo_url: '',
      website_url: '',
      description: '',
      status: 'active',
      notes: '',
    });
    setEditingPartner(null);
  };

  const startEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setForm({
      name: partner.name,
      type: partner.type || 'sponsor',
      contact_name: partner.contact_name || '',
      contact_email: partner.contact_email || '',
      contact_phone: partner.contact_phone || '',
      logo_url: partner.logo_url || '',
      website_url: partner.website_url || '',
      description: partner.description || '',
      status: partner.status,
      notes: partner.notes || '',
    });
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading partners...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Handshake className="h-6 w-6" />
            Partners Management
          </h2>
          <p className="text-muted-foreground">Manage sponsors, affiliates, and partners</p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPartner ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Partner Name *</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g., Nike"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PARTNER_TYPES.map(t => (
                          <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Partnership details..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Name</Label>
                    <Input
                      value={form.contact_name}
                      onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={form.contact_email}
                      onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input
                      value={form.contact_phone}
                      onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                      placeholder="+44..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={form.logo_url}
                      onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website URL</Label>
                    <Input
                      value={form.website_url}
                      onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTNER_STATUSES.map(s => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Internal notes..."
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {editingPartner ? 'Update' : 'Add'} Partner
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {partners.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center text-muted-foreground">
              <Handshake className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No partners found. Add a partner to get started!</p>
            </CardContent>
          </Card>
        ) : (
          partners.map(partner => (
            <Card key={partner.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {partner.logo_url ? (
                    <img src={partner.logo_url} alt={partner.name} className="w-16 h-16 object-contain rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <Handshake className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{partner.name}</h3>
                      <Badge className={`${getStatusColor(partner.status)} text-white`}>
                        {partner.status}
                      </Badge>
                      {partner.type && (
                        <Badge variant="outline" className="capitalize">{partner.type}</Badge>
                      )}
                    </div>
                    {partner.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {partner.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {partner.contact_email && (
                        <a href={`mailto:${partner.contact_email}`} className="flex items-center gap-1 hover:text-primary">
                          <Mail className="h-3 w-3" />
                          {partner.contact_email}
                        </a>
                      )}
                      {partner.contact_phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {partner.contact_phone}
                        </span>
                      )}
                      {partner.website_url && (
                        <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                          <Globe className="h-3 w-3" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(partner)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(partner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
