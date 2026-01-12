import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/fff_logo.png";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { LocalizedLink } from "@/components/LocalizedLink";
import { CartIcon } from "@/components/CartIcon";
import { PorscheStyleMenu } from "@/components/PorscheStyleMenu";

interface ShopHeaderProps {
  type: 'shop' | 'services' | 'customisation';
}

export const ShopHeader = ({ type }: ShopHeaderProps) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine menu type for PorscheStyleMenu
  const menuType = type === 'shop' ? 'shop' : 'services';

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-md w-full transition-all duration-500 ease-out border-b-2 border-primary`}>
      <div className="container mx-auto px-2 md:px-4">
        <div className={`flex items-center justify-between transition-all duration-500 ease-out ${isScrolled ? 'h-12 md:h-14' : 'h-14 md:h-16'}`}>
          {/* Menu Button - Opens PorscheStyleMenu */}
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <button 
                className="group relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-300 ease-out w-12 h-12 md:w-14 md:h-14" 
                aria-label="Toggle menu"
              >
                <svg 
                  className="text-primary group-hover:text-foreground transition-all duration-300 ease-out w-7 h-7 md:w-8 md:h-8" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                >
                  <line x1="4" y1="8" x2="20" y2="8" className="origin-center transition-transform duration-300 group-hover:rotate-[-45deg]" />
                  <line x1="2" y1="16" x2="18" y2="16" className="origin-center transition-transform duration-300 group-hover:rotate-[-45deg] group-hover:translate-x-1" />
                </svg>
              </button>
            </DrawerTrigger>
            <DrawerContent className="fixed inset-0 h-screen w-full !mt-0 rounded-none z-[200] overflow-hidden bg-transparent border-none">
              <PorscheStyleMenu type={menuType} />
            </DrawerContent>
          </Drawer>

          {/* Logo - Center */}
          <LocalizedLink 
            to="/players"
            className="absolute left-1/2 transform -translate-x-1/2 z-10"
          >
            <img 
              src={logo} 
              alt="Fuel For Football" 
              className={`transition-all duration-500 ease-out ${isScrolled ? 'h-9 md:h-11' : 'h-10 md:h-12'}`} 
            />
          </LocalizedLink>

          {/* Cart Icon - Right */}
          <CartIcon />
        </div>
      </div>
    </header>
  );
};
