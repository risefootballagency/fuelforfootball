import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Plus, Edit, Trash2, Users, ChevronDown, ChevronUp, X, Save, Loader2 } from "lucide-react";
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

interface Player {
  id: string;
  name: string;
  email: string | null;
  category: string | null;
  bio: any;
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

const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "default" },
  { value: "warm", label: "Warm Lead", color: "secondary" },
  { value: "cold", label: "Cold", color: "outline" },
  { value: "in_talks", label: "In Talks", color: "default" },
  { value: "pending", label: "Pending Decision", color: "secondary" },
  { value: "churned", label: "Churned", color: "destructive" },
  { value: "re-engaged", label: "Re-engaged", color: "default" },
  { value: "long_term", label: "Long-term Client", color: "default" },
  { value: "vip", label: "VIP", color: "default" },
];

export function RetentionTracker() {
  const [clients, setClients] = useState<RetentionClient[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client_name: "",
    client_type: "existing",
    contact_email: "",
    last_contact_year: new Date().getFullYear().toString(),
    status: "active",
    notes: "",
    services_worked: [] as string[],
    service_dates: [] as ServiceDate[],
  });

  useEffect(() => {
    fetchClients();
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    // Fetch players from shared database
    const { data, error } = await sharedSupabase
      .from("players")
      .select("id, name, email, category, bio")
      .eq("category", "Fuel For Football")
      .order("name");

    if (error) {
      console.error("Error fetching players:", error);
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
        services_worked: (c.services_worked as unknown as string[]) || [],
        service_dates: (c.service_dates as unknown as ServiceDate[]) || []
      })));
    }
    setLoading(false);
  };

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
    const player = players.find(p => p.id === playerId);
    if (player) {
      // Auto-determine type from player's is_active_client status in bio
      const isActive = player.bio?.is_active_client === true;
      setFormData(prev => ({
        ...prev,
        client_name: player.name,
        contact_email: player.email || "",
        client_type: isActive ? "existing" : "previous",
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

  const handleSubmit = async () => {
    if (!formData.client_name.trim()) {
      toast.error("Please enter a client name");
      return;
    }
    
    const payload = {
      client_name: formData.client_name,
      client_type: formData.client_type,
      contact_email: formData.contact_email || null,
      contact_phone: null as string | null,
      player_id: selectedPlayerId || null,
      last_contact_date: formData.last_contact_year ? `${formData.last_contact_year}-01-01` : null,
      next_contact_date: null as string | null,
      status: formData.status,
      notes: formData.notes || null,
      total_revenue: 0,
      services_worked: formData.services_worked,
      service_dates: JSON.parse(JSON.stringify(formData.service_dates)),
    };

    if (editingId) {
      const { error } = await supabase
        .from("retention_clients")
        .update(payload)
        .eq("id", editingId);

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
      last_contact_year: new Date().getFullYear().toString(),
      status: "active",
      notes: "",
      services_worked: [],
      service_dates: [],
    });
    setSelectedPlayerId("");
    setEditingId(null);
    setShowAddForm(false);
  };

  const startEdit = (client: RetentionClient) => {
    setEditingId(client.id);
    setSelectedPlayerId(client.player_id || "");
    const year = client.last_contact_date ? new Date(client.last_contact_date).getFullYear().toString() : new Date().getFullYear().toString();
    setFormData({
      client_name: client.client_name,
      client_type: client.client_type,
      contact_email: client.contact_email || "",
      last_contact_year: year,
      status: client.status,
      notes: client.notes || "",
      services_worked: client.services_worked || [],
      service_dates: client.service_dates || [],
    });
    setShowAddForm(true);
  };

  const updateNotes = async (clientId: string, notes: string) => {
    const { error } = await supabase
      .from("retention_clients")
      .update({ notes })
      .eq("id", clientId);

    if (!error) {
      setClients(prev => prev.map(c => c.id === clientId ? { ...c, notes } : c));
    }
  };

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find(o => o.value === status);
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      default: "default",
      secondary: "secondary",
      destructive: "destructive",
      outline: "outline",
    };
    return <Badge variant={variants[option?.color || "outline"]}>{option?.label || status}</Badge>;
  };

  const activeClients = clients.filter(c => c.status === "active" || c.status === "long_term" || c.status === "vip").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Generate year options (last 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-lg font-bold">{activeClients}</p>
                <p className="text-xs text-muted-foreground">Active Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-lg font-bold">{clients.length}</p>
                <p className="text-xs text-muted-foreground">Total Tracked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form - Inline */}
      {!showAddForm ? (
        <Button onClick={() => setShowAddForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Retention Client
        </Button>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{editingId ? "Edit Client" : "Add Retention Client"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Player Selection */}
            <div>
              <Label>Select from FFF Players</Label>
              <Select value={selectedPlayerId || "manual"} onValueChange={(v) => handlePlayerSelect(v === "manual" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Select a player..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">-- Manual Entry --</SelectItem>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">{players.length} players available</p>
            </div>

            <div>
              <Label>Client Name *</Label>
              <Input
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={formData.client_type} onValueChange={(v) => setFormData({ ...formData, client_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existing">Existing</SelectItem>
                    <SelectItem value="previous">Previous</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-0.5">Auto-filled from player status</p>
              </div>
              <div>
                <Label>Last Contact (Year)</Label>
                <Select value={formData.last_contact_year} onValueChange={(v) => setFormData({ ...formData, last_contact_year: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Services Worked */}
            <div>
              <Label className="mb-2 block">Services Worked On</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-lg p-3 bg-muted/20 max-h-48 overflow-y-auto">
                {SERVICES.map(service => {
                  const isSelected = formData.services_worked.includes(service);
                  return (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={`service-${service}`}
                        checked={isSelected}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <label htmlFor={`service-${service}`} className="text-xs cursor-pointer">
                        {service}
                      </label>
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
                rows={2}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {editingId ? "Update" : "Add"} Client
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Clients List */}
      <div className="space-y-2">
        {clients.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No retention clients yet</p>
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Collapsible 
              key={client.id}
              open={expandedClient === client.id}
              onOpenChange={(open) => setExpandedClient(open ? client.id : null)}
            >
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <CollapsibleTrigger className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{client.client_name}</p>
                        {getStatusBadge(client.status)}
                        {expandedClient === client.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1">
                        <span className="capitalize">{client.client_type}</span>
                        {client.last_contact_date && (
                          <span>Last: {new Date(client.last_contact_date).getFullYear()}</span>
                        )}
                      </div>
                    </CollapsibleTrigger>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(client)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(client.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent className="mt-3 pt-3 border-t space-y-3">
                    {/* Services */}
                    {client.services_worked && client.services_worked.length > 0 && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Services</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {client.services_worked.map(service => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Notes */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Notes</Label>
                      <Textarea
                        value={client.notes || ""}
                        onChange={(e) => updateNotes(client.id, e.target.value)}
                        placeholder="Add notes..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  </CollapsibleContent>
                </CardContent>
              </Card>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
}
