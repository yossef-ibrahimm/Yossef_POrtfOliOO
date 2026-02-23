import gsap from 'gsap'
import { useRef, useEffect } from 'react'
import { Github, Linkedin, Twitter, Heart } from 'lucide-react'
import './App.css'

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
]

export const Footer = () => {
  const logoRef = useRef(null)
  const socialRefs = useRef([])

  useEffect(() => {
    // Logo hover animation
    if (logoRef.current) {
      logoRef.current.addEventListener('mouseenter', () => {
        gsap.to(logoRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        })
      })

      logoRef.current.addEventListener('mouseleave', () => {
        gsap.to(logoRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        })
      })
    }

    // Social links hover animation
    socialRefs.current.forEach((ref) => {
      if (!ref) return

      ref.addEventListener('mouseenter', () => {
        gsap.to(ref, {
          scale: 1.25,
          y: -4,
          color: '#63f',
          textShadow: '0 0 20px rgba(99, 102, 241, 0.8)',
          duration: 0.3,
          ease: 'power2.out',
        })
      })

      ref.addEventListener('mouseleave', () => {
        gsap.to(ref, {
          scale: 1,
          y: 0,
          color: '#94a3b8',
          textShadow: 'none',
          duration: 0.3,
          ease: 'power2.out',
        })
      })

      ref.addEventListener('mousedown', () => {
        gsap.to(ref, {
          scale: 0.95,
          duration: 0.1,
        })
      })

      ref.addEventListener('mouseup', () => {
        gsap.to(ref, {
          scale: 1.25,
          duration: 0.1,
        })
      })
    })

    return () => {
      socialRefs.current = []
    }
  }, [])

  return (
    <footer className="relative mt-20 border-t border-border/50 bg-gradient-to-b from-transparent via-primary/5 to-background overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Logo & Description */}
            <div className="flex flex-col items-start gap-4">
              <a
                ref={logoRef}
                href="#home"
                className="text-3xl font-display font-bold text-gradient cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                Yossef.
              </a>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Front-End Developer crafting beautiful, performant digital
                experiences with modern technologies.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider">
                Navigation
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Home', href: '#home' },
                  { name: 'About', href: '#about' },
                  { name: 'Work', href: '#work' },
                  { name: 'Contact', href: '#contact' },
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>{' '}
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-foreground font-semibold text-sm uppercase tracking-wider">
                Connect
              </h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.label}
                    ref={(el) => (socialRefs.current[index] = el)}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-110 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <social.icon className="w-5 h-5 relative z-10" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              Made with{' '}
              <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />{' '}
              by Yossef Ibrahim
            </p>
            <p>© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
