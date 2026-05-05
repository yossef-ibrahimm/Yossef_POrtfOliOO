/**
 * Interactive Elements Hook
 * Adds interactive animations to data-attributed elements
 *
 * FIXED: Uses gsap.context() for scoped cleanup.
 * All event listeners are now properly removed on unmount.
 * Pulse/colorShift animations are scoped and cleaned up.
 */

import gsap from 'gsap'
import { useEffect } from 'react'

export const useInteractiveElements = (containerRef = null) => {
  useEffect(() => {
    const container = containerRef?.current || document
    const cleanups = []

    const ctx = gsap.context(() => {
      // Stagger reveal for elements with data-stagger-item
      const staggerItems = container.querySelectorAll('[data-stagger-item]')
      staggerItems.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'power2.out',
          }
        )
      })

      // Hover lift effect for data-lift
      const liftElements = container.querySelectorAll('[data-lift]')
      liftElements.forEach((element) => {
        const onEnter = () => {
          gsap.to(element, {
            y: -10,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            duration: 0.3,
            ease: 'power2.out',
          })
        }
        const onLeave = () => {
          gsap.to(element, {
            y: 0,
            boxShadow: '0 0px 0px rgba(0, 0, 0, 0)',
            duration: 0.3,
            ease: 'power2.out',
          })
        }
        element.addEventListener('mouseenter', onEnter)
        element.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          element.removeEventListener('mouseenter', onEnter)
          element.removeEventListener('mouseleave', onLeave)
        })
      })

      // Rotate on hover for data-rotate
      const rotateElements = container.querySelectorAll('[data-rotate]')
      rotateElements.forEach((element) => {
        const onEnter = () => {
          gsap.to(element, {
            rotation: 360,
            scale: 1.1,
            duration: 0.6,
            ease: 'power2.out',
          })
        }
        const onLeave = () => {
          gsap.to(element, {
            rotation: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          })
        }
        element.addEventListener('mouseenter', onEnter)
        element.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          element.removeEventListener('mouseenter', onEnter)
          element.removeEventListener('mouseleave', onLeave)
        })
      })

      // Pulse effect for data-pulse
      const pulseElements = container.querySelectorAll('[data-pulse]')
      pulseElements.forEach((element) => {
        gsap.to(element, {
          scale: 1.05,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })

      // Color shift for data-color-shift
      const colorShiftElements = container.querySelectorAll('[data-color-shift]')
      colorShiftElements.forEach((element) => {
        const colors = ['#63f', '#8854e0', '#ec4899', '#63f']
        gsap.to(element, {
          color: colors,
          duration: 3,
          repeat: -1,
          ease: 'none',
        })
      })
    }, container)

    return () => {
      cleanups.forEach((fn) => fn())
      ctx.revert()
    }
  }, [])
}

export default useInteractiveElements
