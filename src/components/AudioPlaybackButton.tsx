import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square } from "lucide-react";

interface AudioPlaybackButtonProps {
  audioUrl: string;
}

const BRAND_GOLD = "#fdc61b";

export const AudioPlaybackButton = ({ audioUrl }: AudioPlaybackButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      audioRef.current?.pause();
      audioRef.current = null;
      setIsPlaying(false);
    } else {
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      audio.play().catch(() => setIsPlaying(false));
      audioRef.current = audio;
      setIsPlaying(true);
    }
  }, [isPlaying, audioUrl]);

  const barVariants = {
    playing: (i: number) => ({
      scaleY: [0.3, 1, 0.5, 0.8, 0.3],
      transition: {
        duration: 0.8 + i * 0.15,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    }),
    stopped: { scaleY: 0.3 },
  };

  return (
    <button
      onClick={toggle}
      className="relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all hover:scale-105 active:scale-95"
      style={{
        borderColor: BRAND_GOLD,
        backgroundColor: isPlaying ? BRAND_GOLD : "rgba(0,0,0,0.6)",
        color: isPlaying ? "#000" : BRAND_GOLD,
      }}
    >
      {isPlaying ? (
        <Square className="w-4 h-4" />
      ) : (
        <Play className="w-4 h-4" />
      )}
      <div className="flex items-end gap-[2px] h-4">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={barVariants}
            animate={isPlaying ? "playing" : "stopped"}
            className="w-[3px] rounded-full origin-bottom"
            style={{
              height: "100%",
              backgroundColor: isPlaying ? "#000" : BRAND_GOLD,
            }}
          />
        ))}
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider">
        {isPlaying ? "Stop" : "Listen"}
      </span>
    </button>
  );
};
