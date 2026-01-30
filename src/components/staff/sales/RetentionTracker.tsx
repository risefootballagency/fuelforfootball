import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { Plus, Edit, Trash2, Users, Target, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

interface ServiceDate {
  service: string;
  start_date: string | null;
  end_date: string | null;
}

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
  services_worked: string[];
  service_dates: ServiceDate[];
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

interface Player {
  id: string;
  name: string;
  email: string | null;
  category: string | null;
}

const SERVICES = [
  "Analysis",
  "Action Reports",
  "Efficiency Reports",
  "Technical Training",
  "Strength Power & Speed",
  "Conditioning",
  "Nutrition",
  "Mental Performance",
  "Mentorship",
  "Consultation",
  "Pro Performance Programme",
  "Elite Performance Programme"
];

export function RetentionTracker() {
  const [clients, setClients] = useState<RetentionClient[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [targets, setTargets] = useState<RetentionTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetDialogOpen, setTargetDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<RetentionClient | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
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
    services_worked: [] as string[],
    service_dates: [] as ServiceDate[],
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
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from("players")
      .select("id, name, email, category")
      .eq("category", "Fuel For Football")
      .order("name");

    if (error) {
      console.error("Error fetching players:", error);
      toast.error("Failed to fetch players");
    } else {
      setPlayers(data || []);
    }
  };

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("retention_clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients");
    } else {
      setClients((data || []).map(c => ({
        ...c,
        services_worked: c.services_worked || [],
        service_dates: c.service_dates || []
      })));
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

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
    const player = players.find(p => p.id === playerId);
    if (player) {
      setFormData(prev => ({
        ...prev,
        client_name: player.name,
        contact_email: player.email || "",
      }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => {
      const exists = prev.services_worked.includes(service);
      if (exists) {
        return {
          ...prev,
          services_worked: prev.services_worked.filter(s => s !== service),
          service_dates: prev.service_dates.filter(sd => sd.service !== service)
        };
      } else {
        return {
          ...prev,
          services_worked: [...prev.services_worked, service],
          service_dates: [...prev.service_dates, { service, start_date: null, end_date: null }]
        };
      }
    });
  };

  const handleServiceDateChange = (service: string, field: 'start_date' | 'end_date', value: string) => {
    setFormData(prev => ({
      ...prev,
      service_dates: prev.service_dates.map(sd => 
        sd.service === service ? { ...sd, [field]: value || null } : sd
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      client_name: formData.client_name,
      client_type: formData.client_type,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      player_id: selectedPlayerId || null,
      last_contact_date: formData.last_contact_date || null,
      next_contact_date: formData.next_contact_date || null,
      status: formData.status,
      notes: formData.notes || null,
      total_revenue: formData.total_revenue,
      services_worked: formData.services_worked,
      service_dates: formData.service_dates,
    };

    if (editingClient) {
      const { error } = await supabase
        .from("retention_clients")
        .update(payload)
        .eq("id", editingClient.id);

      if (error) {
        console.error("Update error:", error);
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
        console.error("Insert error:", error);
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
      services_worked: [],
      service_dates: [],
    });
    setSelectedPlayerId("");
    setEditingClient(null);
  };

  const openEditDialog = (client: RetentionClient) => {
    setEditingClient(client);
    setSelectedPlayerId(client.player_id || "");
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
      services_worked: client.services_worked || [],
      service_dates: client.service_dates || [],
    });
    setDialogOpen(true);
  };

  const activeClients = clients.filter(c => c.status === "active").length;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      churned: "destructive",
      "re-engaged": "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards - Mobile optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Users className="h-5 w-5 sm:h-8 sm:w-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{activeClients}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Target className="h-5 w-5 sm:h-8 sm:w-8 text-orange-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{targets?.outreach_actual || 0}/{targets?.outreach_target || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Outreach</p>
              </div>
            </div>
            {targets && targets.outreach_target > 0 && (
              <Progress value={(targets.outreach_actual / targets.outreach_target) * 100} className="mt-2 h-1.5 sm:h-2" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 text-green-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-lg sm:text-2xl font-bold">{targets?.conversion_actual || 0}/{targets?.conversion_target || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Conversions</p>
              </div>
            </div>
            {targets && targets.conversion_target > 0 && (
              <Progress value={(targets.conversion_actual / targets.conversion_target) * 100} className="mt-2 h-1.5 sm:h-2" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold">£{(targets?.sales_actual || 0).toLocaleString()}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">/ £{(targets?.sales_target || 0).toLocaleString()}</p>
            </div>
            {targets && targets.sales_target > 0 && (
              <Progress value={(targets.sales_actual / targets.sales_target) * 100} className="mt-2 h-1.5 sm:h-2" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions - Stack on mobile */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" /> Add Client</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingClient ? "Edit Client" : "Add Retention Client"}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 pr-4">
              <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                {/* Player Selection */}
                <div>
                  <Label>Select from FFF Players</Label>
                  <Select value={selectedPlayerId} onValueChange={handlePlayerSelect}>
                    <SelectTrigger><SelectValue placeholder="Select a player..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- Manual Entry --</SelectItem>
                      {players.map(player => (
                        <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {players.length} players in Fuel For Football category
                  </p>
                </div>

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

                {/* Services Worked */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    Services Worked On
                  </Label>
                  <div className="space-y-3 border rounded-lg p-3 bg-muted/20">
                    {SERVICES.map(service => {
                      const isSelected = formData.services_worked.includes(service);
                      const serviceDate = formData.service_dates.find(sd => sd.service === service);
                      
                      return (
                        <div key={service} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`service-${service}`}
                              checked={isSelected}
                              onCheckedChange={() => handleServiceToggle(service)}
                            />
                            <label
                              htmlFor={`service-${service}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {service}
                            </label>
                          </div>
                          {isSelected && (
                            <div className="grid grid-cols-2 gap-2 ml-6">
                              <div>
                                <Label className="text-xs text-muted-foreground">Start</Label>
                                <Input
                                  type="date"
                                  className="h-8 text-xs"
                                  value={serviceDate?.start_date || ""}
                                  onChange={(e) => handleServiceDateChange(service, 'start_date', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground">End</Label>
                                <Input
                                  type="date"
                                  className="h-8 text-xs"
                                  value={serviceDate?.end_date || ""}
                                  onChange={(e) => handleServiceDateChange(service, 'end_date', e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog open={targetDialogOpen} onOpenChange={setTargetDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto"><Target className="h-4 w-4 mr-2" /> Set Targets</Button>
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

      {/* Clients List - Mobile Card Layout */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Retention Clients</CardTitle>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          {clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No retention clients yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clients.map((client) => (
                <div key={client.id} className="border rounded-lg p-3 sm:p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{client.client_name}</p>
                      {client.contact_email && (
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{client.contact_email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {getStatusBadge(client.status)}
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(client)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(client.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Services */}
                  {client.services_worked && client.services_worked.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {client.services_worked.map(service => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Info Row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                    <span className="capitalize">{client.client_type}</span>
                    {client.last_contact_date && (
                      <span>Last: {format(parseISO(client.last_contact_date), "dd MMM")}</span>
                    )}
                    {client.next_contact_date && (
                      <span>Next: {format(parseISO(client.next_contact_date), "dd MMM")}</span>
                    )}
                    <span className="font-medium text-foreground">£{(client.total_revenue || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
