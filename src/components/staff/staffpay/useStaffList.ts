import { useCallback, useEffect, useState } from "react";
import { supabase as localSupabase } from "@/integrations/supabase/client";
import { sharedSupabase } from "@/integrations/supabase/sharedClient";

export interface StaffOpt { id: string; name: string; email: string; role?: string; hidden?: boolean; }

export const useStaffList = (options: { includeHidden?: boolean } = {}) => {
  const [staff, setStaff] = useState<StaffOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const setHidden = useCallback(async (staffUserId: string, hidden: boolean) => {
    const { data: { user } } = await localSupabase.auth.getUser();
    const { error } = await (localSupabase as any).from('staff_pay_visibility').upsert({
      staff_user_id: staffUserId,
      hidden,
      hidden_reason: hidden ? 'Hidden from Fuel For Football Staff Pay' : null,
      updated_by: user?.id || null,
    }, { onConflict: 'staff_user_id' });
    if (error) throw error;
    refresh();
  }, [refresh]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data: roles } = await sharedSupabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['admin', 'staff', 'analyst', 'marketeer']);
      const ids = Array.from(new Set((roles || []).map((r: any) => r.user_id)));
      if (!ids.length) { if (active) { setStaff([]); setLoading(false); } return; }
      const { data: profs } = await sharedSupabase
        .from('profiles').select('id,email,full_name').in('id', ids);
      const { data: visibility } = await (localSupabase as any)
        .from('staff_pay_visibility')
        .select('staff_user_id,hidden')
        .in('staff_user_id', ids);
      if (!active) return;
      const hiddenById = new Map((visibility || []).map((v: any) => [v.staff_user_id, !!v.hidden]));
      const roleById = new Map((roles || []).map((r: any) => [r.user_id, r.role]));
      const list = (profs || []).map((p: any) => ({
        id: p.id,
        email: p.email || '',
        name: p.full_name || p.email || p.id.slice(0, 8),
        role: roleById.get(p.id) || 'staff',
        hidden: hiddenById.get(p.id) || false,
      })).filter(s => options.includeHidden || !s.hidden).sort((a, b) => a.name.localeCompare(b.name));
      setStaff(list);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [options.includeHidden, refreshKey]);

  return { staff, loading, refresh, setHidden };
};
