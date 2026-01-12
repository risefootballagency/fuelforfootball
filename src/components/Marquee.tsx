import { motion } from "framer-motion";

interface MarqueeProps {
  text?: string;
  speed?: number;
  className?: string;
  textClassName?: string;
}

export const Marquee = ({
  text = "CHANGE THE GAME",
  speed = 20,
  className = "",
  textClassName = "",
}: MarqueeProps) => {
  // Create multiple copies for seamless loop
  const copies = 8;
  const items = Array(copies).fill(text);

  return (
    <div className={`overflow-hidden py-6 bg-primary/5 border-y border-primary/20 ${className}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, `-${100 / copies}%`],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {items.map((item, index) => (
          <span
            key={index}
            className={`text-4xl md:text-6xl lg:text-7xl font-bebas uppercase tracking-wider text-primary/80 mx-8 ${textClassName}`}
          >
            {item}
            <span className="mx-8 text-primary/40">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
