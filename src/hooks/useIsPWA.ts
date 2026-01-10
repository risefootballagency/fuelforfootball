import { useState, useEffect } from 'react';

export function useIsPWA(): boolean {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (navigator as any).standalone === true;
    const isAndroidTWA = document.referrer.includes('android-app://');
    
    setIsPWA(isStandalone || isIOSStandalone || isAndroidTWA);
  }, []);

  return isPWA;
}
