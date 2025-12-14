import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaTelegram } from "react-icons/fa";

export const SocialSidebar = () => {
  const socialLinks = [
    { icon: FaInstagram, href: "https://www.instagram.com/FuelForFootball", label: "Instagram" },
    { icon: FaFacebook, href: "https://www.facebook.com/fuelforfooty", label: "Facebook" },
    { icon: FaYoutube, href: "https://www.youtube.com/@FuelForFootball", label: "YouTube" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/company/fuel-for-football", label: "LinkedIn" },
    { icon: FaTelegram, href: "#", label: "Telegram" },
  ];

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-1">
      {socialLinks.map((social, index) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-12 h-12 bg-background/80 backdrop-blur-sm border-r border-y border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 first:rounded-tr-lg first:border-t last:rounded-br-lg"
          title={social.label}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <social.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </a>
      ))}
    </div>
  );
};
