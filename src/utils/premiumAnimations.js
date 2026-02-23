import gsap from "gsap";

/**
 * Hover lift effect - 3D elevation on hover
 */
export const createHoverLift = (element, intensity = 20) => {
  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.05;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.05;

    gsap.to(element, {
      y: -intensity,
      x: x,
      rotationX: y * 2,
      rotationY: -x * 2,
      boxShadow: `0 ${intensity}px ${intensity * 2}px rgba(0, 0, 0, 0.3)`,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      y: 0,
      x: 0,
      rotationX: 0,
      rotationY: 0,
      boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

/**
 * Ink splash effect on click
 */
export const createInkSplash = (element, color = "rgb(99, 102, 241)") => {
  const rect = element.getBoundingClientRect();
  const splash = document.createElement("div");
  splash.style.position = "fixed";
  splash.style.left = rect.left + rect.width / 2 + "px";
  splash.style.top = rect.top + rect.height / 2 + "px";
  splash.style.width = "10px";
  splash.style.height = "10px";
  splash.style.borderRadius = "50%";
  splash.style.backgroundColor = color;
  splash.style.pointerEvents = "none";
  splash.style.zIndex = "9999";
  document.body.appendChild(splash);

  gsap.to(splash, {
    width: 200,
    height: 200,
    left: rect.left + rect.width / 2 - 100,
    top: rect.top + rect.height / 2 - 100,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    onComplete: () => splash.remove(),
  });
};

/**
 * Reveal on scroll with stagger
 */
export const createRevealOnScroll = (elements, direction = "up") => {
  elements.forEach((element, index) => {
    const fromVars =
      direction === "up"
        ? { opacity: 0, y: 50 }
        : direction === "left"
          ? { opacity: 0, x: -50 }
          : { opacity: 0, x: 50 };

    gsap.fromTo(
      element,
      fromVars,
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};

/**
 * Smooth scroll to section
 */
export const smoothScrollTo = (selector) => {
  const element = document.querySelector(selector);
  if (!element) return;

  gsap.to(window, {
    scrollTo: {
      y: element,
      offsetY: 100,
      autoKill: true,
    },
    duration: 1,
    ease: "power2.inOut",
  });
};

/**
 * Text gradient animation
 */
export const createTextGradient = (element) => {
  const text = element.textContent;
  element.innerHTML = text
    .split("")
    .map(
      (char, i) =>
        `<span data-char="${i}" style="background: linear-gradient(to bottom, rgba(99, 102, 241, 1), rgba(168, 85, 247, 1)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; transition: all 0.3s ease;">${char}</span>`
    )
    .join("");

  const chars = element.querySelectorAll("[data-char]");
  chars.forEach((char, index) => {
    char.addEventListener("mouseenter", () => {
      gsap.to(char, {
        scale: 1.2,
        duration: 0.2,
        ease: "back.out",
      });
    });

    char.addEventListener("mouseleave", () => {
      gsap.to(char, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    });
  });
};

/**
 * Glassmorphism hover glow
 */
export const createGlassGlow = (element, glowColor = "rgba(99, 102, 241, 0.5)") => {
  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    gsap.to(element, {
      "--glow-x": x + "px",
      "--glow-y": y + "px",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      "--glow-x": "50%",
      "--glow-y": "50%",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

/**
 * Counter animation
 */
export const createCounter = (element, endValue, duration = 2) => {
  const startValue = 0;
  const obj = { value: startValue };

  gsap.to(obj, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = Math.floor(obj.value);
    },
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });
};

/**
 * Floating animation with rotation
 */
export const createFloating = (element, duration = 4) => {
  gsap.to(element, {
    y: -20,
    x: 10,
    rotation: 5,
    duration,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
};

/**
 * Gradient border animation
 */
export const createGradientBorder = (element, colors = ["#63f", "#8854e0", "#ec4899"]) => {
  const size = 200;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  gsap.to(element, {
    "--border-angle": 360,
    duration: 3,
    repeat: -1,
    ease: "none",
  });

  element.style.setProperty("--border-angle", "0deg");
};

/**
 * Blur-in on scroll
 */
export const createBlurIn = (element) => {
  gsap.fromTo(
    element,
    {
      filter: "blur(10px)",
      opacity: 0,
    },
    {
      filter: "blur(0px)",
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );
};

/**
 * Staggered list animation
 */
export const createStaggerList = (container) => {
  const items = container.querySelectorAll("[data-stagger-item]");
  if (items.length === 0) return;

  gsap.fromTo(
    items,
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    }
  );
};

/**
 * Circular progress animation
 */
export const createCircularProgress = (element, percentage, duration = 1.5) => {
  const circle = element.querySelector("circle");
  const circumference = 2 * Math.PI * circle.r.baseVal.value;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  gsap.to(circle, {
    strokeDashoffset: circumference - (percentage / 100) * circumference,
    duration,
    ease: "power2.out",
  });
};

/**
 * Perspective flip on scroll
 */
export const createPerspectiveFlip = (element) => {
  gsap.to(element, {
    rotationY: 360,
    rotationX: 20,
    duration: 1,
    scrollTrigger: {
      trigger: element,
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
    ease: "power2.inOut",
  });
};
