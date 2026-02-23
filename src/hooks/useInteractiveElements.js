/**
 * Interactive Elements Hook
 * Adds interactive animations to data-attributed elements
 */

import gsap from "gsap";
import { useEffect } from "react";

export const useInteractiveElements = () => {
  useEffect(() => {
    // Stagger reveal for elements with data-stagger-item
    const staggerItems = document.querySelectorAll("[data-stagger-item]");
    staggerItems.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.1,
          ease: "power2.out",
        }
      );
    });

    // Hover lift effect for data-lift
    const liftElements = document.querySelectorAll("[data-lift]");
    liftElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        gsap.to(element, {
          y: -10,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      element.addEventListener("mouseleave", () => {
        gsap.to(element, {
          y: 0,
          boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    // Rotate on hover for data-rotate
    const rotateElements = document.querySelectorAll("[data-rotate]");
    rotateElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        gsap.to(element, {
          rotation: 360,
          scale: 1.1,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      element.addEventListener("mouseleave", () => {
        gsap.to(element, {
          rotation: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    });

    // Pulse effect for data-pulse
    const pulseElements = document.querySelectorAll("[data-pulse]");
    pulseElements.forEach((element) => {
      gsap.to(element, {
        scale: [1, 1.05, 1],
        duration: 2,
        repeat: -1,
        ease: "sine.inOut",
      });
    });

    // Color shift for data-color-shift
    const colorShiftElements = document.querySelectorAll("[data-color-shift]");
    const colors = ["#63f", "#8854e0", "#ec4899", "#63f"];
    colorShiftElements.forEach((element) => {
      gsap.to(element, {
        color: colors,
        duration: 3,
        repeat: -1,
        ease: "none",
      });
    });
  }, []);
};

export default useInteractiveElements;
