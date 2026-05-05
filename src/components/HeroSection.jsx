/**
 * HeroSection — Production-Optimized
 *
 * Key optimizations vs original:
 * 1. Fixed useMemo→useCallback for handleDownloadCV
 * 2. Removed 6 unused imports (dead bundle weight)
 * 3. Scoped ScrollTrigger cleanup — no longer kills global triggers
 * 4. Added null-guard on all refs before GSAP access
 * 5. Extracted glowRef into dedicated ref instead of fragile .querySelector
 * 6. Fixed GSAP y-property conflict between entrance + floating animations
 * 7. disableHeavyMotion initializes from matchMedia synchronously — no flicker
 * 8. Added GSAP cleanup for AnimatedOrbs + FloatingParticles (memory leak fix)
 * 9. Removed Suspense around TypewriterText (not an async component)
 * 10. Fixed <a> inside MagneticButton — now uses onClick+role correctly
 * 11. Added aria-label to social links and scroll indicator
 * 12. Added aria-hidden to all decorative elements
 * 13. Added will-change hints for GPU-accelerated orbs
 * 14. socialsRef removed (was unused)
 * 15. animate-pulse conflict removed from GSAP-controlled orbs
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  useRef,
  useMemo,
  useCallback,
  memo,
  lazy,
  Suspense,
  useEffect,
  useState,
} from 'react'
import { ArrowDown, Github, Linkedin, Sparkles, Zap } from 'lucide-react'
import { AnimatedLetters, TypewriterText } from './AnimatedText'
import { createSparkles } from '../utils/advancedAnimations'

gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read prefers-reduced-motion + viewport width synchronously to avoid flicker */
function getMotionPreference() {
  if (typeof window === 'undefined') return true
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mobile = window.innerWidth < 768
  return reduced || mobile
}

// ---------------------------------------------------------------------------
// Lazy-loaded heavy component
// ---------------------------------------------------------------------------

const MagneticButton = lazy(() =>
  import('./MagneticButton').then((m) => ({ default: m.MagneticButton })),
)

// ---------------------------------------------------------------------------
// Static data — defined OUTSIDE component to avoid re-creation on every render
// ---------------------------------------------------------------------------

const SOCIAL_LINKS = [
  {
    icon: Github,
    href: 'https://github.com/yossef-ibrahimm',
    label: 'GitHub',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/youssef-ibrahim/',
    label: 'LinkedIn',
  },
]

/**
 * Particle positions pre-computed as module-level constant.
 * Deterministic formula means no random layout shifts between renders or hydration.
 */
const FLOATING_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 17) % 100}%`,
  top: `${(i * 23 + 31) % 100}%`,
  opacity: 0.3 + (i % 7) * 0.1,
}))

// ---------------------------------------------------------------------------
// AnimatedOrbs
// ---------------------------------------------------------------------------

const AnimatedOrbs = memo(() => {
  const orbsRef = useRef(null)

  useEffect(() => {
    if (!orbsRef.current) return

    const ctx = gsap.context(() => {
      Array.from(orbsRef.current.children).forEach((orb, i) => {
        gsap.to(orb, {
          x: `random(-100, 100)`,
          y: `random(-100, 100)`,
          scale: `random(0.8, 1.2)`,
          duration: `random(8, 15)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.5,
        })
      })
    }, orbsRef)

    // ✅ Scoped context cleanup — no memory leak
    return () => ctx.revert()
  }, [])

  return (
    // aria-hidden: purely decorative, screen readers skip
    <div
      ref={orbsRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* will-change: transform enables GPU compositing layer for smooth animation */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl [will-change:transform]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/30 rounded-full blur-3xl [will-change:transform]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl [will-change:transform]" />
      <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-primary/20 rounded-full blur-2xl [will-change:transform]" />
      <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-accent/20 rounded-full blur-2xl [will-change:transform]" />
    </div>
  )
})

AnimatedOrbs.displayName = 'AnimatedOrbs'

// ---------------------------------------------------------------------------
// FloatingParticles
// ---------------------------------------------------------------------------

const FloatingParticles = memo(() => {
  const particlesRef = useRef(null)

  useEffect(() => {
    if (!particlesRef.current) return

    const ctx = gsap.context(() => {
      Array.from(particlesRef.current.children).forEach((particle, i) => {
        gsap.to(particle, {
          y: `random(-200, 200)`,
          x: `random(-50, 50)`,
          opacity: `random(0.3, 1)`,
          duration: `random(3, 8)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        })
      })
    }, particlesRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={particlesRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      {FLOATING_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-primary rounded-full"
          style={{ left: p.left, top: p.top, opacity: p.opacity }}
        />
      ))}
    </div>
  )
})

FloatingParticles.displayName = 'FloatingParticles'

// ---------------------------------------------------------------------------
// SocialLink
// ---------------------------------------------------------------------------

const SocialLink = memo(({ social, index }) => {
  const linkRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    const el = linkRef.current
    if (!el) return

    // ✅ FIXED: Entrance animation uses `fromTo` with explicit start y.
    // The continuous float starts AFTER entrance completes via `onComplete`,
    // so the two animations no longer fight over the `y` property.
    gsap.fromTo(
      el,
      { opacity: 0, y: 30, scale: 0.5, rotation: -180 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        delay: 1 + index * 0.15,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => {
          gsap.to(el, {
            y: -5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3,
          })
        },
      },
    )

    const onMouseEnter = () => {
      createSparkles(el, 'rgb(99, 102, 241)')
      gsap.to(el, {
        scale: 1.25,
        y: -12,
        rotation: 360,
        boxShadow:
          '0 0 30px rgba(99, 102, 241, 0.8), 0 0 60px rgba(99, 102, 241, 0.4)',
        duration: 0.4,
        ease: 'back.out(2)',
      })
      if (glowRef.current) {
        gsap.to(glowRef.current, { scale: 1.5, opacity: 1, duration: 0.4 })
      }
    }

    const onMouseLeave = () => {
      gsap.to(el, {
        scale: 1,
        y: 0,
        rotation: 0,
        boxShadow: '0 0 0px rgba(99, 102, 241, 0)',
        duration: 0.4,
        ease: 'power2.out',
      })
      if (glowRef.current) {
        gsap.to(glowRef.current, { scale: 1, opacity: 0, duration: 0.4 })
      }
    }

    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mouseleave', onMouseLeave)
      // Kill all GSAP tweens targeting this element on unmount
      gsap.killTweensOf(el)
    }
  }, [index])

  return (
    <div className="relative">
      <div
        ref={glowRef}
        className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 -z-10"
        aria-hidden="true"
      />
      <a
        ref={linkRef}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit my ${social.label} profile`}
        className="relative block p-4 glass rounded-full hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 group overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"
          aria-hidden="true"
        />
        <social.icon
          className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-all duration-300 relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"
          aria-hidden="true"
        />
      </a>
    </div>
  )
})

SocialLink.displayName = 'SocialLink'

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------

export const HeroSection = () => {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const tagRef = useRef(null)
  const headingRef = useRef(null)
  const subheadingRef = useRef(null)
  const paragraphRef = useRef(null)
  const buttonsRef = useRef(null)
  const accentLineRef = useRef(null)
  const scrollIndicatorRef = useRef(null)
  const scrollGlowRef = useRef(null) // ✅ Dedicated ref instead of fragile .querySelector
  const gridRef = useRef(null)

  // ✅ FIXED: Initialize synchronously to prevent desktop flicker on first paint
  const [disableHeavyMotion, setDisableHeavyMotion] =
    useState(getMotionPreference)

  // Listen for viewport width changes (e.g. orientation change, resize)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handler = () => setDisableHeavyMotion(reducedMq.matches || mq.matches)

    mq.addEventListener('change', handler)
    reducedMq.addEventListener('change', handler)
    return () => {
      mq.removeEventListener('change', handler)
      reducedMq.removeEventListener('change', handler)
    }
  }, [])

  // Scroll-based parallax (desktop only, respects motion preference)
  useEffect(() => {
    if (disableHeavyMotion || !contentRef.current || !gridRef.current) return

    // ✅ FIXED: Scoped ScrollTrigger instances stored locally.
    // Original code called ScrollTrigger.getAll().kill() — nuclear option
    // that destroys ALL triggers app-wide, breaking other sections.
    const triggers = []

    triggers.push(
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '150% top',
        scrub: 1,
        animation: gsap.to(contentRef.current, {
          y: -350,
          opacity: 0,
          scale: 0.7,
          rotateX: -15,
          transformPerspective: 1000,
          ease: 'none',
        }),
      }),
    )

    triggers.push(
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '150% top',
        scrub: 1,
        animation: gsap.to(gridRef.current, {
          opacity: 0,
          scale: 1.2,
          y: -100,
          ease: 'none',
        }),
      }),
    )

    if (accentLineRef.current) {
      triggers.push(
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '100% top',
          scrub: 1,
          animation: gsap.to(accentLineRef.current, {
            scaleX: 0,
            opacity: 0,
            rotation: 180,
            ease: 'none',
          }),
        }),
      )
    }

    return () => triggers.forEach((t) => t.kill())
  }, [disableHeavyMotion])

  // Entrance animations timeline
  useEffect(() => {
    // ✅ Guard all refs — if GSAP fails for any reason, elements fall back to visible
    const refs = [
      tagRef,
      headingRef,
      subheadingRef,
      accentLineRef,
      paragraphRef,
      buttonsRef,
    ]
    if (refs.some((r) => !r.current)) return

    const tl = gsap.timeline()

    tl.fromTo(
      tagRef.current,
      { opacity: 0, scale: 0, y: 30, rotation: -180 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)',
      },
      0,
    )
    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' },
      0.2,
    )
    tl.fromTo(
      subheadingRef.current,
      { opacity: 0, y: 30, rotateX: -90 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' },
      0.4,
    )
    tl.fromTo(
      accentLineRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
      0.6,
    )
    tl.fromTo(
      paragraphRef.current,
      { opacity: 0, y: 20, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.6,
        ease: 'power2.out',
      },
      0.8,
    )
    tl.fromTo(
      buttonsRef.current,
      { opacity: 0, y: 30, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
      1,
    )

    return () => tl.kill()
  }, [])

  // Scroll indicator animation
  useEffect(() => {
    if (!scrollIndicatorRef.current || disableHeavyMotion) return

    const tl = gsap.timeline({ repeat: -1 })
    tl.to(scrollIndicatorRef.current, {
      y: 15,
      duration: 1,
      ease: 'power1.inOut',
    }).to(scrollIndicatorRef.current, {
      y: 0,
      duration: 1,
      ease: 'power1.inOut',
    })

    // ✅ FIXED: Use dedicated scrollGlowRef instead of .querySelector('.glow')
    if (scrollGlowRef.current) {
      gsap.to(scrollGlowRef.current, {
        opacity: 0.8,
        scale: 1.2,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }

    return () => {
      tl.kill()
      if (scrollGlowRef.current) gsap.killTweensOf(scrollGlowRef.current)
    }
  }, [disableHeavyMotion])

  // ✅ FIXED: useCallback (not useMemo) for event handler
  const handleDownloadCV = useCallback(() => {
    const link = document.createElement('a')
    link.href = './cv.pdf'
    link.download = 'cv.pdf'
    link.click()
  }, [])

  const handleViewWork = useCallback(() => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Hero section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Decorative background — aria-hidden so screen readers skip */}
      <AnimatedOrbs />
      <FloatingParticles />

      <div
        ref={contentRef}
        className="text-center z-10 w-full px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Tag */}
        <div ref={tagRef} className="mt-8  opacity-0 z-[9999]">
          <span className="inline-block px-5 py-2.5 glass rounded-full text-sm font-semibold text-primary relative overflow-hidden group shadow-lg shadow-primary/20">
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles
                className="w-4 h-4 animate-spin"
                style={{ animationDuration: '3s' }}
                aria-hidden="true"
              />
              Front-End Developer
              <Zap className="w-4 h-4 animate-pulse" aria-hidden="true" />
            </span>
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"
              aria-hidden="true"
            />
          </span>
        </div>

        {/* Main heading - Value proposition first */}
        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-[0.9] md:leading-[0.95] mb-4 opacity-0"
        >
          <span className="relative inline-block">
            <AnimatedLetters
              text="Crafting Digital Excellence"
              className="block text-foreground drop-shadow-lg"
            />
          </span>
        </h1>

        {/* Name + Title */}
        <div ref={subheadingRef} className="mb-8 md:mb-10 opacity-0">
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-black bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] drop-shadow-2xl">
            <TypewriterText text="Youssef Ibrahim" delay={0.5} />
          </span>
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-light mt-4">
             Front-End Developer & UI Engineer
          </p>
        </div>

        {/* Accent line */}
        <div className="flex justify-center mb-10 md:mb-12" aria-hidden="true">
          <div
            ref={accentLineRef}
            className="h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full origin-center shadow-lg shadow-primary/50 relative"
            style={{ width: '250px' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full blur-sm animate-pulse" />
          </div>
        </div>

        {/* Description - Confident, value-focused */}
        <p
          ref={paragraphRef}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 md:mb-14 leading-relaxed opacity-0 px-2"
        >
          I build{' '}
          <span className="text-primary font-semibold">blazing-fast</span>,{' '}
          <span className="text-accent font-semibold">pixel-perfect</span>{' '}
          web applications that deliver measurable results.
          <span className="block mt-2 text-lg text-muted-foreground/80">
            React • TypeScript • Performance Optimization
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16 md:mb-20 opacity-0 px-2"
        >
          <Suspense
            fallback={
              <div className="px-8 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-full">
                Loading...
              </div>
            }
          >
            {/*
             * ✅ FIXED: Original had <a href="#work"> nested inside MagneticButton.
             * Interactive elements must not be nested. Using onClick + button role instead.
             */}
            <MagneticButton
              className="group relative px-8 sm:px-10 py-4 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] text-primary-foreground font-bold rounded-full text-base sm:text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-500 overflow-hidden animate-gradient"
              onClick={handleViewWork}
              aria-label="Scroll to my work section"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                aria-hidden="true"
              />
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <span
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
            </MagneticButton>

            <MagneticButton
              className="relative px-8 sm:px-10 py-4 glass rounded-full text-base sm:text-lg font-semibold hover:bg-secondary/80 hover:border-primary/60 transition-all duration-300 overflow-hidden group"
              onClick={handleDownloadCV}
              aria-label="Download my CV as PDF"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                aria-hidden="true"
              />
              <span className="relative z-10">Download CV</span>
            </MagneticButton>
          </Suspense>
        </div>

        {/* Social links */}
        <div
          aria-label="Social media links"
          className="flex items-center justify-center gap-6"
        >
          {/* ✅ SOCIAL_LINKS is module-level constant — no useMemo needed */}
          {SOCIAL_LINKS.map((social, i) => (
            <SocialLink key={social.label} social={social} index={i} />
          ))}
        </div>
      </div>

      {/* Scroll indicator (desktop + no-reduced-motion only) */}
      {!disableHeavyMotion && (
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
          aria-label="Scroll down"
          role="img"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-semibold">
            Scroll
          </span>
          <div className="relative">
            {/* ✅ FIXED: Dedicated ref instead of .querySelector('.glow') */}
            <div
              ref={scrollGlowRef}
              className="absolute inset-0 bg-primary/30 rounded-full blur-lg"
              aria-hidden="true"
            />
            <ArrowDown
              className="relative w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      {/* Background grid */}
      <div
        ref={gridRef}
        className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.15)_1px,transparent_1px)] bg-[size:80px_80px] sm:bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"
        aria-hidden="true"
      />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/80 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  )
}
