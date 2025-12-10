import { motion, useScroll, useTransform } from "framer-motion";

const FloatingShapes = () => {
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 3000], [0, -500]);
  const y2 = useTransform(scrollY, [0, 3000], [0, -300]);
  const y3 = useTransform(scrollY, [0, 3000], [0, -700]);
  const rotate1 = useTransform(scrollY, [0, 3000], [0, 360]);
  const rotate2 = useTransform(scrollY, [0, 3000], [0, -180]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Circle 1 */}
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full border border-primary/20"
      />
      
      {/* Floating Circle 2 */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[60%] right-[15%] w-24 h-24 rounded-full bg-accent/5 blur-sm"
      />
      
      {/* Floating Square */}
      <motion.div
        style={{ y: y3, rotate: rotate2 }}
        className="absolute top-[40%] right-[25%] w-16 h-16 border border-primary/10 rotate-45"
      />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[30%] left-[20%] w-96 h-96 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-accent/10 blur-3xl"
      />
    </div>
  );
};

export default FloatingShapes;
