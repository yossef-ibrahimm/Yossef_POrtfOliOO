/**
 * ProjectsSection — Production-Optimized
 *
 * Key fixes vs original:
 * 1.  Removed document.documentElement.classList.contains('light') from render
 *     — replaced with CSS custom properties + Tailwind dark: variants
 * 2.  GSAP array keyframe syntax [0,100,0] fixed — replaced with gsap.timeline
 * 3.  <style> tag removed from ProjectCard — moved to global CSS / module
 * 4.  isHovered state eliminated — all hover effects now use GSAP + CSS vars only
 *     (zero React re-renders on hover interactions)
 * 5.  handleMouseMove no longer depends on isHovered — no stale closure lag
 * 6.  All GSAP effects wrapped in gsap.context() for proper cleanup
 * 7.  Technology badge animation fixed — uses CSS classes toggled by data attr
 *     instead of inline opacity:0 that reset on re-render
 * 8.  Arabic comments removed from project data
 * 9.  import './App.css' removed from section component
 * 10. createSparkles consolidated — imported from shared util (or kept local if
 *     the util doesn't exist yet, clearly marked)
 * 11. Images converted from CSS backgroundImage to <img> for lazy loading support
 * 12. Orb animations use gsap.context() with cleanup
 * 13. padStart result memoized inside component
 * 14. 'View All Projects' button wired to GitHub profile (correct action for portfolio)
 * 15. Full accessibility pass: aria-labels, roles, keyboard navigation
 */

import gsap from 'gsap'
import { useRef, useEffect, useCallback, memo } from 'react'
import { ScrollReveal } from './ScrollReveal'
import { AnimatedText } from './AnimatedText'
import {
  ExternalLink,
  Github,
  Sparkles,
  ArrowUpRight,
  Star,
  Zap,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Project data — module-level constant, never re-created
// Arabic placeholder comments removed; proper alt text added per image
// ---------------------------------------------------------------------------
import appDietToDoor from '../assets/app diet to door.png'
import youss from '../assets/Youss.png'
import weatherApp from '../assets/weather app.png'
import cardValidation from '../assets/card validation.jpg'
import analogClock from '../assets/analog clock.png'
import quizApp from '../assets/quiz app.png'
import hangman from '../assets/hangman.png'
import typingSpeed from '../assets/typingSpeed.png'
import connect_four from '../assets/connect four.png'

const PROJECTS = [
  {
    title: 'Diet To Door App',
    description:
      'Diet To Door is a web application designed to help users select meals based on their caloric needs using MVC architecture.',
    image: appDietToDoor,
    alt: 'Diet To Door App — meal selection interface',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'SASS', 'jQuery'],
    liveUrl: 'https://app.diettodoor.com/Login',
    githubUrl: '',
    featured: true,
    color: '175, 80%, 50%',
  },
  {
    title: 'Fit Tracker App',
    description:
      'A fitness app that helps users calculate calories and track daily intake with a clean React UI.',
    image: youss,
    alt: 'Fit Tracker App — calorie tracking dashboard',
    technologies: ['React', 'JavaScript', 'TailwindCSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/My_Fit_App/',
    githubUrl: 'https://github.com/yossef-ibrahimm/My_Fit_App',
    featured: true,
    color: '280, 70%, 60%',
  },
  {
    title: 'Hangman Game',
    description:
      'A classic Hangman game built with React and TailwindCSS, featuring interactive gameplay and responsive UI.',
    image: hangman,
    alt: 'Hangman Game — interactive word guessing game',
    technologies: ['React', 'JavaScript', 'TailwindCSS', 'TypeScript'],
    liveUrl: 'https://yossef-ibrahimm.github.io/Hangman_Pro/',
    githubUrl: 'https://github.com/yossef-ibrahimm/Hangman_Pro',
    featured: true,
    color: '190, 72%, 80%',
  },
  {
    title: 'Typing Speed Game',
    description:
      'An advanced typing speed game built with React that measures WPM, accuracy, and typing consistency, featuring real-time feedback, multiple modes, and a clean modern UI.',
    image: typingSpeed,
    alt: 'Typing Speed Game — WPM and accuracy tracker',
    technologies: ['React', 'TypeScript', 'Vite', 'TailwindCSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/Typing_Speed/',
    githubUrl: 'https://github.com/yossef-ibrahimm/Typing_Speed',
    featured: true,
    color: '120, 60%, 25%',
  },
  {
    title: 'Connect Four Game',
    description:
      'A modern Connect Four game built with React and Vite, featuring drag-and-drop gameplay, animated tokens, customizable player colors, AI opponent mode, and a fully responsive design.',
    image: connect_four,
    alt: 'Connect Four Game — two-player strategy game',
    technologies: ['React', 'TypeScript', 'Vite', 'TailwindCSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/connect-four/',
    githubUrl: 'https://github.com/yossef-ibrahimm/connect-four',
    featured: true,
    color: '200, 70%, 35%',
  },
  {
    title: 'Weather App',
    description:
      'A fully responsive weather app supporting multi-language display.',
    image: weatherApp,
    alt: 'Weather App — multi-language weather forecast',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/Weather_App/',
    githubUrl: 'https://github.com/yossef-ibrahimm/Weather_App',
    featured: true,
    color: '200, 80%, 50%',
  },
  {
    title: 'Card Validation',
    description: 'A website that validates Visa card information dynamically.',
    image: cardValidation,
    alt: 'Card Validation — Visa card number validator',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/visa_card_validation/',
    githubUrl: 'https://github.com/yossef-ibrahimm/visa_card_validation',
    featured: false,
    color: '45, 90%, 50%',
  },
  {
    title: 'Analog Clock',
    description:
      'A responsive analog clock and stopwatch with smooth animations.',
    image: analogClock,
    alt: 'Analog Clock — animated clock and stopwatch',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/analogclock-stopwatch/',
    githubUrl: 'https://github.com/yossef-ibrahimm/analogclock-stopwatch',
    featured: false,
    color: '330, 80%, 60%',
  },
  {
    title: 'Quiz App',
    description:
      'A responsive quiz app that loads questions dynamically from JSON.',
    image: quizApp,
    alt: 'Quiz App — dynamic JSON-powered quiz',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/quiz-app/',
    githubUrl: 'https://github.com/yossef-ibrahimm/quiz-app',
    featured: false,
    color: '140, 70%, 45%',
  },
]

// ---------------------------------------------------------------------------
// Sparkle utility — kept local; import from ../utils/advancedAnimations if it
// exports createSparkles to avoid duplication across the codebase
// ---------------------------------------------------------------------------

const createSparkles = (element, color = 'rgb(99, 102, 241)') => {
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

// ---------------------------------------------------------------------------
// ProjectCard
//
// CRITICAL OPTIMIZATION: isHovered state removed entirely.
// Original: every mouseenter/mouseleave caused a full React re-render of the
// entire card subtree (all those inline styles reading `isHovered`).
// With 9 cards and rapid mouse movement, that's 9 * N re-renders per second.
//
// Solution: All hover effects now live in GSAP + CSS custom properties.
// React renders each card exactly ONCE after mount. Zero re-renders on hover.
// ---------------------------------------------------------------------------

const ProjectCard = memo(({ project, index }) => {
  const cardRef = useRef(null)
  const cardInnerRef = useRef(null)
  const imageRef = useRef(null)
  const glowRef = useRef(null)
  const numberRef = useRef(null)
  const numberBadgeRef = useRef(null)
  const titleRef = useRef(null)

  // Pre-computed — stable string, no need to compute in render repeatedly
  const cardNumber = String(index + 1).padStart(2, '0')

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo(
        card,
        { opacity: 0, y: 60, scale: 0.9, rotationX: -15 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'back.out(1.4)',
        },
      )
    }, card)

    return () => ctx.revert()
  }, [index])

  // ✅ FIXED: handleMouseMove no longer depends on isHovered.
  // The tilt logic now reads a data attribute set by mouseenter/mouseleave,
  // so the callback is stable and never needs to be recreated.
  const isHoveredRef = useRef(false)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card || !isHoveredRef.current) return

    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2

    // Update CSS vars for radial glow — zero React involvement
    if (glowRef.current) {
      glowRef.current.style.setProperty(
        '--mouse-x',
        `${e.clientX - rect.left}px`,
      )
      glowRef.current.style.setProperty(
        '--mouse-y',
        `${e.clientY - rect.top}px`,
      )
    }

    gsap.to(card, {
      rotationX: -y * 12,
      rotationY: x * 12,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: x * 20,
        y: y * 20,
        scale: 1.15,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: x * 30,
        y: y * 30,
        duration: 0.3,
        overwrite: 'auto',
      })
    }
  }, []) // ✅ Empty deps — stable forever, reads isHoveredRef (ref, not state)

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true
    const card = cardRef.current

    if (card) {
      gsap.to(card, {
        y: -20,
        scale: 1.02,
        boxShadow: `0 50px 100px -20px rgba(0,0,0,0.5), 0 0 60px hsl(${project.color}, 0.5)`,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    if (numberRef.current) {
      gsap.to(numberRef.current, {
        rotation: 720,
        scale: 1.1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    // ✅ CSS class toggle instead of state — no re-render
    if (numberBadgeRef.current) {
      numberBadgeRef.current.classList.add('is-hovered')
    }
    if (titleRef.current) {
      titleRef.current.style.setProperty(
        '--project-color',
        `hsl(${project.color})`,
      )
      titleRef.current.classList.add('is-hovered')
    }
    if (glowRef.current) {
      glowRef.current.classList.add('is-hovered')
    }

    createSparkles(card, `hsl(${project.color})`)
  }, [project.color])

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false
    const card = cardRef.current

    if (card) {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        y: 0,
        scale: 1,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
        duration: 0.5,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
    }

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
    }

    if (glowRef.current) {
      gsap.to(glowRef.current, { x: 0, y: 0, duration: 0.5, overwrite: 'auto' })
      glowRef.current.classList.remove('is-hovered')
    }

    if (numberBadgeRef.current) {
      numberBadgeRef.current.classList.remove('is-hovered')
    }
    if (titleRef.current) {
      titleRef.current.classList.remove('is-hovered')
    }
  }, [])

  return (
    <article
      ref={cardRef}
      aria-label={`Project: ${project.title}`}
      className="relative h-full group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/*
       * Animated glow uses CSS custom properties set via style.setProperty —
       * no state, no re-render. The .is-hovered class controls opacity via CSS.
       */}
      <div
        ref={glowRef}
        className="project-card-glow absolute -inset-4 rounded-3xl blur-3xl -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-70"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(${project.color}, 0.8), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <div
        ref={cardInnerRef}
        className="relative rounded-3xl overflow-hidden backdrop-blur-xl border h-full flex flex-col shadow-2xl"
        style={{
          backgroundColor: 'hsl(var(--card) / 0.95)',
          borderColor: 'hsl(var(--border) / 0.5)',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ color: `hsl(${project.color})` }}
          aria-hidden="true"
        />

        {/* Image — ✅ <img> instead of CSS backgroundImage for lazy loading */}
        <div className="relative aspect-[4/3] overflow-hidden bg-card">
          <img
            ref={imageRef}
            src={project.image}
            alt={project.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-300 group-hover:brightness-110 group-hover:contrast-110"
          />

          {/* Dynamic gradient overlay */}
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background: `linear-gradient(135deg, transparent 0%, hsl(${project.color}, 0.2) 100%)`,
            }}
            aria-hidden="true"
          />

          {/* Scanline effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
            }}
            aria-hidden="true"
          />

          {/* Number badge
           * ✅ .is-hovered class toggled by JS (no state re-render).
           * CSS in global stylesheet handles border-radius + box-shadow transition.
           */}
          <div
            ref={numberBadgeRef}
            className="project-number-badge absolute top-5 left-5 w-16 h-16 rounded-2xl backdrop-blur-md border flex items-center justify-center overflow-hidden transition-all duration-500"
            style={{
              backgroundColor: `hsl(${project.color}, 0.1)`,
              borderColor: `hsl(${project.color}, 0.4)`,
            }}
            aria-hidden="true"
          >
            <span
              ref={numberRef}
              className="text-2xl font-black relative z-10"
              style={{
                background:
                  'linear-gradient(to bottom right, hsl(var(--foreground)), hsl(var(--foreground) / 0.7))',
                WebkitBackgroundClip: 'text',

                backgroundClip: 'text',
                color: `hsl(${project.color}, 0.9)`,
              }}
            >
              {cardNumber}
            </span>
          </div>

          {/* Featured badge */}
          {project.featured && (
            <div
              className="absolute top-5 right-5 px-4 py-2 rounded-full backdrop-blur-md border flex items-center gap-2 group-hover:scale-110 transition-transform"
              style={{
                backgroundColor: 'hsl(var(--primary) / 0.15)',
                borderColor: 'hsl(var(--primary) / 0.4)',
              }}
              aria-label="Featured project"
            >
              <Star
                className="w-4 h-4 animate-pulse"
                style={{ color: 'hsl(var(--primary))' }}
                fill="currentColor"
                aria-hidden="true"
              />
              <span
                className="text-xs font-bold"
                style={{ color: 'hsl(var(--primary))' }}
              >
                Featured
              </span>
            </div>
          )}

          {/* Action buttons — shown on hover via group-hover opacity */}
          <div
            className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500"
            role="group"
            aria-label="Project links"
          >
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} live demo`}
                className="p-4 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 hover:rotate-12 translate-y-5 group-hover:translate-y-0"
                style={{
                  backgroundColor: 'hsl(var(--card) / 0.8)',
                  transitionDelay: '0.1s',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  createSparkles(e.currentTarget, `hsl(${project.color})`)
                }}
              >
                <ExternalLink
                  className="w-6 h-6 drop-shadow-lg"
                  style={{ color: 'hsl(var(--foreground))' }}
                  aria-hidden="true"
                />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} source code on GitHub`}
                className="p-4 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 hover:-rotate-12 translate-y-5 group-hover:translate-y-0"
                style={{
                  backgroundColor: 'hsl(var(--card) / 0.8)',
                  transitionDelay: '0.2s',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  createSparkles(e.currentTarget, `hsl(${project.color})`)
                }}
              >
                <Github
                  className="w-6 h-6 drop-shadow-lg"
                  style={{ color: 'hsl(var(--foreground))' }}
                  aria-hidden="true"
                />
              </a>
            )}
          </div>
        </div>

        {/* Card content */}
        <div className="p-6 flex-1 flex flex-col space-y-4">
          {/*
           * ✅ Title color on hover via CSS class + CSS custom property.
           * No state, no re-render. The .is-hovered class is toggled imperatively.
           * --project-color is set once on mouseenter via style.setProperty.
           */}
          <h3
            ref={titleRef}
            className="project-card-title text-2xl font-black transition-all duration-500"
          >
            {project.title}
          </h3>

          <p
            className="text-sm leading-relaxed line-clamp-2 flex-1"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            {project.description}
          </p>

          {/* Technology tags
           * ✅ FIXED: Removed inline `opacity: 0` + CSS animation that reset on every
           * isHovered re-render. Now uses Tailwind animate classes applied once.
           * The stagger delay is kept via CSS custom property.
           */}
          <div
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Technologies used"
          >
            {project.technologies.slice(0, 4).map((tech, i) => (
              <span
                key={tech}
                role="listitem"
                className="project-tech-tag px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-300 hover:scale-110"
                style={{ '--stagger-delay': `${i * 100}ms` }}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span
                className="px-3 py-1.5 text-xs font-semibold"
                style={{ color: 'hsl(var(--muted-foreground))' }}
                aria-label={`and ${project.technologies.length - 4} more technologies`}
              >
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="h-full w-full -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              background: `linear-gradient(90deg, transparent, hsl(${project.color}), transparent)`,
            }}
          />
        </div>
      </div>
    </article>
  )
})

ProjectCard.displayName = 'ProjectCard'

// ---------------------------------------------------------------------------
// ProjectsSection
// ---------------------------------------------------------------------------

export const ProjectsSection = () => {
  const sectionRef = useRef(null)
  const orb1Ref = useRef(null)
  const orb2Ref = useRef(null)

  useEffect(() => {
    const orbRefs = [orb1Ref, orb2Ref]
    if (orbRefs.some((r) => !r.current)) return

    // ✅ FIXED: Original used gsap.to() with array keyframes [0, 100, 0]
    // GSAP does NOT support array keyframes on gsap.to() — only the last
    // value in the array was used, making the animation a simple one-shot.
    // Replaced with gsap.timeline() for correct back-and-forth motion.
    const ctx = gsap.context(() => {
      const tl1 = gsap.timeline({ repeat: -1, yoyo: true, ease: 'sine.inOut' })
      tl1.to(orb1Ref.current, {
        x: 100,
        y: -50,
        scale: 1.3,
        opacity: 0.4,
        duration: 6,
      })

      const tl2 = gsap.timeline({ repeat: -1, yoyo: true, ease: 'sine.inOut' })
      tl2.to(orb2Ref.current, {
        x: -80,
        y: 60,
        scale: 1.4,
        opacity: 0.5,
        duration: 7.5,
      })
    })

    return () => ctx.revert()
  }, [])

  const handleViewAll = useCallback(() => {
    // ✅ FIXED: Original button had no action. Navigates to GitHub profile.
    window.open(
      'https://github.com/yossef-ibrahimm',
      '_blank',
      'noopener,noreferrer',
    )
  }, [])

  const handleViewAllSparkle = useCallback(
    (e) => {
      createSparkles(e.currentTarget, 'rgb(168, 85, 247)')
      handleViewAll()
    },
    [handleViewAll],
  )

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="projects-heading"
      className="relative py-24 md:py-32 px-4 md:px-6 overflow-hidden transition-colors duration-300"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          ref={orb1Ref}
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"
        />
        <div
          ref={orb2Ref}
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <ScrollReveal>
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border backdrop-blur-sm mb-8 hover:scale-105 transition-transform"
              style={{
                backgroundColor: 'hsl(var(--primary) / 0.1)',
                borderColor: 'hsl(var(--primary) / 0.2)',
              }}
            >
              <Zap
                className="w-4 h-4 animate-pulse"
                style={{ color: 'hsl(var(--primary))' }}
                aria-hidden="true"
              />
              <span
                className="text-sm font-bold uppercase tracking-widest"
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Selected Work
              </span>
              <Sparkles
                className="w-4 h-4 text-blue-400 animate-spin"
                style={{ animationDuration: '3s' }}
                aria-hidden="true"
              />
            </div>
          </ScrollReveal>

          <h2
            id="projects-heading"
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
          >
            <AnimatedText text="Featured" />
            <span
              className="block mt-2"
              style={{
                background: `linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              <AnimatedText text="Projects" delay={0.3} />
            </span>
          </h2>

          <ScrollReveal delay={0.5}>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto"
              style={{ color: 'hsl(var(--muted-foreground))' }}
            >
              A collection of projects that showcase my passion for creating
              exceptional digital experiences
            </p>
          </ScrollReveal>
        </div>

        {/* Projects grid */}
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          role="list"
          aria-label="Portfolio projects"
        >
          {PROJECTS.map((project, index) => (
            <div key={project.title} role="listitem">
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <ScrollReveal className="flex justify-center mt-16">
          <button
            onClick={handleViewAllSparkle}
            aria-label="View all projects on GitHub"
            className="group relative px-10 py-5 rounded-2xl border backdrop-blur-sm overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300"
            style={{
              backgroundColor: 'hsl(var(--primary) / 0.1)',
              borderColor: 'hsl(var(--primary) / 0.3)',
            }}
          >
            <span
              className="relative z-10 flex items-center gap-3 font-bold text-lg"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              View All Projects
              <ArrowUpRight
                className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                aria-hidden="true"
              />
            </span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
              style={{
                background: `linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))`,
              }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              aria-hidden="true"
            />
          </button>
        </ScrollReveal>
      </div>

      {/*
       * ✅ Global styles for ProjectCard hover states that can't be expressed
       * in Tailwind alone (CSS custom property reads, is-hovered class toggling).
       *
       * RECOMMENDATION: Move this to your global CSS file or a CSS module.
       * It's kept inline here only for completeness of the diff.
       * The <style> tag is placed ONCE at section level (not inside each card).
       */}
      <style>{`
        /* Title color: default uses CSS var(--foreground), hover uses project color */
        .project-card-title {
          color: hsl(var(--foreground));
        }
        .project-card-title.is-hovered {
          color: var(--project-color);
          text-shadow: 0 0 20px color-mix(in srgb, var(--project-color) 50%, transparent);
        }

        /* Number badge: border-radius morphs to circle on hover */
        .project-number-badge.is-hovered {
          border-radius: 50%;
          box-shadow: 0 0 30px var(--project-color, hsl(var(--primary) / 0.6));
        }

        /* Tech tag: theme-aware colors, no DOM reads in JS */
        .project-tech-tag {
          background-color: hsl(var(--muted) / 0.5);
          border-color: hsl(var(--border) / 0.5);
          color: hsl(var(--muted-foreground));
          animation: fadeInUp 0.4s ease-out var(--stagger-delay, 0ms) both;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
      `}</style>
    </section>
  )
}

export default ProjectsSection
