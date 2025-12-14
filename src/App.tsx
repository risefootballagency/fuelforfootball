import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PageTracker } from "@/components/PageTracker";
import { PageTransition } from "@/components/PageTransition";
import { TransitionProvider } from "@/contexts/TransitionContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useSubdomainRouter } from "@/hooks/useSubdomainRouter";
import { useLocalizedRedirect } from "@/hooks/useLocalizedRedirect";
import { getAllPathVariants } from "@/lib/localizedRoutes";

// Critical pages - loaded immediately
import Home from "./pages/Home";
import News from "./pages/News";
const Services = lazy(() => import("./pages/Services"));
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages for better initial load performance
const Landing = lazy(() => import("./pages/Landing"));
const Index = lazy(() => import("./pages/Index"));
const Staff = lazy(() => import("./pages/Staff"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Clubs = lazy(() => import("./pages/Clubs"));
const Coaches = lazy(() => import("./pages/Coaches"));
const Scouts = lazy(() => import("./pages/Scouts"));
const Agents = lazy(() => import("./pages/Agents"));
const Business = lazy(() => import("./pages/Business"));
const Media = lazy(() => import("./pages/Media"));
const Performance = lazy(() => import("./pages/NewPerformance"));
const DailyFuel = lazy(() => import("./pages/BetweenTheLines"));
const PerformanceReport = lazy(() => import("./pages/PerformanceReport"));
const ImportProgramCSV = lazy(() => import("./pages/ImportProgramCSV"));
const ReplaceProgram = lazy(() => import("./pages/ReplaceProgram"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const AnalysisViewer = lazy(() => import("./pages/AnalysisViewer"));
const Intro = lazy(() => import("./pages/Intro"));
const PDFViewer = lazy(() => import("./pages/PDFViewer"));
const ScoutPortal = lazy(() => import("./pages/ScoutPortal"));
const RealisePotential = lazy(() => import("./pages/RealisePotential"));
const Shop = lazy(() => import("./pages/Shop"));
const FluidCursor = lazy(() => import("./components/FluidCursor"));

// Service pages
const Mentorship = lazy(() => import("./pages/services/Mentorship"));
const Consultation = lazy(() => import("./pages/services/Consultation"));
const ProPerformance = lazy(() => import("./pages/services/ProPerformance"));
const ElitePerformance = lazy(() => import("./pages/services/ElitePerformance"));
const Tactical = lazy(() => import("./pages/services/Tactical"));
const Technical = lazy(() => import("./pages/services/Technical"));
const Mental = lazy(() => import("./pages/services/Mental"));
const StrengthPowerSpeed = lazy(() => import("./pages/services/StrengthPowerSpeed"));
const Conditioning = lazy(() => import("./pages/services/Conditioning"));
const Nutrition = lazy(() => import("./pages/services/Nutrition"));

import { SocialSidebar } from "./components/SocialSidebar";

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse text-primary font-bebas text-2xl tracking-wider">Loading...</div>
  </div>
);

const queryClient = new QueryClient();

const SubdomainRouter = () => {
  useSubdomainRouter();
  useLocalizedRedirect();
  return null;
};

// Helper to create routes for all language variants
const createLocalizedRoutes = (englishPath: string, element: React.ReactNode) => {
  const variants = getAllPathVariants(englishPath);
  return variants.map((path) => (
    <Route key={path} path={path} element={element} />
  ));
};

// Helper for dynamic routes (with parameters)
const createLocalizedDynamicRoutes = (englishPath: string, element: React.ReactNode) => {
  const basePath = englishPath.split('/:')[0];
  const param = englishPath.split('/:')[1];
  const variants = getAllPathVariants(basePath);
  return variants.map((path) => (
    <Route key={`${path}/:${param}`} path={`${path}/:${param}`} element={element} />
  ));
};

const App = () => {
  usePushNotifications();
  
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SubdomainRouter />
            <TransitionProvider>
            <Suspense fallback={null}>
              <FluidCursor />
            </Suspense>
            <SocialSidebar />
            <PageTracker />
            <ScrollToTop />
            <PageTransition>
              {(displayLocation) => (
                <main>
                  <Suspense fallback={<PageLoader />}>
                  <Routes location={displayLocation}>
                    <Route path="/" element={<Home />} />
                    <Route path="/intro" element={<Intro />} />
                    
                    {/* Localized routes */}
                    {createLocalizedRoutes('/clubs', <Clubs />)}
                    {createLocalizedRoutes('/coaches', <Coaches />)}
                    {createLocalizedRoutes('/scouts', <Scouts />)}
                    {createLocalizedRoutes('/agents', <Agents />)}
                    {createLocalizedRoutes('/business', <Business />)}
                    {createLocalizedRoutes('/media', <Media />)}
                    {createLocalizedRoutes('/performance', <Performance />)}
                    {createLocalizedRoutes('/services', <Services />)}
                    {createLocalizedRoutes('/daily-fuel', <DailyFuel />)}
                    {createLocalizedDynamicRoutes('/daily-fuel/:articleId', <News />)}
                    {createLocalizedRoutes('/contact', <Contact />)}
                    {createLocalizedRoutes('/about', <About />)}
                    {createLocalizedRoutes('/login', <Login />)}
                    {createLocalizedRoutes('/portal', <Dashboard />)}
                    {createLocalizedRoutes('/shop', <Shop />)}
                    
                    {createLocalizedRoutes('/services/mentorship', <Mentorship />)}
                    {createLocalizedRoutes('/services/consultation', <Consultation />)}
                    {createLocalizedRoutes('/services/pro-performance', <ProPerformance />)}
                    {createLocalizedRoutes('/services/elite-performance', <ElitePerformance />)}
                    {createLocalizedRoutes('/services/tactical', <Tactical />)}
                    {createLocalizedRoutes('/services/technical', <Technical />)}
                    {createLocalizedRoutes('/services/mental', <Mental />)}
                    {createLocalizedRoutes('/services/strength-power-speed', <StrengthPowerSpeed />)}
                    {createLocalizedRoutes('/services/conditioning', <Conditioning />)}
                    {createLocalizedRoutes('/services/nutrition', <Nutrition />)}
                    
                    {/* Staff/Admin routes */}
                    <Route path="/staff" element={<Staff />} />
                    <Route path="/scout-portal" element={<ScoutPortal />} />
                    <Route path="/realise-potential" element={<RealisePotential />} />
                    <Route path="/performance-report/:slug" element={<PerformanceReport />} />
                    <Route path="/analysis/:analysisId" element={<AnalysisViewer />} />
                    <Route path="/import-program" element={<ImportProgramCSV />} />
                    <Route path="/replace-program" element={<ReplaceProgram />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/pdf-viewer" element={<PDFViewer />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  </Suspense>
                </main>
              )}
            </PageTransition>
            </TransitionProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
