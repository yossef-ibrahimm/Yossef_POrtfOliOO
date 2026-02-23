import gsap from "gsap";
import { useRef, useEffect } from "react";
import { createSparkles } from "../utils/advancedAnimations";
import { createInkSplash } from "../utils/premiumAnimations";

export const MagneticButton = ({
  children,
  className = "",
  onClick,
}) => {
  const ref = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const button = ref.current;
    let x = 0;
    let y = 0;

    const onMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      x = (e.clientX - centerX) * 0.35;
      y = (e.clientY - centerY) * 0.35;

      gsap.to(button, {
        x,
        y,
        duration: 0.25,
        ease: "power2.out",
      });

      // Glow follows cursor
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          left: e.clientX - rect.left,
          top: e.clientY - rect.top,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const onMouseEnter = () => {
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      const glowColor = `hsl(${primaryColor} / 0.8)`;
      gsap.to(button, {
        boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor.replace('0.8', '0.4')}`,
        duration: 0.3,
        ease: "power2.out",
      });

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 1,
          duration: 0.3,
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        boxShadow: "0 0 0px transparent",
        duration: 0.3,
        ease: "power2.out",
      });

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0,
          duration: 0.3,
        });
      }
    };

    const onMouseDown = () => {
      gsap.to(button, {
        scale: 0.92,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    const onMouseUp = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.1,
        ease: "power2.out",
      });
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      const hslColor = `hsl(${primaryColor})`;
      createSparkles(button, hslColor);
      createInkSplash(button, hslColor);
    };

    button.addEventListener("mousemove", onMouseMove);
    button.addEventListener("mouseenter", onMouseEnter);
    button.addEventListener("mouseleave", onMouseLeave);
    button.addEventListener("mousedown", onMouseDown);
    button.addEventListener("mouseup", onMouseUp);

    return () => {
      button.removeEventListener("mousemove", onMouseMove);
      button.removeEventListener("mouseenter", onMouseEnter);
      button.removeEventListener("mouseleave", onMouseLeave);
      button.removeEventListener("mousedown", onMouseDown);
      button.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <button
      ref={ref}
      className={className + " relative overflow-hidden group"}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute w-20 h-20 bg-primary/30 rounded-full blur-2xl opacity-0 pointer-events-none"
        style={{
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
        }}
      />

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {children}
    </button>
  );
};
