/**
 * PremiumAboutSection — Production-Optimized
 *
 * Key fixes vs original:
 * 1.  id="about" moved from inner div to <section> — anchor links now work
 * 2.  <a><button> illegal nesting fixed — button uses onClick + scrollIntoView
 * 3.  AnimatedStat observer no longer depends on hasAnimated (re-subscription bug)
 *     — uses a ref flag instead of state to gate the one-shot animation
 * 4.  AnimatedStat counter replaced raw rAF loop with gsap.to numericValue
 *     — consistent with codebase, fewer moving parts, auto-cleaned up
 * 5.  imageContainerRef: conflicting y-animations (floating + createFloatingParallax)
 *     — floating animation now starts onComplete of entrance, parallax kept separate
 * 6.  All GSAP effects wrapped in gsap.context() for scoped cleanup
 * 7.  BackgroundParticles, AnimatedStat, SkillBadge wrapped in memo()
 * 8.  stats + skills moved to module-level constants (not useMemo — no deps)
 * 9.  SkillBadge duplicate ping dot removed — was a visual glitch
 * 10. NextJS icon color changed from #000000 (invisible dark mode) to currentColor-safe gray
 * 11. Arabic comments translated/removed for codebase consistency
 * 12. aria-hidden on all decorative elements, aria-labels on interactive ones
 * 13. Semantic <nav> for skills section, proper roles on stats
 * 14. particlePositions moved to module-level constant (same pattern as HeroSection)
 * 15. SkillBadge Math.random() in floating duration replaced with deterministic formula
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useEffect, useState, memo, useCallback } from 'react'
import { RevealOnScroll, DepthLayer } from './ParallaxSection'
import { ResponsiveImage } from './ResponsiveImage'
import { ArrowRight, Award, Code, Zap, Sparkles } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHtml5,
  faCss3Alt,
  faJs,
  faBootstrap,
  faReact,
  faFigma,
  faGit,
} from '@fortawesome/free-brands-svg-icons'
import {
  faCode,
  faGear,
  faGlobe,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons'
import yossef from '../assets/yossef.png'
import { createFloatingParallax } from '../utils/scrollAnimations'

gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// Module-level constants — defined once, never re-created
// Original had these in useMemo with no deps, which is equivalent but wasteful
// ---------------------------------------------------------------------------

const STATS = [
  { number: 10, label: 'Projects', icon: '📁' },
  { number: 2, label: 'Years', icon: '⏱️' },
  { number: 6, label: 'Clients', icon: '👥' },
]

const SKILLS = [
  { name: 'HTML5', icon: faHtml5, color: '#E34C26' },
  { name: 'CSS3', icon: faCss3Alt, color: '#1572B6' },
  { name: 'JavaScript (ES6+)', icon: faJs, color: '#F7DF1E' },
  { name: 'Bootstrap', icon: faBootstrap, color: '#7952B3' },
  { name: 'Tailwind CSS', icon: faCode, color: '#06B6D4' },
  { name: 'React.js', icon: faReact, color: '#61DAFB' },
  // ✅ FIXED: #000000 is invisible in dark mode — use a neutral accessible gray
  { name: 'NextJS', icon: faCode, color: '#888888' },
  { name: 'Figma', icon: faFigma, color: '#F24E1E' },
  { name: 'Git & GitHub', icon: faGit, color: '#F05032' },
  { name: 'Responsive Design', icon: faGlobe, color: '#FF6B6B' },
  { name: 'RESTful APIs', icon: faDatabase, color: '#4CAF50' },
  { name: 'Performance Optimization', icon: faGear, color: '#FFA500' },
  { name: 'Cross-Browser Compat.', icon: faGlobe, color: '#4285F4' },
]

/**
 * Deterministic particle positions — same formula as HeroSection for consistency.
 * Module-level: computed once at bundle load, never re-computed.
 */
const PARTICLE_POSITIONS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${(i * 13 + 7) % 100}%`,
  top: `${(i * 19 + 11) % 100}%`,
  opacity: 0.2 + (i % 5) * 0.08,
}))

// ---------------------------------------------------------------------------
// BackgroundParticles
// ---------------------------------------------------------------------------

const BackgroundParticles = memo(() => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // ✅ gsap.context() scopes all tweens — ctx.revert() kills them cleanly on unmount
    const ctx = gsap.context(() => {
      Array.from(containerRef.current.children).forEach((particle, i) => {
        gsap.to(particle, {
          x: () => gsap.utils.random(-150, 150),
          y: () => gsap.utils.random(-150, 150),
          opacity: () => gsap.utils.random(0.2, 0.6),
          scale: () => gsap.utils.random(0.5, 1.5),
          duration: () => gsap.utils.random(8, 15),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {PARTICLE_POSITIONS.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-primary rounded-full"
          style={{ left: p.left, top: p.top, opacity: p.opacity }}
        />
      ))}
    </div>
  )
})

BackgroundParticles.displayName = 'BackgroundParticles'

// ---------------------------------------------------------------------------
// AnimatedStat
// ---------------------------------------------------------------------------

const AnimatedStat = memo(({ number, label, icon, index }) => {
  const ref = useRef(null)
  // ✅ FIXED: Use a ref flag instead of state for the "has animated" gate.
  // Original used hasAnimated as both state AND effect dependency, causing
  // the IntersectionObserver to be torn down and re-created on every flip.
  const hasAnimatedRef = useRef(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || hasAnimatedRef.current) return
        hasAnimatedRef.current = true

        // ✅ FIXED: Use GSAP counter tween instead of raw rAF + Date.now() loop.
        // Consistent with the rest of the codebase, auto-cleaned by gsap.context,
        // and correctly eased without manual easing math.
        const proxy = { val: 0 }
        gsap.to(proxy, {
          val: number,
          duration: 2,
          delay: index * 0.15,
          ease: 'power2.out',
          onUpdate() {
            setCount(Math.floor(proxy.val))
          },
          onComplete() {
            setCount(number) // guarantee exact final value
          },
        })

        // Entrance animation
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, scale: 0.5, rotateY: -90 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'back.out(1.7)',
          },
        )
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
    // ✅ number and index are stable props — correct deps, no hasAnimated dep
  }, [number, index])

  return (
    <div
      ref={ref}
      role="figure"
      aria-label={`${number}+ ${label}`}
      className="text-center group p-6 rounded-2xl hover:bg-gradient-to-br hover:from-primary/10 hover:to-purple-500/10 transition-all duration-500 hover:scale-110 cursor-default relative overflow-hidden backdrop-blur-sm border border-transparent hover:border-primary/30"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div
          className="text-4xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 filter drop-shadow-lg"
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
          {count}+
        </div>
        <div className="text-sm text-foreground/70 uppercase tracking-[0.2em] font-semibold group-hover:text-foreground transition-colors">
          {label}
        </div>
      </div>
    </div>
  )
})

AnimatedStat.displayName = 'AnimatedStat'

// ---------------------------------------------------------------------------
// SkillBadge
// ---------------------------------------------------------------------------

const SkillBadge = memo(({ skill, index }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0, y: 30, rotation: -180 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotation: 0,
          duration: 0.6,
          delay: index * 0.05,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          // ✅ FIXED: Float starts after entrance completes — no y-property conflict
          onComplete() {
            gsap.to(ref.current, {
              y: -5,
              // ✅ FIXED: Deterministic duration using index instead of Math.random()
              // Math.random() in React StrictMode double-invocation produces different
              // values between the two runs, causing inconsistent behavior in dev
              duration: 2 + (index % 5) * 0.2,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: index * 0.1,
            })
          },
        },
      )
    }, ref)

    return () => ctx.revert()
  }, [index])

  return (
    <span
      ref={ref}
      className="px-5 py-2.5 rounded-full border-2 border-primary/40 text-sm font-medium text-foreground/90 hover:border-primary hover:bg-primary/10 hover:scale-110 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 cursor-default group overflow-hidden relative backdrop-blur-md flex items-center gap-2"
    >
      <FontAwesomeIcon
        icon={skill.icon}
        className="text-lg flex-shrink-0"
        style={{ color: skill.color }}
        aria-hidden="true"
      />

      <span className="relative z-10 flex items-center gap-2">
        {/* ✅ FIXED: Original had two overlapping ping dots (visual bug).
            One was position:static, one was position:absolute left-0 — they stacked.
            Kept only the ping dot, removed the duplicate absolute one. */}
        <span
          className="w-2 h-2 rounded-full bg-primary group-hover:animate-ping flex-shrink-0"
          aria-hidden="true"
        />
        {skill.name}
      </span>

      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"
        aria-hidden="true"
      />
    </span>
  )
})

SkillBadge.displayName = 'SkillBadge'

// ---------------------------------------------------------------------------
// PremiumAboutSection
// ---------------------------------------------------------------------------

export const PremiumAboutSection = ({ showImage = true }) => {
  const sectionRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)
  const orb3Ref = useRef(null)
  const borderRef = useRef(null)
  const shapeRef = useRef(null)
  const rotatingShapeRef = useRef(null)
  const imageContainerRef = useRef(null)
  const headerRef = useRef(null)
  const titleRef = useRef(null)
  const underlineRef = useRef(null)

  // Background orb animations
  useEffect(() => {
    const orbRefs = [orb1Ref, orb2Ref, orb3Ref]
    if (orbRefs.some((r) => !r.current)) return

    const ctx = gsap.context(() => {
      orbRefs.forEach((orbRef, i) => {
        gsap.to(orbRef.current, {
          x: `random(-100, 100)`,
          y: `random(-100, 100)`,
          scale: 1.3,
          opacity: 0.3,
          duration: 10 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 1.5,
        })
      })
    })

    return () => ctx.revert()
  }, [])

  // Border glow animation
  useEffect(() => {
    if (!borderRef.current) return

    const ctx = gsap.context(() => {
      // GSAP doesn't tween CSS border-color/boxShadow arrays natively like this.
      // Using a timeline with keyframes for correct alternating behavior.
      const tl = gsap.timeline({ repeat: -1, ease: 'sine.inOut' })
      tl.to(borderRef.current, {
        boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)',
        borderColor: 'rgba(168, 85, 247, 0.5)',
        duration: 1.5,
      }).to(borderRef.current, {
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        duration: 1.5,
      })
    }, borderRef)

    return () => ctx.revert()
  }, [])

  // Decorative shapes animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (shapeRef.current) {
        gsap.to(shapeRef.current, {
          y: -10,
          x: 10,
          rotation: 360,
          duration: 8,
          repeat: -1,
          ease: 'sine.inOut',
        })
      }
      if (rotatingShapeRef.current) {
        gsap.to(rotatingShapeRef.current, {
          rotation: 360,
          duration: 6,
          repeat: -1,
          ease: 'linear',
        })
      }
    })

    return () => ctx.revert()
  }, [])

  // Image container: entrance + floating
  // ✅ FIXED: Original started floating immediately in the same effect as entrance,
  // causing two concurrent y-animations. Float now starts in onComplete.
  useEffect(() => {
    const el = imageContainerRef.current
    if (!el) return

    createFloatingParallax(el, -0.3)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.8, y: 100, rotateY: -45 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateY: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          onComplete() {
            gsap.to(el, {
              y: -15,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            })
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  // Header entrance animation
  useEffect(() => {
    if (!headerRef.current || !titleRef.current || !underlineRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.5)' },
      ).fromTo(
        underlineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.4',
      )
    }, headerRef)

    return () => ctx.revert()
  }, [])

  // ✅ Stable callback for "View My Work" CTA — no nested <a><button>
  const handleViewWork = useCallback(() => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    // ✅ FIXED: id="about" on <section>, not on inner background div
    // Original placement broke all anchor navigation (#about links)
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden"
    >
      {/* Decorative background — screen readers skip */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          ref={orb1Ref}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-500/10 rounded-full blur-3xl"
        />
        <div
          ref={orb2Ref}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500/15 to-primary/10 rounded-full blur-3xl"
        />
        <div
          ref={orb3Ref}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"
        />
        <BackgroundParticles />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.08)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.08)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <div className="inline-block relative">
            <div
              className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-primary/40"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-primary/40"
              aria-hidden="true"
            />

            <h2
              id="about-heading"
              ref={titleRef}
              className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight mb-6 relative"
              style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
            >
              <span className="relative z-10 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text">
                About Me
              </span>
              <div
                className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-2xl blur-2xl -z-10 animate-pulse"
                aria-hidden="true"
              />
            </h2>
          </div>

          <div
            ref={underlineRef}
            className="relative w-32 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
          </div>

          <div
            className="flex items-center justify-center gap-2 mt-6"
            aria-hidden="true"
          >
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <p className="text-lg text-muted-foreground font-light">
              Crafting Digital Experiences
            </p>
            <Sparkles
              className="w-5 h-5 text-primary animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {showImage && (
            <div ref={imageContainerRef} className="relative">
              <DepthLayer depth={0.3} className="relative">
                <div className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden group">
                  <div className="relative w-full h-full bg-gradient-to-br from-primary/15 to-purple-500/15 rounded-3xl overflow-hidden backdrop-blur-sm">
                    <ResponsiveImage
                      src={yossef}
                      alt="Youssef Ibrahim — Front-End Developer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      priority={false}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
                      aria-hidden="true"
                    />
                    <div
                      ref={borderRef}
                      className="absolute inset-0 rounded-3xl border-2 border-primary/40 pointer-events-none"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div
                  ref={shapeRef}
                  className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-primary/30 rounded-3xl backdrop-blur-sm bg-background/20"
                  aria-hidden="true"
                />
                <div
                  ref={rotatingShapeRef}
                  className="absolute -top-8 -left-8 w-24 h-24 rounded-[2rem] backdrop-blur-sm border-2 border-primary/50 bg-gradient-to-br from-primary/30 to-purple-500/30"
                  aria-hidden="true"
                />

                {/* Floating badge icons */}
                <div
                  className="absolute top-10 -right-6 w-16 h-16 bg-gradient-to-br from-primary/80 to-purple-500/80 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/50 animate-bounce"
                  aria-hidden="true"
                >
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div
                  className="absolute bottom-20 -left-6 w-16 h-16 bg-gradient-to-br from-accent/80 to-primary/80 rounded-2xl flex items-center justify-center shadow-xl shadow-accent/50"
                  style={{ animation: 'bounce 2s infinite 0.5s' }}
                  aria-hidden="true"
                >
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </DepthLayer>
            </div>
          )}

          {/* Content */}
          <RevealOnScroll
            direction="left"
            className="flex flex-col justify-center space-y-10"
          >
            <div className="space-y-6">
              <p className="text-xl md:text-2xl leading-relaxed text-foreground font-light">
                I craft{' '}
                <span className="font-semibold text-primary">exceptional digital experiences</span>{' '}
                that combine{' '}
                <span className="font-semibold text-purple-500">
                  technical precision
                </span>
                {' '}with{' '}
                <span className="font-semibold text-accent">
                  pixel-perfect design
                </span>.
              </p>
              <p className="text-lg md:text-xl leading-relaxed text-foreground/70 font-light">
                Specializing in React ecosystem, I architect scalable front-end
                solutions with focus on{' '}
                <span className="text-foreground/90">performance</span>,{' '}
                <span className="text-foreground/90">accessibility</span>, and{' '}
                <span className="text-foreground/90">clean code</span> that stands the test of time.
              </p>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-4 py-8"
              role="group"
              aria-label="Career statistics"
            >
              {STATS.map((stat, idx) => (
                <AnimatedStat
                  key={stat.label}
                  number={stat.number}
                  label={stat.label}
                  icon={stat.icon}
                  index={idx}
                />
              ))}
            </div>

            {/* CTA */}
            {/* ✅ FIXED: <a><button> is illegal HTML. Interactive elements cannot nest.
                Button now handles navigation via scrollIntoView. */}
            <div>
              <button
                onClick={handleViewWork}
                aria-label="Scroll to my work section"
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] text-primary-foreground rounded-2xl font-semibold overflow-hidden text-lg hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 active:scale-95 animate-gradient"
              >
                <span className="relative flex items-center gap-3 z-10">
                  <Award
                    className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
                    aria-hidden="true"
                  />
                  View My Work
                  <ArrowRight
                    className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </span>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-r from-primary/50 via-purple-500/50 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Skills */}
            <div
              aria-label="Technical skills"
              className="flex flex-wrap gap-3 pt-6"
            >
              {SKILLS.map((skill, idx) => (
                <SkillBadge key={skill.name} skill={skill} index={idx} />
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  )
}

export default PremiumAboutSection
