import { useState, useEffect } from "react";
import { normalizePortalLanguage } from "@/lib/portalTranslations";

/**
 * Reads the portal language from localStorage or browser settings.
 * Returns a normalized language code (en, fr, es, pt, de, it, pl, cs, ru, tr).
 * Re-renders when portal_language_hint changes in localStorage.
 */
export function usePortalLanguage(): string {
  const resolve = () => {
    const hint = localStorage.getItem("portal_language_hint")
      || localStorage.getItem("preferred_language")
      || sessionStorage.getItem("ip_language_detected");
    if (hint) return normalizePortalLanguage(hint);
    const nav = navigator.language?.split("-")[0] || "en";
    return normalizePortalLanguage(nav);
  };

  const [lang, setLang] = useState(resolve);

  useEffect(() => {
    // Re-check on storage events (cross-tab) and on a short interval for same-tab writes
    const onStorage = (e: StorageEvent) => {
      if (e.key === "portal_language_hint" || e.key === "preferred_language") {
        setLang(resolve());
      }
    };
    window.addEventListener("storage", onStorage);

    // Same-tab polling (localStorage.setItem doesn't fire storage event in same tab)
    const interval = setInterval(() => {
      const current = resolve();
      setLang(prev => prev !== current ? current : prev);
    }, 1000);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  return lang;
}
