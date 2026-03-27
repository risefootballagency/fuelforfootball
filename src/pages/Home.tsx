import { useMemo, lazy, Suspense } from 'react';
import { getSubdomainInfo } from '@/lib/subdomainUtils';

// Lazy-load all subdomain pages to match App.tsx code splitting
const Landing = lazy(() => import('./Landing'));
const Dashboard = lazy(() => import('./Dashboard'));
const Scouts = lazy(() => import('./Scouts'));
const PlayersIntro = lazy(() => import('./PlayersIntro'));
const Clubs = lazy(() => import('./Clubs'));
const Agents = lazy(() => import('./Agents'));
const Coaches = lazy(() => import('./Coaches'));
const Media = lazy(() => import('./Media'));
const Business = lazy(() => import('./Business'));

// Map subdomains to their page components
const subdomainComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'portal': Dashboard,
  'scouts': Scouts,
  'players': PlayersIntro,
  'clubs': Clubs,
  'agents': Agents,
  'coaches': Coaches,
  'media': Media,
  'business': Business,
};

const Home = () => {
  const subdomainInfo = useMemo(() => getSubdomainInfo(), []);
  
  // If we have a role subdomain with a matching component, render it
  if (subdomainInfo.type === 'role' && subdomainInfo.subdomain && subdomainComponents[subdomainInfo.subdomain]) {
    const PageComponent = subdomainComponents[subdomainInfo.subdomain];
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <PageComponent />
      </Suspense>
    );
  }
  
  // Default to PlayersIntro page
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PlayersIntro />
    </Suspense>
  );
};

export default Home;
