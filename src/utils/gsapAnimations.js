import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Check for reduced motion preference and mobile
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches
const isMobileDevice = () => window.innerWidth < 768

/**
 * ANIMATION UTILITIES - Production-Ready GSAP Animations
 * Optimized for mobile performance and accessibility
 */

// ============================================================================
// TEXT ANIMATIONS
// ============================================================================

/**
 * Animate text by words with staggered effect
 * @param {HTMLElement} element - Target element containing words
 * @param {Object} options - Animation options
 */
export const animateTextByWords = (element, options = {}) => {
  if (prefersReducedMotion || !element) return null

  const {
    delay = 0,
    staggerDelay = 0.05,
    duration = 0.6,
    type = 'slideUp',
  } = options

  const words = element.querySelectorAll('span')
  if (!words.length) return null

  const animationPresets = {
    slideUp: {
      from: { y: 48, opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    slideDown: {
      from: { y: -48, opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    scale: {
      from: { scale: 0.5, opacity: 0 },
      to: { scale: 1, opacity: 1 },
    },
    fade: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    blur: {
      from: { filter: 'blur(10px)', opacity: 0 },
      to: { filter: 'blur(0px)', opacity: 1 },
    },
    glitch: {
      from: { x: 10, opacity: 0 },
      to: { x: 0, opacity: 1 },
    },
  }

  const preset = animationPresets[type] || animationPresets.slideUp

  return gsap.to(words, {
    ...preset.to,
    duration,
    stagger: staggerDelay,
    delay,
    ease: 'power2.out',
    willChange: 'transform, opacity',
  })
}

/**
 * Animate text by letters with staggered effect
 * @param {HTMLElement} element - Target element containing letters
 * @param {Object} options - Animation options
 */
export const animateTextByLetters = (element, options = {}) => {
  if (prefersReducedMotion || !element) return null

  const {
    delay = 0,
    staggerDelay = 0.03,
    duration = 0.5,
    type = 'rotate',
  } = options

  const letters = element.querySelectorAll('span')
  if (!letters.length) return null

  // Reduce animations on mobile for performance
  const isMobile = isMobileDevice()
  const adjustedStagger = isMobile ? staggerDelay * 0.5 : staggerDelay
  const adjustedDuration = isMobile ? duration * 0.8 : duration

  const animationPresets = {
    rotate: {
      from: { rotation: 90, opacity: 0, y: 10 },
      to: { rotation: 0, opacity: 1, y: 0 },
    },
    wave: {
      from: { y: 20, opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    bounce: {
      from: { scale: 0, opacity: 0 },
      to: { scale: 1, opacity: 1 },
    },
    flip: {
      from: { rotationY: -90, opacity: 0 },
      to: { rotationY: 0, opacity: 1 },
    },
    zoom: {
      from: { scale: 1.5, opacity: 0 },
      to: { scale: 1, opacity: 1 },
    },
    typewriter: {
      from: { opacity: 0, filter: 'blur(5px)' },
      to: { opacity: 1, filter: 'blur(0px)' },
    },
  }

  const preset = animationPresets[type] || animationPresets.rotate

  return gsap.to(letters, {
    ...preset.to,
    duration: adjustedDuration,
    stagger: adjustedStagger,
    delay,
    ease: 'back.out',
    willChange: 'transform, opacity',
  })
}

// ============================================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================================

/**
 * Reveal element on scroll with smooth animation
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const scrollReveal = (element, options = {}) => {
  if (prefersReducedMotion || !element) return null

  const {
    direction = 'up',
    offset = 100,
    duration = 0.8,
    delay = 0,
    ease = 'power2.out',
  } = options

  const directions = {
    up: { y: offset, opacity: 0, x: 0 },
    down: { y: -offset, opacity: 0, x: 0 },
    left: { x: offset, opacity: 0, y: 0 },
    right: { x: -offset, opacity: 0, y: 0 },
  }

  const fromState = directions[direction] || directions.up

  gsap.set(element, fromState)

  return gsap.to(element, {
    y: 0,
    x: 0,
    opacity: 1,
    duration,
    delay,
    ease,
    willChange: 'transform, opacity',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      markers: false,
    },
  })
}

/**
 * Multiple elements scroll reveal with stagger
 * @param {NodeList|Array} elements - Target elements
 * @param {Object} options - Animation options
 */
export const scrollRevealStagger = (elements, options = {}) => {
  if (prefersReducedMotion || !elements || !elements.length) return null

  const {
    direction = 'up',
    offset = 100,
    duration = 0.8,
    staggerDelay = 0.15,
    ease = 'power2.out',
  } = options

  const directions = {
    up: { y: offset, opacity: 0, x: 0 },
    down: { y: -offset, opacity: 0, x: 0 },
    left: { x: offset, opacity: 0, y: 0 },
    right: { x: -offset, opacity: 0, y: 0 },
  }

  const fromState = directions[direction] || directions.up

  gsap.set(elements, fromState)

  return gsap.to(elements, {
    y: 0,
    x: 0,
    opacity: 1,
    duration,
    stagger: staggerDelay,
    ease,
    willChange: 'transform, opacity',
    scrollTrigger: {
      trigger: elements[0]?.parentElement,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      markers: false,
    },
  })
}

// ============================================================================
// PARALLAX ANIMATIONS
// ============================================================================

/**
 * Create parallax effect on scroll - optimized for mobile
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const parallaxScroll = (element, options = {}) => {
  if (prefersReducedMotion || !element || isMobileDevice()) return null

  const { speed = 0.5, direction = 'vertical' } = options

  if (direction === 'vertical') {
    return gsap.to(element, {
      y: (index, target) => {
        const rect = target.getBoundingClientRect()
        return -(window.innerHeight - rect.top) * speed
      },
      ease: 'none',
      willChange: 'transform',
      scrollTrigger: {
        trigger: element,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false,
        invalidateOnRefresh: true,
      },
    })
  }

  return gsap.to(element, {
    x: (index, target) => {
      const rect = target.getBoundingClientRect()
      return (window.innerWidth - rect.left) * speed * 0.5
    },
    ease: 'none',
    willChange: 'transform',
    scrollTrigger: {
      trigger: element,
      start: 'left left',
      end: 'right left',
      scrub: 1,
      markers: false,
      invalidateOnRefresh: true,
    },
  })
}

// ============================================================================
// INTERACTIVE ANIMATIONS (HOVER, CLICK)
// ============================================================================

/**
 * Magnetic button effect - cursor follows (desktop only)
 * @param {HTMLElement} button - Button element
 * @param {Object} options - Animation options
 */
export const magneticButton = (button, options = {}) => {
  // Disable on mobile
  if (isMobileDevice() || !button) return null

  const { strength = 0.3, smoothing = 0.2 } = options

  let x = 0
  let y = 0

  const onMouseMove = (e) => {
    const rect = button.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distX = (e.clientX - centerX) * strength
    const distY = (e.clientY - centerY) * strength

    gsap.to(button, {
      x: distX,
      y: distY,
      duration: 0.3,
      ease: 'power2.out',
      willChange: 'transform',
    })
  }

  const onMouseLeave = () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
      willChange: 'auto',
    })
  }

  button.addEventListener('mousemove', onMouseMove)
  button.addEventListener('mouseleave', onMouseLeave)

  return () => {
    button.removeEventListener('mousemove', onMouseMove)
    button.removeEventListener('mouseleave', onMouseLeave)
  }
}

/**
 * Hover scale effect - optimized for mobile touch
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const hoverScale = (element, options = {}) => {
  if (!element) return null

  const isMobile = isMobileDevice()
  const { scale = 1.05, duration = 0.3, ease = 'power2.out' } = options

  const onMouseEnter = () => {
    gsap.to(element, {
      scale: isMobile ? 1.02 : scale,
      duration,
      ease,
      willChange: 'transform',
    })
  }

  const onMouseLeave = () => {
    gsap.to(element, { scale: 1, duration, ease, willChange: 'auto' })
  }

  element.addEventListener('mouseenter', onMouseEnter)
  element.addEventListener('mouseleave', onMouseLeave)

  // Touch support for mobile
  if (isMobile) {
    element.addEventListener('touchstart', onMouseEnter)
    element.addEventListener('touchend', onMouseLeave)
  }

  return () => {
    element.removeEventListener('mouseenter', onMouseEnter)
    element.removeEventListener('mouseleave', onMouseLeave)
    if (isMobile) {
      element.removeEventListener('touchstart', onMouseEnter)
      element.removeEventListener('touchend', onMouseLeave)
    }
  }
}

/**
 * Glow effect on hover - optimized for performance
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const glowEffect = (element, options = {}) => {
  if (!element) return null

  const { color = '0 255 255', intensity = 20, duration = 0.4 } = options

  const isMobile = isMobileDevice()

  const onMouseEnter = () => {
    gsap.to(element, {
      boxShadow: `0 0 ${
        isMobile ? intensity * 0.5 : intensity
      }px rgb(${color}), 0 0 ${
        isMobile ? intensity : intensity * 2
      }px rgba(${color}, 0.5)`,
      duration,
      ease: 'power2.out',
      willChange: 'box-shadow',
    })
  }

  const onMouseLeave = () => {
    gsap.to(element, {
      boxShadow: '0 0 0px rgba(0, 0, 0, 0)',
      duration,
      ease: 'power2.out',
      willChange: 'auto',
    })
  }

  element.addEventListener('mouseenter', onMouseEnter)
  element.addEventListener('mouseleave', onMouseLeave)

  if (isMobile) {
    element.addEventListener('touchstart', onMouseEnter)
    element.addEventListener('touchend', onMouseLeave)
  }

  return () => {
    element.removeEventListener('mouseenter', onMouseEnter)
    element.removeEventListener('mouseleave', onMouseLeave)
    if (isMobile) {
      element.removeEventListener('touchstart', onMouseEnter)
      element.removeEventListener('touchend', onMouseLeave)
    }
  }
}

// ============================================================================
// PAGE LOAD ANIMATIONS
// ============================================================================

/**
 * Loading screen fade out
 * @param {HTMLElement} element - Loading screen element
 * @param {Object} options - Animation options
 */
export const fadeOutLoadingScreen = (element, options = {}) => {
  if (!element || prefersReducedMotion) return null

  const { duration = 0.6, delay = 0, ease = 'power2.inOut' } = options

  return gsap.to(element, {
    opacity: 0,
    duration,
    delay,
    ease,
    pointerEvents: 'none',
    willChange: 'opacity',
  })
}

/**
 * Page entrance animation - staggered elements
 * @param {NodeList|Array} elements - Elements to animate
 * @param {Object} options - Animation options
 */
export const pageEntrance = (elements, options = {}) => {
  if (prefersReducedMotion || !elements || !elements.length) return null

  const { duration = 0.8, staggerDelay = 0.1, ease = 'power2.out' } = options

  gsap.set(elements, { opacity: 0, y: 20 })

  return gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration,
    stagger: staggerDelay,
    ease,
    willChange: 'transform, opacity',
  })
}

// ============================================================================
// COMPLEX ANIMATIONS
// ============================================================================

/**
 * 3D rotation effect - disabled on mobile
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const rotate3D = (element, options = {}) => {
  if (prefersReducedMotion || isMobileDevice() || !element) return null

  const {
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0,
    duration = 1,
    ease = 'power1.inOut',
  } = options

  gsap.set(element, { perspective: 1000 })

  return gsap.to(element, {
    rotationX,
    rotationY,
    rotationZ,
    duration,
    ease,
    willChange: 'transform',
  })
}

/**
 * Floating animation (bob up and down)
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const float = (element, options = {}) => {
  if (prefersReducedMotion || !element) return null

  const {
    distance = 20,
    duration = 4,
    ease = 'sine.inOut',
    delay = 0,
  } = options

  return gsap.to(element, {
    y: -distance,
    duration,
    ease,
    yoyo: true,
    repeat: -1,
    delay,
    willChange: 'transform',
  })
}

/**
 * Pulse effect (scale animation)
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const pulse = (element, options = {}) => {
  if (prefersReducedMotion || !element) return null

  const { scale = 1.1, duration = 0.6, ease = 'power1.inOut' } = options

  return gsap.to(element, {
    scale,
    duration,
    ease,
    yoyo: true,
    repeat: -1,
    willChange: 'transform',
  })
}

/**
 * Rotation animation (continuous)
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const rotate = (element, options = {}) => {
  if (prefersReducedMotion || !element) return null

  const { duration = 3, ease = 'none', direction = 'clockwise' } = options

  const rotation = direction === 'clockwise' ? 360 : -360

  return gsap.to(element, {
    rotation,
    duration,
    ease,
    repeat: -1,
    willChange: 'transform',
  })
}

/**
 * Shimmer/gradient animation
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Animation options
 */
export const shimmer = (element, options = {}) => {
  if (prefersReducedMotion || !element) return null

  const { duration = 2, angle = 45, ease = 'power1.inOut' } = options

  return gsap.to(element, {
    backgroundPosition: ['200% center', '-200% center'],
    duration,
    ease,
    repeat: -1,
    willChange: 'background-position',
  })
}

// ============================================================================
// UTILITY HOOKS FOR REACT INTEGRATION
// ============================================================================

/**
 * Create a timeline with multiple animations
 * @param {Object} options - Timeline options
 * @returns {gsap.core.Timeline} GSAP Timeline instance
 */
export const createTimeline = (options = {}) => {
  const { repeat = 0, yoyo = false, delay = 0 } = options

  const timeline = gsap.timeline({
    repeat,
    yoyo,
    delay,
  })

  return timeline
}

/**
 * Kill all animations on element
 * @param {HTMLElement} element - Target element
 */
export const killAnimations = (element) => {
  if (element) {
    gsap.killTweensOf(element)
  }
}

/**
 * Destroy ScrollTrigger instances
 * @param {HTMLElement} trigger - Trigger element
 */
export const destroyScrollTrigger = (trigger) => {
  if (trigger) {
    const scrollTriggers = ScrollTrigger.getAll()
    scrollTriggers.forEach((st) => {
      if (st.trigger === trigger) {
        st.kill()
      }
    })
  }
}

/**
 * Safely animate with reduced motion consideration
 * @param {HTMLElement} element - Target element
 * @param {Object} toVars - Animation target values
 * @param {Object} options - Animation options
 */
export const safeAnimate = (element, toVars, options = {}) => {
  if (!element) return null

  if (prefersReducedMotion) {
    gsap.set(element, toVars)
    return null
  }

  return gsap.to(element, { ...toVars, willChange: 'auto', ...options })
}

export default {
  animateTextByWords,
  animateTextByLetters,
  scrollReveal,
  scrollRevealStagger,
  parallaxScroll,
  magneticButton,
  hoverScale,
  glowEffect,
  fadeOutLoadingScreen,
  pageEntrance,
  rotate3D,
  float,
  pulse,
  rotate,
  shimmer,
  createTimeline,
  killAnimations,
  destroyScrollTrigger,
  safeAnimate,
}
