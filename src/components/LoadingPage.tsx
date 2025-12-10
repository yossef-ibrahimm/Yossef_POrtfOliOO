import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./LoadingPage.css";

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

interface LoadingPageProps {
  onLoadingComplete: () => void;
}

const LoadingPage = ({ onLoadingComplete }: LoadingPageProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 15 + 8,
      duration: Math.random() * 2 + 2.5,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);

    // Transition to main content after 1 second (optimized)
    const timer = setTimeout(onLoadingComplete, 1000);
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <motion.div
      className="loading-page"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: "blur(10px)",
      }}
      transition={{
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <div className="loading-content">
        {/* Particles */}
        <div className="particles-container">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.left}%`,
                width: particle.size,
                height: particle.size,
              }}
              initial={{ y: "100vh", opacity: 0 }}
              animate={{
                y: "-100vh",
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Center Brand Icon */}
        <motion.div
          className="loading-icon"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
        >
          <div className="icon-content">
            <motion.div
              className="icon-circle"
              animate={{
                boxShadow: [
                  "0 20px 40px rgba(59, 130, 246, 0.3)",
                  "0 20px 60px rgba(59, 130, 246, 0.5)",
                  "0 20px 40px rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="icon-text">Y</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="loading-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingPage;
