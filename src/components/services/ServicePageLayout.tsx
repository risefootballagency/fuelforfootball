import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlayersSubmenu } from "@/components/PlayersSubmenu";
import { ReactNode } from "react";

interface ServicePageLayoutProps {
  children: ReactNode;
  category: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  heroVideo?: string;
  showSubmenu?: boolean;
}

export const ServicePageLayout = ({ 
  children, 
  category, 
  title, 
  subtitle,
  heroImage,
  heroVideo,
  showSubmenu = true
}: ServicePageLayoutProps) => {
  const hasMedia = heroImage || heroVideo;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Players Submenu */}
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

          {/* Gradient overlay (non-media) */}
          {!hasMedia && (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/3 rounded-full blur-2xl pointer-events-none" />
            </>
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
    className={`py-16 md:py-24 relative ${dark ? 'bg-card/40' : ''} ${className}`}
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
  <h2 className={`font-bebas text-2xl md:text-3xl lg:text-4xl text-primary text-center mb-10 md:mb-14 tracking-[0.2em] ${className}`}>
    {children}
  </h2>
);

export const ServicePillars = ({ 
  pillars 
}: { 
  pillars: Array<{ icon: string; label: string }> 
}) => (
  <section className="py-10 md:py-14 bg-gradient-to-b from-card/60 to-card/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`grid grid-cols-2 md:grid-cols-${Math.min(pillars.length, 4)} gap-6 md:gap-8 max-w-4xl mx-auto`}>
        {pillars.map((pillar, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center gap-4 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
              <img 
                src={pillar.icon}
                alt={pillar.label}
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
            </div>
            <span className="font-bebas text-sm md:text-base tracking-[0.15em] text-foreground text-center">
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
        className="text-muted-foreground text-sm md:text-base leading-relaxed"
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
  <div className={`group bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 ${featured ? 'border-primary' : 'border-border hover:border-primary/50'}`}>
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
      <h3 className="font-bebas text-lg md:text-xl text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
      )}
      {price && (
        <p className="font-bebas text-lg text-primary mb-4">{price}</p>
      )}
      <a href={link} className="block">
        <button className={`w-full py-2.5 px-4 font-bebas tracking-wider text-sm rounded-lg transition-all duration-200 ${featured ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border hover:border-primary hover:text-primary'}`}>
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
  <div className={`bg-card border rounded-xl p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${featured ? 'border-primary' : 'border-border'}`}>
    <h3 className="font-bebas text-xl md:text-2xl text-primary mb-2">{title}</h3>
    {subtitle && (
      <p className="text-xs md:text-sm text-muted-foreground mb-4">{subtitle}</p>
    )}
    {content && (
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{content}</p>
    )}
    {items && (
      <ul className="space-y-2.5 text-muted-foreground text-sm md:text-base">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
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
    
    <p className="text-muted-foreground text-sm md:text-base text-center max-w-4xl mx-auto mb-10 md:mb-14 leading-relaxed">
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
