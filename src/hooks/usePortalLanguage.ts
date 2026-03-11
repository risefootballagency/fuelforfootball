import { useState, useEffect } from "react";
import { normalizePortalLanguage } from "@/lib/portalTranslations";

interface UsePortalLanguageOptions {
  includePortalHint?: boolean;
}

/**
 * Reads the portal language from storage/browser settings.
 * Switzerland defaults to French when no explicit preference exists.
 */
export function usePortalLanguage(options: UsePortalLanguageOptions = {}): string {
  const { includePortalHint = true } = options;

  const resolve = () => {
    const portalHint = includePortalHint ? localStorage.getItem("portal_language_hint") : null;
    const ipDetected = sessionStorage.getItem("ip_language_detected");
    const preferred = localStorage.getItem("preferred_language");
    const hint = portalHint || ipDetected || preferred;

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
  }, [includePortalHint]);

  return lang;
}

