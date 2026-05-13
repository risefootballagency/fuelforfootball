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

const ensureLocalStaffAccess = async (supabase: any, userId: string, email: string, role: string) => {
  await supabase.from("profiles").upsert({ id: userId, email }, { onConflict: "id" });
  const { data: roles, error: rolesErr } = await supabase
    .from("user_roles").select("id,role").eq("user_id", userId);
  if (rolesErr) throw rolesErr;
  const hasAllowed = (roles || []).some((r: any) => ALLOWED_ROLES.has(r.role));
  if (!hasAllowed) {
    const { error: roleErr } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (roleErr) throw roleErr;
  }
};

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
      await ensureLocalStaffAccess(supabase, user.id, normalizedEmail, sharedRole);
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

    // No local user yet - create one because the shared staff login has been verified.
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: normalizedEmail, password, email_confirm: true,
    });
    if (createErr) throw createErr;
    if (created.user?.id) {
      await ensureLocalStaffAccess(supabase, created.user.id, normalizedEmail, sharedRole);
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
