import { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaFacebook, FaSnapchatGhost, FaTelegram, FaSpotify, FaWhatsapp } from "react-icons/fa";
import { Mail } from "lucide-react";
import logo from "@/assets/fff_logo.png";
import riseLogo from "@/assets/rise-logo-full.png";
import { WorkWithUsDialog } from "@/components/WorkWithUsDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { LocalizedLink } from "@/components/LocalizedLink";
import { SubdomainLink } from "@/components/SubdomainLink";
import { toast } from "@/hooks/use-toast";

// Build version - update this to verify deployments
const BUILD_VERSION = "v2024.11.27.002";

export const Footer = () => {
  const [connectOpen, setConnectOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    // Simulate submission - replace with actual API call later
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer className="bg-background">
      {/* Change The Game Divider */}
      <div className="relative py-6">
        <div className="absolute inset-0 flex items-center px-4">
          <div className="w-full border-t-4 border-primary" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-8 text-3xl md:text-4xl font-bebas uppercase tracking-wider text-foreground italic">
            Change The Game
          </span>
        </div>
        <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
          <div className="w-full border-b-4 border-primary mt-12" />
        </div>
      </div>

      {/* Partners Section */}
      <div className="container mx-auto px-4 py-8">
        <h3 className="font-bebas text-2xl uppercase tracking-wider text-primary text-center mb-6">
          Partners
        </h3>
        <div className="flex justify-center items-center gap-12 flex-wrap">
          <img src={riseLogo} alt="RISE" className="h-12 md:h-16 object-contain" />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Enquiries */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-px bg-primary" />
              <h3 className="font-bebas text-2xl uppercase tracking-wider text-foreground px-4">
                Enquiries
              </h3>
              <div className="flex-1 h-px bg-primary" />
            </div>

            {/* Partnerships/Sponsorships */}
            <div className="mb-6">
              <h4 className="font-bebas text-sm uppercase tracking-wider text-primary mb-2">
                Partnerships/Sponsorships
              </h4>
              <a
                href="mailto:info@fuelforfootball.com"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-6 h-6" />
                <span>info@fuelforfootball.com</span>
              </a>
            </div>

            {/* Sales & Support */}
            <div className="mb-6">
              <h4 className="font-bebas text-sm uppercase tracking-wider text-primary mb-2">
                Sales & Support
              </h4>
              <a
                href="https://wa.me/447742431806"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <FaWhatsapp className="w-6 h-6" />
                <span>+44 7742431806</span>
              </a>
            </div>

            {/* Performance Q&A */}
            <div className="mb-6">
              <h4 className="font-bebas text-sm uppercase tracking-wider text-primary mb-2">
                Performance Q&A
              </h4>
              <a
                href="https://www.instagram.com/FuelForFootball"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <FaInstagram className="w-6 h-6" />
                <span>@FuelForFootball</span>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-8">
              <LocalizedLink to="/about">
                <Button 
                  className="w-full font-bebas uppercase tracking-wider text-lg"
                >
                  About Us
                </Button>
              </LocalizedLink>
              <WorkWithUsDialog>
                <Button 
                  className="w-full font-bebas uppercase tracking-wider text-lg"
                >
                  Get In Touch
                </Button>
              </WorkWithUsDialog>
            </div>
          </div>

          {/* Right Column - Fuel Stations (Social Links) */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-px bg-primary" />
              <h3 className="font-bebas text-2xl uppercase tracking-wider text-foreground px-4">
                Fuel Stations
              </h3>
              <div className="flex-1 h-px bg-primary" />
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <a
                href="https://www.instagram.com/FuelForFootball"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <FaInstagram className="w-8 h-8 text-pink-500" />
                <span className="underline">@FuelForFootball</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <FaTelegram className="w-8 h-8 text-blue-400" />
                <span className="underline">Daily Fuel</span>
              </a>
              <a
                href="https://www.youtube.com/@FuelForFootball"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <FaYoutube className="w-8 h-8 text-red-500" />
                <span className="underline">Fuel For Football</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <FaSnapchatGhost className="w-8 h-8 text-yellow-400" />
                <span className="underline">fuelforfootball</span>
              </a>
              <a
                href="https://www.linkedin.com/company/fuel-for-football"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <FaLinkedin className="w-8 h-8 text-blue-600" />
                <span className="underline">Fuel For Football</span>
              </a>
              <a
                href="https://open.spotify.com/show/1Ep6k8p6j4rMT1a0AFqX8C"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <FaSpotify className="w-8 h-8 text-green-500" />
                <span className="underline">Fuel For Football Podcast</span>
              </a>
              <a
                href="https://www.facebook.com/fuelforfooty"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <FaFacebook className="w-8 h-8 text-blue-500" />
                <span className="underline">@fuelforfooty</span>
              </a>
              <a
                href="https://x.com/fuelforfootball"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
              >
                <FaTwitter className="w-8 h-8" />
                <span className="underline">@fuelforfootball</span>
              </a>
            </div>

            {/* Newsletter Subscription */}
            <div className="border-t-2 border-primary pt-6">
              <h4 className="font-bebas text-lg uppercase tracking-wider text-foreground mb-4 text-center">
                Keep Updated With Our New Packages And Offers
              </h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-1 block">Email *</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="bg-background border-muted-foreground/30"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="self-end font-bebas uppercase tracking-wider"
                >
                  {isSubmitting ? "..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-primary/20">
          <h3 className="font-bebas text-xl uppercase tracking-wider text-foreground mb-4 text-center">
            {t("footer.quick_links", "Quick Links")}
          </h3>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <LocalizedLink to="/players" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Players
            </LocalizedLink>
            <LocalizedLink to="/clubs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Clubs
            </LocalizedLink>
            <LocalizedLink to="/coaches" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Coaches
            </LocalizedLink>
            <LocalizedLink to="/scouts" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Scouts
            </LocalizedLink>
            <LocalizedLink to="/performance" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Performance
            </LocalizedLink>
            <LocalizedLink to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Services
            </LocalizedLink>
            <LocalizedLink to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Shop
            </LocalizedLink>
            <LocalizedLink to="/between-the-lines" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Insights
            </LocalizedLink>
            <LocalizedLink to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              About
            </LocalizedLink>
            <LocalizedLink to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Contact
            </LocalizedLink>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary/10 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-6">
            <img src={logo} alt="Fuel For Football" className="h-12 mx-auto mb-4" />
            <p className="text-xs text-muted-foreground/80 max-w-3xl mx-auto px-4">
              {t("footer.regulatory_text", "Fuel For Football operates in accordance with the regulatory frameworks established by FIFA and UEFA. Our work follows the standards required for player representation, governance and integrity.")}
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Fuel For Football. {t("footer.all_rights_reserved", "All rights reserved.")}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="https://open.spotify.com/show/1Ep6k8p6j4rMT1a0AFqX8C" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-bebas uppercase tracking-wider"
              >
                Fuel For Football Podcast
              </a>
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors font-bebas uppercase tracking-wider">
                {t("footer.privacy_policy", "Privacy Policy")}
              </Link>
              <a 
                href="/FIFA_Football_Agent_Regulations.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-bebas uppercase tracking-wider"
              >
                {t("footer.regulations", "REGULATIONS")}
              </a>
              <a 
                href="https://www.fifa.com/legal/football-regulatory/agents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-bebas uppercase tracking-wider"
              >
                {t("footer.fifa_framework", "FIFA Framework")}
              </a>
              <a 
                href="https://www.uefa.com/insideuefa/protecting-the-game/football-regulatory" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-bebas uppercase tracking-wider"
              >
                {t("footer.uefa_framework", "UEFA Framework")}
              </a>
            </div>
          </div>
          {/* Version indicator for deployment debugging */}
          <p className="text-[10px] text-muted-foreground/40 text-center mt-4">
            Build: {BUILD_VERSION}
          </p>
        </div>
      </div>
    </footer>
  );
};
