import { useState, useEffect } from 'react';

interface PerformanceCheckResult {
  isLowPerformance: boolean;
  isChecking: boolean;
  reason?: string;
}

export function usePerformanceCheck(): PerformanceCheckResult {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [reason, setReason] = useState<string | undefined>();

  useEffect(() => {
    const checkPerformance = async () => {
      try {
        // Check for WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          setIsLowPerformance(true);
          setReason('WebGL not supported');
          setIsChecking(false);
          return;
        }

        // Check device memory (if available)
        const nav = navigator as any;
        if (nav.deviceMemory && nav.deviceMemory < 4) {
          setIsLowPerformance(true);
          setReason('Low device memory');
          setIsChecking(false);
          return;
        }

        // Check hardware concurrency (CPU cores)
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
          setIsLowPerformance(true);
          setReason('Low CPU cores');
          setIsChecking(false);
          return;
        }

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setIsLowPerformance(true);
          setReason('Reduced motion preferred');
          setIsChecking(false);
          return;
        }

        // Simple frame rate check
        let frameCount = 0;
        const startTime = performance.now();
        
        const countFrames = () => {
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
      } catch (error) {
        // If any check fails, assume decent performance
        setIsChecking(false);
      }
    };

    checkPerformance();
  }, []);

  return { isLowPerformance, isChecking, reason };
}
