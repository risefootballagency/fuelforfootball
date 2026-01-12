import { useEffect, useRef } from "react";

export const LandingCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Direct DOM manipulation - no React re-renders
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        cursor.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      if (cursor) {
        cursor.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[3] opacity-0"
      style={{
        transform: 'translate(-50%, -50%)',
        willChange: 'left, top',
      }}
    >
      {/* Mint green dot cursor */}
      <div className="w-3 h-3 rounded-full bg-[hsl(var(--mint))] shadow-[0_0_10px_hsl(var(--mint)/0.5)]" />
      <div className="absolute inset-0 w-6 h-6 -translate-x-1.5 -translate-y-1.5 border border-[hsl(var(--mint)/0.4)] rounded-full animate-pulse" />
    </div>
  );
};
