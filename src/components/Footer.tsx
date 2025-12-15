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
    <footer className="text-[hsl(0_0%_98%)] border-t border-primary/10">
      {/* Smooth transition gradient from page to footer */}
      <div className="h-24 bg-gradient-to-b from-transparent via-[hsl(var(--bg-dark))]/50 to-[hsl(var(--bg-dark))]" />
      
      {/* Change The Game Divider */}
      <div className="relative flex items-center justify-center py-6 bg-[hsl(var(--bg-dark))]">
        <div className="absolute left-0 right-0 h-1 bg-primary top-1/2 -translate-y-1/2" />
        <span className="relative bg-[hsl(var(--bg-dark))] px-8 text-3xl md:text-4xl font-bebas uppercase tracking-wider text-mint italic">
          Change The Game
        </span>
      </div>

      {/* Partners Section */}
      <div className="bg-[hsl(120_40%_10%)] py-8 border-b border-primary/10">
        <div className="container mx-auto px-4">
          <h3 className="font-bebas text-lg uppercase tracking-widest text-primary text-center mb-4">
            Partners
          </h3>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            <img src={riseLogo} alt="RISE" className="h-10 md:h-12 object-contain opacity-80 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Top Section - Logo & Description */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <img src={logo} alt="Fuel For Football" className="h-16 mx-auto mb-6" />
          <p className="text-lg text-mint-dim leading-relaxed max-w-2xl mx-auto">
            {t("footer.description", "Fuel For Football is football's leading performance consultancy. We help players, coaches, and clubs reach their full potential through elite physical training, tactical analysis, psychological development, and data-driven insights.")}
          </p>
        </div>

        {/* Main Footer Content - 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto mb-12">
          {/* Quick Links */}
          <div>
            <h3 className="font-bebas text-xl md:text-2xl uppercase tracking-wider text-mint mb-4 md:mb-6">
              {t("footer.quick_links", "Quick Links")}
            </h3>
            <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3">
              <Link to="/" className="text-mint-dim hover:text-primary transition-colors">
                Home
              </Link>
              <LocalizedLink to="/players" className="text-mint-dim hover:text-primary transition-colors">
                Players
              </LocalizedLink>
              <LocalizedLink to="/clubs" className="text-mint-dim hover:text-primary transition-colors">
                Clubs
              </LocalizedLink>
              <LocalizedLink to="/coaches" className="text-mint-dim hover:text-primary transition-colors">
                Coaches
              </LocalizedLink>
              <LocalizedLink to="/scouts" className="text-mint-dim hover:text-primary transition-colors">
                Scouts
              </LocalizedLink>
              <LocalizedLink to="/performance" className="text-mint-dim hover:text-primary transition-colors">
                Performance
              </LocalizedLink>
              <LocalizedLink to="/services" className="text-mint-dim hover:text-primary transition-colors">
                Services
              </LocalizedLink>
              <LocalizedLink to="/shop" className="text-mint-dim hover:text-primary transition-colors">
                Shop
              </LocalizedLink>
              <LocalizedLink to="/daily-fuel" className="text-mint-dim hover:text-primary transition-colors">
                Daily Fuel
              </LocalizedLink>
              <LocalizedLink to="/about" className="text-mint-dim hover:text-primary transition-colors">
                About
              </LocalizedLink>
              <LocalizedLink to="/contact" className="text-mint-dim hover:text-primary transition-colors">
                Contact
              </LocalizedLink>
            </div>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="font-bebas text-xl md:text-2xl uppercase tracking-wider text-mint mb-4 md:mb-6">
              {t("footer.get_in_touch", "Get In Touch")}
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <a
                href="mailto:info@fuelforfootball.com"
                className="flex items-center gap-3 text-mint-dim hover:text-primary transition-colors text-sm"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span>info@fuelforfootball.com</span>
              </a>
              <a
                href="https://wa.me/447742431806"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-mint-dim hover:text-primary transition-colors text-sm"
              >
                <FaWhatsapp className="w-4 h-4 text-primary" />
                <span>+44 7742431806</span>
              </a>
            </div>

            <WorkWithUsDialog>
              <Button 
                size="lg"
                hoverEffect
                className="w-full btn-shine font-bebas uppercase tracking-wider text-lg mb-3"
              >
                {t("footer.contact_us", "Contact Us")}
              </Button>
            </WorkWithUsDialog>
            <WorkWithUsDialog open={connectOpen} onOpenChange={setConnectOpen}>
              <Button 
                variant="outline"
                size="lg"
                hoverEffect
                className="w-full font-bebas uppercase tracking-wider text-lg border-primary/50 text-primary hover:bg-primary/10"
              >
                {t("footer.connect", "Connect")}
              </Button>
            </WorkWithUsDialog>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-bebas text-xl md:text-2xl uppercase tracking-wider text-mint mb-4 md:mb-6">
              {t("footer.follow_us", "Follow Us")}
            </h3>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <a
                href="https://www.instagram.com/FuelForFootball"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all group"
              >
                <FaInstagram className="w-4 h-4 text-primary" />
                <span className="text-xs font-bebas uppercase tracking-wider text-mint group-hover:text-primary transition-colors">Instagram</span>
              </a>
              <a
                href="https://x.com/fuelforfootball"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all group"
              >
                <FaTwitter className="w-4 h-4 text-primary" />
                <span className="text-xs font-bebas uppercase tracking-wider text-mint group-hover:text-primary transition-colors">Twitter</span>
              </a>
              <a
                href="https://www.linkedin.com/company/fuel-for-football"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all group"
              >
                <FaLinkedin className="w-4 h-4 text-primary" />
                <span className="text-xs font-bebas uppercase tracking-wider text-mint group-hover:text-primary transition-colors">LinkedIn</span>
              </a>
              <a
                href="https://www.youtube.com/@FuelForFootball"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all group"
              >
                <FaYoutube className="w-4 h-4 text-primary" />
                <span className="text-xs font-bebas uppercase tracking-wider text-mint group-hover:text-primary transition-colors">YouTube</span>
              </a>
              <a
                href="https://www.facebook.com/fuelforfooty"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all group"
              >
                <FaFacebook className="w-4 h-4 text-primary" />
                <span className="text-xs font-bebas uppercase tracking-wider text-mint group-hover:text-primary transition-colors">Facebook</span>
              </a>
              <a
                href="https://open.spotify.com/show/1Ep6k8p6j4rMT1a0AFqX8C"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all group"
              >
                <FaSpotify className="w-4 h-4 text-primary" />
                <span className="text-xs font-bebas uppercase tracking-wider text-mint group-hover:text-primary transition-colors">Podcast</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all group"
              >
                <FaTelegram className="w-4 h-4 text-primary" />
                <span className="text-xs font-bebas uppercase tracking-wider text-mint group-hover:text-primary transition-colors">Telegram</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-primary/5 hover:bg-primary/10 rounded-lg border border-primary/20 hover:border-primary/40 transition-all group"
              >
                <FaSnapchatGhost className="w-4 h-4 text-primary" />
                <span className="text-xs font-bebas uppercase tracking-wider text-mint group-hover:text-primary transition-colors">Snapchat</span>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="max-w-xl mx-auto text-center mb-8 md:mb-12 p-4 md:p-6 bg-primary/10 rounded-xl border border-primary/20">
          <h4 className="font-bebas text-lg md:text-xl uppercase tracking-wider text-mint mb-2">
            Keep Updated With Our New Packages And Offers
          </h4>
          <p className="text-xs md:text-sm text-mint-dim mb-4">Subscribe to our newsletter</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-[hsl(120_40%_12%)] border-primary/30 text-mint placeholder:text-mint-dim/50"
              required
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="font-bebas uppercase tracking-wider px-6"
            >
              {isSubmitting ? "..." : "Subscribe"}
            </Button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 md:pt-8 border-t border-primary/10">
          <p className="text-[10px] md:text-xs text-mint-dim/80 text-center max-w-3xl mx-auto mb-4 md:mb-6 px-2 md:px-4">
            {t("footer.regulatory_text", "Fuel For Football operates in accordance with the regulatory frameworks established by FIFA and UEFA. Our work follows the standards required for player representation, governance and integrity.")}
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-xs md:text-sm text-mint-dim">
              © {new Date().getFullYear()} Fuel For Football. {t("footer.all_rights_reserved", "All rights reserved.")}
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              <a 
                href="https://open.spotify.com/show/1Ep6k8p6j4rMT1a0AFqX8C" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-mint-dim hover:text-primary transition-colors font-bebas uppercase tracking-wider"
              >
                Fuel For Football Podcast
              </a>
              <Link to="/privacy-policy" className="text-sm text-mint-dim hover:text-primary transition-colors font-bebas uppercase tracking-wider">
                {t("footer.privacy_policy", "Privacy Policy")}
              </Link>
              <a 
                href="/FIFA_Football_Agent_Regulations.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-mint-dim hover:text-primary transition-colors font-bebas uppercase tracking-wider"
              >
                {t("footer.regulations", "REGULATIONS")}
              </a>
              <a 
                href="https://www.fifa.com/legal/football-regulatory/agents" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-mint-dim hover:text-primary transition-colors font-bebas uppercase tracking-wider"
              >
                {t("footer.fifa_framework", "FIFA Framework")}
              </a>
              <a 
                href="https://www.uefa.com/insideuefa/protecting-the-game/football-regulatory" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-mint-dim hover:text-primary transition-colors font-bebas uppercase tracking-wider"
              >
                {t("footer.uefa_framework", "UEFA Framework")}
              </a>
            </div>
          </div>
          <p className="text-[10px] text-mint-dim/40 text-center mt-4">
            Build: {BUILD_VERSION}
          </p>
        </div>
      </div>
    </footer>
  );
};