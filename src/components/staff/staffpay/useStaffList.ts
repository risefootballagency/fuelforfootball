import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StaffOpt { id: string; name: string; email: string; }

export const useStaffList = () => {
  const [staff, setStaff] = useState<StaffOpt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['admin', 'staff', 'analyst', 'marketeer']);
      const ids = Array.from(new Set((roles || []).map((r: any) => r.user_id)));
      if (!ids.length) { if (active) { setStaff([]); setLoading(false); } return; }
      const { data: profs } = await supabase
        .from('profiles').select('id,email,full_name').in('id', ids);
      if (!active) return;
      const list = (profs || []).map((p: any) => ({
        id: p.id,
        email: p.email || '',
        name: p.full_name || p.email || p.id.slice(0, 8),
      })).sort((a, b) => a.name.localeCompare(b.name));
      setStaff(list);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { staff, loading };
};
