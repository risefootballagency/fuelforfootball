import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image_url: string | null;
  badge: string | null;
  ribbon: string | null;
  visible: boolean;
  display_order: number;
  options: any;
}

const categories = [
  "All in One Services",
  "Analysis Services",
  "Technical Services",
  "Physical Services",
  "Nutrition Services",
  "Psychological Services",
  "Coaching Services",
  "Data Services",
  "Special Packages",
  "Other",
];

interface ServiceCatalogManagementProps {
  isAdmin: boolean;
}

export const ServiceCatalogManagement = ({ isAdmin }: ServiceCatalogManagementProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Other",
    price: 0,
    image_url: "",
    badge: "",
    ribbon: "",
    visible: true,
  });

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_catalog')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      category: service.category,
      price: service.price,
      image_url: service.image_url || "",
      badge: service.badge || "",
      ribbon: service.ribbon || "",
      visible: service.visible,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      category: "Other",
      price: 0,
      image_url: "",
      badge: "",
      ribbon: "",
      visible: true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingService) {
        const { error } = await supabase
          .from('service_catalog')
          .update({
            name: formData.name,
            description: formData.description || null,
            category: formData.category,
            price: formData.price,
            image_url: formData.image_url || null,
            badge: formData.badge || null,
            ribbon: formData.ribbon || null,
            visible: formData.visible,
          })
          .eq('id', editingService.id);

        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        const { error } = await supabase
          .from('service_catalog')
          .insert({
            name: formData.name,
            description: formData.description || null,
            category: formData.category,
            price: formData.price,
            image_url: formData.image_url || null,
            badge: formData.badge || null,
            ribbon: formData.ribbon || null,
            visible: formData.visible,
            display_order: services.length,
          });

        if (error) throw error;
        toast.success('Service created successfully');
      }

      setIsDialogOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('service_catalog')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Service deleted');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const { error } = await supabase
        .from('service_catalog')
        .update({ visible: !currentVisible })
        .eq('id', id);

      if (error) throw error;
      toast.success(currentVisible ? 'Service hidden' : 'Service visible');
      fetchServices();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bebas uppercase tracking-wider">Service Catalog</h2>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-bebas uppercase tracking-wider text-sm">Name</th>
              <th className="text-left p-3 font-bebas uppercase tracking-wider text-sm">Category</th>
              <th className="text-left p-3 font-bebas uppercase tracking-wider text-sm">Price</th>
              <th className="text-left p-3 font-bebas uppercase tracking-wider text-sm">Status</th>
              <th className="text-right p-3 font-bebas uppercase tracking-wider text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <span className="font-medium">{service.name}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground text-sm">{service.category}</td>
                <td className="p-3">£{service.price.toLocaleString()}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${service.visible ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                    {service.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {service.visible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleVisibility(service.id, service.visible)}>
                      {service.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {services.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No services yet. Add your first service to get started.
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl uppercase tracking-wider">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Service name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (£)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge">Badge Text</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="CUSTOM BADGE"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ribbon">Ribbon (e.g., New Arrival)</Label>
                <Input
                  id="ribbon"
                  value={formData.ribbon}
                  onChange={(e) => setFormData({ ...formData, ribbon: e.target.value })}
                  placeholder="New Arrival"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (HTML supported)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Service description..."
                rows={6}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="visible"
                checked={formData.visible}
                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
              />
              <Label htmlFor="visible">Visible to customers</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
