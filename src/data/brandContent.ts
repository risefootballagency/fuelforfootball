/**
 * FFF Brand Content - Centralized copy for use across the site
 * 
 * Fuel For Football is a performance consultancy (NOT an agency)
 * focusing on player development and performance.
 */

export const BRAND_CONTENT = {
  // Company overview - main description
  overview: `Fuel For Football is a performance consultancy, which focuses on player development and performance, currently working with a host of English Premier League and Football League players, alongside a range of talents from across Europe's top leagues.`,
  
  // Value proposition - what we offer
  valueProposition: `All our services are focused to your response to stimuli, allowing us to tailor training to you as an individual. As a result, in the short term, you can expect to display improved game-to-game performance. In the long term, your attributes develop, increasing your value to the team and manager. In this way, our services can provide you with greater leverage in contract discussions.`,
  
  // Services description
  servicesOverview: `We use our team of coaches to offer several services to players, ranging from power development, to psychological performance sessions and game analysis. Our premium service is the Pro Performance Programme which runs year-round, developing players beyond the training offered by their respective teams.`,
  
  // Team culture
  teamCulture: `At the centre of the company is a team of personable coaches creating relationships beyond the game with elite footballers.`,
  
  // Market gap / problem statement
  problemStatement: `Clubs at nearly every level of professional football offer good generalised training for their squads, but there is significant room for improvement when it comes to supporting individual players' performance and development. Coaches and trainers in each field of performance face challenges in working in conjunction to create superior athletes, footballers, and people.`,
  
  // The challenge clubs face
  clubChallenge: `Given the need for many clubs to monitor expenses in order to maintain a successful and sustainable business, coaches are often assigned upwards of 50 players to work with, meaning that attention to detail is incredibly hard to give. Considering the varying physiology of each professional player, in order for real progression and elite performance to be achieved, this attention to detail is a must-have.`,
  
  // Our solution
  solution: `Fuel For Football provides this much-needed service, helping players and - indirectly - clubs to achieve their maximum potential. The current roster features many Championship players, alongside a number of Premiership and European stars.`,
  
  // Taglines
  tagline: "Change The Game.",
  shortDescription: "Football's leading performance consultancy.",
  
  // Key differentiators
  differentiators: [
    "Tailored training based on individual response to stimuli",
    "Improved game-to-game performance in the short term",
    "Long-term attribute development increasing player value",
    "Greater leverage in contract discussions",
    "Personalised attention that clubs cannot provide at scale",
    "Relationships beyond the game with elite footballers"
  ],
  
  // Service categories
  serviceCategories: [
    "Power Development",
    "Psychological Performance",
    "Game Analysis",
    "Technical Training",
    "Tactical Analysis",
    "Nutrition Planning"
  ],
  
  // Premium offering
  premiumService: {
    name: "Pro Performance Programme",
    description: "Our premium service runs year-round, developing players beyond the training offered by their respective teams."
  },
  
  // Client roster description
  clientRoster: "English Premier League and Football League players, alongside talents from across Europe's top leagues.",
  
  // Short quotes/snippets for various uses
  quotes: {
    attention: "Attention to detail is a must-have for real progression and elite performance.",
    individual: "We tailor training to you as an individual.",
    leverage: "Our services provide greater leverage in contract discussions.",
    relationships: "Creating relationships beyond the game with elite footballers."
  }
} as const;

// Colors for reference (defined in index.css/tailwind)
export const BRAND_COLORS = {
  green: "#09380e",
  gold: "#ffc805", 
  white: "#f5f5f5"
} as const;
