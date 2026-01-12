import { useState, useEffect } from "react";
import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";

export type AppRole = 'admin' | 'staff' | 'marketeer' | 'scout' | 'player';

interface RolePermissions {
  isAdmin: boolean;
  isStaff: boolean;
  isMarketeer: boolean;
  isScout: boolean;
  isPlayer: boolean;
  roles: AppRole[];
  loading: boolean;
  canView: (section: string) => boolean;
  canEdit: (section: string) => boolean;
}

// Sections that marketeer can access
const MARKETEER_ALLOWED_SECTIONS = [
  'overview', 'marketing', 'marketingideas', 'contentcreator', 'blog', 
  'dailyfuel', 'openaccess', 'visitors', 'pwainstall', 'offlinemanager', 
  'pushnotifications', 'marketingtips'
];

// Sections that require admin only
const ADMIN_ONLY_SECTIONS = [
  'staffaccounts', 'passwords', 'sitemanagement', 'notificationsettings', 
  'smsnotifications', 'partners', 'jobs'
];

// Financial sections hidden from marketeer
const FINANCIAL_SECTIONS = [
  'invoices', 'payments', 'expenses', 'taxrecords', 'budgets', 
  'financialreports', 'sales', 'salestracker', 'retention', 'outreach', 
  'saleshub', 'timemanagement'
];

export const useRolePermissions = (userId?: string): RolePermissions => {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRoles = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching roles:', error);
          setRoles([]);
        } else {
          const userRoles = (data || []).map(r => r.role as AppRole);
          setRoles(userRoles);
        }
      } catch (err) {
        console.error('Error:', err);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [userId]);

  const isAdmin = roles.includes('admin');
  const isStaff = roles.includes('staff') || isAdmin;
  const isMarketeer = roles.includes('marketeer');
  const isScout = roles.includes('scout');
  const isPlayer = roles.includes('player');

  const canView = (section: string): boolean => {
    if (isAdmin) return true;
    if (isStaff) {
      // Staff can view everything except admin-only sections
      return !ADMIN_ONLY_SECTIONS.includes(section);
    }
    if (isMarketeer) {
      // Marketeer can only view their allowed sections
      return MARKETEER_ALLOWED_SECTIONS.includes(section);
    }
    return false;
  };

  const canEdit = (section: string): boolean => {
    if (isAdmin) return true;
    if (isStaff) {
      // Staff can edit non-admin sections
      return !ADMIN_ONLY_SECTIONS.includes(section);
    }
    if (isMarketeer) {
      // Marketeer can edit their sections
      return MARKETEER_ALLOWED_SECTIONS.includes(section);
    }
    return false;
  };

  return {
    isAdmin,
    isStaff,
    isMarketeer,
    isScout,
    isPlayer,
    roles,
    loading,
    canView,
    canEdit,
  };
};
