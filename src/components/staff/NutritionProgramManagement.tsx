import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { toast } from "sonner";
import {
  Apple, Plus, Trash2, Edit, Save, Calendar, Clock,
  ChevronDown, ChevronUp, UtensilsCrossed,
} from "lucide-react";

interface MealItem {
  name: string;
  portion: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  notes: string;
}

interface MealPlan {
  id: string;
  type: string; // breakfast, snack1, lunch, snack2, dinner, pre_training, post_training
  items: MealItem[];
}

interface NutritionDay {
  day: string; // monday-sunday
  meals: MealPlan[];
  totalCalories: number;
  notes: string;
}

interface NutritionProgram {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  days: NutritionDay[];
  goals: string;
  restrictions: string;
}

interface NutritionProgramManagementProps {
  playerId: string;
  playerName: string;
}

const MEAL_TYPES = [
  { id: "breakfast", label: "Breakfast" },
  { id: "snack1", label: "Morning Snack" },
  { id: "lunch", label: "Lunch" },
  { id: "snack2", label: "Afternoon Snack" },
  { id: "pre_training", label: "Pre-Training" },
  { id: "post_training", label: "Post-Training" },
  { id: "dinner", label: "Dinner" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const emptyItem = (): MealItem => ({
  name: "", portion: "", calories: "", protein: "", carbs: "", fat: "", notes: "",
});

export const NutritionProgramManagement = ({ playerId, playerName }: NutritionProgramManagementProps) => {
  const [programs, setPrograms] = useState<NutritionProgram[]>([]);
  const [activeProgram, setActiveProgram] = useState<NutritionProgram | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => { loadPrograms(); }, [playerId]);

  const loadPrograms = async () => {
    const { data } = await supabase
      .from("coaching_analysis" as any)
      .select("*")
      .eq("analysis_type", "nutrition_program")
      .eq("folder", playerId)
      .order("created_at", { ascending: false });
    if (data) {
      setPrograms(data.map((d: any) => {
        const meta = d.attachments as any || {};
        return {
          id: d.id,
          title: d.title,
          description: d.description || "",
          start_date: meta.start_date || "",
          end_date: meta.end_date || "",
          days: meta.days || [],
          goals: meta.goals || "",
          restrictions: meta.restrictions || "",
        };
      }));
    }
  };

  const handleCreate = async () => {
    if (!title) { toast.error("Title required"); return; }
    
    const initialDays: NutritionDay[] = DAYS.map(day => ({
      day: day.toLowerCase(),
      meals: MEAL_TYPES.map(mt => ({ id: crypto.randomUUID(), type: mt.id, items: [] })),
      totalCalories: 0,
      notes: "",
    }));

    const meta = {
      start_date: startDate,
      end_date: endDate,
      days: initialDays,
      goals,
      restrictions,
    };

    const { error } = await supabase.from("coaching_analysis" as any).insert({
      title,
      description,
      analysis_type: "nutrition_program",
      folder: playerId,
      attachments: meta as any,
    });
    if (error) { toast.error("Create failed"); return; }
    toast.success("Program created");
    setShowCreate(false);
    setTitle(""); setDescription(""); setGoals(""); setRestrictions("");
    setStartDate(""); setEndDate("");
    loadPrograms();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("coaching_analysis" as any).delete().eq("id", id);
    if (activeProgram?.id === id) setActiveProgram(null);
    toast.success("Deleted");
    loadPrograms();
  };

  const saveProgram = async (program: NutritionProgram) => {
    const meta = {
      start_date: program.start_date,
      end_date: program.end_date,
      days: program.days,
      goals: program.goals,
      restrictions: program.restrictions,
    };
    await supabase.from("coaching_analysis" as any)
      .update({ attachments: meta as any })
      .eq("id", program.id);
    toast.success("Saved");
  };

  const addItemToMeal = (dayIdx: number, mealIdx: number) => {
    if (!activeProgram) return;
    const updated = { ...activeProgram };
    updated.days[dayIdx].meals[mealIdx].items.push(emptyItem());
    setActiveProgram(updated);
  };

  const updateItem = (dayIdx: number, mealIdx: number, itemIdx: number, field: keyof MealItem, value: string) => {
    if (!activeProgram) return;
    const updated = { ...activeProgram };
    updated.days[dayIdx].meals[mealIdx].items[itemIdx][field] = value;
    setActiveProgram(updated);
  };

  const removeItem = (dayIdx: number, mealIdx: number, itemIdx: number) => {
    if (!activeProgram) return;
    const updated = { ...activeProgram };
    updated.days[dayIdx].meals[mealIdx].items.splice(itemIdx, 1);
    setActiveProgram(updated);
  };

  // Detail view
  if (activeProgram) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveProgram(null)}>← Back</Button>
            <h3 className="text-lg font-semibold truncate">{activeProgram.title}</h3>
          </div>
          <Button size="sm" onClick={() => saveProgram(activeProgram)}>
            <Save className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>

        {activeProgram.goals && (
          <div className="text-xs text-muted-foreground">
            <strong>Goals:</strong> {activeProgram.goals}
            {activeProgram.restrictions && <> • <strong>Restrictions:</strong> {activeProgram.restrictions}</>}
          </div>
        )}

        {/* Days */}
        {activeProgram.days.map((day, dayIdx) => (
          <Card key={day.day}>
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold capitalize">{day.day}</span>
                <span className="text-[10px] text-muted-foreground">
                  {day.meals.reduce((sum, m) => sum + m.items.length, 0)} items
                </span>
              </div>
              {expandedDay === day.day ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>

            {expandedDay === day.day && (
              <CardContent className="pt-0 space-y-3">
                {day.meals.map((meal, mealIdx) => {
                  const mealLabel = MEAL_TYPES.find(mt => mt.id === meal.type)?.label || meal.type;
                  return (
                    <div key={meal.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{mealLabel}</h4>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => addItemToMeal(dayIdx, mealIdx)}>
                          <Plus className="w-3 h-3 mr-0.5" /> Add
                        </Button>
                      </div>
                      {meal.items.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground italic">No items</p>
                      ) : (
                        meal.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="grid grid-cols-[1fr,80px,60px,60px,60px,auto] gap-1 items-center">
                            <Input
                              value={item.name}
                              onChange={e => updateItem(dayIdx, mealIdx, itemIdx, "name", e.target.value)}
                              placeholder="Food item"
                              className="h-7 text-xs"
                            />
                            <Input
                              value={item.portion}
                              onChange={e => updateItem(dayIdx, mealIdx, itemIdx, "portion", e.target.value)}
                              placeholder="Portion"
                              className="h-7 text-xs"
                            />
                            <Input
                              value={item.protein}
                              onChange={e => updateItem(dayIdx, mealIdx, itemIdx, "protein", e.target.value)}
                              placeholder="P (g)"
                              className="h-7 text-xs"
                            />
                            <Input
                              value={item.carbs}
                              onChange={e => updateItem(dayIdx, mealIdx, itemIdx, "carbs", e.target.value)}
                              placeholder="C (g)"
                              className="h-7 text-xs"
                            />
                            <Input
                              value={item.fat}
                              onChange={e => updateItem(dayIdx, mealIdx, itemIdx, "fat", e.target.value)}
                              placeholder="F (g)"
                              className="h-7 text-xs"
                            />
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeItem(dayIdx, mealIdx, itemIdx)}>
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Apple className="w-5 h-5 text-primary" />
            Nutrition — {playerName}
          </CardTitle>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-1" /> New Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        {programs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <UtensilsCrossed className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No nutrition programs yet</p>
            <p className="text-xs">Create a plan to manage meals and macros</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {programs.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => setActiveProgram(p)}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">{p.title}</p>
                  {p.description && <p className="text-xs text-muted-foreground truncate">{p.description}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={e => { e.stopPropagation(); handleDelete(p.id); }}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create dialog inline */}
        {showCreate && (
          <div className="mt-4 p-4 rounded-lg border border-primary space-y-3">
            <h3 className="text-sm font-semibold">New Nutrition Plan</h3>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Plan title *" />
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={2} />
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Start Date</Label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
              <div><Label className="text-xs">End Date</Label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
            </div>
            <Input value={goals} onChange={e => setGoals(e.target.value)} placeholder="Goals (e.g. Gain lean mass)" />
            <Input value={restrictions} onChange={e => setRestrictions(e.target.value)} placeholder="Dietary restrictions" />
            <div className="flex gap-2">
              <Button onClick={handleCreate} size="sm" className="flex-1"><Save className="w-4 h-4 mr-1" /> Create</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)} size="sm">Cancel</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
