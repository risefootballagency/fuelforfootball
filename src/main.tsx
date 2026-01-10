// Redirect www.{subdomain}.domain.com → {subdomain}.domain.com
// Also translates English paths to localized paths for language subdomains
// Must run before React renders to avoid flash of content
(function() {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Language subdomains and their route translations
  const LANGUAGE_SUBDOMAINS = ['en', 'es', 'pt', 'fr', 'de', 'it', 'pl', 'cs', 'cz', 'ru', 'tr', 'hr', 'no'];
  const routeTranslations: Record<string, Record<string, string>> = {
    '/players': { en: '/players', es: '/jugadoras', pt: '/jogadoras', fr: '/joueurs', de: '/spielerinnen', it: '/giocatrici', pl: '/zawodniczki', cs: '/hracky', ru: '/igroki', tr: '/oyuncular' },
    '/learnmore': { en: '/learnmore', es: '/aprender-mas', pt: '/saiba-mais', fr: '/en-savoir-plus', de: '/erfahren-mehr', it: '/scopri-di-piu', pl: '/dowiedz-sie-wiecej', cs: '/zjistit-vice', ru: '/uznat-bolshe', tr: '/daha-fazla-bilgi' },
    '/stars': { en: '/stars', es: '/estrellas', pt: '/estrelas', fr: '/etoiles', de: '/sterne', it: '/stelle', pl: '/gwiazdy', cs: '/hvezdy', ru: '/zvezdy', tr: '/yildizlar' },
    '/clubs': { en: '/clubs', es: '/clubes', pt: '/clubes', fr: '/clubs', de: '/vereine', it: '/club', pl: '/kluby', cs: '/kluby', ru: '/kluby', tr: '/kulupler' },
    '/scouts': { en: '/scouts', es: '/ojeadores', pt: '/olheiros', fr: '/recruteurs', de: '/scouts', it: '/osservatori', pl: '/skauci', cs: '/skauti', ru: '/skauty', tr: '/skautlar' },
    '/coaches': { en: '/coaches', es: '/entrenadores', pt: '/treinadores', fr: '/entraineurs', de: '/trainer', it: '/allenatori', pl: '/trenerzy', cs: '/treneri', ru: '/trenery', tr: '/antrenorler' },
    '/agents': { en: '/agents', es: '/agentes', pt: '/agentes', fr: '/agents', de: '/agenten', it: '/agenti', pl: '/agenci', cs: '/agenti', ru: '/agenty', tr: '/menajerler' },
    '/about': { en: '/about', es: '/nosotros', pt: '/sobre', fr: '/a-propos', de: '/ueber-uns', it: '/chi-siamo', pl: '/o-nas', cs: '/o-nas', ru: '/o-nas', tr: '/hakkimizda' },
    '/news': { en: '/news', es: '/noticias', pt: '/noticias', fr: '/actualites', de: '/nachrichten', it: '/notizie', pl: '/aktualnosci', cs: '/novinky', ru: '/novosti', tr: '/haberler' },
    '/contact': { en: '/contact', es: '/contacto', pt: '/contato', fr: '/contact', de: '/kontakt', it: '/contatti', pl: '/kontakt', cs: '/kontakt', ru: '/kontakty', tr: '/iletisim' },
    '/performance': { en: '/performance', es: '/rendimiento', pt: '/desempenho', fr: '/performance', de: '/leistung', it: '/prestazioni', pl: '/wydajnosc', cs: '/vykon', ru: '/rezultaty', tr: '/performans' },
    '/between-the-lines': { en: '/between-the-lines', es: '/entre-lineas', pt: '/entre-linhas', fr: '/entre-les-lignes', de: '/zwischen-den-zeilen', it: '/tra-le-righe', pl: '/miedzy-wierszami', cs: '/mezi-radky', ru: '/mezhdu-strok', tr: '/satirlar-arasi' },
    '/daily-fuel': { en: '/daily-fuel', es: '/combustible-diario', pt: '/combustivel-diario', fr: '/carburant-quotidien', de: '/taeglicher-treibstoff', it: '/carburante-quotidiano', pl: '/codzienne-paliwo', cs: '/denni-palivo', ru: '/ezhednevnoe-toplivo', tr: '/gunluk-yakit' },
    '/login': { en: '/login', es: '/acceso', pt: '/entrar', fr: '/connexion', de: '/anmelden', it: '/accedi', pl: '/logowanie', cs: '/prihlaseni', ru: '/vhod', tr: '/giris' },
    '/portal': { en: '/portal', es: '/portal', pt: '/portal', fr: '/portail', de: '/portal', it: '/portale', pl: '/portal', cs: '/portal', ru: '/portal', tr: '/portal' },
    '/media': { en: '/media', es: '/medios', pt: '/midia', fr: '/medias', de: '/medien', it: '/media', pl: '/media', cs: '/media', ru: '/media', tr: '/medya' },
    '/business': { en: '/business', es: '/negocios', pt: '/negocios', fr: '/entreprise', de: '/geschaeft', it: '/affari', pl: '/biznes', cs: '/obchod', ru: '/biznes', tr: '/is' },
  };
  
  // Check for www.{subdomain}.domain.com format (4+ parts with www prefix)
  if (parts.length >= 4 && parts[0].toLowerCase() === 'www') {
    const subdomain = parts[1].toLowerCase();
    const newHostname = parts.slice(1).join('.');
    let pathname = window.location.pathname;
    
    // If it's a language subdomain, translate the path
    const langCode = subdomain === 'cz' ? 'cs' : subdomain;
    if (LANGUAGE_SUBDOMAINS.includes(subdomain) && langCode !== 'en') {
      const pathParts = pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        const basePath = '/' + pathParts[0];
        const translations = routeTranslations[basePath];
        if (translations && translations[langCode] && translations[langCode] !== basePath) {
          const rest = pathParts.slice(1).join('/');
          pathname = rest ? `${translations[langCode]}/${rest}` : translations[langCode];
        }
      }
    }
    
    const newUrl = `${window.location.protocol}//${newHostname}${pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(newUrl);
  }
})();

import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { VersionManager } from "./lib/versionManager";

// Force version check and cache clear on load
const initializeApp = async () => {
  try {
    console.log('[App] Checking for updates...');
    const versionInfo = await VersionManager.initialize(true);
    
    if (versionInfo.hasUpdate) {
      console.log('[App] New version detected! Clearing caches and reloading...');
      await VersionManager.forceUpdate();
      return; // forceUpdate will reload the page
    }
    
    console.log('[App] Running version:', versionInfo.version);
  } catch (error) {
    console.error('[App] Version check failed:', error);
  }
};

// Run version check immediately
initializeApp();

// Register service worker with aggressive update detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none' // Always fetch sw.js fresh
      });
      console.log('[PWA] Service Worker registered');
      
      // Check for updates immediately
      try {
        await registration.update();
      } catch {
        // Silently ignore update errors
      }
      
      // Listen for new service worker activation
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('[PWA] New service worker installing...');
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New service worker installed, triggering update...');
              // New service worker is ready, tell it to take over
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }
      });
      
      // Check for updates every 2 minutes (more aggressive)
      setInterval(async () => {
        try {
          await registration.update();
        } catch {
          // Silently ignore periodic update errors
        }
      }, 2 * 60 * 1000);
    } catch {
      // Silently fail - SW is not critical for app functionality
    }
  });
  
  // Reload page when new service worker takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    console.log('[PWA] New service worker active, reloading page...');
    window.location.reload();
  });
  
  // Listen for update messages from service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SW_UPDATED') {
      console.log('[PWA] Service worker updated to:', event.data.version);
    }
  });
}

const root = createRoot(document.getElementById("root")!);

// Hide loading splash once React is mounted and ready
root.render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Remove loading splash after React has rendered - only show on /portal and /staff routes
const removeSplash = () => {
  const splash = document.getElementById('loading-splash');
  if (splash) {
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 4000);
  }
};

setTimeout(() => {
  const splash = document.getElementById('loading-splash');
  const currentPath = window.location.pathname;
  
  // Only show splash for /portal and /staff routes (exact match or starts with)
  const shouldShowSplash = currentPath === '/portal' || currentPath.startsWith('/portal/') || 
                           currentPath === '/staff' || currentPath.startsWith('/staff/');
  
  if (splash && !shouldShowSplash) {
    // Immediately hide splash on other pages
    splash.classList.add('hidden');
    setTimeout(() => splash.remove(), 500);
  } else if (splash && shouldShowSplash) {
    // For portal/staff, show for 1 second then fade out over 4 seconds
    setTimeout(() => {
      removeSplash();
    }, 1000);
    
    // Fallback: Always remove splash after 6 seconds max (for offline scenarios)
    setTimeout(() => {
      removeSplash();
    }, 6000);
  }
}, 100);