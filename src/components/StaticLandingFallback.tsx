import { useState } from "react";
import { Link } from "react-router-dom";
import { LanguageMapSelector } from "@/components/LanguageMapSelector";
import { HoverText } from "@/components/HoverText";
import { useLanguage } from "@/contexts/LanguageContext";
import { RepresentationDialog } from "@/components/RepresentationDialog";
import { DeclareInterestPlayerDialog } from "@/components/DeclareInterestPlayerDialog";
import { Button } from "@/components/ui/button";
import { useRoleSubdomain, pathToRole, RoleSubdomain } from "@/hooks/useRoleSubdomain";
import { useIsPWA } from "@/hooks/useIsPWA";
import fffLogo from "@/assets/fff_logo.png";

interface StaticLandingFallbackProps {
  performanceReason?: string;
}

export function StaticLandingFallback({ performanceReason }: StaticLandingFallbackProps) {
  const { t } = useLanguage();
  const { getRoleUrl } = useRoleSubdomain();
  const isPWA = useIsPWA();
  
  const [showRepresentation, setShowRepresentation] = useState(false);
  const [showDeclareInterest, setShowDeclareInterest] = useState(false);

  const navigateToRole = (path: string) => {
    const role = pathToRole[path];
    console.log('[StaticFallback.navigateToRole] Path:', path, 'Role:', role);
    
    if (role) {
      const roleUrl = getRoleUrl(role as Exclude<RoleSubdomain, null>);
      console.log('[StaticFallback.navigateToRole] Generated URL:', roleUrl);
      
      if (roleUrl.startsWith('http')) {
        console.log('[StaticFallback.navigateToRole] Navigating to subdomain URL');
        window.location.href = roleUrl;
      } else {
        console.log('[StaticFallback.navigateToRole] Navigating to internal path:', roleUrl);
        window.location.href = roleUrl;
      }
    } else {
      console.log('[StaticFallback.navigateToRole] No role match, using path directly');
      window.location.href = path;
    }
  };

  const navLinks = [
    { to: "/agents", labelKey: "landing.nav_agents", fallback: "AGENT" },
    { to: "/coaches", labelKey: "landing.nav_coaches", fallback: "COACH" },
    { to: "/clubs", labelKey: "landing.nav_clubs", fallback: "CLUB" },
    { to: "/players", labelKey: "landing.nav_players", fallback: "PLAYER" },
    { to: "/scouts", labelKey: "landing.nav_scouts", fallback: "SCOUT" },
    { to: "/media", labelKey: "landing.nav_media", fallback: "MEDIA" },
    { to: "/business", labelKey: "landing.nav_business", fallback: "BUSINESS" },
  ];

  const mobileNavLinks = [
    { to: "/players", labelKey: "landing.nav_players", fallback: "PLAYER" },
    { to: "/coaches", labelKey: "landing.nav_coaches", fallback: "COACH" },
    { to: "/clubs", labelKey: "landing.nav_clubs", fallback: "CLUB" },
    { to: "/agents", labelKey: "landing.nav_agents", fallback: "AGENT" },
    { to: "/scouts", labelKey: "landing.nav_scouts", fallback: "SCOUT" },
    { to: "/business", labelKey: "landing.nav_business", fallback: "BUSINESS" },
    { to: "/media", labelKey: "landing.nav_media", fallback: "MEDIA" },
  ];

  const pwaClass = isPWA ? 'pwa-standalone' : '';

  return (
    <div className={`min-h-screen bg-[hsl(147,40%,7%)] relative overflow-hidden ${pwaClass}`}>
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(147,40%,7%)] via-[hsl(147,40%,5%)] to-[hsl(147,40%,7%)]" />

      {/* Top Section */}
      <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4">
        <LanguageMapSelector />
        
        <img 
          src={fffLogo} 
          alt="Fuel for Football" 
          className="h-10 md:h-12 object-contain"
        />
        
        <div className="flex items-center gap-3 text-xs">
          <Link to="/staff" className="text-[hsl(var(--mint)/0.5)] hover:text-primary transition-colors uppercase tracking-wider font-bebas">
            {t("header.staff", "Staff")}
          </Link>
          <Link to="/portal" className="text-[hsl(var(--mint)/0.5)] hover:text-primary transition-colors uppercase tracking-wider font-bebas">
            {t("header.portal", "Portal")}
          </Link>
        </div>
      </div>

      {/* Center Section - Static Player Image */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <img 
          src="/assets/player-base.png" 
          alt="" 
          className="h-[60vh] md:h-[70vh] object-contain opacity-90"
        />
      </div>

      {/* Bottom Section - Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 md:pb-12">
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-1">
              {navLinks.map((link, index) => (
              <div key={link.to} className="flex items-center">
                <button
                  onClick={() => navigateToRole(link.to)}
                  className="px-4 py-2 text-xl font-bebas uppercase tracking-[0.2em] text-white/70 hover:text-primary transition-colors duration-300"
                >
                  <HoverText text={t(link.labelKey, link.fallback)} />
                </button>
                {index < navLinks.length - 1 && <span className="text-white/20">|</span>}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowRepresentation(true)}
              variant="outline"
              className="font-bebas uppercase tracking-wider border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
              style={{ borderRadius: '20px' }}
            >
              {t("landing.represent_me", "Represent Me")}
            </Button>
            <Button
              onClick={() => setShowDeclareInterest(true)}
              className="btn-shine font-bebas uppercase tracking-wider"
              style={{ borderRadius: '20px' }}
            >
              {t("landing.declare_interest", "Declare Interest In Star")}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-bebas">
            {t("landing.select_role_enter", "Select Your Role To Enter Site")}
          </p>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex flex-col items-center gap-4 px-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowRepresentation(true)}
              variant="outline"
              size="sm"
              className="font-bebas uppercase tracking-wider border-primary/50 text-primary hover:bg-primary/10 text-xs px-3 h-7"
            >
              {t("landing.represent_me", "Represent Me")}
            </Button>
            <Button
              onClick={() => setShowDeclareInterest(true)}
              size="sm"
              className="btn-shine font-bebas uppercase tracking-wider text-xs px-3 h-7"
            >
              {t("landing.declare_interest_short", "Declare Interest")}
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1">
              {mobileNavLinks.slice(0, 3).map((link, index) => (
                <div key={link.to} className="flex items-center">
                  <button
                    onClick={() => navigateToRole(link.to)}
                    className="px-2 py-0.5 text-[15px] font-bebas uppercase tracking-[0.1em] text-white/70 hover:text-primary transition-colors duration-300"
                  >
                    {t(link.labelKey, link.fallback)}
                  </button>
                  {index < 2 && <span className="text-white/20">|</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1">
              {mobileNavLinks.slice(3).map((link, index) => (
                <div key={link.to} className="flex items-center">
                  <button
                    onClick={() => navigateToRole(link.to)}
                    className="px-2 py-0.5 text-[15px] font-bebas uppercase tracking-[0.1em] text-white/70 hover:text-primary transition-colors duration-300"
                  >
                    {t(link.labelKey, link.fallback)}
                  </button>
                  {index < 3 && <span className="text-white/20">|</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <LanguageMapSelector />
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bebas mt-2">
              {t("landing.select_role_enter", "Select Your Role To Enter Site")}
            </p>
          </div>
        </div>
      </div>

      <RepresentationDialog open={showRepresentation} onOpenChange={setShowRepresentation} />
      <DeclareInterestPlayerDialog open={showDeclareInterest} onOpenChange={setShowDeclareInterest} />
    </div>
  );
}
