/**
 * Shared Animation Utilities
 *
 * Single source of truth for animation utilities used across components.
 * Eliminates duplicate createSparkles definitions.
 */

import gsap from 'gsap'

/**
 * Create sparkle effect on an element
 * @param {HTMLElement} element - The target element
 * @param {string} color - The sparkle color (default: 'rgb(99, 102, 241)')
 */
export const createSparkles = (element, color = 'rgb(99, 102, 241)') => {
  if (!element) return

  const rect = element.getBoundingClientRect()
  const sparkleCount = 8
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div')
    const angle = (Math.PI * 2 * i) / sparkleCount
    const distance = 40 + Math.random() * 20

    Object.assign(sparkle.style, {
      position: 'fixed',
      width: '4px',
      height: '4px',
      background: color,
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '9999',
      boxShadow: `0 0 10px ${color}`,
      left: `${cx}px`,
      top: `${cy}px`,
    })

    document.body.appendChild(sparkle)

    gsap.to(sparkle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 0,
      scale: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => sparkle.remove(),
    })
  }
}

/**
 * Create hover lift effect
 * @param {HTMLElement} element - The target element
 * @param {number} distance - Lift distance in pixels (default: 10)
 */
export const createHoverLift = (element, distance = 10) => {
  if (!element) return

  const handleMouseEnter = () => {
    gsap.to(element, {
      y: -distance,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(element, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  element.addEventListener('mouseenter', handleMouseEnter)
  element.addEventListener('mouseleave', handleMouseLeave)

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * Create floating parallax effect based on scroll
 * @param {HTMLElement} element - The target element
 * @param {number} factor - Parallax factor (negative = moves slower)
 */
export const createFloatingParallax = (element, factor = 0.3) => {
  if (!element) return

  const handleScroll = () => {
    const scrollY = window.scrollY
    gsap.to(element, {
      y: scrollY * factor,
      duration: 0.3,
      ease: 'power1.out',
    })
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}
