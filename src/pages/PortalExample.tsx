import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Dashboard from "./Dashboard";

// Demo player - Cristiano Ronaldo
const DEMO_PLAYER_EMAIL = "bloggs@fuelforfootball.com";

interface PortalExampleProps {
  isEmbedded?: boolean;
  initialSection?: string;
  serviceContext?: {
    serviceName: string;
    serviceId?: string;
  };
}

export const PortalExample = ({ isEmbedded = false, initialSection, serviceContext }: PortalExampleProps) => {
  const previousEmail = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [searchParams] = useSearchParams();

  // Determine which section to show based on context
  const section = initialSection || searchParams.get("section") || "hub";

  useEffect(() => {
    // Store existing email to restore later
    previousEmail.current = localStorage.getItem("player_email");
    
    // Set demo email so Dashboard thinks we're logged in
    localStorage.setItem("player_email", DEMO_PLAYER_EMAIL);
    // Flag demo mode so Dashboard can detect it
    sessionStorage.setItem("demo_portal_mode", "true");
    if (section) {
      sessionStorage.setItem("demo_portal_section", section);
    }
    
    setReady(true);

    return () => {
      // Restore previous email on unmount
      if (previousEmail.current) {
        localStorage.setItem("player_email", previousEmail.current);
      } else {
        localStorage.removeItem("player_email");
      }
      sessionStorage.removeItem("demo_portal_mode");
      sessionStorage.removeItem("demo_portal_section");
    };
  }, [section]);

  if (!ready) return null;

  return <Dashboard />;
};

export default PortalExample;
