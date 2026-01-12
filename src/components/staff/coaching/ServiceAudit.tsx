import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Clock, DollarSign, TrendingUp, Calculator } from "lucide-react";
import { toast } from "sonner";

interface ServiceAuditItem {
  id: string;
  service_name: string;
  category: string | null;
  price: number;
  currency: string;
  average_duration_minutes: number;
  hourly_value: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  "Analysis",
  "Coaching",
  "Conditioning",
  "Mental",
  "Nutrition",
  "Technical",
  "Tactical",
  "Representation",
  "Marketing",
  "Other"
];

const CURRENCIES = ["GBP", "EUR", "USD"];

export const ServiceAudit = () => {
  const [services, setServices] = useState<ServiceAuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceAuditItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Form state
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("GBP");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("service_audit")
        .select("*")
        .order("category", { ascending: true })
        .order("service_name", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setServiceName("");
    setCategory("");
    setPrice("");
    setCurrency("GBP");
    setDurationMinutes("60");
    setDescription("");
    setIsActive(true);
    setEditingService(null);
    setIsDialogOpen(false);
  };

  const openEdit = (service: ServiceAuditItem) => {
    setEditingService(service);
    setServiceName(service.service_name);
    setCategory(service.category || "");
    setPrice(service.price.toString());
    setCurrency(service.currency);
    setDurationMinutes(service.average_duration_minutes.toString());
    setDescription(service.description || "");
    setIsActive(service.is_active);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!serviceName.trim()) {
      toast.error("Please enter a service name");
      return;
    }

    const priceNum = parseFloat(price) || 0;
    const durationNum = parseInt(durationMinutes) || 60;

    try {
      if (editingService) {
        const { error } = await supabase
          .from("service_audit")
          .update({
            service_name: serviceName,
            category: category || null,
            price: priceNum,
            currency,
            average_duration_minutes: durationNum,
            description: description || null,
            is_active: isActive,
          })
          .eq("id", editingService.id);

        if (error) throw error;
        toast.success("Service updated");
      } else {
        const { error } = await supabase
          .from("service_audit")
          .insert({
            service_name: serviceName,
            category: category || null,
            price: priceNum,
            currency,
            average_duration_minutes: durationNum,
            description: description || null,
            is_active: isActive,
          });

        if (error) throw error;
        toast.success("Service added");
      }

      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;

    try {
      const { error } = await supabase.from("service_audit").delete().eq("id", id);
      if (error) throw error;
      toast.success("Service deleted");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const formatCurrency = (amount: number, curr: string) => {
    const symbols: Record<string, string> = { GBP: "£", EUR: "€", USD: "$" };
    return `${symbols[curr] || curr}${amount.toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const filteredServices = filterCategory === "all"
    ? services
    : services.filter(s => s.category === filterCategory);

  const activeServices = filteredServices.filter(s => s.is_active);
  const avgHourlyValue = activeServices.length > 0
    ? activeServices.reduce((sum, s) => sum + (s.hourly_value || 0), 0) / activeServices.length
    : 0;

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{services.length}</p>
                <p className="text-xs text-muted-foreground">Total Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{activeServices.length}</p>
                <p className="text-xs text-muted-foreground">Active Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">£{avgHourlyValue.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Avg Hourly Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {activeServices.length > 0
                    ? formatDuration(Math.round(activeServices.reduce((sum, s) => sum + s.average_duration_minutes, 0) / activeServices.length))
                    : "0m"}
                </p>
                <p className="text-xs text-muted-foreground">Avg Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Service Name *</label>
                <Input
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Post-Match Analysis"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="flex-1"
                    />
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (mins)</label>
                  <Input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    placeholder="60"
                  />
                </div>
              </div>

              {/* Auto-calculated hourly value preview */}
              {price && durationMinutes && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Hourly Value:</span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(
                        ((parseFloat(price) || 0) / (parseInt(durationMinutes) || 60)) * 60,
                        currency
                      )}/hr
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the service..."
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm">Active service</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={resetForm}>Cancel</Button>
                <Button onClick={handleSave}>
                  {editingService ? "Update" : "Add"} Service
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                  <TableHead className="text-right">Hourly Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id} className={!service.is_active ? "opacity-50" : ""}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.service_name}</p>
                        {service.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {service.category && (
                        <Badge variant="secondary">{service.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(service.price, service.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDuration(service.average_duration_minutes)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-primary">
                        {formatCurrency(service.hourly_value || 0, service.currency)}/hr
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.is_active ? "default" : "secondary"}>
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(service)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(service.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredServices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No services found. Add your first service to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
