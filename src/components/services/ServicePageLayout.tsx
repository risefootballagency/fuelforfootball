import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlayersSubmenu } from "@/components/PlayersSubmenu";
import { AnimatedSmokyBackground } from "@/components/AnimatedSmokyBackground";
import { HoverText } from "@/components/HoverText";
import { SEO } from "@/components/SEO";
import { ReactNode } from "react";

interface ServicePageLayoutProps {
  children: ReactNode;
  category: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  heroVideo?: string;
  showSubmenu?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  seoUrl?: string;
}

export const ServicePageLayout = ({ 
  children, 
  category, 
  title, 
  subtitle,
  heroImage,
  heroVideo,
  showSubmenu = true,
  seoTitle,
  seoDescription,
  seoImage,
  seoUrl
}: ServicePageLayoutProps) => {
  const hasMedia = heroImage || heroVideo;
  const defaultSeoTitle = `${title} - Fuel For Football`;
  const defaultSeoDescription = subtitle || `${title} services from Fuel For Football - Elite football performance consultancy.`;

  return (
    <>
      <SEO 
        title={seoTitle || defaultSeoTitle}
        description={seoDescription || defaultSeoDescription}
        image={seoImage}
        url={seoUrl}
      />
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated smoky background for entire page - fixed behind all content */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <AnimatedSmokyBackground />
        </div>
      
      {/* Main content wrapper - transparent to show smoky bg */}
      <div className="relative z-10">
        <Header />
        <main className="pt-14 md:pt-16">
          {/* Players Submenu - tight against header */}
          {showSubmenu && <PlayersSubmenu />}
          
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Media Background */}
            {hasMedia && (
              <div className="absolute inset-0 z-0">
                {heroVideo ? (
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src={heroVideo} type="video/mp4" />
                  </video>
                ) : heroImage ? (
                  <img 
                    src={heroImage} 
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : null}
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
              </div>
            )}
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <p className={`font-bebas text-lg md:text-xl tracking-[0.3em] mb-4 animate-fade-in ${hasMedia ? 'text-white' : 'text-primary'}`}>
                {category}
              </p>
              <h1 className={`font-bebas text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 leading-[0.95] animate-fade-in [animation-delay:100ms] ${hasMedia ? 'text-white drop-shadow-lg' : 'text-foreground'}`}>
                {title.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < title.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h1>
              {subtitle && (
                <p className={`max-w-2xl mx-auto text-base md:text-lg leading-relaxed animate-fade-in [animation-delay:200ms] ${hasMedia ? 'text-white/90' : 'text-muted-foreground'}`}>
                  {subtitle}
                </p>
              )}
            </div>
          </section>
          
          {children}
        </main>
        <Footer />
      </div>
    </div>
    </>
  );
};

// Shared section components
export const ServiceSection = ({ 
  children, 
  className = "",
  dark = false,
  id
}: { 
  children: ReactNode; 
  className?: string;
  dark?: boolean;
  id?: string;
}) => (
  <section 
    id={id}
    className={`py-4 md:py-6 relative ${dark ? 'bg-black/30 backdrop-blur-sm' : ''} ${className}`}
  >
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {children}
    </div>
  </section>
);

export const ServiceSectionTitle = ({ 
  children,
  className = ""
}: { 
  children: ReactNode;
  className?: string;
}) => (
  <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-4 md:mb-6">
    <div 
      className="w-screen relative left-1/2 -translate-x-1/2 py-3 md:py-4 overflow-hidden border-y-4 border-accent"
      style={{
        backgroundImage: `url('/grass-bg-smoky.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className={`font-bebas text-2xl md:text-3xl lg:text-4xl text-white text-center tracking-[0.2em] drop-shadow-lg ${className}`}>
        <HoverText text={typeof children === 'string' ? children : String(children)} />
      </h2>
    </div>
  </div>
);

export const ServicePillars = ({ 
  pillars 
}: { 
  pillars: Array<{ icon: string; label: string }> 
}) => (
  <section className="py-10 md:py-14 bg-black/20 backdrop-blur-sm">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`grid grid-cols-2 md:grid-cols-${Math.min(pillars.length, 4)} gap-6 md:gap-8 max-w-4xl mx-auto`}>
        {pillars.map((pillar, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center gap-4 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 group-hover:border-accent/50 transition-all duration-300">
              <img 
                src={pillar.icon}
                alt={pillar.label}
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
            </div>
            <span className="font-bebas text-sm md:text-base tracking-[0.15em] text-white text-center drop-shadow-md">
              {pillar.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ServiceContentBlock = ({ 
  paragraphs,
  className = ""
}: { 
  paragraphs: string[];
  className?: string;
}) => (
  <div className={`max-w-4xl mx-auto space-y-5 ${className}`}>
    {paragraphs.map((text, index) => (
      <p 
        key={index} 
        className="text-white/80 text-sm md:text-base leading-relaxed"
      >
        {text}
      </p>
    ))}
  </div>
);

export const ServiceCard = ({ 
  image, 
  title, 
  price, 
  link,
  description,
  featured = false
}: { 
  image?: string; 
  title: string; 
  price?: string;
  link: string;
  description?: string;
  featured?: boolean;
}) => (
  <div className={`group bg-black/40 backdrop-blur-sm border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 ${featured ? 'border-accent' : 'border-white/20 hover:border-accent/50'}`}>
    {image && (
      <div className="aspect-square overflow-hidden">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    )}
    <div className="p-5 md:p-6">
      <h3 className="font-bebas text-lg md:text-xl text-white mb-2">{title}</h3>
      {description && (
        <p className="text-white/70 text-sm mb-3 line-clamp-2">{description}</p>
      )}
      {price && (
        <p className="font-bebas text-lg text-accent mb-4">{price}</p>
      )}
      <a href={link} className="block">
        <button className={`w-full py-2.5 px-4 font-bebas tracking-wider text-sm rounded-lg transition-all duration-200 ${featured ? 'bg-accent text-black hover:bg-accent/90' : 'border border-white/30 text-white hover:border-accent hover:text-accent'}`}>
          {price ? 'Get Started' : 'See Options'}
        </button>
      </a>
    </div>
  </div>
);

export const ServiceInfoCard = ({ 
  title, 
  subtitle,
  content,
  items,
  featured = false
}: { 
  title: string; 
  subtitle?: string;
  content?: string;
  items?: string[];
  featured?: boolean;
}) => (
  <div className={`bg-black/40 backdrop-blur-sm border rounded-xl p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 ${featured ? 'border-accent' : 'border-white/20'}`}>
    <h3 className="font-bebas text-xl md:text-2xl text-accent mb-2">{title}</h3>
    {subtitle && (
      <p className="text-xs md:text-sm text-white/60 mb-4">{subtitle}</p>
    )}
    {content && (
      <p className="text-white/80 text-sm md:text-base leading-relaxed">{content}</p>
    )}
    {items && (
      <ul className="space-y-2.5 text-white/80 text-sm md:text-base">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export const ServiceFullPackage = () => (
  <ServiceSection>
    <ServiceSectionTitle>THE FULL PACKAGE</ServiceSectionTitle>
    
    <p className="text-white/80 text-sm md:text-base text-center max-w-4xl mx-auto mb-10 md:mb-14 leading-relaxed">
      The ultimate level of service to help you take your game to the next level. Our larger programs offer a comprehensive range of individualised services. Work on multiple aspects of your performance and improve effectively both in and out of season.
    </p>
    
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
      <ServiceInfoCard
        title="PRO PERFORMANCE PROGRAMME"
        items={[
          "Nutrition Programming",
          "Strength, Power & Speed Programming",
          "Conditioning Programming",
          "Technical Programming"
        ]}
      />
      
      <ServiceInfoCard
        title="ELITE PERFORMANCE PROGRAMME"
        featured
        items={[
          "Nutrition Programming",
          "Strength, Power & Speed Programming",
          "Conditioning Programming",
          "Technical Programming",
          "Pre-Match Opposition Analysis",
          "Post-Match Performance Analysis",
          "Mental Skill Sessions",
          "Mental Will Sessions",
          "Player Efficiency Reports",
          "Mentorship",
          "Recovery, Mobility & Injury Prevention"
        ]}
      />
    </div>
  </ServiceSection>
);

export const ServiceDivider = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
);
