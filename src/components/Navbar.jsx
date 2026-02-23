import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useState, useRef, useEffect } from 'react'
import { MagneticButton } from './MagneticButton'
import { useTheme } from './ThemeProvider'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Work', href: '#work' },
  { name: 'Contact', href: '#contact' },
]

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme('dark')
  const navRef = useRef(null)
  const logoRef = useRef(null)
  const navLinksRef = useRef([])
  const menuRef = useRef(null)

  useEffect(() => {
    if (!navRef.current) return

    // Navbar background scroll effect
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top 100px',
      onEnter: () => {
        gsap.to(navRef.current, {
          backdropFilter: 'blur(20px)',
          duration: 0.3,
        })
      },
      onLeaveBack: () => {
        gsap.to(navRef.current, {
          backgroundColor: 'rgba(10, 12, 16, 0)',
          backdropFilter: 'blur(0px)',
          duration: 0.3,
        })
      },
    })

    // Animate logo
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
      )
    }

    // Animate nav links
    navLinksRef.current.forEach((link, i) => {
      if (link) {
        gsap.fromTo(
          link,
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.1 * i + 0.3,
            ease: 'power2.out',
          },
        )
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  useEffect(() => {
    if (!menuRef.current) return

    if (isOpen) {
      gsap.to(menuRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
      })

      const menuItems = menuRef.current.querySelectorAll('[data-menu-item]')
      gsap.fromTo(
        menuItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          delay: 0.1,
          ease: 'power2.out',
        },
      )
    } else {
      gsap.to(menuRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.2,
      })
    }
  }, [isOpen])

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 sm:py-4 lg:px-12 transition-all"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a
            ref={logoRef}
            href="#home"
            className="text-xl sm:text-2xl font-display font-bold text-gradient relative z-10 "
            style={{ userSelect: 'none', fontSize: '30px' }}
          >
            YI
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                ref={(el) => (navLinksRef.current[i] = el)}
                href={link.href}
                className="relative text-sm lg:text-base font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group px-3 py-2"
              >
                {/* Background hover effect */}
                <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />

                {link.name}

                {/* Animated underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}

            <MagneticButton className="ml-2 lg:ml-4 px-4 py-2 lg:px-6 lg:py-2.5 bg-gradient-primary text-primary-foreground font-medium rounded-full text-sm hover:shadow-lg hover:shadow-primary/25 transition-shadow duration-300">
              <a href="#contact" style={{ color: '#fff' }}>
                Let's Talk
              </a>
            </MagneticButton>

            {/* Desktop Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 lg:ml-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-300 hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg
                  className="w-5 h-5 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative w-12 h-12 flex flex-col justify-center items-center gap-1.5 z-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/40 transition-all duration-300"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span
              className="w-5 h-[2px] bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-sm transition-all duration-300"
              style={{
                transform: isOpen ? 'translateY(10px) rotate(45deg)' : 'none',
                backgroundColor: isOpen ? '#fd4141' : '#ffffff',
              }}
            />
            <span
              className="w-5 h-[2px] bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-sm transition-all duration-200"
              style={{
                opacity: isOpen ? 0 : 1,
                backgroundColor: isOpen ? '#fd4141' : '#ffffff',
              }}
            />
            <span
              className="w-5 h-[2px] bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-sm transition-all duration-300"
              style={{
                transform: isOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
                backgroundColor: isOpen ? '#fd4141' : '#ffffff',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="md:hidden fixed inset-0 bg-background/95 backdrop-blur-lg z-40 opacity-0 pointer-events-none transition-opacity"
      >
        <div className="flex flex-col items-center justify-center h-full px-6 pt-20 pb-8">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col items-center gap-8 w-full max-w-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                data-menu-item
                className="text-2xl sm:text-3xl font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}

            {/* Mobile CTA Button */}
            <a
              href="#contact"
              data-menu-item
              className="mt-4 px-8 py-3 bg-gradient-primary text-primary-foreground font-medium rounded-full text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow duration-300"
              onClick={() => setIsOpen(false)}
            >
              Let's Talk
            </a>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              data-menu-item
              className="mt-4 p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg
                  className="w-6 h-6 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
.light{
    nav{
       backdrop-filter: blur(20px) !important;
    background-color:  rgb(132 132 132 / 82%); !important;
    }
}
`}</style>
    </>
  )
}

export default Navbar
