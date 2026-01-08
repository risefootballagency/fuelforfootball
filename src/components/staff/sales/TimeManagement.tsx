import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Clock, TrendingUp, DollarSign, Calculator } from "lucide-react";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

interface TimeEntry {
  id: string;
  service_type: string;
  player_id: string | null;
  player_name: string | null;
  date: string;
  duration_minutes: number;
  fee_received: number;
  currency: string;
  notes: string | null;
  created_at: string;
}

interface Player {
  id: string;
  name: string;
}

const SERVICE_TYPES = [
  "Performance Analysis",
  "Coaching Session",
  "Programme Creation",
  "Highlight Reel",
  "Club Outreach",
  "Contract Work",
  "Administrative",
  "Marketing",
  "Other",
];

export function TimeManagement() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [formData, setFormData] = useState({
    service_type: "",
    player_id: "",
    player_name: "",
    date: format(new Date(), "yyyy-MM-dd"),
    duration_minutes: 60,
    fee_received: 0,
    currency: "GBP",
    notes: "",
  });

  useEffect(() => {
    fetchEntries();
    fetchPlayers();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("service_time_tracking")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast.error("Failed to fetch time entries");
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  const fetchPlayers = async () => {
    const { data } = await supabase
      .from("players")
      .select("id, name")
      .order("name");

    setPlayers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPlayer = players.find(p => p.id === formData.player_id);
    const payload = {
      service_type: formData.service_type,
      player_id: formData.player_id || null,
      player_name: selectedPlayer?.name || formData.player_name || null,
      date: formData.date,
      duration_minutes: formData.duration_minutes,
      fee_received: formData.fee_received,
      currency: formData.currency,
      notes: formData.notes || null,
    };

    if (editingEntry) {
      const { error } = await supabase
        .from("service_time_tracking")
        .update(payload)
        .eq("id", editingEntry.id);

      if (error) {
        toast.error("Failed to update entry");
      } else {
        toast.success("Entry updated");
        fetchEntries();
      }
    } else {
      const { error } = await supabase
        .from("service_time_tracking")
        .insert(payload);

      if (error) {
        toast.error("Failed to add entry");
      } else {
        toast.success("Entry added");
        fetchEntries();
      }
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;

    const { error } = await supabase
      .from("service_time_tracking")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete entry");
    } else {
      toast.success("Entry deleted");
      fetchEntries();
    }
  };

  const resetForm = () => {
    setFormData({
      service_type: "",
      player_id: "",
      player_name: "",
      date: format(new Date(), "yyyy-MM-dd"),
      duration_minutes: 60,
      fee_received: 0,
      currency: "GBP",
      notes: "",
    });
    setEditingEntry(null);
  };

  const openEditDialog = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setFormData({
      service_type: entry.service_type,
      player_id: entry.player_id || "",
      player_name: entry.player_name || "",
      date: entry.date,
      duration_minutes: entry.duration_minutes,
      fee_received: entry.fee_received,
      currency: entry.currency,
      notes: entry.notes || "",
    });
    setDialogOpen(true);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const calculateHourlyRate = (fee: number, minutes: number) => {
    if (minutes === 0) return 0;
    return (fee / minutes) * 60;
  };

  // Calculate stats
  const totalMinutes = entries.reduce((sum, e) => sum + e.duration_minutes, 0);
  const totalFees = entries.reduce((sum, e) => sum + e.fee_received, 0);
  const avgHourlyRate = totalMinutes > 0 ? calculateHourlyRate(totalFees, totalMinutes) : 0;

  // Group by service type for insights
  const byServiceType = entries.reduce((acc, e) => {
    if (!acc[e.service_type]) {
      acc[e.service_type] = { minutes: 0, fees: 0, count: 0 };
    }
    acc[e.service_type].minutes += e.duration_minutes;
    acc[e.service_type].fees += e.fee_received;
    acc[e.service_type].count += 1;
    return acc;
  }, {} as Record<string, { minutes: number; fees: number; count: number }>);

  const serviceTypeStats = Object.entries(byServiceType)
    .map(([type, stats]) => ({
      type,
      ...stats,
      hourlyRate: calculateHourlyRate(stats.fees, stats.minutes),
    }))
    .sort((a, b) => b.hourlyRate - a.hourlyRate);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{formatDuration(totalMinutes)}</p>
                <p className="text-sm text-muted-foreground">Total Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">£{totalFees.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">£{avgHourlyRate.toFixed(0)}/hr</p>
                <p className="text-sm text-muted-foreground">Avg Hourly Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calculator className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{entries.length}</p>
                <p className="text-sm text-muted-foreground">Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Type Breakdown */}
      {serviceTypeStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Value by Service Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {serviceTypeStats.map((stat) => (
                <div key={stat.type} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{stat.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.count} entries · {formatDuration(stat.minutes)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">£{stat.hourlyRate.toFixed(0)}/hr</p>
                    <p className="text-sm text-muted-foreground">£{stat.fees.toLocaleString()} total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Entry */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogTrigger asChild>
          <Button><Plus className="h-4 w-4 mr-2" /> Log Time</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Entry" : "Log Time"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Service Type *</Label>
              <Select value={formData.service_type} onValueChange={(v) => setFormData({ ...formData, service_type: v })}>
                <SelectTrigger><SelectValue placeholder="Select service..." /></SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Player (Optional)</Label>
              <Select value={formData.player_id} onValueChange={(v) => setFormData({ ...formData, player_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select player..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No player</SelectItem>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fee Received</Label>
                <Input
                  type="number"
                  value={formData.fee_received}
                  onChange={(e) => setFormData({ ...formData, fee_received: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formData.duration_minutes > 0 && (
              <div className="p-3 rounded-lg bg-primary/10 text-center">
                <p className="text-sm text-muted-foreground">Effective hourly rate</p>
                <p className="text-xl font-bold text-primary">
                  £{calculateHourlyRate(formData.fee_received, formData.duration_minutes).toFixed(0)}/hr
                </p>
              </div>
            )}
            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">{editingEntry ? "Update" : "Log"} Entry</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Player</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>£/hr</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(parseISO(entry.date), "dd MMM yyyy")}</TableCell>
                  <TableCell>{entry.service_type}</TableCell>
                  <TableCell>{entry.player_name || "-"}</TableCell>
                  <TableCell>{formatDuration(entry.duration_minutes)}</TableCell>
                  <TableCell>£{entry.fee_received.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">
                    £{calculateHourlyRate(entry.fee_received, entry.duration_minutes).toFixed(0)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No time entries yet. Start logging your time above.
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
