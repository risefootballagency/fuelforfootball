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
import { Plus, Edit, Trash2, UserPlus, Phone, MessageSquare, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { format, parseISO, subMonths, addMonths } from "date-fns";

interface OutreachProspect {
  id: string;
  prospect_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  source: string | null;
  status: string;
  last_contact_date: string | null;
  next_follow_up: string | null;
  notes: string | null;
  created_at: string;
}

interface OutreachTarget {
  id: string;
  month: string;
  new_prospects_target: number;
  follow_ups_target: number;
  conversions_target: number;
  new_prospects_actual: number;
  follow_ups_actual: number;
  conversions_actual: number;
}

export function OutreachTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prospects, setProspects] = useState<OutreachProspect[]>([]);
  const [targets, setTargets] = useState<OutreachTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetDialogOpen, setTargetDialogOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState<OutreachProspect | null>(null);
  const [formData, setFormData] = useState({
    prospect_name: "",
    contact_email: "",
    contact_phone: "",
    source: "",
    status: "new",
    last_contact_date: "",
    next_follow_up: "",
    notes: "",
  });
  const [targetData, setTargetData] = useState({
    new_prospects_target: 0,
    follow_ups_target: 0,
    conversions_target: 0,
  });

  const currentMonth = format(currentDate, "yyyy-MM");

  useEffect(() => {
    fetchProspects();
    fetchTargets();
  }, [currentMonth]);

  const fetchProspects = async () => {
    const { data, error } = await supabase
      .from("outreach_prospects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch prospects");
    } else {
      setProspects(data || []);
    }
    setLoading(false);
  };

  const fetchTargets = async () => {
    const { data } = await supabase
      .from("outreach_targets")
      .select("*")
      .eq("month", currentMonth)
      .single();

    if (data) {
      setTargets(data);
      setTargetData({
        new_prospects_target: data.new_prospects_target,
        follow_ups_target: data.follow_ups_target,
        conversions_target: data.conversions_target,
      });
    } else {
      setTargets(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      contact_email: formData.contact_email || null,
      contact_phone: formData.contact_phone || null,
      source: formData.source || null,
      last_contact_date: formData.last_contact_date || null,
      next_follow_up: formData.next_follow_up || null,
      notes: formData.notes || null,
    };

    if (editingProspect) {
      const { error } = await supabase
        .from("outreach_prospects")
        .update(payload)
        .eq("id", editingProspect.id);

      if (error) {
        toast.error("Failed to update prospect");
      } else {
        toast.success("Prospect updated");
        fetchProspects();
      }
    } else {
      const { error } = await supabase
        .from("outreach_prospects")
        .insert(payload);

      if (error) {
        toast.error("Failed to add prospect");
      } else {
        toast.success("Prospect added");
        fetchProspects();
        // Update actual count
        if (targets) {
          await supabase
            .from("outreach_targets")
            .update({ new_prospects_actual: targets.new_prospects_actual + 1 })
            .eq("month", currentMonth);
          fetchTargets();
        }
      }
    }

    resetForm();
    setDialogOpen(false);
  };

  const handleTargetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (targets) {
      const { error } = await supabase
        .from("outreach_targets")
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
        .from("outreach_targets")
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

  const handleStatusChange = async (prospect: OutreachProspect, newStatus: string) => {
    const { error } = await supabase
      .from("outreach_prospects")
      .update({ 
        status: newStatus,
        last_contact_date: format(new Date(), "yyyy-MM-dd"),
      })
      .eq("id", prospect.id);

    if (!error) {
      toast.success("Status updated");
      fetchProspects();

      // Update targets
      if (targets) {
        if (newStatus === "follow_up" || newStatus === "meeting_scheduled") {
          await supabase
            .from("outreach_targets")
            .update({ follow_ups_actual: targets.follow_ups_actual + 1 })
            .eq("month", currentMonth);
        } else if (newStatus === "converted") {
          await supabase
            .from("outreach_targets")
            .update({ conversions_actual: targets.conversions_actual + 1 })
            .eq("month", currentMonth);
        }
        fetchTargets();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prospect?")) return;
    
    const { error } = await supabase
      .from("outreach_prospects")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete prospect");
    } else {
      toast.success("Prospect deleted");
      fetchProspects();
    }
  };

  const resetForm = () => {
    setFormData({
      prospect_name: "",
      contact_email: "",
      contact_phone: "",
      source: "",
      status: "new",
      last_contact_date: "",
      next_follow_up: "",
      notes: "",
    });
    setEditingProspect(null);
  };

  const openEditDialog = (prospect: OutreachProspect) => {
    setEditingProspect(prospect);
    setFormData({
      prospect_name: prospect.prospect_name,
      contact_email: prospect.contact_email || "",
      contact_phone: prospect.contact_phone || "",
      source: prospect.source || "",
      status: prospect.status,
      last_contact_date: prospect.last_contact_date || "",
      next_follow_up: prospect.next_follow_up || "",
      notes: prospect.notes || "",
    });
    setDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "outline",
      contacted: "secondary",
      follow_up: "default",
      meeting_scheduled: "default",
      converted: "default",
      lost: "destructive",
    };
    const labels: Record<string, string> = {
      new: "New",
      contacted: "Contacted",
      follow_up: "Follow Up",
      meeting_scheduled: "Meeting",
      converted: "Converted",
      lost: "Lost",
    };
    return <Badge variant={variants[status] || "outline"}>{labels[status] || status}</Badge>;
  };

  const prospectsProgress = targets && targets.new_prospects_target > 0 
    ? (targets.new_prospects_actual / targets.new_prospects_target) * 100 : 0;
  const followUpsProgress = targets && targets.follow_ups_target > 0 
    ? (targets.follow_ups_actual / targets.follow_ups_target) * 100 : 0;
  const conversionsProgress = targets && targets.conversions_target > 0 
    ? (targets.conversions_actual / targets.conversions_target) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Target Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:pt-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <UserPlus className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" />
              <div>
                <p className="text-base sm:text-2xl font-bold">{targets?.new_prospects_actual || 0}/{targets?.new_prospects_target || 0}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Prospects</p>
              </div>
            </div>
            <Progress value={Math.min(100, prospectsProgress)} className="h-1.5 sm:h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:pt-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <Phone className="h-4 w-4 sm:h-6 sm:w-6 text-orange-500" />
              <div>
                <p className="text-base sm:text-2xl font-bold">{targets?.follow_ups_actual || 0}/{targets?.follow_ups_target || 0}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Follow Ups</p>
              </div>
            </div>
            <Progress value={Math.min(100, followUpsProgress)} className="h-1.5 sm:h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:pt-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <MessageSquare className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
              <div>
                <p className="text-base sm:text-2xl font-bold">{targets?.conversions_actual || 0}/{targets?.conversions_target || 0}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Conversions</p>
              </div>
            </div>
            <Progress value={Math.min(100, conversionsProgress)} className="h-1.5 sm:h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Prospect</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProspect ? "Edit Prospect" : "Add Prospect"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={formData.prospect_name}
                  onChange={(e) => setFormData({ ...formData, prospect_name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Source</Label>
                  <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v })}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                      <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  <Label>Next Follow Up</Label>
                  <Input
                    type="date"
                    value={formData.next_follow_up}
                    onChange={(e) => setFormData({ ...formData, next_follow_up: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">{editingProspect ? "Update" : "Add"} Prospect</Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={targetDialogOpen} onOpenChange={setTargetDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><Target className="h-4 w-4 mr-2" /> Set Targets</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Targets for {format(currentDate, "MMMM yyyy")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleTargetSubmit} className="space-y-4">
              <div>
                <Label>New Prospects Target</Label>
                <Input
                  type="number"
                  value={targetData.new_prospects_target}
                  onChange={(e) => setTargetData({ ...targetData, new_prospects_target: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Follow Ups Target</Label>
                <Input
                  type="number"
                  value={targetData.follow_ups_target}
                  onChange={(e) => setTargetData({ ...targetData, follow_ups_target: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Conversions Target</Label>
                <Input
                  type="number"
                  value={targetData.conversions_target}
                  onChange={(e) => setTargetData({ ...targetData, conversions_target: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button type="submit" className="w-full">Save Targets</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Prospects Table - Mobile Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Prospects</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="hidden sm:table-cell text-xs">Source</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="hidden md:table-cell text-xs">Last</TableHead>
                <TableHead className="hidden md:table-cell text-xs">Next</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prospects.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell className="max-w-[120px]">
                    <div>
                      <p className="font-medium text-xs sm:text-sm truncate">{prospect.prospect_name}</p>
                      {prospect.contact_email && (
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{prospect.contact_email}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell capitalize text-xs">{prospect.source || "-"}</TableCell>
                  <TableCell>
                    <Select 
                      value={prospect.status} 
                      onValueChange={(v) => handleStatusChange(prospect, v)}
                    >
                      <SelectTrigger className="w-20 sm:w-32 h-7 sm:h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="follow_up">Follow Up</SelectItem>
                        <SelectItem value="meeting_scheduled">Meeting</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs">
                    {prospect.last_contact_date ? format(parseISO(prospect.last_contact_date), "dd MMM") : "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs">
                    {prospect.next_follow_up ? format(parseISO(prospect.next_follow_up), "dd MMM") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(prospect)}>
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(prospect.id)}>
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {prospects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-sm">
                    No prospects yet. Add your first prospect above.
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
