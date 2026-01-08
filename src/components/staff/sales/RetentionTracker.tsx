import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Users, Target, TrendingUp } from "lucide-react";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

interface RetentionClient {
  id: string;
  client_name: string;
  client_type: string;
  contact_email: string | null;
  contact_phone: string | null;
  player_id: string | null;
  last_contact_date: string | null;
  next_contact_date: string | null;
  status: string;
  notes: string | null;
  total_revenue: number;
  created_at: string;
}

interface RetentionTarget {
  id: string;
  month: string;
  outreach_target: number;
  conversion_target: number;
  sales_target: number;
  outreach_actual: number;
  conversion_actual: number;
  sales_actual: number;
}

export function RetentionTracker() {
  const [clients, setClients] = useState<RetentionClient[]>([]);
  const [targets, setTargets] = useState<RetentionTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetDialogOpen, setTargetDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<RetentionClient | null>(null);
  const [formData, setFormData] = useState({
    client_name: "",
    client_type: "existing",
    contact_email: "",
    contact_phone: "",
    last_contact_date: "",
    next_contact_date: "",
    status: "active",
    notes: "",
    total_revenue: 0,
  });
  const [targetData, setTargetData] = useState({
    outreach_target: 0,
    conversion_target: 0,
    sales_target: 0,
  });

  const currentMonth = format(new Date(), "yyyy-MM");

  useEffect(() => {
    fetchClients();
    fetchTargets();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("retention_clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch clients");
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  const fetchTargets = async () => {
    const { data, error } = await supabase
      .from("retention_targets")
      .select("*")
      .eq("month", currentMonth)
      .single();

    if (data) {
      setTargets(data);
      setTargetData({
        outreach_target: data.outreach_target,
        conversion_target: data.conversion_target,
        sales_target: data.sales_target,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      last_contact_date: formData.last_contact_date || null,
      next_contact_date: formData.next_contact_date || null,
      notes: formData.notes || null,
    };

    if (editingClient) {
      const { error } = await supabase
        .from("retention_clients")
        .update(payload)
        .eq("id", editingClient.id);

      if (error) {
        toast.error("Failed to update client");
      } else {
        toast.success("Client updated");
        fetchClients();
      }
    } else {
      const { error } = await supabase
        .from("retention_clients")
        .insert(payload);

      if (error) {
        toast.error("Failed to add client");
      } else {
        toast.success("Client added");
        fetchClients();
      }
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleTargetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: existing } = await supabase
      .from("retention_targets")
      .select("id")
      .eq("month", currentMonth)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("retention_targets")
        .update(targetData)
        .eq("month", currentMonth);

      if (error) {
        toast.error("Failed to update targets");
      } else {
        toast.success("Targets updated");
        fetchTargets();
      }
    } else {
      const { error } = await supabase
        .from("retention_targets")
        .insert({ ...targetData, month: currentMonth });

      if (error) {
        toast.error("Failed to set targets");
      } else {
        toast.success("Targets set");
        fetchTargets();
      }
    }

    setTargetDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    
    const { error } = await supabase
      .from("retention_clients")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete client");
    } else {
      toast.success("Client deleted");
      fetchClients();
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: "",
      client_type: "existing",
      contact_email: "",
      contact_phone: "",
      last_contact_date: "",
      next_contact_date: "",
      status: "active",
      notes: "",
      total_revenue: 0,
    });
    setEditingClient(null);
  };

  const openEditDialog = (client: RetentionClient) => {
    setEditingClient(client);
    setFormData({
      client_name: client.client_name,
      client_type: client.client_type,
      contact_email: client.contact_email || "",
      contact_phone: client.contact_phone || "",
      last_contact_date: client.last_contact_date || "",
      next_contact_date: client.next_contact_date || "",
      status: client.status,
      notes: client.notes || "",
      total_revenue: client.total_revenue || 0,
    });
    setDialogOpen(true);
  };

  const activeClients = clients.filter(c => c.status === "active").length;
  const churnedClients = clients.filter(c => c.status === "churned").length;
  const reEngagedClients = clients.filter(c => c.status === "re-engaged").length;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      churned: "destructive",
      "re-engaged": "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{activeClients}</p>
                <p className="text-sm text-muted-foreground">Active Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{targets?.outreach_actual || 0}/{targets?.outreach_target || 0}</p>
                <p className="text-sm text-muted-foreground">Outreach This Month</p>
              </div>
            </div>
            {targets && targets.outreach_target > 0 && (
              <Progress value={(targets.outreach_actual / targets.outreach_target) * 100} className="mt-2" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{targets?.conversion_actual || 0}/{targets?.conversion_target || 0}</p>
                <p className="text-sm text-muted-foreground">Conversions</p>
              </div>
            </div>
            {targets && targets.conversion_target > 0 && (
              <Progress value={(targets.conversion_actual / targets.conversion_target) * 100} className="mt-2" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="text-2xl">£</div>
              <div>
                <p className="text-2xl font-bold">£{(targets?.sales_actual || 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">/ £{(targets?.sales_target || 0).toLocaleString()} target</p>
              </div>
            </div>
            {targets && targets.sales_target > 0 && (
              <Progress value={(targets.sales_actual / targets.sales_target) * 100} className="mt-2" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Client</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingClient ? "Edit Client" : "Add Client"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Client Name *</Label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={formData.client_type} onValueChange={(v) => setFormData({ ...formData, client_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="existing">Existing</SelectItem>
                      <SelectItem value="previous">Previous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="churned">Churned</SelectItem>
                      <SelectItem value="re-engaged">Re-engaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Last Contact</Label>
                  <Input
                    type="date"
                    value={formData.last_contact_date}
                    onChange={(e) => setFormData({ ...formData, last_contact_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Next Contact</Label>
                  <Input
                    type="date"
                    value={formData.next_contact_date}
                    onChange={(e) => setFormData({ ...formData, next_contact_date: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Total Revenue (£)</Label>
                <Input
                  type="number"
                  value={formData.total_revenue}
                  onChange={(e) => setFormData({ ...formData, total_revenue: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">{editingClient ? "Update" : "Add"} Client</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={targetDialogOpen} onOpenChange={setTargetDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><Target className="h-4 w-4 mr-2" /> Set Targets</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Monthly Targets - {format(new Date(), "MMMM yyyy")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleTargetSubmit} className="space-y-4">
              <div>
                <Label>Outreach Target</Label>
                <Input
                  type="number"
                  value={targetData.outreach_target}
                  onChange={(e) => setTargetData({ ...targetData, outreach_target: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Conversion Target</Label>
                <Input
                  type="number"
                  value={targetData.conversion_target}
                  onChange={(e) => setTargetData({ ...targetData, conversion_target: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Sales Target (£)</Label>
                <Input
                  type="number"
                  value={targetData.sales_target}
                  onChange={(e) => setTargetData({ ...targetData, sales_target: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button type="submit" className="w-full">Save Targets</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Retention Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Next Contact</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.client_name}</p>
                      {client.contact_email && (
                        <p className="text-sm text-muted-foreground">{client.contact_email}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{client.client_type}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>
                    {client.last_contact_date ? format(parseISO(client.last_contact_date), "dd MMM yyyy") : "-"}
                  </TableCell>
                  <TableCell>
                    {client.next_contact_date ? format(parseISO(client.next_contact_date), "dd MMM yyyy") : "-"}
                  </TableCell>
                  <TableCell>£{(client.total_revenue || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {clients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No clients yet. Add your first client above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
