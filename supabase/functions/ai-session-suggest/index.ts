import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { playerName, position, notes, category, recentActions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch relevant exercises from coaching database
    const { data: exercises } = await supabase
      .from('coaching_exercises')
      .select('title, description, category, sets, reps, load, rest_time')
      .limit(20);

    // Fetch relevant drills
    const { data: drills } = await supabase
      .from('coaching_drills')
      .select('title, description, category, equipment, players_required')
      .limit(15);

    // Fetch existing sessions for style reference
    const { data: sessions } = await supabase
      .from('coaching_sessions')
      .select('title, description, category, duration')
      .limit(5);

    let dbContext = '';
    if (exercises?.length) {
      dbContext += '\n\nAVAILABLE EXERCISES IN DATABASE:\n';
      exercises.forEach((e: any) => {
        dbContext += `- ${e.title} (${e.category || 'General'}): ${e.description || 'No description'}`;
        if (e.sets) dbContext += ` | ${e.sets} sets`;
        if (e.reps) dbContext += ` x ${e.reps}`;
        dbContext += '\n';
      });
    }
    if (drills?.length) {
      dbContext += '\n\nAVAILABLE DRILLS IN DATABASE:\n';
      drills.forEach((d: any) => {
        dbContext += `- ${d.title} (${d.category || 'General'}): ${d.description || 'No description'}\n`;
      });
    }
    if (sessions?.length) {
      dbContext += '\n\nEXISTING SESSION TEMPLATES:\n';
      sessions.forEach((s: any) => {
        dbContext += `- ${s.title} (${s.category || 'General'}, ${s.duration || '?'}min): ${s.description || ''}\n`;
      });
    }

    let recentPerformanceContext = '';
    if (recentActions?.length) {
      recentPerformanceContext = '\n\nRECENT PERFORMANCE DATA:\n';
      recentActions.forEach((a: any) => {
        recentPerformanceContext += `- Action: ${a.action_type || 'Unknown'}, Score: ${a.action_score || 'N/A'}, Notes: ${a.notes || 'None'}\n`;
      });
    }

    const systemPrompt = `You are an elite football coaching consultant. Generate a tailored training session suggestion for a player.

ALWAYS write in British English (UK spelling).

PLAYER CONTEXT:
- Name: ${playerName || 'Unknown'}
- Position: ${position || 'Not specified'}
- Coach Notes: ${notes || 'None provided'}
- Requested Category: ${category || 'General'}
${recentPerformanceContext}
${dbContext}

INSTRUCTIONS:
- Design a focused 60-90 minute training session
- Where possible, reference exercises/drills from the database above
- Tailor to the player's position and any noted weaknesses
- Include warm-up, main block, and cool-down phases
- Provide specific coaching cues and progressions
- Be direct and practical, not generic

RESPONSE FORMAT (use this exact structure):
**Session Title:** [Descriptive title]
**Duration:** [X minutes]
**Focus:** [Primary training focus]

**Warm-Up (10-15 min)**
[Specific exercises with reps/sets]

**Main Block (35-50 min)**
[Detailed drills and exercises with coaching points]

**Cool-Down (5-10 min)**
[Recovery exercises]

**Key Coaching Points:**
- [Point 1]
- [Point 2]
- [Point 3]`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a ${category || 'general'} training session for ${playerName || 'this player'}.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error('AI service error');
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || 'No suggestion generated.';

    return new Response(
      JSON.stringify({ suggestion }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-session-suggest:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
