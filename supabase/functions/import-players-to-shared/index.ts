import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";

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
    // Local database client
    const localSupabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Shared database client
    const sharedSupabase = createClient(SHARED_SUPABASE_URL, SHARED_SUPABASE_ANON_KEY);

    // Get all marketing gallery images
    const { data: galleryImages, error: galleryError } = await localSupabase
      .from("marketing_gallery")
      .select("title, file_url")
      .eq("category", "players");

    if (galleryError) {
      throw new Error(`Failed to fetch gallery: ${galleryError.message}`);
    }

    // Get existing players from shared database
    const { data: existingPlayers, error: playersError } = await sharedSupabase
      .from("players")
      .select("name");

    if (playersError) {
      throw new Error(`Failed to fetch existing players: ${playersError.message}`);
    }

    const existingNames = new Set(existingPlayers?.map(p => p.name.toLowerCase()) || []);

    // Filter out existing players and prepare new ones
    const newPlayers = galleryImages
      ?.filter(img => {
        const name = img.title;
        // Skip if already exists or contains "&" (group photos)
        return !existingNames.has(name.toLowerCase()) && !name.includes("&");
      })
      .map(img => {
        const name = img.title;
        // Extract surname (last word) for email
        const nameParts = name.trim().split(" ");
        const surname = nameParts[nameParts.length - 1].toLowerCase();
        
        return {
          name: name,
          email: `${surname}@fuelforfootball.com`,
          category: "Fuel For Football",
          image_url: img.file_url,
          position: "Forward",
          nationality: "Unknown",
          age: 20
        };
      }) || [];

    if (newPlayers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No new players to import", imported: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert new players into shared database
    const { data: inserted, error: insertError } = await sharedSupabase
      .from("players")
      .insert(newPlayers)
      .select();

    if (insertError) {
      throw new Error(`Failed to insert players: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully imported ${inserted?.length || 0} players`,
        imported: inserted?.length || 0,
        players: inserted?.map(p => p.name)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
