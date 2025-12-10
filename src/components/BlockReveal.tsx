import { motion } from "framer-motion";

interface BlockRevealProps {
  onComplete: () => void;
}

const BlockReveal = ({ onComplete }: BlockRevealProps) => {
  const columns = 8; // Number of vertical blocks
  
  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">
      {Array.from({ length: columns }).map((_, index) => (
        <motion.div
          key={index}
          className="flex-1 h-full"
          style={{
            background: "linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          }}
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          transition={{
            duration: 0.8,
            delay: index * 0.1, // Staggered delay
            ease: [0.76, 0, 0.24, 1], // Custom easing for smooth effect
          }}
          onAnimationComplete={index === columns - 1 ? onComplete : undefined}
        />
      ))}
    </div>
  );
};

export default BlockReveal;
