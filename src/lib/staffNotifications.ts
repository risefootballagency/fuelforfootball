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
    // Deduplicate: skip if a similar event for the same dedupeKey exists within the last 5 minutes.
    // (Previously 1h with no key match — far too aggressive, suppressed real distinct events.)
    if (dedupeKey) {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const { data: existing } = await supabase
        .from("staff_notification_events")
        .select("id, event_data")
        .eq("event_type", eventType)
        .gte("created_at", fiveMinAgo)
        .limit(50);

      const duplicate = (existing || []).some((row: any) => {
        const ed = row?.event_data;
        if (!ed || typeof ed !== "object") return false;
        // Match against common id fields the caller may put in event_data
        return (
          ed.player_id === dedupeKey ||
          ed.visitor_id === dedupeKey ||
          ed.id === dedupeKey ||
          ed.dedupe_key === dedupeKey
        );
      });

      if (duplicate) {
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
