import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  animateTextByWords,
  animateTextByLetters,
  scrollReveal,
  scrollRevealStagger,
  parallaxScroll,
  magneticButton,
  hoverScale,
  glowEffect,
  destroyScrollTrigger,
} from "./gsapAnimations";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP React Hooks - Integration layer for GSAP with React
 * Handles cleanup and prevents memory leaks
 */

/**
 * Hook for animated text by words
 * @param {string} text - Text to animate
 * @param {Object} options - Animation options
 */
export const useAnimatedText = (text, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const words = ref.current.querySelectorAll("span");
    if (words.length === 0) {
      // Create spans if not already created
      ref.current.innerHTML = text
        .split(" ")
        .map((word) => `<span>${word}</span>`)
        .join(" ");
    }

    const animation = animateTextByWords(ref.current, {
      type: "slideUp",
      ...options,
    });

    return () => {
      if (animation) animation.kill();
    };
  }, [text, options]);

  return ref;
};

/**
 * Hook for animated text by letters
 * @param {string} text - Text to animate
 * @param {Object} options - Animation options
 */
export const useAnimatedLetters = (text, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const letters = ref.current.querySelectorAll("span");
    if (letters.length === 0) {
      // Create spans if not already created
      ref.current.innerHTML = text
        .split("")
        .map((letter) => `<span>${letter === " " ? "\u00A0" : letter}</span>`)
        .join("");
    }

    const animation = animateTextByLetters(ref.current, {
      type: "rotate",
      ...options,
    });

    return () => {
      if (animation) animation.kill();
    };
  }, [text, options]);

  return ref;
};

/**
 * Hook for scroll reveal animation
 * @param {Object} options - Animation options
 */
export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    scrollReveal(ref.current, options);

    return () => {
      destroyScrollTrigger(ref.current);
    };
  }, [options]);

  return ref;
};

/**
 * Hook for scroll reveal with stagger
 * @param {Object} options - Animation options
 */
export const useScrollRevealStagger = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const elements = ref.current.querySelectorAll("[data-reveal]");
    if (elements.length === 0) return;

    scrollRevealStagger(elements, options);

    return () => {
      destroyScrollTrigger(ref.current);
    };
  }, [options]);

  return ref;
};

/**
 * Hook for parallax effect
 * @param {Object} options - Animation options
 */
export const useParallax = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    parallaxScroll(ref.current, options);

    return () => {
      destroyScrollTrigger(ref.current);
    };
  }, [options]);

  return ref;
};

/**
 * Hook for magnetic button effect
 * @param {Object} options - Animation options
 */
export const useMagneticButton = (options = {}) => {
  const ref = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    cleanupRef.current = magneticButton(ref.current, options);

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [options]);

  return ref;
};

/**
 * Hook for hover scale effect
 * @param {Object} options - Animation options
 */
export const useHoverScale = (options = {}) => {
  const ref = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    cleanupRef.current = hoverScale(ref.current, options);

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [options]);

  return ref;
};

/**
 * Hook for glow effect
 * @param {Object} options - Animation options
 */
export const useGlowEffect = (options = {}) => {
  const ref = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    cleanupRef.current = glowEffect(ref.current, options);

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [options]);

  return ref;
};

/**
 * Hook for detecting reduced motion preference
 */
export const useReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReduced;
};

/**
 * Hook for intersection observer (for triggering animations)
 * @param {Object} options - Intersection observer options
 */
export const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options.once) observer.disconnect();
      } else if (!options.once) {
        setIsInView(false);
      }
    }, {
      threshold: options.threshold || 0.1,
      ...options,
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return [ref, isInView];
};

/**
 * Hook for mouse position tracking (for interactive effects)
 */
export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return position;
};

/**
 * Hook for scroll progress tracking
 */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return progress;
};

/**
 * Hook for window size tracking
 */
export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};

/**
 * Hook for GSAP timeline
 */
export const useGsapTimeline = (callback, deps = []) => {
  const timelineRef = useRef(null);

  useEffect(() => {
    timelineRef.current = gsap.timeline();

    if (callback) {
      callback(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, deps);

  return timelineRef.current;
};

export default {
  useAnimatedText,
  useAnimatedLetters,
  useScrollReveal,
  useScrollRevealStagger,
  useParallax,
  useMagneticButton,
  useHoverScale,
  useGlowEffect,
  useReducedMotion,
  useInView,
  useMousePosition,
  useScrollProgress,
  useWindowSize,
  useGsapTimeline,
};
