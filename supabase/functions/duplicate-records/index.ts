import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHARED_URL = "https://qwethimbtaamlhbajmal.supabase.co";
const SHARED_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZXRoaW1idGFhbWxoYmFqbWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODQzNDMsImV4cCI6MjA3NjM2MDM0M30.FNM354bgxhdtM4F_KGbQQnJwX7-WngaX58kPvPYnUEY";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const shared = createClient(SHARED_URL, SHARED_KEY);
    const JOE_BLOGGS_ID = "e3ae5dcd-0a67-4d49-bf04-879040c4b8c3";
    const results: string[] = [];

    // 1. Find Tyrese Omotoye's player ID
    const { data: tyresePlayer } = await shared
      .from("players")
      .select("id, name")
      .ilike("name", "%omotoye%")
      .limit(1)
      .single();

    // 2. Find Alfons Sampsted's player ID
    const { data: alfonsPlayer } = await shared
      .from("players")
      .select("id, name")
      .ilike("name", "%sampsted%")
      .limit(1)
      .single();

    // === TASK 1: Duplicate Tyrese vs Budejovice performance report ===
    if (tyresePlayer) {
      const { data: budejoviceReport } = await shared
        .from("player_analysis")
        .select("*")
        .eq("player_id", tyresePlayer.id)
        .ilike("opponent", "%budejovice%")
        .limit(1)
        .single();

      if (budejoviceReport) {
        const { id, created_at, updated_at, ...reportData } = budejoviceReport;
        const { data: newReport, error: reportErr } = await shared
          .from("player_analysis")
          .insert({ ...reportData, player_id: JOE_BLOGGS_ID })
          .select()
          .single();

        if (reportErr) {
          results.push(`❌ Budejovice report: ${reportErr.message}`);
        } else {
          results.push(`✅ Duplicated Budejovice performance report (new id: ${newReport.id})`);

          // Also duplicate the performance_report_actions
          const { data: actions } = await shared
            .from("performance_report_actions")
            .select("*")
            .eq("analysis_id", budejoviceReport.id);

          if (actions && actions.length > 0) {
            const newActions = actions.map(({ id, created_at, updated_at, ...a }) => ({
              ...a,
              analysis_id: newReport.id,
            }));
            const { error: actionsErr } = await shared
              .from("performance_report_actions")
              .insert(newActions);
            if (actionsErr) {
              results.push(`❌ Budejovice actions: ${actionsErr.message}`);
            } else {
              results.push(`✅ Duplicated ${actions.length} actions for Budejovice report`);
            }
          }
        }
      } else {
        results.push("⚠️ Could not find Tyrese vs Budejovice performance report");
      }

      // === TASK 2: Duplicate Tyrese Middelfart pre-match analysis ===
      const { data: middelfartAnalysis } = await shared
        .from("analyses")
        .select("*")
        .eq("analysis_type", "pre-match")
        .or(`home_team.ilike.%middelfart%,away_team.ilike.%middelfart%`)
        .limit(1)
        .single();

      if (middelfartAnalysis) {
        const { id, created_at, updated_at, ...analysisData } = middelfartAnalysis;
        const { data: newAnalysis, error: analysisErr } = await shared
          .from("analyses")
          .insert({ ...analysisData, player_name: "JOE BLOGGS" })
          .select()
          .single();

        if (analysisErr) {
          results.push(`❌ Middelfart pre-match: ${analysisErr.message}`);
        } else {
          results.push(`✅ Duplicated Middelfart pre-match (new id: ${newAnalysis.id})`);
        }
      } else {
        results.push("⚠️ Could not find Middelfart pre-match analysis");
      }
    } else {
      results.push("⚠️ Could not find Tyrese Omotoye player record");
    }

    // === TASK 3: Duplicate Alfons Sampsted vs Tromso ===
    if (alfonsPlayer) {
      // Check player_analysis first
      const { data: tromsoReport } = await shared
        .from("player_analysis")
        .select("*")
        .eq("player_id", alfonsPlayer.id)
        .ilike("opponent", "%troms%")
        .limit(1)
        .single();

      if (tromsoReport) {
        const { id, created_at, updated_at, ...reportData } = tromsoReport;
        const { data: newReport, error: reportErr } = await shared
          .from("player_analysis")
          .insert({ ...reportData, player_id: JOE_BLOGGS_ID })
          .select()
          .single();

        if (reportErr) {
          results.push(`❌ Tromso report: ${reportErr.message}`);
        } else {
          results.push(`✅ Duplicated Tromso performance report (new id: ${newReport.id})`);

          // Also duplicate actions
          const { data: actions } = await shared
            .from("performance_report_actions")
            .select("*")
            .eq("analysis_id", tromsoReport.id);

          if (actions && actions.length > 0) {
            const newActions = actions.map(({ id, created_at, updated_at, ...a }) => ({
              ...a,
              analysis_id: newReport.id,
            }));
            const { error: actionsErr } = await shared
              .from("performance_report_actions")
              .insert(newActions);
            if (actionsErr) {
              results.push(`❌ Tromso actions: ${actionsErr.message}`);
            } else {
              results.push(`✅ Duplicated ${actions.length} actions for Tromso report`);
            }
          }
        }
      } else {
        // Try analyses table
        const { data: tromsoAnalysis } = await shared
          .from("analyses")
          .select("*")
          .or(`home_team.ilike.%troms%,away_team.ilike.%troms%`)
          .limit(1)
          .single();

        if (tromsoAnalysis) {
          const { id, created_at, updated_at, ...analysisData } = tromsoAnalysis;
          const { data: newAnalysis, error: analysisErr } = await shared
            .from("analyses")
            .insert({ ...analysisData, player_name: "JOE BLOGGS" })
            .select()
            .single();

          if (analysisErr) {
            results.push(`❌ Tromso analysis: ${analysisErr.message}`);
          } else {
            results.push(`✅ Duplicated Tromso analysis (new id: ${newAnalysis.id})`);
          }
        } else {
          results.push("⚠️ Could not find Alfons vs Tromso in either table");
        }
      }
    } else {
      results.push("⚠️ Could not find Alfons Sampsted player record");
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
