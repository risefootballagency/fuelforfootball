import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Shared database credentials
const SHARED_SUPABASE_URL = 'https://qwethimbtaamlhbajmal.supabase.co';
const SHARED_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZXRoaW1idGFhbWxoYmFqbWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODQzNDMsImV4cCI6MjA3NjM2MDM0M30.FNM354bgxhdtM4F_KGbQQnJwX7-WngaX58kPvPYnUEY';

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { programme } = await req.json();
    
    if (!programme) {
      return new Response(
        JSON.stringify({ error: "Programme data required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sharedSupabase = createClient(SHARED_SUPABASE_URL, SHARED_SUPABASE_ANON_KEY);

    const { data, error } = await sharedSupabase
      .from('coaching_programmes')
      .insert([programme])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
