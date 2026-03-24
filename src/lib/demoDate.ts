/**
 * Returns a fixed date (Feb 05, 2012) when in demo portal mode,
 * otherwise returns the real current date.
 */
export const DEMO_DATE = new Date(2012, 1, 5); // Feb 05, 2012

export const isDemoMode = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    sessionStorage.getItem("demo_portal_mode") === "true" ||
    localStorage.getItem("demo_portal_mode") === "true" ||
    window.location.pathname.includes("/portal-example")
  );
};

export const getDemoDate = (): Date => {
  return isDemoMode() ? new Date(DEMO_DATE) : new Date();
};

export const getDemoDateISO = (): string => {
  return getDemoDate().toISOString().split("T")[0];
};
