import { useState, useEffect } from 'react';

interface PerformanceCheckResult {
  isLowPerformance: boolean;
  isChecking: boolean;
  reason?: string;
}

// Run cheap checks synchronously to avoid spinner delay
function runCheapChecks(): { failed: boolean; reason?: string } {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isMobile && isTouchDevice) return { failed: true, reason: 'Mobile device detected' };

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return { failed: true, reason: 'WebGL not supported' };

  const nav = navigator as any;
  if (nav.deviceMemory && nav.deviceMemory < 4) return { failed: true, reason: 'Low device memory' };
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return { failed: true, reason: 'Low CPU cores' };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return { failed: true, reason: 'Reduced motion preferred' };

  return { failed: false };
}

export function usePerformanceCheck(): PerformanceCheckResult {
  // Run cheap checks immediately — no spinner for fast devices
  const cheapResult = runCheapChecks();

  const [isLowPerformance, setIsLowPerformance] = useState(cheapResult.failed);
  const [isChecking, setIsChecking] = useState(!cheapResult.failed); // only checking if cheap checks passed
  const [reason, setReason] = useState<string | undefined>(cheapResult.reason);

  useEffect(() => {
    // If cheap checks already failed, nothing more to do
    if (cheapResult.failed) {
      setIsChecking(false);
      return;
    }

    // Run FPS test in background — page is already visible
    let frameCount = 0;
    const startTime = performance.now();
    let cancelled = false;

    const countFrames = () => {
      if (cancelled) return;
      frameCount++;
      if (performance.now() - startTime < 500) {
        requestAnimationFrame(countFrames);
      } else {
        const fps = (frameCount / 500) * 1000;
        if (fps < 30) {
          setIsLowPerformance(true);
          setReason('Low frame rate detected');
        }
        setIsChecking(false);
      }
    };

    requestAnimationFrame(countFrames);
    return () => { cancelled = true; };
  }, []);

  return { isLowPerformance, isChecking, reason };
}
