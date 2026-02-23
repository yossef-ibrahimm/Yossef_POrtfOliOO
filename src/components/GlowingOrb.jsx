import gsap from "gsap";
import { useRef, useEffect } from "react";

export const GlowingOrb = () => {
  const ref = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    // Continuous animation for orb 1
    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, {
        scale: [1, 1.1, 1],
        duration: 20,
        repeat: -1,
        ease: "easeInOut",
      });
    }

    // Continuous animation for orb 2
    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        scale: [1, 0.9, 1.1, 1],
        duration: 15,
        repeat: -1,
        ease: "easeInOut",
        delay: 2,
      });
    }

    // Animate particles
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        gsap.to(particle, {
          y: [0, -30, 0],
          duration: 3 + i,
          repeat: -1,
          ease: "easeInOut",
          delay: i * 0.5,
        });
      }
    });

    return () => {
      gsap.killTweensOf([orb1Ref.current, orb2Ref.current]);
      particlesRef.current.forEach((particle) => {
        if (particle) gsap.killTweensOf(particle);
      });
    };
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Primary Orb */}
      <div
        ref={orb1Ref}
        className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px]"
      >
        <div className="w-full h-full rounded-full bg-primary/20 blur-[120px]" />
      </div>

      {/* Secondary Orb */}
      <div
        ref={orb2Ref}
        className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px]"
      >
        <div className="w-full h-full rounded-full bg-accent/15 blur-[100px]" />
      </div>

      {/* Small floating particles */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (particlesRef.current[i] = el)}
          className="absolute w-2 h-2 rounded-full bg-primary/40"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
        />
      ))}
    </div>
  );
};
