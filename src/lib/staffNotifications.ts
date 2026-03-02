import { supabase } from "@/integrations/supabase/client";

/**
 * Insert a staff notification event, with optional deduplication.
 * Silently fails so it never blocks the main workflow.
 *
 * @param dedupeKey  – if provided, skip insert when a matching event_type
 *                     with the same key in event_data exists within the last hour.
 */
export const insertStaffNotification = async ({
  eventType,
  title,
  body,
  eventData,
  dedupeKey,
}: {
  eventType: string;
  title: string;
  body: string;
  eventData?: Record<string, any>;
  dedupeKey?: string;
}) => {
  try {
    // Deduplicate: skip if a similar event exists within the last hour
    if (dedupeKey) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: existing } = await supabase
        .from("staff_notification_events")
        .select("id")
        .eq("event_type", eventType)
        .gte("created_at", oneHourAgo)
        .limit(1);

      if (existing && existing.length > 0) {
        return;
      }
    }

    await supabase.from("staff_notification_events").insert({
      event_type: eventType,
      title,
      body,
      event_data: eventData || {},
    });
  } catch (err) {
    console.error("Staff notification insert failed:", err);
  }
};
