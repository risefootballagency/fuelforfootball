import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import { getServiceExampleRoute } from "@/lib/serviceExampleRouting";

// Demo player - Cristiano Ronaldo
const DEMO_PLAYER_EMAIL = "bloggs@fuelforfootball.com";
const DEMO_PLAYER_ID = "e3ae5dcd-0a67-4d49-bf04-879040c4b8c3";

interface PortalExampleProps {
  isEmbedded?: boolean;
  initialSection?: string;
  serviceContext?: {
    serviceName: string;
    serviceId?: string;
    analysisTab?: "performance" | "video";
    reportHint?: string;
  };
}

export const PortalExample = ({ isEmbedded = false, initialSection, serviceContext }: PortalExampleProps) => {
  const previousEmail = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [searchParams] = useSearchParams();

  const derivedRoute = getServiceExampleRoute({
    id: serviceContext?.serviceId,
    name: serviceContext?.serviceName,
  });

  // Determine which section to show based on context
  const section = initialSection || searchParams.get("section") || "hub";
  const analysisTab = searchParams.get("analysisTab") || serviceContext?.analysisTab || derivedRoute.analysisTab;
  const reportHint = searchParams.get("reportHint") || serviceContext?.reportHint || derivedRoute.reportHint;

  useEffect(() => {
    // Store existing email to restore later
    previousEmail.current = localStorage.getItem("player_email");

    // Set demo auth/session keys in both storages for maximum resilience
    localStorage.setItem("player_email", DEMO_PLAYER_EMAIL);
    sessionStorage.setItem("player_email", DEMO_PLAYER_EMAIL);

    localStorage.setItem("demo_portal_mode", "true");
    sessionStorage.setItem("demo_portal_mode", "true");

    localStorage.setItem("demo_portal_email", DEMO_PLAYER_EMAIL);
    sessionStorage.setItem("demo_portal_email", DEMO_PLAYER_EMAIL);
    localStorage.setItem("demo_portal_player_id", DEMO_PLAYER_ID);
    sessionStorage.setItem("demo_portal_player_id", DEMO_PLAYER_ID);

    if (section) {
      sessionStorage.setItem("demo_portal_section", section);
      localStorage.setItem("demo_portal_section", section);
    }
    if (analysisTab) {
      sessionStorage.setItem("demo_portal_analysis_tab", analysisTab);
      localStorage.setItem("demo_portal_analysis_tab", analysisTab);
    }
    if (reportHint) {
      sessionStorage.setItem("demo_portal_report_hint", reportHint);
      localStorage.setItem("demo_portal_report_hint", reportHint);
    }

    setReady(true);

    return () => {
      // Restore previous email on unmount
      if (previousEmail.current) {
        localStorage.setItem("player_email", previousEmail.current);
      } else {
        localStorage.removeItem("player_email");
      }
      localStorage.removeItem("demo_portal_mode");
      sessionStorage.removeItem("demo_portal_mode");
      localStorage.removeItem("demo_portal_section");
      sessionStorage.removeItem("demo_portal_section");
      localStorage.removeItem("demo_portal_analysis_tab");
      sessionStorage.removeItem("demo_portal_analysis_tab");
      localStorage.removeItem("demo_portal_report_hint");
      sessionStorage.removeItem("demo_portal_report_hint");
      localStorage.removeItem("demo_portal_email");
      sessionStorage.removeItem("demo_portal_email");
      localStorage.removeItem("demo_portal_player_id");
      sessionStorage.removeItem("demo_portal_player_id");
    };
  }, [section, analysisTab, reportHint]);

  if (!ready) return null;

  return <Dashboard />;
};

export default PortalExample;
