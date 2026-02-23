import gsap from "gsap";

/**
 * Enhanced Animations for Premium UI
 */

// Fast stagger animation
export const staggerFast = (targets, fromVars, toVars) => {
  gsap.fromTo(targets, fromVars, {
    ...toVars,
    stagger: 0.05,
  });
};

// Sparkle effect on hover
export const createSparkles = (element, color = "#fff") => {
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement("div");
    sparkle.style.position = "fixed";
    sparkle.style.width = "4px";
    sparkle.style.height = "4px";
    sparkle.style.backgroundColor = color;
    sparkle.style.borderRadius = "50%";
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";
    sparkle.style.pointerEvents = "none";
    sparkle.style.zIndex = "9999";
    sparkle.style.boxShadow = `0 0 10px ${color}`;
    document.body.appendChild(sparkle);

    const angle = (i / 8) * Math.PI * 2;
    const velocity = 4 + Math.random() * 3;

    gsap.to(sparkle, {
      x: Math.cos(angle) * 80,
      y: Math.sin(angle) * 80,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => sparkle.remove(),
    });
  }
};

// Pulse glow effect
export const pulseGlow = (element, color = "rgb(99, 102, 241)") => {
  gsap.to(element, {
    boxShadow: [
      `0 0 10px ${color}`,
      `0 0 20px ${color}`,
      `0 0 10px ${color}`,
    ],
    duration: 1.5,
    repeat: -1,
    ease: "sine.inOut",
  });
};

// Morphing shape animation
export const morphShape = (element) => {
  const shapes = [
    "circle(50%)",
    "circle(60% 40%)",
    "circle(40% 60%)",
    "circle(50%)",
  ];

  gsap.to(element, {
    borderRadius: shapes,
    duration: 4,
    repeat: -1,
    ease: "sine.inOut",
  });
};

// Floating animation
export const floating = (element, distance = 20, duration = 3) => {
  gsap.fromTo(
    element,
    { y: 0 },
    {
      y: -distance,
      duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    }
  );
};

// 3D flip card effect
export const flip3D = (element, isHovered) => {
  if (isHovered) {
    gsap.to(element, {
      rotationY: 180,
      duration: 0.6,
      ease: "back.out",
    });
  } else {
    gsap.to(element, {
      rotationY: 0,
      duration: 0.6,
      ease: "back.out",
    });
  }
};

// Magnetic cursor effect
export const magneticCursor = (element, strength = 0.5) => {
  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = (e.clientX - centerX) * strength;
    const distY = (e.clientY - centerY) * strength;

    gsap.to(element, {
      x: distX,
      y: distY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.3,
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

// Text reveal with character animation
export const charReveal = (element, duration = 0.03) => {
  const text = element.textContent;
  element.innerHTML = text
    .split("")
    .map((char) => `<span class="char">${char}</span>`)
    .join("");

  gsap.fromTo(
    element.querySelectorAll(".char"),
    { opacity: 0, y: 10 },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger: duration,
      ease: "back.out",
    }
  );
};

// Liquid swipe effect
export const liquidSwipe = (element, color = "rgb(99, 102, 241)") => {
  gsap.fromTo(
    element,
    {
      clipPath: "polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%)",
    },
    {
      clipPath: "polygon(0% 0%, 100% 100%, 100% 100%, 0% 0%)",
      duration: 0.6,
      ease: "power2.inOut",
    }
  );
};

// Rainbow text animation
export const rainbowText = (element) => {
  const colors = [
    "rgb(99, 102, 241)",
    "rgb(168, 85, 247)",
    "rgb(236, 72, 153)",
    "rgb(249, 115, 22)",
    "rgb(34, 197, 94)",
    "rgb(59, 130, 246)",
  ];

  let colorIndex = 0;
  gsap.to(element, {
    color: () => {
      colorIndex = (colorIndex + 1) % colors.length;
      return colors[colorIndex];
    },
    duration: 0.3,
    repeat: -1,
    repeatDelay: 0,
  });
};

// Bounce entrance
export const bounceIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.3,
      y: 30,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      delay,
      ease: "back.out",
    }
  );
};

// Gradient shift animation
export const gradientShift = (element) => {
  const gradients = [
    "linear-gradient(45deg, rgb(99, 102, 241), rgb(168, 85, 247))",
    "linear-gradient(45deg, rgb(168, 85, 247), rgb(236, 72, 153))",
    "linear-gradient(45deg, rgb(236, 72, 153), rgb(99, 102, 241))",
  ];

  let index = 0;
  gsap.to(element, {
    backgroundImage: () => {
      index = (index + 1) % gradients.length;
      return gradients[index];
    },
    duration: 2,
    repeat: -1,
    repeatDelay: 0,
  });
};
