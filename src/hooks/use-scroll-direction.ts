import { useEffect, useState, useRef } from 'react';

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY.current) < 5) {
        return; // Ignore small scroll changes
      }

      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, []);

  return { scrollDirection, scrollY };
};

export const useScrollDynamicAnimation = (
  baseDelay: number = 0,
  index: number = 0
) => {
  const { scrollDirection } = useScrollDirection();

  return {
    scrollDirection,
    getInitialState: () => {
      return scrollDirection === 'up'
        ? { opacity: 0, y: -40, x: -30, rotateZ: -5 }
        : { opacity: 0, y: 40, x: 30, rotateZ: 5 };
    },
    getAnimateState: () => ({
      opacity: 1,
      y: 0,
      x: 0,
      rotateZ: 0,
    }),
    getExitState: () => {
      return scrollDirection === 'up'
        ? { opacity: 0, y: -40, x: -30, rotateZ: -5 }
        : { opacity: 0, y: 40, x: 30, rotateZ: 5 };
    },
    getTransition: () => ({
      delay: baseDelay + index * 0.08,
      duration: 0.5,
      type: 'spring' as const,
      stiffness: 140,
      damping: 20,
    }),
  };
};
