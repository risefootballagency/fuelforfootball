import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: "URL required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const html = await response.text();

    // Extract .mp4 links from various patterns
    const mp4Regex = /(?:src|href|data-src|data-video|content|source)\s*=\s*["']([^"']*\.mp4[^"']*)/gi;
    const jsonRegex = /"([^"]*\.mp4[^"]*)"/g;
    
    const found = new Set<string>();
    
    let match;
    while ((match = mp4Regex.exec(html)) !== null) {
      found.add(match[1]);
    }
    while ((match = jsonRegex.exec(html)) !== null) {
      // Filter out obvious non-URLs
      const val = match[1];
      if (val.startsWith("http") || val.startsWith("/")) {
        found.add(val);
      }
    }

    // Resolve relative URLs
    const baseUrl = new URL(url);
    const links = Array.from(found).map((link) => {
      try {
        return new URL(link, baseUrl).href;
      } catch {
        return link;
      }
    });

    return new Response(JSON.stringify({ links }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
