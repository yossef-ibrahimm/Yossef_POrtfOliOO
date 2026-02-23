import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useMemo, memo, useEffect, useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

/* =========================================================
   Motion Safety Hook (Mobile + Reduced Motion)
========================================================= */
const useMotionSafe = () => {
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    disableMotion: prefersReduced || isMobile,
    isMobile,
  }
}

/* =========================================================
   Scroll Reveal - Enhanced with blur and scale
========================================================= */
export const ScrollReveal = memo(
  ({ children, className = '', direction = 'up', offset = 100, delay = 0 }) => {
    const ref = useRef(null)
    const { disableMotion } = useMotionSafe()

    useEffect(() => {
      if (disableMotion || !ref.current) return

      const directions = {
        up: { y: offset, opacity: 0, x: 0, scale: 0.95, filter: 'blur(10px)' },
        down: {
          y: -offset,
          opacity: 0,
          x: 0,
          scale: 0.95,
          filter: 'blur(10px)',
        },
        left: {
          x: offset,
          opacity: 0,
          y: 0,
          scale: 0.95,
          filter: 'blur(10px)',
        },
        right: {
          x: -offset,
          opacity: 0,
          y: 0,
          scale: 0.95,
          filter: 'blur(10px)',
        },
      }

      const fromState = directions[direction] || directions.up

      gsap.set(ref.current, fromState)

      gsap.to(ref.current, {
        y: 0,
        x: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse',
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === ref.current) t.kill()
        })
      }
    }, [direction, offset, delay, disableMotion])

    if (disableMotion) {
      return (
        <div
          ref={ref}
          className={className}
          style={{ opacity: 0, animation: 'fadeInUp 0.6s ease-out forwards' }}
        >
          {children}
          <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )
    }

    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  },
)

ScrollReveal.displayName = 'ScrollReveal'

/* =========================================================
   Parallax Layer - Enhanced with smooth transform
========================================================= */
export const ParallaxLayer = memo(
  ({ children, className = '', speed = 0.5, direction = 'vertical' }) => {
    const ref = useRef(null)
    const { disableMotion } = useMotionSafe()

    useEffect(() => {
      if (disableMotion || !ref.current) return

      if (direction === 'vertical') {
        gsap.to(ref.current, {
          y: () => -(ScrollTrigger.maxScroll(window) * speed * 0.3),
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        })
      } else {
        gsap.to(ref.current, {
          x: () => ScrollTrigger.maxScroll(window) * speed * 0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'left bottom',
            end: 'right top',
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        })
      }

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === ref.current) t.kill()
        })
      }
    }, [speed, direction, disableMotion])

    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  },
)

ParallaxLayer.displayName = 'ParallaxLayer'

/* =========================================================
   Scroll Scale - Enhanced with rotation and glow
========================================================= */
export const ScrollScale = memo(
  ({
    children,
    className = '',
    scaleFrom = 0.8,
    scaleTo = 1,
    withRotation = false,
  }) => {
    const ref = useRef(null)
    const { disableMotion } = useMotionSafe()

    useEffect(() => {
      if (disableMotion || !ref.current) return

      const initialProps = {
        scale: scaleFrom,
        opacity: 0.3,
        filter: 'blur(8px) brightness(0.7)',
        ...(withRotation && { rotation: -5 }),
      }

      gsap.set(ref.current, initialProps)

      gsap.to(ref.current, {
        scale: scaleTo,
        opacity: 1,
        filter: 'blur(0px) brightness(1)',
        rotation: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.8)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'center center',
          toggleActions: 'play none none reverse',
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === ref.current) t.kill()
        })
      }
    }, [scaleFrom, scaleTo, withRotation, disableMotion])

    if (disableMotion) {
      return (
        <div
          ref={ref}
          className={className}
          style={{
            opacity: 0.6,
            transform: 'scale(0.95)',
            animation: 'scaleIn 0.6s ease-out forwards',
          }}
        >
          {children}
          <style>{`@keyframes scaleIn { from { opacity: 0.6; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
      )
    }

    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  },
)

ScrollScale.displayName = 'ScrollScale'

/* =========================================================
   Scroll Rotate
========================================================= */
export const ScrollRotate = memo(
  ({ children, className = '', rotateFrom = 0, rotateTo = 360 }) => {
    const ref = useRef(null)
    const { disableMotion } = useMotionSafe()

    useEffect(() => {
      if (disableMotion || !ref.current) return

      gsap.set(ref.current, { rotation: rotateFrom })

      gsap.to(ref.current, {
        rotation: rotateTo,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === ref.current) {
            trigger.kill()
          }
        })
      }
    }, [rotateFrom, rotateTo, disableMotion])

    if (disableMotion) {
      return (
        <div
          ref={ref}
          className={className}
          style={{ opacity: 0.7, animation: 'fadeIn 0.6s ease-out forwards' }}
        >
          {children}
          <style>{`@keyframes fadeIn { from { opacity: 0.7; } to { opacity: 1; } }`}</style>
        </div>
      )
    }

    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  },
)

ScrollRotate.displayName = 'ScrollRotate'

/* =========================================================
   Stagger Reveal (for lists/grids)
========================================================= */
export const StaggerReveal = memo(
  ({ children, className = '', staggerDelay = 0.1 }) => {
    const ref = useRef(null)
    const { disableMotion } = useMotionSafe()

    useEffect(() => {
      if (!ref.current) return

      const items = ref.current.querySelectorAll('[data-stagger-item]')
      if (items.length === 0) return

      if (disableMotion) {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        })
      } else {
        gsap.set(items, { opacity: 0, y: 20 })

        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: staggerDelay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === ref.current) {
            trigger.kill()
          }
        })
      }
    }, [staggerDelay, disableMotion])

    const childrenArray = useMemo(
      () => (Array.isArray(children) ? children : [children]),
      [children],
    )

    return (
      <div ref={ref} className={className}>
        {childrenArray.map((child, i) => (
          <div key={i} data-stagger-item>
            {child}
          </div>
        ))}
      </div>
    )
  },
)

StaggerReveal.displayName = 'StaggerReveal'

/* =========================================================
   Viewport Reveal (Simple entrance animation)
========================================================= */
export const ViewportReveal = memo(({ children, className = '' }) => {
  const ref = useRef(null)
  const { disableMotion } = useMotionSafe()

  useEffect(() => {
    if (!ref.current) return

    if (disableMotion) {
      gsap.set(ref.current, { opacity: 1, y: 0 })
      return
    }

    gsap.set(ref.current, { opacity: 0, y: 30 })

    gsap.to(ref.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === ref.current) {
          trigger.kill()
        }
      })
    }
  }, [disableMotion])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
})

ViewportReveal.displayName = 'ViewportReveal'

/* =========================================================
   Magnetic Hover - Element follows cursor
========================================================= */
export const MagneticHover = memo(
  ({ children, className = '', strength = 0.3 }) => {
    const ref = useRef(null)
    const { disableMotion } = useMotionSafe()

    useEffect(() => {
      if (disableMotion || !ref.current) return

      const el = ref.current

      const handleMove = (e) => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        gsap.to(el, {
          x: x * strength,
          y: y * strength,
          duration: 0.6,
          ease: 'power2.out',
        })
      }

      const handleLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
      }

      el.addEventListener('mousemove', handleMove)
      el.addEventListener('mouseleave', handleLeave)

      return () => {
        el.removeEventListener('mousemove', handleMove)
        el.removeEventListener('mouseleave', handleLeave)
      }
    }, [strength, disableMotion])

    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  },
)

MagneticHover.displayName = 'MagneticHover'

/* =========================================================
   Clip Path Reveal - Dramatic entrance
========================================================= */
export const ClipPathReveal = memo(
  ({ children, className = '', direction = 'left' }) => {
    const ref = useRef(null)
    const { disableMotion } = useMotionSafe()

    useEffect(() => {
      if (disableMotion || !ref.current) return

      const clips = {
        left: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        right: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
        top: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
        bottom: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
        center: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
      }

      gsap.set(ref.current, {
        clipPath: clips[direction] || clips.left,
        opacity: 0,
      })

      gsap.to(ref.current, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        opacity: 1,
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === ref.current) t.kill()
        })
      }
    }, [direction, disableMotion])

    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  },
)

ClipPathReveal.displayName = 'ClipPathReveal'

/* =========================================================
   Text Split Reveal - Letter by letter animation
========================================================= */
export const TextSplitReveal = memo(
  ({ text, className = '', stagger = 0.03 }) => {
    const ref = useRef(null)
    const { disableMotion } = useMotionSafe()

    useEffect(() => {
      if (!ref.current) return

      const letters = ref.current.querySelectorAll('.letter')

      if (disableMotion) {
        gsap.set(letters, { opacity: 1, y: 0 })
        return
      }

      gsap.set(letters, { opacity: 0, y: 50, rotationX: -90 })

      gsap.to(letters, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === ref.current) t.kill()
        })
      }
    }, [stagger, disableMotion])

    return (
      <div ref={ref} className={className} style={{ perspective: '1000px' }}>
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="letter"
            style={{ display: 'inline-block', transformOrigin: 'bottom' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    )
  },
)

TextSplitReveal.displayName = 'TextSplitReveal'

/* =========================================================
   Morph Shape - SVG morphing animation
========================================================= */
export const MorphShape = memo(({ className = '', color = '#6366f1' }) => {
  const ref = useRef(null)
  const { disableMotion } = useMotionSafe()

  useEffect(() => {
    if (disableMotion || !ref.current) return

    const path = ref.current.querySelector('path')

    const shapes = [
      'M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z',
      'M51,171.3c-6.1-17.7-15.3-17.2-20.7-32c-8-21.9,0.7-54.6,20.7-67.1c19.5-12.3,32.8,5.5,67.7-3.4C145.2,62,145,49.9,173,43.4 c12-2.8,41.4-9.6,60.2,6.6c19,16.4,16.7,47.5,16,57.7c-1.7,22.8-10.3,25.5-9.4,46.4c1,22.5,11.2,25.8,9.1,42.6 c-2.2,17.6-16.3,37.5-33.5,40.8c-22,4.1-29.4-22.4-54.9-22.6c-31-0.2-40.8,39-68.3,35.7c-17.3-2-32.2-19.8-37.3-34.8 C48.9,198.6,57.8,191,51,171.3z',
      'M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z',
    ]

    const tl = gsap.timeline({
      repeat: -1,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        toggleActions: 'play pause play pause',
      },
    })

    shapes.forEach((shape) => {
      tl.to(path, {
        attr: { d: shape },
        duration: 2,
        ease: 'sine.inOut',
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === ref.current) t.kill()
      })
      tl.kill()
    }
  }, [disableMotion])

  return (
    <svg
      ref={ref}
      className={className}
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color}
        d="M37.5,186c-12.1-10.5-11.8-32.3-7.2-46.7c4.8-15,13.1-17.8,30.1-36.7C91,68.8,83.5,56.7,103.4,45 c22.2-13.1,51.1-9.5,69.6-1.6c18.1,7.8,15.7,15.3,43.3,33.2c28.8,18.8,37.2,14.3,46.7,27.9c15.6,22.3,6.4,53.3,4.4,60.2 c-3.3,11.2-7.1,23.9-18.5,32c-16.3,11.5-29.5,0.7-48.6,11c-16.2,8.7-12.6,19.7-28.2,33.2c-22.7,19.7-63.8,25.7-79.9,9.7 c-15.2-15.1,0.3-41.7-16.6-54.9C63,186,49.7,196.7,37.5,186z"
      />
    </svg>
  )
})

MorphShape.displayName = 'MorphShape'

/* =========================================================
   Floating Element - Continuous smooth movement
========================================================= */
export const FloatingElement = memo(
  ({ children, className = '', intensity = 1 }) => {
    const ref = useRef(null)
    const { disableMotion } = useMotionSafe()

    useEffect(() => {
      if (disableMotion || !ref.current) return

      gsap.to(ref.current, {
        y: `${-20 * intensity}px`,
        duration: 2 + intensity,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to(ref.current, {
        x: `${10 * intensity}px`,
        duration: 3 + intensity,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      return () => {
        gsap.killTweensOf(ref.current)
      }
    }, [intensity, disableMotion])

    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  },
)

FloatingElement.displayName = 'FloatingElement'
