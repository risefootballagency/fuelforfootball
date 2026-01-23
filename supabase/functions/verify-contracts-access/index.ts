import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { playerId, password, action } = await req.json()

    if (!playerId || !password) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Missing playerId or password' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key for server-side verification
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch the stored password (server-side only - never exposed to client)
    const { data: playerData, error: fetchError } = await supabase
      .from('players')
      .select('contracts_password')
      .eq('id', playerId)
      .single()

    if (fetchError) {
      console.error('Error fetching player:', fetchError)
      return new Response(
        JSON.stringify({ verified: false, error: 'Player not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const storedPassword = playerData?.contracts_password || '12345'

    // Handle password change action
    if (action === 'change') {
      const { currentPassword, newPassword } = await req.json().catch(() => ({ currentPassword: password }))
      
      if (password !== storedPassword) {
        return new Response(
          JSON.stringify({ verified: false, error: 'Current password is incorrect' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update password
      const { error: updateError } = await supabase
        .from('players')
        .update({ contracts_password: newPassword })
        .eq('id', playerId)

      if (updateError) {
        return new Response(
          JSON.stringify({ verified: false, error: 'Failed to update password' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ verified: true, message: 'Password updated successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify password for unlock action
    if (password !== storedPassword) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Incorrect password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate a simple access token (expires in 1 hour)
    const expiresAt = Date.now() + (60 * 60 * 1000) // 1 hour
    const accessToken = btoa(JSON.stringify({ 
      playerId, 
      expiresAt,
      verified: true 
    }))

    return new Response(
      JSON.stringify({ 
        verified: true, 
        accessToken,
        expiresAt 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ verified: false, error: 'Server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})