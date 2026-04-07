import { useState, useEffect } from "react";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Users } from "lucide-react";

const POSITIONS = [
  'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB',
  'CDM', 'CM', 'CAM', 'LM', 'RM',
  'LW', 'RW', 'CF', 'ST'
];

export const METRIC_CATEGORIES = [
  {
    category: 'Shooting',
    metrics: [
      { key: 'goals_per90', label: 'Goals' },
      { key: 'npxg_per90', label: 'npxG' },
      { key: 'shots_on_target_per90', label: 'Shots On Target' },
      { key: 'on_target_pct', label: 'On Target %' },
      { key: 'created_own_shot_per90', label: 'Created Own Shot' },
      { key: 'total_shots_per90', label: 'Total Shots' },
      { key: 'shots_outside_box_per90', label: 'Shots Outside Box' },
      { key: 'shots_inside_box_per90', label: 'Shots Inside Box' },
    ]
  },
  {
    category: 'Passing',
    metrics: [
      { key: 'assists_per90', label: 'Assists' },
      { key: 'xa_per90', label: 'xA' },
      { key: 'key_passes_per90', label: 'Key Passes' },
      { key: 'xt_via_live_passes_per90', label: 'xT via Live Passes' },
      { key: 'progressive_passes_per90', label: 'Progressive Passes' },
      { key: 'passes_into_final_3rd_per90', label: 'Passes Into Final 3rd' },
      { key: 'forward_passes_per90', label: 'Forward Passes' },
      { key: 'passes_in_opp_half_per90', label: 'Passes in Opp. Half' },
      { key: 'passes_in_own_half_per90', label: 'Passes in Own Half' },
      { key: 'accurate_passes_per90', label: 'Accurate Passes' },
      { key: 'accurate_long_balls_per90', label: 'Accurate Long Balls' },
      { key: 'accurate_crosses_per90', label: 'Accurate Crosses' },
      { key: 'pass_accuracy_pct', label: 'Pass Accuracy %' },
      { key: 'long_ball_accuracy_pct', label: 'Long Ball Accuracy %' },
      { key: 'cross_accuracy_pct', label: 'Cross Accuracy %' },
    ]
  },
  {
    category: 'Possession',
    metrics: [
      { key: 'successful_dribbles_per90', label: 'Successful Dribbles' },
      { key: 'dribble_attempts_per90', label: 'Dribble Attempts' },
      { key: 'dribble_success_pct', label: 'Dribble Success %' },
      { key: 'progressive_carries_per90', label: 'Progressive Carries' },
      { key: 'xt_via_prog_carries_per90', label: 'xT via Prog. Carries' },
      { key: 'carries_into_final_3rd_per90', label: 'Carries Into Final ⅓' },
      { key: 'touches_in_opp_box_per90', label: 'Touches In Opp. Box' },
      { key: 'fouls_drawn_per90', label: 'Fouls Drawn' },
    ]
  },
  {
    category: 'Defending',
    metrics: [
      { key: 'tackles_won_pct', label: 'Tackles Won %' },
      { key: 'aerials_won_pct', label: 'Aerials Won %' },
      { key: 'duels_won_pct', label: 'Duels Won %' },
      { key: 'tackles_won_per90', label: 'Tackles Won' },
      { key: 'aerials_won_per90', label: 'Aerials Won' },
      { key: 'duels_won_per90', label: 'Duels Won' },
      { key: 'clearances_per90', label: 'Clearances' },
      { key: 'interceptions_per90', label: 'Interceptions' },
    ]
  },
];

// Goalkeeper-specific metric categories
export const GK_METRIC_CATEGORIES = [
  {
    category: 'Overall',
    metrics: [
      { key: 'gk_clean_sheets', label: 'Clean Sheets' },
      { key: 'gk_goals_conceded', label: 'Goals Conceded' },
      { key: 'gk_goals_conceded_inside_box', label: 'Goals Conceded Inside Box' },
      { key: 'gk_goals_conceded_outside_box', label: 'Goals Conceded Outside Box' },
    ]
  },
  {
    category: 'Shot Performance',
    metrics: [
      { key: 'gk_save_percentage', label: 'Save Percentage' },
      { key: 'gk_shots_on_target_faced', label: 'Shots On Target Faced' },
      { key: 'gk_saves_made', label: 'Saves Made' },
      { key: 'gk_shots_on_target_faced_inside_box', label: 'SoT Faced (Inside Box)' },
      { key: 'gk_saves_from_inside_box', label: 'Saves from Inside Box' },
      { key: 'gk_shots_on_target_faced_outside_box', label: 'SoT Faced (Outside Box)' },
      { key: 'gk_saves_from_outside_box', label: 'Saves from Outside Box' },
    ]
  },
  {
    category: 'Passing+',
    metrics: [
      { key: 'gk_touches', label: 'Touches' },
      { key: 'gk_passes_completed', label: 'Passes Completed' },
      { key: 'gk_passing_accuracy', label: 'Passing Accuracy (%)' },
      { key: 'gk_long_passes_completed', label: 'Long Passes Completed' },
      { key: 'gk_long_pass_accuracy', label: 'Long Pass Accuracy (%)' },
      { key: 'gk_passes_completed_opp_half', label: 'Passes Completed (Opp. Half)' },
      { key: 'gk_possession_lost', label: 'Possession Lost' },
      { key: 'gk_clearances', label: 'Clearances' },
      { key: 'gk_ball_recoveries', label: 'Ball Recoveries' },
    ]
  },
];

export const ALL_GK_METRICS = GK_METRIC_CATEGORIES.flatMap(c => c.metrics);

export const ALL_METRICS = METRIC_CATEGORIES.flatMap(c => c.metrics);

/** Returns the correct categories based on position */
export const getMetricCategoriesForPosition = (position?: string) => {
  if (position?.toUpperCase() === 'GK') return GK_METRIC_CATEGORIES;
  return METRIC_CATEGORIES;
};

/** Returns the correct flat metrics list based on position */
export const getMetricsForPosition = (position?: string) => {
  if (position?.toUpperCase() === 'GK') return ALL_GK_METRICS;
  return ALL_METRICS;
};

// Stub component - staff management UI not needed on this site
export const ComparisonPlayerData = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
      Comparison player data is managed on the shared platform.
    </div>
  );
};
