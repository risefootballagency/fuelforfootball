import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

interface AudioPlaybackButtonProps {
  audioUrl: string;
}

const BRAND_GOLD = "#fdc61b";

export const AudioPlaybackButton = ({ audioUrl }: AudioPlaybackButtonProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
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
      audio.crossOrigin = "anonymous";
      
      // Boost volume using Web Audio API gain node
      try {
        const ctx = new AudioContext();
        const source = ctx.createMediaElementSource(audio);
        const gain = ctx.createGain();
        gain.gain.value = 2.5; // 2.5x volume boost
        source.connect(gain);
        gain.connect(ctx.destination);
        audioCtxRef.current = ctx;
      } catch {
        // Fallback: just play without boost
        audio.volume = 1;
      }
      
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
      className="flex items-center justify-center gap-1.5 rounded-full transition-all hover:scale-110 active:scale-95"
      style={{
        width: 40,
        height: 40,
        backgroundColor: isPlaying ? BRAND_GOLD : "rgba(0,0,0,0.6)",
        color: isPlaying ? "#000" : BRAND_GOLD,
        backdropFilter: "blur(4px)",
      }}
      title={isPlaying ? "Stop" : "Listen"}
    >
      {isPlaying ? (
        <div className="flex items-end gap-[2px] h-3">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={barVariants}
              animate="playing"
              className="w-[2.5px] rounded-full origin-bottom"
              style={{ height: "100%", backgroundColor: "#000" }}
            />
          ))}
        </div>
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
};
