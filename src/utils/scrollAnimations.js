import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Collapse animation on scroll down
 * Components collapse and gather together
 */
export const createCollapseEffect = (element, trigger = null) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    {
      scrollTrigger: {
        trigger: trigger || element,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        markers: false,
      },
      opacity: 0.6,
      scale: 0.85,
      y: -30,
      ease: "power2.inOut",
    }
  );
};

/**
 * Pinch effect on scroll - elements gather towards center
 */
export const createPinchEffect = (elements) => {
  gsap.to(elements, {
    scrollTrigger: {
      trigger: elements[0]?.parentElement,
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
    x: (i) => {
      const center = (elements.length - 1) / 2;
      const offset = i - center;
      return -offset * 20;
    },
    y: -20,
    scale: 0.9,
    duration: 1,
    stagger: 0.05,
    ease: "power2.inOut",
  });
};

/**
 * Stick scroll animation - elements stick to top and gather
 */
export const createStickyGather = (element, trigger = null) => {
  if (!element) return;

  gsap.to(element, {
    scrollTrigger: {
      trigger: trigger || element,
      start: "top 200px",
      end: "bottom 100px",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        if (progress > 0.3) {
          element.style.position = "sticky";
          element.style.top = `${20 - progress * 50}px`;
        }
      },
    },
    scale: 1 - progress * 0.15,
    ease: "power2.inOut",
  });
};

/**
 * Wave collapse - like cards gathering in a wave
 */
export const createWaveCollapse = (element, index = 0) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationZ: 0,
    },
    {
      scrollTrigger: {
        trigger: element.parentElement,
        start: "top center",
        end: "bottom 200px",
        scrub: 1.2,
      },
      opacity: 0.4,
      y: -50 - index * 10,
      scale: 0.8 - index * 0.05,
      rotationZ: index * 2,
      ease: "power2.inOut",
    }
  );
};

/**
 * Blur and fade on scroll
 */
export const createBlurFade = (element) => {
  if (!element) return;

  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
    filter: "blur(5px)",
    opacity: 0.3,
    ease: "power2.inOut",
  });
};

/**
 * Rotate and fade on scroll
 */
export const createRotateFade = (element, direction = 1) => {
  if (!element) return;

  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
    rotation: direction * 360,
    opacity: 0.2,
    scale: 0.7,
    ease: "power2.inOut",
  });
};

/**
 * Magnetic scroll effect
 */
export const createMagneticScroll = (element) => {
  if (!element) return;

  let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter(element, "skewY", "deg"),
    clamp = gsap.utils.clamp(-20, 20);

  gsap.set(element, { transformOrigin: "center center", force3D: true });

  ScrollTrigger.create({
    onUpdate: (self) => {
      let skew = clamp(self.getVelocity() / 300);
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        skewSetter(skew);
      }
    },
  });

  gsap.to(proxy, {
    skew: 0,
    duration: 0.8,
    ease: "power3",
    overwrite: "auto",
  });
};

/**
 * Squeeze and gather effect
 */
export const createSqueezeGather = (container) => {
  if (!container) return;

  const children = container.querySelectorAll("[data-squeeze]");
  if (children.length === 0) return;

  gsap.to(children, {
    scrollTrigger: {
      trigger: container,
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
    x: (i) => {
      const center = (children.length - 1) / 2;
      const distance = Math.abs(i - center);
      return distance * 30 * (i > center ? 1 : -1);
    },
    y: -40,
    scaleX: 0.7,
    scaleY: 0.85,
    opacity: 0.5,
    stagger: {
      amount: 0.2,
      from: "center",
    },
    ease: "power2.inOut",
  });
};

/**
 * Floating elements with parallax
 */
export const createFloatingParallax = (element, speed = -0.5) => {
  if (!element) return;

  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: 0,
      markers: false,
    },
    y: window.innerHeight * speed,
    ease: "none",
  });
};

/**
 * Text reveal on scroll with mask
 */
export const createMaskReveal = (element) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      clipPath: "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)",
    },
    {
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power2.inOut",
    }
  );
};

/**
 * Stagger collapse for multiple elements
 */
export const createStaggerCollapse = (elements) => {
  gsap.to(elements, {
    scrollTrigger: {
      trigger: elements[0]?.parentElement,
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
    y: -60,
    scale: 0.8,
    opacity: 0.4,
    stagger: {
      amount: 0.3,
      from: "start",
    },
    ease: "power2.inOut",
  });
};
