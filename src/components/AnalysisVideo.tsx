import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface AnalysisVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Global registry to track currently playing video
let currentlyPlayingVideo: HTMLVideoElement | null = null;

export const AnalysisVideo = forwardRef<HTMLVideoElement, AnalysisVideoProps>(({ src, className, style, children }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => videoRef.current!);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Pause currently playing video if different
            if (currentlyPlayingVideo && currentlyPlayingVideo !== video) {
              currentlyPlayingVideo.pause();
            }
            // Play this video
            video.play().catch(() => {
              // Ignore autoplay errors (browser policy)
            });
            currentlyPlayingVideo = video;
          } else {
            // Pause when scrolled away
            video.pause();
            if (currentlyPlayingVideo === video) {
              currentlyPlayingVideo = null;
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      if (currentlyPlayingVideo === video) {
        currentlyPlayingVideo = null;
      }
    };
  }, []);

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      currentlyPlayingVideo = video;
    } else {
      video.pause();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        className={`${className ?? ''} cursor-pointer`}
        style={style}
        onClick={handleClick}
      />
      {children}
    </div>
  );
});

AnalysisVideo.displayName = 'AnalysisVideo';
