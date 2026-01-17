import { useEffect, useRef } from "react";

interface AnalysisVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

// Global registry to track currently playing video
let currentlyPlayingVideo: HTMLVideoElement | null = null;

export const AnalysisVideo = ({ src, className, style }: AnalysisVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        className={className}
        style={style}
      />
    </div>
  );
};
