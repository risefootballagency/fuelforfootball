import { supabase } from "@/integrations/supabase/client";

/**
 * Insert a staff notification event for tracking player engagement
 */
export const insertStaffNotification = async (
  title: string,
  body: string,
  type: string = "portal_view"
) => {
  try {
    await supabase
      .from("staff_notification_events")
      .insert([{
        title,
        body,
        event_type: type,
      }]);
  } catch (error) {
    // Silently fail - notifications are non-critical
    console.error("[StaffNotifications] Failed to insert:", error);
  }
};
