import { useMemo } from "react";
import { t } from "@/lib/portalTranslations";

const FLAGS: { code: string; flag: string; label: string }[] = [
  { code: "en", flag: "gb", label: "ENG" },
  { code: "fr", flag: "fr", label: "FRA" },
  { code: "es", flag: "es", label: "ESP" },
  { code: "pt", flag: "pt", label: "POR" },
  { code: "de", flag: "de", label: "DEU" },
  { code: "it", flag: "it", label: "ITA" },
  { code: "pl", flag: "pl", label: "POL" },
  { code: "cs", flag: "cz", label: "ČES" },
  { code: "ru", flag: "ru", label: "РУС" },
  { code: "tr", flag: "tr", label: "TÜR" },
];

const flagUrl = (c: string) => `https://flagcdn.com/w40/${c}.png`;

interface PortalFlagLanguageSelectorProps {
  language: string;
  onSelect: (language: string) => void;
}

export const PortalFlagLanguageSelector = ({ language, onSelect }: PortalFlagLanguageSelectorProps) => {
  const current = useMemo(() => FLAGS.find(l => l.code === language) || FLAGS[0], [language]);

  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <p className="text-xs text-muted-foreground">{t(language, "login_language_label")}</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {FLAGS.map((item) => {
          const active = item.code === current.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => onSelect(item.code)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors ${active ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"}`}
            >
              <img src={flagUrl(item.flag)} alt={item.label} className="h-3.5 w-5 rounded-sm object-cover" />
              <span className="font-bebas tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
