import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface NavItem {
  label: string;
  items: {
    label: string;
    link: string;
    description: string;
  }[];
}

// Navigation items for the players submenu with descriptions
const navItems: NavItem[] = [
  {
    label: "General",
    items: [
      { label: "Consultation", link: "/consultation", description: "One-on-one expert guidance to identify your development needs and create a personalized pathway." },
      { label: "Pro Performance", link: "/pro-performance", description: "Our flagship programme for professional players seeking elite-level holistic development." },
      { label: "Elite Performance", link: "/elite-performance", description: "Comprehensive training for aspiring professionals ready to take the next step." },
    ]
  },
  {
    label: "Holistic",
    items: [
      { label: "Pro Performance", link: "/pro-performance", description: "Full-spectrum development covering tactical, technical, physical and mental pillars." },
      { label: "Elite Performance", link: "/elite-performance", description: "Structured progression across all performance areas for emerging talent." },
      { label: "Mentorship", link: "/mentorship", description: "Ongoing support and guidance from experienced football performance specialists." },
    ]
  },
  {
    label: "Tactical",
    items: [
      { label: "Tactical Overview", link: "/tactical", description: "Video analysis and tactical education to enhance decision-making and game intelligence." },
      { label: "Action Reports", link: "/action-reports", description: "Detailed breakdown of your on-ball actions with specific improvement recommendations." },
    ]
  },
  {
    label: "Technical",
    items: [
      { label: "Technical Training", link: "/technical", description: "Master your touch, improve finishing and develop unpredictable skills to beat opponents." },
    ]
  },
  {
    label: "Mental",
    items: [
      { label: "Psychological Performance", link: "/mental", description: "Build mental resilience, focus and confidence to perform consistently under pressure." },
    ]
  },
  {
    label: "Physical",
    items: [
      { label: "Strength, Power & Speed", link: "/strength-power-speed", description: "Develop explosive power and acceleration to dominate physical battles on the pitch." },
      { label: "Conditioning", link: "/conditioning", description: "Build endurance and work capacity to maintain peak performance throughout matches." },
      { label: "Nutrition", link: "/nutrition", description: "Optimize your diet to fuel training, recovery and match-day performance." },
    ]
  },
];

interface PlayersSubmenuProps {
  className?: string;
}

export const PlayersSubmenu = ({ className = "" }: PlayersSubmenuProps) => {
  return (
    <nav className={`bg-[#0a3622] border-2 border-[#0a3622] ${className}`}>
      <div className="w-full">
        <div className="flex flex-wrap justify-center">
          {navItems.map((item, index) => {
            // Determine dropdown alignment based on position
            const isFirst = index === 0;
            const isLast = index === navItems.length - 1;
            
            return (
              <div key={index} className="group relative w-1/3 md:w-auto md:flex-1">
                <div className="px-2 md:px-6 py-2 md:py-3 text-[#c4a000] font-bebas uppercase tracking-widest text-[10px] md:text-sm hover:bg-[#c4a000] hover:text-[#0a3622] transition-all duration-300 inline-flex items-center justify-center gap-0.5 md:gap-1.5 border-r border-[#c4a000]/20 last:border-r-0 w-full cursor-pointer">
                  {item.label} <ChevronDown className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:rotate-180 transition-transform duration-300" />
                </div>
                {/* Glass-morphism Dropdown with smart positioning - mobile uses left-0 for all */}
                <div 
                  className={`absolute top-full min-w-[280px] md:min-w-[320px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pt-2 left-0 md:left-auto ${
                    isFirst 
                      ? 'md:left-0' 
                      : isLast 
                        ? 'md:right-0 md:left-auto' 
                        : 'md:left-1/2 md:-translate-x-1/2'
                  }`}
                >
                  <div className="backdrop-blur-xl bg-black/70 border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.link}
                        className="block px-5 py-4 hover:bg-white/10 transition-colors duration-200 border-b border-white/5 last:border-b-0"
                      >
                        <span className="block text-white font-bebas uppercase tracking-wider text-sm md:text-base">
                          {subItem.label}
                        </span>
                        <span className="block text-white/60 text-xs md:text-sm font-sans mt-1 leading-relaxed">
                          {subItem.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
