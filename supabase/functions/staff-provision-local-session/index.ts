// Provisions or repairs a local Supabase auth account for staff so the local
// session matches the shared session. Used by Staff.tsx after a successful
// shared sign-in when local signInWithPassword fails.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SHARED_SUPABASE_URL = "https://qwethimbtaamlhbajmal.supabase.co";
const SHARED_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZXRoaW1idGFhbWxoYmFqbWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODQzNDMsImV4cCI6MjA3NjM2MDM0M30.FNM354bgxhdtM4F_KGbQQnJwX7-WngaX58kPvPYnUEY";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_ROLES = new Set(["admin", "staff", "marketeer", "analyst"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email, password } = await req.json();
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return new Response(JSON.stringify({ error: "email and password required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "password too short" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const normalizedEmail = email.trim().toLowerCase();
    const shared = createClient(SHARED_SUPABASE_URL, SHARED_SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: sharedAuth, error: sharedAuthErr } = await shared.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    if (sharedAuthErr || !sharedAuth.user) {
      return new Response(JSON.stringify({ error: "shared staff login could not be verified" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: sharedRoles, error: sharedRoleErr } = await shared
      .from("user_roles").select("role").eq("user_id", sharedAuth.user.id);
    if (sharedRoleErr) throw sharedRoleErr;
    const sharedRole = (sharedRoles || []).find((r: any) => ALLOWED_ROLES.has(r.role))?.role;
    if (!sharedRole) {
      return new Response(JSON.stringify({ error: "shared account has no staff role" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find user via auth admin listUsers (filter by email)
    const { data: list, error: listErr } = await supabase.auth.admin.listUsers({
      page: 1, perPage: 200,
    });
    if (listErr) throw listErr;
    let user = list.users.find((u) => (u.email || "").toLowerCase() === normalizedEmail) || null;

    if (user) {
      // Confirm role permits staff access on this backend
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", user.id);
      const hasRole = (roles || []).some((r: any) => ALLOWED_ROLES.has(r.role));
      if (!hasRole) {
        return new Response(JSON.stringify({ error: "no staff role on local backend" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Reset password to match shared
      const { error: updErr } = await supabase.auth.admin.updateUserById(user.id, {
        password, email_confirm: true,
      });
      if (updErr) throw updErr;
      await supabase.from("staff_pay_identities").upsert({
        shared_user_id: sharedAuth.user.id,
        local_user_id: user.id,
        email: normalizedEmail,
        role: sharedRole,
      }, { onConflict: "shared_user_id" });
      return new Response(JSON.stringify({ ok: true, action: "reset" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // No local user yet — only auto-provision if a profile already exists
    // (created by an admin via the Staff Accounts panel) and has an
    // approved role. Otherwise refuse so we don't grant access broadly.
    const { data: profile } = await supabase
      .from("profiles").select("id").eq("email", normalizedEmail).maybeSingle();
    if (!profile) {
      return new Response(JSON.stringify({ error: "no local profile; ask an admin to provision your account" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", profile.id);
    const hasRole = (roles || []).some((r: any) => ALLOWED_ROLES.has(r.role));
    if (!hasRole) {
      return new Response(JSON.stringify({ error: "profile has no staff role" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create auth user with the same id as the profile when possible
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: normalizedEmail, password, email_confirm: true,
    });
    if (createErr) throw createErr;
    if (created.user?.id) {
      await supabase.from("staff_pay_identities").upsert({
        shared_user_id: sharedAuth.user.id,
        local_user_id: created.user.id,
        email: normalizedEmail,
        role: sharedRole,
      }, { onConflict: "shared_user_id" });
    }

    return new Response(JSON.stringify({ ok: true, action: "created", user_id: created.user?.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("staff-provision-local-session error", err);
    return new Response(JSON.stringify({ error: err?.message || "unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
