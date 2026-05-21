import { OPERATING_PROFILE_SECTIONS, Section } from "./operatingProfileQuestions";

// Simplified for FFF - translation can be wired through usePortalLanguage later.
export function useTranslatedOperatingProfile() {
  const sections: Section[] = OPERATING_PROFILE_SECTIONS;
  const labelFor = (s: string) => s;
  return { sections, loading: false, labelFor };
}
