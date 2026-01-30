import { sharedSupabase as supabase } from "@/integrations/supabase/sharedClient";
import { supabase as localSupabase } from "@/integrations/supabase/client";
import PublicHub from "./PublicHub";

// Demo player ID - Joe Bloggs
const DEMO_PLAYER_ID = "e3ae5dcd-0a67-4d49-bf04-879040c4b8c3";

interface PortalExampleProps {
  isEmbedded?: boolean;
}

export const PortalExample = ({ isEmbedded = false }: PortalExampleProps) => {
  // Just render PublicHub with the demo player ID
  // PublicHub already has all the correct portal styling and data fetching
  return <PublicHub playerId={DEMO_PLAYER_ID} isEmbedded={isEmbedded} />;
};

export default PortalExample;
