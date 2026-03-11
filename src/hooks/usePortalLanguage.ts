import { useState, useEffect } from "react";
import { normalizePortalLanguage } from "@/lib/portalTranslations";

/**
 * Reads the portal language from storage/browser settings.
 * Switzerland defaults to French when no explicit preference exists.
 */
export function usePortalLanguage(): string {
  const resolve = () => {
    const hint = localStorage.getItem("portal_language_hint")
      || localStorage.getItem("preferred_language")
      || sessionStorage.getItem("ip_language_detected");

    if (hint) return normalizePortalLanguage(hint);

    const locale = navigator.language || "en";
    const [langPart, regionPart] = locale.split("-");
    const region = (regionPart || "").toUpperCase();

    if (region === "CH") return "fr";

    return normalizePortalLanguage(langPart || "en");
  };

  const [lang, setLang] = useState(resolve);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "portal_language_hint"
        || e.key === "preferred_language"
        || e.key === "ip_language_detected"
      ) {
        setLang(resolve());
      }
    };

    window.addEventListener("storage", onStorage);

    const interval = setInterval(() => {
      const current = resolve();
      setLang(prev => (prev !== current ? current : prev));
    }, 1000);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, []);

  return lang;
}
