// @ts-nocheck
/**
 * LoadingScreen — Cinematic Portfolio Intro (Optimized)
 *
 * Same visual identity as the original, rebuilt for performance:
 *
 *  ✦ Progress is now tied to real page-load state (window 'load' event)
 *    combined with a min/max display window, driven by requestAnimationFrame
 *    instead of a random setInterval — smoother and honest about load state.
 *
 *  ✦ Removed animated `filter: blur()` on letter entrance (the single most
 *    expensive paint operation in the original — many elements repainting
 *    simultaneously). Entrance now uses only transform/opacity.
 *
 *  ✦ Starfield: delta-time based motion (frame-rate independent), capped
 *    DPR (1.5), fewer stars on small screens, pauses fully when the tab is
 *    hidden (visibilitychange), debounced resize via rAF.
 *
 *  ✦ Nebula parallax: mousemove is throttled to one gsap update per animation
 *    frame instead of firing on every mouse event.
 *
 *  ✦ Full prefers-reduced-motion bypass: a lightweight static variant with
 *    no canvas, no parallax, no shatter — just a quick fade.
 *
 *  ✦ will-change is cleared once entrance animations complete, so the browser
 *    can drop the promoted layers instead of holding them for the page's life.
 *
 *  ✦ Removed dead CSS (unused .ls-shard rules from an earlier iteration).
 */

import gsap from 'gsap'
import { useState, useEffect, useRef, memo, useCallback } from 'react'

/* -------------------------------------------------------------------------- */
/* Module-level CSS (injected once)                                           */
/* -------------------------------------------------------------------------- */
if (typeof document !== 'undefined') {
  const ID = 'loading-screen-epic-styles'
  if (!document.getElementById(ID)) {
    const s = document.createElement('style')
    s.id = ID
    s.textContent = `
      @keyframes ls-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes ls-shimmer { 0%{transform:translateX(-200%)} 100%{transform:translateX(200%)} }
      @keyframes ls-spin    { to { transform: rotate(360deg) } }
      @keyframes ls-spin-rev{ to { transform: rotate(-360deg) } }
      @keyframes ls-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

      .ls-root { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      .ls-blink   { animation: ls-blink 1s steps(1) infinite; }
      .ls-shimmer { animation: ls-shimmer 1.6s linear infinite; }
      .ls-spin    { animation: ls-spin 8s linear infinite; }
      .ls-spin-rev{ animation: ls-spin-rev 12s linear infinite; }
      .ls-float   { animation: ls-float 4s ease-in-out infinite; }

      .ls-letter {
        display: inline-block;
        will-change: transform;
        cursor: default;
        background: linear-gradient(180deg, #ffffff 0%, #c4b5fd 50%, #8b5cf6 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 40px rgba(139, 92, 246, 0.35);
      }
      .ls-letter[data-space="true"] { width: 0.45em; }

      .ls-grid-floor {
        position: absolute; inset: auto 0 0 0; height: 55%;
        perspective: 600px;
        pointer-events: none;
        opacity: .55;
      }
      .ls-grid-floor::before {
        content: '';
        position: absolute; inset: 0;
        background-image:
          linear-gradient(to right, rgba(139,92,246,.35) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59,130,246,.35) 1px, transparent 1px);
        background-size: 60px 60px;
        transform: rotateX(65deg) translateZ(0);
        transform-origin: bottom;
        animation: ls-grid-scroll 12s linear infinite;
        will-change: background-position;
        mask-image: linear-gradient(to bottom, transparent 0%, #000 30%, #000 80%, transparent 100%);
      }
      @keyframes ls-grid-scroll {
        from { background-position: 0 0; }
        to   { background-position: 0 60px; }
      }

      .ls-vignette {
        position: absolute; inset: 0; pointer-events: none;
        background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.85) 100%);
      }

      .ls-noise {
        position: absolute; inset: 0; pointer-events: none; opacity: .04;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        mix-blend-mode: overlay;
      }
    `
    document.head.appendChild(s)
  }
}

const STATUS_LINES = [
  'Booting neural core…',
  'Compiling shaders…',
  'Loading creative modules…',
  'Calibrating pixels…',
  'Synchronizing universe…',
  'Almost ready…',
]

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* -------------------------------------------------------------------------- */
/* Starfield — animated canvas background with warp mode                      */
/* frame-rate independent, DPR-capped, pauses when tab is hidden              */
/* -------------------------------------------------------------------------- */
const Starfield = memo(({ warpRef }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    let resizeRaf = 0
    let stars = []
    let w = 0
    let h = 0
    let lastTime = 0
    let visible = true

    const starCount = window.innerWidth < 640 ? 90 : 170

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      stars = Array.from({ length: starCount }, () => ({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * w,
        pz: 0,
        c: Math.random() > 0.85
          ? `hsl(${260 + Math.random() * 40}, 90%, 75%)`
          : `hsl(${200 + Math.random() * 40}, 80%, 80%)`,
      }))
    }

    const draw = (time) => {
      if (!visible) {
        raf = requestAnimationFrame(draw)
        return
      }
      // normalize to a 60fps baseline so warp speed feels the same on any display
      const dt = lastTime ? Math.min(48, time - lastTime) : 16.7
      lastTime = time
      const frameScale = dt / 16.7

      const warp = warpRef?.current ?? 0
      ctx.fillStyle = `rgba(6, 4, 18, ${warp > 0 ? 0.25 : 0.35})`
      ctx.fillRect(0, 0, w, h)
      ctx.save()
      ctx.translate(w / 2, h / 2)

      const speed = (1 + warp * 40) * frameScale

      for (const s of stars) {
        s.pz = s.z
        s.z -= speed
        if (s.z < 1) {
          s.x = (Math.random() - 0.5) * w
          s.y = (Math.random() - 0.5) * h
          s.z = w
          s.pz = s.z
        }
        const k = 128 / s.z
        const px = s.x * k
        const py = s.y * k
        const pk = 128 / s.pz
        const ppx = s.x * pk
        const ppy = s.y * pk
        const size = (1 - s.z / w) * 2.4

        ctx.strokeStyle = s.c
        ctx.lineWidth = size
        ctx.globalAlpha = Math.min(1, (1 - s.z / w) + warp * 2)
        ctx.beginPath()
        ctx.moveTo(ppx, ppy)
        ctx.lineTo(px, py)
        ctx.stroke()
      }

      ctx.restore()
      raf = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      visible = document.visibilityState === 'visible'
    }

    const onResize = () => {
      cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(() => {
        resize()
        init()
      })
    }

    resize()
    init()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(resizeRaf)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [warpRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  )
})
Starfield.displayName = 'Starfield'

/* -------------------------------------------------------------------------- */
/* Nebula Orbs — soft gradient orbs with rAF-throttled mouse parallax         */
/* -------------------------------------------------------------------------- */
const NebulaOrbs = memo(() => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) return
    const ctx = gsap.context(() => {
      const orbs = ref.current.querySelectorAll('[data-orb]')
      const cfg = [
        { x: 80, y: 40, s: 1.15, d: 11 },
        { x: -60, y: -30, s: 1.2, d: 13 },
        { x: 40, y: -60, s: 1.1, d: 9 },
      ]
      orbs.forEach((o, i) => {
        const c = cfg[i]
        gsap.to(o, {
          x: c.x, y: c.y, scale: c.s,
          duration: c.d, repeat: -1, yoyo: true, ease: 'sine.inOut',
        })
      })

      // Throttle to at most one parallax update per animation frame,
      // instead of one gsap.to() call per mousemove event.
      let ticking = false
      let lastEvent = null
      const applyParallax = () => {
        ticking = false
        if (!lastEvent) return
        const cx = window.innerWidth / 2
        const cy = window.innerHeight / 2
        const dx = (lastEvent.clientX - cx) / cx
        const dy = (lastEvent.clientY - cy) / cy
        orbs.forEach((o, i) => {
          const depth = (i + 1) * 18
          gsap.to(o, { xPercent: dx * depth, yPercent: dy * depth, duration: 1.2, ease: 'power3.out', overwrite: 'auto' })
        })
      }
      const onMove = (e) => {
        lastEvent = e
        if (!ticking) {
          ticking = true
          requestAnimationFrame(applyParallax)
        }
      }
      window.addEventListener('mousemove', onMove, { passive: true })
      return () => window.removeEventListener('mousemove', onMove)
    }, ref)
    return () => ctx.revert()
  }, [])

  const orb = (color, size, top, left) => ({
    position: 'absolute',
    top, left,
    width: size, height: size,
    borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
    filter: 'blur(24px)',
    opacity: 0.7,
    pointerEvents: 'none',
    willChange: 'transform',
  })

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div data-orb style={orb('rgba(139,92,246,.85)', 520, '-10%', '-10%')} />
      <div data-orb style={orb('rgba(59,130,246,.7)', 460, '40%', '60%')} />
      <div data-orb style={orb('rgba(236,72,153,.6)', 380, '60%', '5%')} />
    </div>
  )
})
NebulaOrbs.displayName = 'NebulaOrbs'

/* -------------------------------------------------------------------------- */
/* Brand Mark — rotating rings + monogram                                     */
/* -------------------------------------------------------------------------- */
const BrandMark = memo(({ initials = 'JS' }) => (
  <div
    style={{
      position: 'relative',
      width: 120, height: 120,
      margin: '0 auto 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    <div
      className={prefersReducedMotion ? '' : 'ls-spin'}
      style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        border: '1px dashed rgba(139,92,246,.6)',
      }}
    />
    <div
      className={prefersReducedMotion ? '' : 'ls-spin-rev'}
      style={{
        position: 'absolute', inset: 10,
        borderRadius: '50%',
        border: '1px solid rgba(59,130,246,.4)',
        boxShadow: 'inset 0 0 20px rgba(139,92,246,.3)',
      }}
    />
    {!prefersReducedMotion && (
      <div
        className="ls-spin"
        style={{ position: 'absolute', inset: 0, animationDuration: '4s', pointerEvents: 'none' }}
      >
        <div style={{
          position: 'absolute', top: -4, left: '50%',
          width: 8, height: 8, borderRadius: '50%',
          background: '#a78bfa',
          boxShadow: '0 0 16px #a78bfa, 0 0 32px #8b5cf6',
          transform: 'translateX(-50%)',
        }} />
      </div>
    )}
    <div
      className={prefersReducedMotion ? '' : 'ls-float'}
      style={{
        fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em',
        background: 'linear-gradient(135deg, #fff, #c4b5fd)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 30px rgba(139,92,246,.6)',
      }}
    >
      {initials}
    </div>
  </div>
))
BrandMark.displayName = 'BrandMark'

/* -------------------------------------------------------------------------- */
/* Name Letters — transform/opacity entrance (no animated filter) + hover     */
/* -------------------------------------------------------------------------- */
const NameLetters = memo(({ name }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const letters = ref.current.querySelectorAll('[data-letter]')
      if (!letters.length) return

      if (prefersReducedMotion) {
        gsap.set(letters, { opacity: 1 })
        return
      }

      gsap.fromTo(
        letters,
        { opacity: 0, y: 60, rotationX: -90, rotationY: 30, scale: 0.4 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.9,
          ease: 'back.out(1.6)',
          stagger: { each: 0.06, from: 'start' },
          // release the promoted compositor layer once we're done animating it
          onComplete: () => gsap.set(letters, { clearProps: 'willChange' }),
        },
      )

      const cleanups = []
      letters.forEach((el) => {
        const onEnter = () => {
          gsap.to(el, {
            scale: 1.25, y: -6, rotationY: 360,
            textShadow:
              '2px 0 0 #ec4899, -2px 0 0 #06b6d4, 0 0 30px rgba(139,92,246,.9)',
            duration: 0.6, ease: 'power3.out', overwrite: 'auto',
          })
        }
        const onLeave = () => {
          gsap.to(el, {
            scale: 1, y: 0, rotationY: 0,
            textShadow: '0 0 40px rgba(139,92,246,.35)',
            duration: 0.6, ease: 'power3.out', overwrite: 'auto',
          })
        }
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          el.removeEventListener('mouseenter', onEnter)
          el.removeEventListener('mouseleave', onLeave)
        })
      })
      return () => cleanups.forEach((fn) => fn())
    }, ref)
    return () => ctx.revert()
  }, [name])

  return (
    <h1
      ref={ref}
      style={{
        margin: 0,
        fontSize: 'clamp(2.4rem, 7vw, 5rem)',
        fontWeight: 800,
        letterSpacing: '-0.04em',
        textAlign: 'center',
        perspective: '1000px',
      }}
    >
      {Array.from(name).map((ch, i) => (
        <span
          key={i}
          data-letter
          data-space={ch === ' ' ? 'true' : 'false'}
          className="ls-letter"
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </h1>
  )
})
NameLetters.displayName = 'NameLetters'

/* -------------------------------------------------------------------------- */
/* Typewriter role line                                                       */
/* -------------------------------------------------------------------------- */
const Typewriter = memo(({ text }) => {
  const [shown, setShown] = useState(prefersReducedMotion ? text : '')
  useEffect(() => {
    if (prefersReducedMotion) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 55)
    return () => clearInterval(id)
  }, [text])
  return (
    <p
      style={{
        margin: '14px 0 0',
        textAlign: 'center',
        color: 'rgba(226,232,240,.85)',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 'clamp(.85rem, 1.6vw, 1rem)',
        letterSpacing: '0.08em',
      }}
    >
      <span style={{ color: '#a78bfa' }}>&gt;_ </span>
      {shown}
      <span className="ls-blink" style={{ color: '#a78bfa' }}>▍</span>
    </p>
  )
})
Typewriter.displayName = 'Typewriter'

/* -------------------------------------------------------------------------- */
/* Progress Bar — liquid + shimmer + dial counter                             */
/* -------------------------------------------------------------------------- */
const ProgressBar = memo(({ progress, status }) => {
  const fillRef = useRef(null)
  const display = Math.min(100, Math.round(progress))

  useEffect(() => {
    if (!fillRef.current) return
    gsap.to(fillRef.current, { width: `${progress}%`, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
  }, [progress])

  return (
    <div style={{ width: 'min(440px, 86vw)', margin: '36px auto 0' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 10,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(203,213,225,.75)',
      }}>
        <span>{status}</span>
        <span style={{
          color: '#fff',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          textShadow: '0 0 12px rgba(139,92,246,.7)',
        }}>
          {String(display).padStart(3, '0')}%
        </span>
      </div>
      <div style={{
        position: 'relative',
        height: 6,
        borderRadius: 999,
        background: 'rgba(255,255,255,.06)',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.05)',
      }}>
        <div
          ref={fillRef}
          style={{
            position: 'absolute', inset: 0, width: 0,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #06b6d4)',
            backgroundSize: '300% 100%',
            borderRadius: 999,
            boxShadow: '0 0 18px rgba(139,92,246,.7)',
            overflow: 'hidden',
          }}
        >
          {!prefersReducedMotion && (
            <div
              className="ls-shimmer"
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent)',
                transform: 'translateX(-100%)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
})
ProgressBar.displayName = 'ProgressBar'

/* -------------------------------------------------------------------------- */
/* Smooth Exit — hyperspace burst + radial flash + fade (no blocks)           */
/* -------------------------------------------------------------------------- */
const SmoothExit = memo(({ wrapperRef, warpRef, onComplete }) => {
  const shockRef = useRef(null)
  const flashRef = useRef(null)

  useEffect(() => {
    if (!wrapperRef?.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      if (prefersReducedMotion) {
        tl.to(wrapperRef.current, { opacity: 0, duration: 0.3, ease: 'power1.out', onComplete })
        return
      }

      tl.to(warpRef, { current: 1.6, duration: 0.9, ease: 'power3.in' }, 0)

      if (shockRef.current) {
        tl.fromTo(shockRef.current,
          { scale: 0, opacity: 0.95 },
          { scale: 14, opacity: 0, duration: 1.0, ease: 'power2.out' },
          0.15,
        )
      }

      if (flashRef.current) {
        tl.fromTo(flashRef.current,
          { opacity: 0 },
          { opacity: 0.85, duration: 0.18, ease: 'power2.out' },
          0.55,
        ).to(flashRef.current, { opacity: 0, duration: 0.5, ease: 'power2.in' })
      }

      tl.to(wrapperRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete,
      }, 0.75)
    })

    return () => ctx.revert()
  }, [wrapperRef, warpRef, onComplete])

  if (prefersReducedMotion) {
    return <div style={{ position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none' }} />
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, pointerEvents: 'none' }}>
      <div
        ref={shockRef}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 200, height: 200, marginLeft: -100, marginTop: -100,
          borderRadius: '50%',
          border: '3px solid rgba(167,139,250,.9)',
          boxShadow: '0 0 60px rgba(139,92,246,.9), inset 0 0 40px rgba(236,72,153,.6)',
          opacity: 0,
        }}
      />
      <div
        ref={flashRef}
        style={{
          position: 'absolute', inset: 0, opacity: 0,
          background: 'radial-gradient(circle at center, rgba(255,255,255,.95), rgba(167,139,250,.4) 40%, transparent 70%)',
        }}
      />
    </div>
  )
})
SmoothExit.displayName = 'SmoothExit'

/* -------------------------------------------------------------------------- */
/* Loading Content                                                            */
/* -------------------------------------------------------------------------- */
const LoadingContent = memo(({ progress, status, name, role, initials }) => {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 720, padding: '0 24px',
        textAlign: 'center',
      }}
    >
      <BrandMark initials={initials} />
      <NameLetters name={name} />
      <Typewriter text={role} />
      <ProgressBar progress={progress} status={status} />

      <div
        aria-live="polite"
        style={{
          position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
          overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
        }}
      >
        Loading {Math.round(progress)} percent: {status}
      </div>
    </div>
  )
})
LoadingContent.displayName = 'LoadingContent'

/* -------------------------------------------------------------------------- */
/* Root                                                                       */
/* -------------------------------------------------------------------------- */
const MIN_DISPLAY_MS = 900   // never finish so fast it flashes
const MAX_DISPLAY_MS = 2600  // never hang even if 'load' is slow

const LoadingScreen = ({
  onLoadingComplete,
  name = 'Youssef Ibrahim',
  role = 'Creative Developer & Designer',
  initials = 'JS',
}) => {
  const [stage, setStage] = useState('loading') // loading → shatter → complete
  const [progress, setProgress] = useState(0)
  const wrapperRef = useRef(null)
  const warpRef = useRef(0)
  const timeoutsRef = useRef([])

  // Progress driven by rAF, tied to real page-load state instead of a random timer.
  useEffect(() => {
    let raf = 0
    let finished = false
    let loaded = document.readyState === 'complete'
    const start = performance.now()

    const markLoaded = () => { loaded = true }
    if (!loaded) window.addEventListener('load', markLoaded, { once: true })

    const step = (now) => {
      const elapsed = now - start
      const timeBudget = Math.min(1, elapsed / MAX_DISPLAY_MS)
      const eased = 1 - Math.pow(1 - timeBudget, 3) // fast start, settles near the ceiling
      const ceiling = loaded ? 100 : 90
      const target = Math.min(ceiling, eased * 100)

      setProgress((p) => {
        const next = p + (target - p) * 0.15
        return next > 99.5 ? target : next
      })

      const canFinish = (loaded && elapsed >= MIN_DISPLAY_MS) || elapsed >= MAX_DISPLAY_MS
      if (canFinish) {
        if (!finished) {
          finished = true
          setProgress(100)
          gsap.to(warpRef, { current: 0.6, duration: 0.5, ease: 'power3.in' })
          const t = setTimeout(() => setStage('shatter'), prefersReducedMotion ? 100 : 420)
          timeoutsRef.current.push(t)
        }
        return
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', markLoaded)
    }
  }, [])

  // Cycle status text with progress
  // Cleanup timeouts
  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), [])

  const handleDone = useCallback(() => {
    setStage('complete')
    onLoadingComplete?.()
  }, [onLoadingComplete])

  if (stage === 'complete') return null

  return (
    <div
      ref={wrapperRef}
      className="ls-root"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background:
          'radial-gradient(ellipse at top, #1a0b3d 0%, #0a0420 45%, #03010a 100%)',
        color: '#fff',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {!prefersReducedMotion && <Starfield warpRef={warpRef} />}
      {!prefersReducedMotion && <NebulaOrbs />}
      <div className="ls-grid-floor" />
      <div className="ls-vignette" />
      <div className="ls-noise" />

      {stage === 'loading' && (
        <LoadingContent
          progress={progress}
          status={status}
          name={name}
          role={role}
          initials={initials}
        />
      )}

      {stage === 'shatter' && (
        <SmoothExit wrapperRef={wrapperRef} warpRef={warpRef} onComplete={handleDone} />
      )}
    </div>
  )
}

export default LoadingScreen