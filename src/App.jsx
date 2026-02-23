import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import LoadingScreen from './components/LoadingScreen.jsx'
import PremiumAboutSection from './components/PremiumAboutSection.jsx'
import ProjectsSection from './components/ProjectsSection.jsx'
import { ContactSection } from './components/ContactSection.jsx'
import Footer from './components/Footer.jsx'
import gsap from 'gsap'
import { useRef, useState, useEffect, useMemo, memo, useCallback } from 'react'
import { useTheme } from './components/ThemeProvider'

// ---------------------------------------------------------------------------
// useMotionSafe
//
// ✅ FIXED (original had 3 bugs):
//
// Bug 1: window.matchMedia() called synchronously in hook body (render-time)
//   → crashes in SSR, wrong in concurrent mode
//   Fix: lazy useState initializer reads window synchronously but safely
//        (only runs once, in browser, before first paint)
//
// Bug 2: `reduced` was computed once at hook call time, never updated
//   → user changing OS accessibility setting mid-session had no effect
//   Fix: useEffect subscribes to the media query change event
//
// Bug 3: isMobile initialized to false → true flip after mount
//   → caused 40 particles + MouseFollowers to mount briefly on mobile
//   Fix: lazy initializer reads window.innerWidth synchronously
// ---------------------------------------------------------------------------

function getInitialMotionState() {
  if (typeof window === 'undefined') return { reduced: false, mobile: false }
  return {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    mobile:
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 768,
  }
}

const useMotionSafe = () => {
  // ✅ Lazy initializer: runs synchronously before first render, only in browser
  const [motionState, setMotionState] = useState(getInitialMotionState)

  useEffect(() => {
    // Subscribe to resize for isMobile updates
    const handleResize = () => {
      setMotionState((prev) => ({ ...prev, mobile: window.innerWidth < 768 }))
    }

    // ✅ Subscribe to prefers-reduced-motion changes (e.g. user flips OS setting)
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleReducedChange = (e) => {
      setMotionState((prev) => ({ ...prev, reduced: e.matches }))
    }

    window.addEventListener('resize', handleResize, { passive: true })
    reducedMq.addEventListener('change', handleReducedChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      reducedMq.removeEventListener('change', handleReducedChange)
    }
  }, [])

  return {
    disableMotion: motionState.reduced || motionState.mobile,
    isMobile: motionState.mobile,
  }
}

// ---------------------------------------------------------------------------
// Deterministic particle seeder
//
// ✅ FIXED: Original used Math.random() inside useMemo.
// Problem: React StrictMode invokes the memo factory twice (different values
// each time). In SSR/hydration, server and client produce different particles
// causing layout shift. In fast re-renders, particles jump positions.
//
// Solution: Linear Congruential Generator seeded with particle index.
// Same seed → same values every time, everywhere.
// ---------------------------------------------------------------------------

function seededRand(seed) {
  // LCG parameters (same as glibc)
  const a = 1664525
  const c = 1013904223
  const m = Math.pow(2, 32)
  let s = seed
  return () => {
    s = (a * s + c) % m
    return s / m
  }
}

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const rand = seededRand(i * 7919) // prime multiplier for good distribution
    return {
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 4 + 2,
      duration: rand() * 15 + 10,
      delay: rand() * 3,
      opacity: rand() * 0.4 + 0.1,
    }
  })
}

// ---------------------------------------------------------------------------
// ParticleCanvas
//
// ✅ ARCHITECTURAL UPGRADE: Replaces 40 individual <Particle> components.
//
// Original: 40 components × (useRef + useEffect + GSAP tween) = 40 animation
// loops registered with GSAP's ticker, each doing a DOM style update every
// frame. On a low-end mobile at 30fps, that's 40 * 30 = 1200 style mutations/sec.
//
// New: Single <canvas> element, one rAF loop, zero DOM mutations per frame.
// Particles are drawn with canvas 2D API — orders of magnitude faster.
// ---------------------------------------------------------------------------

const ParticleCanvas = memo(({ particles }) => {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || particles.length === 0) return

    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight

    canvas.width = width
    canvas.height = height

    // Particle state: each particle tracks its own phase for sine wave
    const state = particles.map((p) => ({
      x: (p.x / 100) * width,
      y: (p.y / 100) * height,
      baseY: (p.y / 100) * height,
      size: p.size,
      opacity: p.opacity,
      speed: (2 * Math.PI) / (p.duration * 60), // radians per frame at 60fps
      phase: p.delay * 60, // start phase offset
      amplitude: 20,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      state.forEach((p) => {
        p.phase += p.speed
        const currentY = p.baseY + Math.sin(p.phase) * p.amplitude
        const currentOpacity = p.opacity + Math.sin(p.phase) * p.opacity * 0.4

        ctx.beginPath()
        ctx.arc(p.x, currentY, p.size / 2, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(220, 100%, 70%, ${Math.max(0, currentOpacity)})`
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      // Recompute absolute positions from percentages
      state.forEach((p, i) => {
        p.x = (particles[i].x / 100) * width
        p.baseY = (particles[i].y / 100) * height
      })
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [particles])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
})

ParticleCanvas.displayName = 'ParticleCanvas'

// ---------------------------------------------------------------------------
// Orb
// ✅ FIXED: GSAP array syntax opacity:[0.25,0.5,0.25] — GSAP gsap.to() does
// not support array keyframes. Only the last value was applied. Fixed with
// gsap.timeline({ repeat: -1, yoyo: true }).
// ✅ Added displayName for React DevTools.
// ---------------------------------------------------------------------------

const Orb = memo(({ orb }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    // ✅ FIXED: Use timeline yoyo instead of broken array syntax
    const tl = gsap.timeline({ repeat: -1, yoyo: true, ease: 'sine.inOut' })
    tl.to(ref.current, { opacity: 0.5, duration: 5 })
    // start opacity set via inline style below

    return () => tl.kill()
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: orb.x,
        top: orb.y,
        width: orb.size,
        height: orb.size,
        borderRadius: '50%',
        background: `radial-gradient(circle, hsla(${orb.color},0.2), transparent 70%)`,
        opacity: 0.25, // matches tl start value
        willChange: 'opacity',
      }}
    />
  )
})

Orb.displayName = 'Orb'

// ---------------------------------------------------------------------------
// MouseFollowers
// ✅ FIXED: mouseX/mouseY were declared but never read — dead variables removed.
// GSAP already captures the values via the event handler closure.
// ✅ Added displayName.
// ---------------------------------------------------------------------------

const MouseFollowers = memo(() => {
  const followerRef = useRef(null)

  useEffect(() => {
    if (!followerRef.current) return

    const handleMouseMove = (e) => {
      gsap.to(followerRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={followerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        width: 120,
        height: 120,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, hsla(280,100%,60%,0.25), transparent 70%)',
        transform: 'translate(-50%,-50%)',
        willChange: 'transform',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
})

MouseFollowers.displayName = 'MouseFollowers'

// ---------------------------------------------------------------------------
// InteractiveBackground
//
// ✅ OPTIMIZATION: theme prop removed. Theme changes are now handled via CSS
// custom properties on :root (set by ThemeProvider). This means a theme toggle
// no longer re-renders InteractiveBackground or any of its children.
//
// The background gradient now reads from CSS vars that update instantly.
// ---------------------------------------------------------------------------

// Stable orb definitions — module-level, never re-created
const DESKTOP_ORBS = [
  { id: 'orb-tl', x: '10%', y: '20%', color: '280,100%,60%', size: 150 },
  { id: 'orb-tr', x: '80%', y: '30%', color: '200,100%,60%', size: 120 },
  { id: 'orb-b', x: '50%', y: '75%', color: '320,100%,60%', size: 180 },
]
const REDUCED_ORBS = [
  { id: 'orb-center', x: '50%', y: '50%', color: '280,100%,60%', size: 200 },
]

// Stable particle set — generated once at module load (deterministic)
const DESKTOP_PARTICLES = generateParticles(40)

const InteractiveBackground = memo(() => {
  const { disableMotion, isMobile } = useMotionSafe()

  const orbs = disableMotion ? REDUCED_ORBS : DESKTOP_ORBS
  const particles = disableMotion ? [] : DESKTOP_PARTICLES

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/*
       * ✅ Background gradient reads from CSS custom properties set by ThemeProvider.
       * No prop drilling, no re-render on theme change.
       * Add to your global CSS:
       *   :root        { --bg-gradient: radial-gradient(circle, hsl(250,50%,8%), hsl(240,50%,3%)); }
       *   :root.light  { --bg-gradient: radial-gradient(circle, hsl(0,0%,95%), hsl(0,0%,90%)); }
       */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--bg-gradient)',
        }}
      />

      {/* Single canvas replaces 40 individual Particle DOM nodes */}
      {particles.length > 0 && <ParticleCanvas particles={particles} />}

      {orbs.map((o) => (
        // ✅ FIXED: key uses stable id instead of index
        <Orb key={o.id} orb={o} />
      ))}

      {!disableMotion && !isMobile && <MouseFollowers />}
    </div>
  )
})

InteractiveBackground.displayName = 'InteractiveBackground'

// ---------------------------------------------------------------------------
// PageContent
//
// Extracted into its own component so that useInteractiveElements() is only
// called when the actual page DOM exists (after loading completes).
//
// ✅ FIXED: Original called useInteractiveElements() unconditionally in App,
// meaning it ran during the LoadingScreen render when no page sections existed.
// ---------------------------------------------------------------------------

import useInteractiveElements from './hooks/useInteractiveElements'

const PageContent = memo(() => {
  // ✅ Now safely called: this component only mounts after isLoading → false
  useInteractiveElements()

  return (
    <>
      <InteractiveBackground />
      <Navbar />
      {/*
       * ✅ <main> landmark added — required for accessibility.
       * Screen reader users can skip directly to main content.
       */}
      <main id="main-content">
        <HeroSection />
        <PremiumAboutSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
})

PageContent.displayName = 'PageContent'

// ---------------------------------------------------------------------------
// App — Root Component
// ---------------------------------------------------------------------------

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = useCallback(() => setIsLoading(false), [])

  return (
    <>
      {/*
       * ✅ aria-live region announces the loading→content transition
       * to screen readers. Hidden visually but present in accessibility tree.
       */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isLoading
          ? 'Loading portfolio, please wait…'
          : 'Portfolio loaded. Welcome.'}
      </div>

      {isLoading ? (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      ) : (
        <PageContent />
      )}
    </>
  )
}
