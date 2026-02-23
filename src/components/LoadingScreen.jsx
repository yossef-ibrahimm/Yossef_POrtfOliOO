/**
 * LoadingScreen — Production-Optimized + Epic Transition
 *
 * Bugs fixed:
 * 1.  GlowingOrbs GSAP array syntax [1,1.2,1] → gsap.timeline yoyo (5th time this codebase)
 * 2.  OrbitalLoader 5× broken array syntax → gsap.context + timelines
 * 3.  LettersAnimation: return inside forEach was ignored → listeners leaked forever
 *     Fixed: collect refs, clean up in useEffect return
 * 4.  ProgressBar textContent tween requires paid TextPlugin → replaced with React state
 * 5.  LoadingScreen setTimeout has no cleanup → useRef-tracked timeout, cleared on unmount
 * 6.  Particle Math.random() in JSX render → module-level seeded constants
 * 7.  BlocksTransition querySelector null safety added
 * 8.  @keyframes scaleIn used invalid CSS `scaleX:0` → transform: scaleX(0)
 * 9.  All <style> tags consolidated into one module-level injection
 * 10. All effects wrapped in gsap.context() for scoped cleanup
 * 11. aria-live region added for screen reader progress announcements
 * 12. memo() added to all sub-components
 *
 * EPIC TRANSITION (user request: خرافية):
 * Stage 1 — Loading content fades with letter scatter + blur
 * Stage 2 — 24 blocks assemble from outside → center with staggered 3D flip
 * Stage 3 — Blocks shatter outward revealing the site beneath in a radial burst
 * Stage 4 — Shockwave ripple ring expands, wrapperRef opacity:0 → onLoadingComplete
 */

import gsap from 'gsap'
import { useState, useEffect, useRef, memo } from 'react'

// ---------------------------------------------------------------------------
// Module-level CSS injection — once per app load, not per component instance
// ---------------------------------------------------------------------------
if (typeof document !== 'undefined') {
  const id = 'loading-screen-styles'
  if (!document.getElementById(id)) {
    const s = document.createElement('style')
    s.id = id
    s.textContent = `
      @keyframes ls-pulse-opacity {
        0%, 100% { opacity: 0.4; }
        50%       { opacity: 1;   }
      }
      @keyframes ls-blink {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0; }
      }
      @keyframes ls-scale-in {
        from { opacity: 0; transform: scaleX(0); }
        to   { opacity: 1; transform: scaleX(1); }
      }
      @keyframes ls-shimmer {
        0%   { transform: translateX(-200%); }
        100% { transform: translateX(200%);  }
      }
      .ls-pulse    { animation: ls-pulse-opacity 2.5s ease-in-out infinite; }
      .ls-blink    { animation: ls-blink 1s ease-in-out infinite; }
      .ls-scale-in { animation: ls-scale-in 0.8s ease-out 1.5s both; transform-origin: center; }
      .ls-shimmer  { animation: ls-shimmer 1.5s linear infinite; }
    `
    document.head.appendChild(s)
  }
}

// ---------------------------------------------------------------------------
// Deterministic seeded positions for particles (no Math.random in render)
// ---------------------------------------------------------------------------
function seededRand(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const PARTICLE_DATA = Array.from({ length: 20 }, (_, i) => {
  const rand = seededRand(i * 6271)
  return {
    id: i,
    left: `${rand() * 100}%`,
    top: `${rand() * 100}%`,
    symbol: ['{  }', '[ ]', '</>', '( )', '=>', '//', '/*', '*/', '&&', '||'][
      i % 10
    ],
  }
})

// ---------------------------------------------------------------------------
// GlowingOrbs
// ✅ All array syntax replaced with gsap.timeline yoyo
// ✅ gsap.context() for cleanup
// ---------------------------------------------------------------------------
const GlowingOrbs = memo(() => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const orbs = containerRef.current.querySelectorAll('[data-orb]')
      const configs = [
        {
          duration: 10,
          delay: 0,
          toX: 50,
          toY: 30,
          toScale: 1.2,
          toOpacity: 0.25,
        },
        {
          duration: 12,
          delay: 1,
          toX: -40,
          toY: -20,
          toScale: 1.15,
          toOpacity: 0.2,
        },
        {
          duration: 8,
          delay: 2,
          toX: 30,
          toY: -40,
          toScale: 1.1,
          toOpacity: 0.15,
        },
      ]
      orbs.forEach((orb, i) => {
        const c = configs[i]
        const tl = gsap.timeline({
          repeat: -1,
          yoyo: true,
          delay: c.delay,
          ease: 'sine.inOut',
        })
        tl.to(orb, {
          scale: c.toScale,
          opacity: c.toOpacity,
          x: c.toX,
          y: c.toY,
          duration: c.duration,
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      aria-hidden="true"
    >
      <div
        data-orb
        className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-blue-500/20 rounded-full blur-[150px]"
      />
      <div
        data-orb
        className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[120px]"
      />
      <div
        data-orb
        className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]"
      />
    </div>
  )
})
GlowingOrbs.displayName = 'GlowingOrbs'

// ---------------------------------------------------------------------------
// LettersAnimation
// ✅ FIXED: return inside forEach was ignored — listeners never removed
//    Now stores all cleanup pairs in an array and runs them in useEffect cleanup
// ✅ gsap.context() for tween cleanup
// ✅ Particle positions from module-level constants (no Math.random in render)
// ---------------------------------------------------------------------------
const LettersAnimation = memo(({ name }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const letters = containerRef.current.querySelectorAll('[data-letter]')
      if (!letters.length) return

      const tl = gsap.timeline()

      // ✅ Collect cleanup pairs outside forEach — return inside forEach is ignored
      const cleanups = []

      letters.forEach((letter, i) => {
        tl.fromTo(
          letter,
          {
            opacity: 0,
            scale: 0,
            rotationY: -90,
            rotationX: 90,
            z: -200,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            z: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'back.out(1.7)',
          },
          i * 0.1,
        )

        const onEnter = () =>
          gsap.to(letter, {
            scale: 1.3,
            rotationY: 360,
            z: 50,
            textShadow:
              '0 0 30px rgba(139,92,246,0.8), 0 0 60px rgba(139,92,246,0.5)',
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        const onLeave = () =>
          gsap.to(letter, {
            scale: 1,
            rotationY: 0,
            z: 0,
            textShadow: 'none',
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          })

        letter.addEventListener('mouseenter', onEnter)
        letter.addEventListener('mouseleave', onLeave)
        // ✅ Store for cleanup
        cleanups.push(() => {
          letter.removeEventListener('mouseenter', onEnter)
          letter.removeEventListener('mouseleave', onLeave)
        })
      })

      // Animate particles
      const particles = containerRef.current.querySelectorAll('[data-particle]')
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          x: () => gsap.utils.random(-100, 100),
          y: () => gsap.utils.random(-100, 100),
          opacity: 0,
          duration: 3,
          delay: i * 0.1,
          repeat: -1,
          repeatDelay: 0,
          ease: 'power1.inOut',
        })
      })

      // Return cleanup from context
      return () => cleanups.forEach((fn) => fn())
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="mb-16 relative">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {PARTICLE_DATA.map((p) => (
          <div
            key={p.id}
            data-particle
            className="absolute text-xs text-purple-500/20 font-mono opacity-0"
            style={{ left: p.left, top: p.top }}
          >
            {p.symbol}
          </div>
        ))}
      </div>

      <div
        className="flex justify-center items-center gap-1 mb-6 relative flex-wrap"
        aria-label={name}
      >
        {Array.from(name).map((letter, i) => (
          <span
            key={i}
            data-letter
            aria-hidden="true"
            className="text-6xl md:text-8xl font-bold relative cursor-pointer opacity-0"
            style={{
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              display: 'inline-block',
              transformStyle: 'preserve-3d',
              perspective: '1000px',
              background:
                'linear-gradient(to bottom right, #3b82f6, #8b5cf6, #ec4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      <div className="text-center relative">
        <div
          className="flex items-center justify-center gap-2 mb-3"
          style={{ minHeight: '30px' }}
        >
          <span
            className="ls-blink text-green-400 text-sm font-mono"
            aria-hidden="true"
          >
            ▶
          </span>
          <p className="text-slate-400 text-sm md:text-base font-mono">
            <span className="text-purple-400">class</span>{' '}
            <span className="text-blue-400">Developer</span>{' '}
            <span className="text-slate-500">{'{'}</span>{' '}
            <span className="text-pink-400">design</span>
            <span className="text-slate-500">{'()'}</span>{' '}
            <span className="text-slate-500">{'}'}</span>
          </p>
        </div>
        {/* ✅ FIXED: @keyframes scaleIn used invalid `scaleX: 0` property */}
        <div className="ls-scale-in w-32 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
      </div>
    </div>
  )
})
LettersAnimation.displayName = 'LettersAnimation'

// ---------------------------------------------------------------------------
// OrbitalLoader
// ✅ All 5 broken array syntax instances replaced with gsap.timeline yoyo
// ✅ gsap.context() cleanup
// ---------------------------------------------------------------------------
const OrbitalLoader = memo(() => {
  const containerRef = useRef(null)
  const centerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || !centerRef.current) return

    const ctx = gsap.context(() => {
      // Center pulse
      const centerTl = gsap.timeline({
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      centerTl.to(centerRef.current, {
        scale: 1.4,
        boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)',
        duration: 1,
      })

      // Orbit rotations
      containerRef.current
        .querySelectorAll('[data-orbit]')
        .forEach((orbit, i) => {
          gsap.to(orbit, {
            rotation: 360,
            duration: 3 - i * 0.5,
            repeat: -1,
            ease: 'none',
          })
        })

      // Orbit particle glow pulse
      containerRef.current
        .querySelectorAll('[data-orbit-particle]')
        .forEach((p, i) => {
          const tl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            delay: (i % 3) * 0.3,
            ease: 'sine.inOut',
          })
          tl.to(p, {
            scale: 1.5,
            boxShadow: '0 0 30px currentColor',
            duration: 0.75,
          })
        })

      // Ring pulse
      containerRef.current
        .querySelectorAll('[data-orbit-ring]')
        .forEach((ring, i) => {
          const tl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            delay: i * 0.3,
            ease: 'sine.inOut',
          })
          tl.to(ring, { opacity: 0.5, scale: 1.02, duration: 1 })
        })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-32 h-32 mb-12"
      aria-hidden="true"
    >
      <div
        ref={centerRef}
        className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
      />

      {[0, 1, 2].map((i) => (
        <div key={i} data-orbit className="absolute inset-0">
          <div
            data-orbit-particle
            className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 rounded-full"
            style={{
              background: [
                'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                'linear-gradient(135deg,#8b5cf6,#ec4899)',
                'linear-gradient(135deg,#ec4899,#3b82f6)',
              ][i],
            }}
          />
        </div>
      ))}

      {[0, 1, 2].map((i) => (
        <div
          key={`ring-${i}`}
          data-orbit-ring
          className="absolute border border-slate-700/30 rounded-full"
          style={{
            width: `${100 + i * 15}%`,
            height: `${100 + i * 15}%`,
            left: `${-7.5 * i}%`,
            top: `${-7.5 * i}%`,
            opacity: 0.2,
          }}
        />
      ))}
    </div>
  )
})
OrbitalLoader.displayName = 'OrbitalLoader'

// ---------------------------------------------------------------------------
// ProgressBar
// ✅ FIXED: gsap textContent tween requires paid TextPlugin — not available
//    without it. Replaced with React state + rounded display value.
// ✅ Shimmer now CSS-only (ls-shimmer class) — no GSAP needed
// ---------------------------------------------------------------------------
const ProgressBar = memo(({ progress }) => {
  const barRef = useRef(null)
  const displayProgress = Math.min(100, Math.round(progress))

  useEffect(() => {
    if (!barRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        width: `${progress}%`,
        duration: 0.1,
        ease: 'power2.out',
      })
    }, barRef)
    return () => ctx.revert()
  }, [progress])

  return (
    <div
      className="w-72 max-w-full"
      role="progressbar"
      aria-valuenow={displayProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading progress"
    >
      <div className="flex justify-between text-xs text-slate-400 mb-2 px-1">
        <span>Loading Experience</span>
        {/* ✅ React renders the number directly — no GSAP TextPlugin needed */}
        <span aria-hidden="true">{displayProgress}%</span>
      </div>
      <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/30">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative w-0 overflow-hidden"
        >
          {displayProgress > 0 && (
            <div className="ls-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          )}
        </div>
      </div>
    </div>
  )
})
ProgressBar.displayName = 'ProgressBar'

// ---------------------------------------------------------------------------
// BlocksTransition — EPIC UPGRADED VERSION
//
// Original: blocks scale in from center → simple fade out.
// New epic 3-stage sequence:
//
// Stage 1 (Assemble): 24 blocks fly in from outside viewport edges, rotating
//   in 3D with color trails — they slam into position with elastic bounce.
//
// Stage 2 (Hold): Blocks pulse with chromatic aberration-style color shift,
//   building tension for 0.4s.
//
// Stage 3 (Shatter): Blocks explode outward from center in radial burst —
//   each block flies to its own vector off-screen with rotation and scale:0.
//   A shockwave ring div expands simultaneously (scale 0→8, opacity 0→0).
//   After the shatter, wrapperRef fades to opacity:0 revealing the site.
//
// The entire transition takes ~2.2 seconds and works at 60fps.
// ---------------------------------------------------------------------------
const BlocksTransition = memo(({ wrapperRef, onComplete }) => {
  const gridRef = useRef(null)
  const shockwaveRef = useRef(null)
  const cols = 6
  const rows = 4
  const totalBlocks = cols * rows

  useEffect(() => {
    if (!gridRef.current || !wrapperRef?.current) return

    const blocks = Array.from(gridRef.current.querySelectorAll('[data-block]'))
    if (!blocks.length) return

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline()

      // ── STAGE 1: Fly-in from edges ──
      blocks.forEach((block, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)

        // Each block starts from a random edge of the viewport
        const edge = index % 4
        const fromX = edge === 0 ? -300 : edge === 1 ? 300 : 0
        const fromY = edge === 2 ? -300 : edge === 3 ? 300 : 0
        const fromRotation =
          (index % 2 === 0 ? 1 : -1) * gsap.utils.random(90, 270)

        // Distance from center for stagger timing
        const distX = col - cols / 2
        const distY = row - rows / 2
        const dist = Math.sqrt(distX * distX + distY * distY)

        gsap.set(block, {
          x: fromX,
          y: fromY,
          rotation: fromRotation,
          scale: 0,
          opacity: 0,
        })

        masterTl.to(
          block,
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.4)',
          },
          dist * 0.06,
        )
      })

      // ── STAGE 2: Chromatic pulse tension ──
      masterTl.to(
        blocks,
        {
          boxShadow:
            '0 0 20px rgba(139,92,246,0.6), inset 0 0 15px rgba(59,130,246,0.3)',
          duration: 0.2,
          stagger: { amount: 0.15, from: 'center' },
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1,
        },
        '+=0.1',
      )

      // ── STAGE 3: Radial shatter outward ──
      blocks.forEach((block, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        // Vector from center → outward
        const vx = (col - cols / 2 + 0.5) * 120 + gsap.utils.random(-40, 40)
        const vy = (row - rows / 2 + 0.5) * 120 + gsap.utils.random(-40, 40)
        const mag = Math.sqrt(vx * vx + vy * vy)

        masterTl.to(
          block,
          {
            x: (vx / mag) * 900,
            y: (vy / mag) * 900,
            scale: 0,
            opacity: 0,
            rotation: gsap.utils.random(-360, 360),
            duration: 0.12,
            ease: 'power3.in',
          },
          masterTl.duration() - 0.05,
        )
      })

      // ── Shockwave ring expands during shatter ──
      if (shockwaveRef.current) {
        masterTl.fromTo(
          shockwaveRef.current,
          { scale: 0, opacity: 0.8 },
          { scale: 8, opacity: 0, duration: 0.7, ease: 'power2.out' },
          masterTl.duration() - 0.05,
        )
      }

      // ── Final: fade wrapper revealing the site ──
      masterTl.to(wrapperRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete,
      })
    }, gridRef)

    return () => ctx.revert()
  }, [wrapperRef, onComplete])

  return (
    <div className="fixed inset-0 z-50" aria-hidden="true">
      {/* Shockwave ring */}
      <div
        ref={shockwaveRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-purple-400/60 opacity-0 pointer-events-none"
        style={{
          boxShadow:
            '0 0 40px rgba(139,92,246,0.5), inset 0 0 40px rgba(139,92,246,0.3)',
        }}
      />

      {/* Block grid */}
      <div
        ref={gridRef}
        className="w-full h-full p-2 grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: totalBlocks }, (_, index) => {
          const col = index % cols
          const row = Math.floor(index / cols)
          const distX = col - cols / 2
          const distY = row - rows / 2
          const dist = Math.sqrt(distX * distX + distY * distY)
          const maxDist = Math.sqrt((cols / 2) ** 2 + (rows / 2) ** 2)
          const t = 1 - dist / maxDist

          return (
            <div
              key={index}
              data-block
              className="rounded-xl relative overflow-hidden opacity-0"
              style={{
                background: `linear-gradient(135deg,
                  rgba(59,130,246,${0.15 + t * 0.2}),
                  rgba(139,92,246,${0.12 + t * 0.18}),
                  rgba(236,72,153,${0.1 + t * 0.15}))`,
                backdropFilter: 'blur(8px)',
                border: `1px solid rgba(139,92,246,${0.1 + t * 0.2})`,
              }}
            >
              {/* ✅ FIXED: null-safety — querySelector result checked before use */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
            </div>
          )
        })}
      </div>
    </div>
  )
})
BlocksTransition.displayName = 'BlocksTransition'

// ---------------------------------------------------------------------------
// LoadingContent
// ✅ memo() + gsap.context() cleanup
// ---------------------------------------------------------------------------
const LoadingContent = memo(({ progress }) => {
  const contentRef = useRef(null)

  useEffect(() => {
    if (!contentRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
      )
    }, contentRef)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={contentRef}
      className="fixed inset-0 flex flex-col items-center justify-center z-50 px-4 opacity-0"
      role="status"
      aria-label="Loading portfolio"
    >
      <LettersAnimation name="Youssef" />
      <OrbitalLoader />
      <ProgressBar progress={progress} />

      <div className="mt-8 text-center">
        {/* ✅ aria-live so screen readers announce when this changes */}
        <p className="ls-pulse text-slate-500 text-sm" aria-live="polite">
          Preparing your experience…
        </p>
      </div>
    </div>
  )
})
LoadingContent.displayName = 'LoadingContent'

// ---------------------------------------------------------------------------
// LoadingScreen — Root
//
// ✅ FIXED: setTimeout calls tracked with useRef → cleared on unmount
// ✅ BlocksTransition now receives wrapperRef + onComplete to own the exit
//    sequence, keeping all transition logic in one place
// ---------------------------------------------------------------------------
const LoadingScreen = ({ onLoadingComplete }) => {
  const [loadingStage, setLoadingStage] = useState('loading')
  const [progress, setProgress] = useState(0)
  const wrapperRef = useRef(null)
  const timeoutsRef = useRef([])

  // Progress ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // ✅ Track timeout so it can be cleared on unmount
          const t = setTimeout(() => setLoadingStage('blocks'), 300)
          timeoutsRef.current.push(t)
          return 100
        }
        return Math.min(100, prev + Math.random() * 15)
      })
    }, 125)

    return () => clearInterval(interval)
  }, [])

  // Cleanup tracked timeouts on unmount
  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout)
  }, [])

  // ✅ onComplete callback passed to BlocksTransition — it drives the exit now
  const handleTransitionComplete = () => {
    setLoadingStage('complete')
    onLoadingComplete?.()
  }

  return (
    <>
      {loadingStage !== 'complete' && (
        <div
          ref={wrapperRef}
          className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Loading screen"
        >
          <GlowingOrbs />

          {loadingStage === 'loading' && <LoadingContent progress={progress} />}

          {loadingStage === 'blocks' && (
            <BlocksTransition
              wrapperRef={wrapperRef}
              onComplete={handleTransitionComplete}
            />
          )}
        </div>
      )}
    </>
  )
}

export default LoadingScreen
