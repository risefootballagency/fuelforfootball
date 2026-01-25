// CRITICAL: This sets the correct manifest BEFORE browser PWA detection
// It only runs on initial page load, NOT during React Router navigation
(function() {
  const path = window.location.pathname;
  const manifestLink = document.getElementById('manifest-link');
  const appleTitle = document.getElementById('apple-title');
  
  if (!manifestLink) return;
  
  let newManifest = null;
  let newTitle = 'Fuel For Football';
  
  if (path.startsWith('/portal')) {
    newManifest = '/manifest-player.json';
    newTitle = 'FFF Player Portal';
  } else if (path.startsWith('/staff')) {
    newManifest = '/manifest-staff.json';
    newTitle = 'FFF Staff Portal';
  }
  
  if (newManifest) {
    manifestLink.href = newManifest;
    manifestLink.rel = 'manifest';
  } else {
    manifestLink.removeAttribute('href');
    manifestLink.removeAttribute('rel');
  }
  if (appleTitle) {
    appleTitle.content = newTitle;
  }
  console.log('[PWA] Manifest set to:', newManifest, 'for path:', path);
})();
