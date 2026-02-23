import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useMemo, memo, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------
  Parallax Section - Optimized
------------------------------------------- */
export const ParallaxSection = memo(({ children, className = "", speed = 0.5 }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: (index, target) => {
        const rect = target.getBoundingClientRect();
        return -(window.innerHeight - rect.top) * speed;
      },
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        markers: false,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === ref.current) {
          trigger.kill();
        }
      });
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
});

ParallaxSection.displayName = "ParallaxSection";

/* -------------------------------------------
  Reveal On Scroll - Optimized & Fixed
------------------------------------------- */
export const RevealOnScroll = memo(({ 
  children, 
  className = "", 
  delay = 0, 
  direction = "up" 
}) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;

    const directions = {
      up: { y: 60, opacity: 0, x: 0 },
      down: { y: -60, opacity: 0, x: 0 },
      left: { x: 60, opacity: 0, y: 0 },
      right: { x: -60, opacity: 0, y: 0 },
    };

    const fromState = directions[direction] || directions.up;

    gsap.set(ref.current, fromState);

    gsap.to(ref.current, {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
      delay,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
        markers: false,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === ref.current) {
          trigger.kill();
        }
      });
    };
  }, [direction, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
});

RevealOnScroll.displayName = "RevealOnScroll";

/* -------------------------------------------
  Depth Layer - Optimized
------------------------------------------- */
export const DepthLayer = memo(({ children, className = "", depth = 1 }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: () => [50 * depth, -50 * depth],
      scale: [1 - 0.05 * depth, 1, 1 - 0.05 * depth],
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        markers: false,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === ref.current) {
          trigger.kill();
        }
      });
    };
  }, [depth]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
});

DepthLayer.displayName = "DepthLayer";

/* -------------------------------------------
  Loaders - Optimized with GSAP
------------------------------------------- */

// Shared size configurations (memoized)
const SIZE_CONFIGS = {
  container: { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" },
  dot: { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-4 h-4" },
  pulsing: { sm: "w-12 h-12", md: "w-16 h-16", lg: "w-20 h-20" },
  bar: {
    height: { sm: "h-6", md: "h-8", lg: "h-10" },
    width: { sm: "w-1", md: "w-2", lg: "w-3" }
  }
};

export const LoaderSpinningDots = memo(({ 
  size = "md", 
  className = "", 
  label = "Loading..." 
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const dots = containerRef.current.querySelectorAll('[data-dot]');
    const tl = gsap.timeline();

    dots.forEach((dot, index) => {
      tl.to(dot, {
        y: -10,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      }, index * 0.1);
    });

    return () => tl.kill();
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`flex justify-center items-end gap-2 ${SIZE_CONFIGS.container[size]}`}>
        {[0, 1, 2].map((dot) => (
          <div 
            key={dot}
            data-dot
            className={`${SIZE_CONFIGS.dot[size]} bg-primary rounded-full`}
          />
        ))}
      </div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
});

LoaderSpinningDots.displayName = "LoaderSpinningDots";

export const LoaderCircular = memo(({ 
  size = "md", 
  className = "", 
  label = "Loading..." 
}) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    gsap.to(loaderRef.current, {
      rotation: 360,
      duration: 1.5,
      repeat: -1,
      ease: "none",
    });

    return () => gsap.killTweensOf(loaderRef.current);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div 
        ref={loaderRef}
        className={`${SIZE_CONFIGS.container[size]} border-4 border-primary/30 border-t-primary rounded-full`}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
});

LoaderCircular.displayName = "LoaderCircular";

export const LoaderPulsingCircles = memo(({ 
  size = "md", 
  className = "", 
  label = "Loading..." 
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const circles = containerRef.current.querySelectorAll('[data-circle]');
    
    circles.forEach((circle, index) => {
      gsap.to(circle, {
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
        duration: 1.5,
        repeat: -1,
        ease: "sine.inOut",
        delay: index * 0.2,
      });
    });

    return () => {
      circles.forEach((circle) => gsap.killTweensOf(circle));
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div ref={containerRef} className={`relative ${SIZE_CONFIGS.pulsing[size]}`}>
        {[0, 1, 2].map((c) => (
          <div 
            key={c}
            data-circle
            className="absolute inset-0 border-2 border-primary rounded-full"
          />
        ))}
      </div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
});

LoaderPulsingCircles.displayName = "LoaderPulsingCircles";

export const LoaderWave = memo(({ 
  size = "md", 
  className = "", 
  label = "Loading..." 
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const bars = containerRef.current.querySelectorAll('[data-bar]');

    bars.forEach((bar, index) => {
      gsap.to(bar, {
        scaleY: [0.5, 1, 0.5],
        duration: 0.8,
        repeat: -1,
        ease: "sine.inOut",
        delay: index * 0.1,
      });
    });

    return () => {
      bars.forEach((bar) => gsap.killTweensOf(bar));
    };
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div ref={containerRef} className="flex justify-center items-end gap-1">
        {[0, 1, 2, 3, 4].map((bar) => (
          <div 
            key={bar}
            data-bar
            className={`${SIZE_CONFIGS.bar.width[size]} ${SIZE_CONFIGS.bar.height[size]} bg-primary rounded-full origin-bottom`}
          />
        ))}
      </div>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
});

LoaderWave.displayName = "LoaderWave";

export const LoaderGradientSpinner = memo(({ 
  size = "md", 
  className = "", 
  label = "Loading..." 
}) => {
  const spinnerRef = useRef(null);

  useEffect(() => {
    if (!spinnerRef.current) return;

    gsap.to(spinnerRef.current, {
      rotation: 360,
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      duration: 2,
      repeat: -1,
      ease: "none",
    });

    return () => gsap.killTweensOf(spinnerRef.current);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div 
        ref={spinnerRef}
        className={`${SIZE_CONFIGS.container[size]} rounded-full bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_200%]`}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
});

LoaderGradientSpinner.displayName = "LoaderGradientSpinner";

/* -------------------------------------------
  Full Screen Loader - Optimized
------------------------------------------- */
export const FullScreenLoader = memo(({ 
  isVisible = true, 
  loaderType = "circular", 
  label = "Loading..." 
}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current || !isVisible) return;

    gsap.fromTo(wrapperRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );

    return () => gsap.killTweensOf(wrapperRef.current);
  }, [isVisible]);

  const loaderComponents = useMemo(() => ({
    "spinning-dots": <LoaderSpinningDots label={label} />,
    circular: <LoaderCircular label={label} />,
    "pulsing-circles": <LoaderPulsingCircles label={label} />,
    wave: <LoaderWave label={label} />,
    gradient: <LoaderGradientSpinner label={label} />
  }), [label]);

  if (!isVisible) return null;

  return (
    <div 
      ref={wrapperRef}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 opacity-0"
    >
      {loaderComponents[loaderType]}
    </div>
  );
});

FullScreenLoader.displayName = "FullScreenLoader";