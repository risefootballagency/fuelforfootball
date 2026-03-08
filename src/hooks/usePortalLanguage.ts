import { useMemo } from "react";
import { normalizePortalLanguage } from "@/lib/portalTranslations";

/**
 * Reads the portal language from localStorage or browser settings.
 * Returns a normalized language code (en, fr, es, pt, de, it, pl, cs, ru, tr).
 */
export function usePortalLanguage(): string {
  return useMemo(() => {
    // Check localStorage hints
    const hint = localStorage.getItem("portal_language_hint")
      || localStorage.getItem("preferred_language")
      || sessionStorage.getItem("ip_language_detected");
    if (hint) return normalizePortalLanguage(hint);

    // Fall back to browser language
    const nav = navigator.language?.split("-")[0] || "en";
    return normalizePortalLanguage(nav);
  }, []);
}
