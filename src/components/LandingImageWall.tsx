import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useXRay } from "@/contexts/XRayContext";

interface WallImage {
  id: string;
  file_url: string;
  title: string;
}

// Generate random sizes for the mismatched wall effect
const generateRandomSizes = (count: number): { width: number; height: number }[] => {
  const sizes: { width: number; height: number }[] = [];
  const baseSize = 80; // Base size in pixels
  
  for (let i = 0; i < count; i++) {
    // Random variation: 0.6x to 1.6x base size
    const widthMult = 0.6 + Math.random() * 1.0;
    const heightMult = 0.6 + Math.random() * 1.0;
    sizes.push({
      width: Math.floor(baseSize * widthMult),
      height: Math.floor(baseSize * heightMult),
    });
  }
  return sizes;
};

// Masonry-style layout for mismatched sizes
const calculatePositions = (
  sizes: { width: number; height: number }[],
  containerWidth: number,
  containerHeight: number
) => {
  const positions: { x: number; y: number; width: number; height: number; rotation: number }[] = [];
  const columns = 10;
  const rows = 10;
  const cellWidth = containerWidth / columns;
  const cellHeight = containerHeight / rows;
  
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (index >= sizes.length) break;
      
      const size = sizes[index];
      // Add some random offset within the cell for organic feel
      const offsetX = (Math.random() - 0.5) * cellWidth * 0.3;
      const offsetY = (Math.random() - 0.5) * cellHeight * 0.3;
      const rotation = (Math.random() - 0.5) * 8; // -4 to +4 degrees
      
      positions.push({
        x: col * cellWidth + cellWidth / 2 - size.width / 2 + offsetX,
        y: row * cellHeight + cellHeight / 2 - size.height / 2 + offsetY,
        width: size.width,
        height: size.height,
        rotation,
      });
      index++;
    }
  }
  
  return positions;
};

export const LandingImageWall = () => {
  const { xrayState } = useXRay();
  const [images, setImages] = useState<WallImage[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 1920, height: 1080 });
  
  // Calculate opacity based on X-ray state
  const wallOpacity = xrayState.isActive ? xrayState.intensity * 0.7 : 0;
  const cursorX = xrayState.position.x * 100;
  const cursorY = xrayState.position.y * 100;
  const bubbleRadius = 18; // Slightly larger bubble for images
  
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("marketing_gallery")
        .select("id, file_url, title")
        .eq("folder", "landing")
        .eq("file_type", "image")
        .limit(100);
      
      if (!error && data) {
        setImages(data);
      }
    };
    
    fetchImages();
    
    // Update container size on resize
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  
  // Generate stable random sizes based on image count
  const sizes = useMemo(() => {
    return generateRandomSizes(Math.min(images.length, 100));
  }, [images.length]);
  
  // Calculate positions for all images
  const positions = useMemo(() => {
    return calculatePositions(sizes, containerSize.width, containerSize.height);
  }, [sizes, containerSize]);
  
  // Don't render if no images or no x-ray active
  if (images.length === 0 || wallOpacity === 0) {
    return null;
  }
  
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 1, // Behind player (z-2) but in front of background
        opacity: wallOpacity,
        transition: "opacity 0.15s ease-out",
      }}
    >
      {/* SVG mask for the X-ray bubble effect */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <defs>
          <radialGradient id="imageWallMaskGradient" cx={`${cursorX}%`} cy={`${cursorY}%`} r={`${bubbleRadius}%`}>
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.6" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="imageWallMask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#imageWallMaskGradient)" />
          </mask>
        </defs>
      </svg>
      
      {/* Image wall container with mask applied */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: `radial-gradient(circle at ${cursorX}% ${cursorY}%, black 0%, black ${bubbleRadius * 0.7}%, transparent ${bubbleRadius}%)`,
          WebkitMaskImage: `radial-gradient(circle at ${cursorX}% ${cursorY}%, black 0%, black ${bubbleRadius * 0.7}%, transparent ${bubbleRadius}%)`,
        }}
      >
        {images.slice(0, positions.length).map((image, index) => {
          const pos = positions[index];
          if (!pos) return null;
          
          return (
            <div
              key={image.id}
              className="absolute overflow-hidden rounded shadow-lg border border-white/10"
              style={{
                left: pos.x,
                top: pos.y,
                width: pos.width,
                height: pos.height,
                transform: `rotate(${pos.rotation}deg)`,
                transformOrigin: "center center",
              }}
            >
              <img
                src={image.file_url}
                alt={image.title}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{
                  filter: "saturate(0.8) contrast(1.1)",
                }}
              />
              {/* Subtle vignette overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
