import gsap from 'gsap'
import { useRef, useState, useEffect, useCallback } from 'react'
import {
  Mail,
  MapPin,
  Phone,
  Send,
  ArrowUpRight,
  Sparkles,
  Github,
  Linkedin,
  Twitter,
  Instagram,
} from 'lucide-react'
import { GlitchText } from './AnimatedText'
import { createSparkles } from '../utils/advancedAnimations'
import { createFloatingParallax } from '../utils/scrollAnimations'
import emailjs from '@emailjs/browser'

// ============ Animated Text Components ============

// ============ Magnetic Button ============

const MagneticButton = ({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled,
}) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const handleMouseMove = (e) => {
      if (disabled) return
      const rect = ref.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.35
      const y = (e.clientY - rect.top - rect.height / 2) * 0.35

      gsap.to(ref.current, {
        x,
        y,
        duration: 0.2,
        ease: 'power2.out',
      })
    }

    const handleMouseEnter = () => {
      if (!disabled) {
        createSparkles(ref.current, 'rgb(99, 102, 241)')
        gsap.to(ref.current, {
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.8)',
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    const handleMouseLeave = () => {
      gsap.to(ref.current, {
        x: 0,
        y: 0,
        boxShadow: '0 0 0px rgba(99, 102, 241, 0)',
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    ref.current.addEventListener('mousemove', handleMouseMove)
    ref.current.addEventListener('mouseenter', handleMouseEnter)
    ref.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousemove', handleMouseMove)
        ref.current.removeEventListener('mouseenter', handleMouseEnter)
        ref.current.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [disabled])

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative overflow-hidden group ${className} ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  )
}

// ============ Floating Orb Decoration ============
const FloatingOrb = ({ className, delay = 0 }) => {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.to(ref.current, {
      y: [-30, 30, -30],
      x: [-20, 20, -20],
      scale: [1, 1.1, 1],
      duration: 5,
      repeat: -1,
      ease: 'easeInOut',
      delay,
    })

    return () => {
      gsap.killTweensOf(ref.current)
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    />
  )
}

// ============ Contact Info ============
const contactInfo = [
  {
    id: 1,
    icon: Mail,
    label: 'Email',
    value: 'yossef.ibrahim565200@gmail.com',
    href: 'mailto:hello@yossef.dev',
  },
  {
    id: 2,
    icon: Phone,
    label: 'Phone',
    value: '+201028599903',
    href: 'tel:201028599903',
  },
  {
    id: 3,
    icon: Phone,
    label: 'Phone',
    value: '+01030006425',
    href: 'tel:01030006425',
  },
  {
    id: 4,
    icon: MapPin,
    label: 'Location',
    value: '10th of Ramadan Shrqia',
    href: '#',
  },
]

const socialLinks = [
  {
    icon: Github,
    name: 'GitHub',
    href: 'https://github.com/yossef-ibrahimm',
    color: 'hover:text-foreground',
  },
  {
    icon: Linkedin,
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yossef%D9%80%D9%80%D9%80ibrahim/',
    color: 'hover:text-[#0A66C2]',
  },
]

// ============ Main Contact Section ============
export const ContactSection = () => {
  const containerRef = useRef(null)
  const headingRef = useRef(null)
  const contactGridRef = useRef(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  useEffect(() => {
    // Animate heading on mount - FASTER
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
      )
    }

    // Animate contact info items on scroll - FASTER
    const items = containerRef.current?.querySelectorAll('[data-contact-item]')
    if (items) {
      gsap.fromTo(
        items,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }

    // Add floating parallax to contact grid
    if (contactGridRef.current) {
      createFloatingParallax(contactGridRef.current, -0.4)
    }
  }, [])

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleFocusChange = useCallback(
    (field) => () => {
      setFocusedField(field)
    },
    [],
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await emailjs.send(
        'service_do5c29q', // Service ID
        'template_6va02bb', // Template ID
        {
          name: formState.name,
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
          time: new Date().toLocaleString(),
        },
        'u1Hn6kHbOQGpX2xy5', // Public Key
      )

      alert('Message sent successfully!')
      setFormState({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('EmailJS error:', error)
      alert('Failed to send message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative min-h-screen py-32 px-4 md:px-8 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingOrb
          className="w-[600px] h-[600px] -top-40 -right-40 bg-primary/10"
          delay={0}
        />
        <FloatingOrb
          className="w-[500px] h-[500px] -bottom-32 -left-32 bg-secondary/10"
          delay={2}
        />
        <FloatingOrb
          className="w-[300px] h-[300px] top-1/2 left-1/3 bg-accent/5"
          delay={4}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-28">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <div className="animate-spin inline-block">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary tracking-wide">
              Let's Connect
            </span>
          </div>

          {/* Main Title */}
          <h2
            ref={headingRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-8"
          >
            <GlitchText text="Wait for what?!" className="text-foreground" />
            <br />
            <GlitchText text="Hire  Me" className="text-foreground" />
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your visions.
          </p>
        </div>

        {/* Main Content Grid */}
        <div
          className="grid lg:grid-cols-12 gap-12 lg:gap-16"
          ref={contactGridRef}
        >
          {/* Left Column - Info */}
          <div className="lg:col-span-5 space-y-10">
            {/* Info Card */}
            <div className="relative p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden group hover:border-primary/30 transition-colors">
              {/* Card glow effect */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-semibold mb-3">
                    Get in Touch
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ready to bring your ideas to life? Let's collaborate and
                    create something extraordinary together.
                  </p>
                </div>

                {/* Contact Items */}
                <div className="space-y-4 pt-4">
                  {contactInfo.map((item, i) => (
                    <a
                      key={item.id}
                      href={item.href}
                      data-contact-item
                      className="flex items-center gap-4 p-4 -mx-4 rounded-2xl hover:bg-primary/5 transition-colors group/item cursor-pointer"
                    >
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center group-hover/item:border-primary/30 transition-colors">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground block mb-1">
                          {item.label}
                        </span>
                        <span className="font-medium text-foreground group-hover/item:text-primary transition-colors">
                          {item.value}
                        </span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover/item:opacity-100 group-hover/item:text-primary transition-all -translate-x-2 group-hover/item:translate-x-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-5">
              <h4 className="text-sm uppercase tracking-widest text-muted-foreground">
                Follow Me
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-12 h-12 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-center text-muted-foreground ${social.color} transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:scale-110 hover:y-1`}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability Badge */}
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-green-500/20 bg-green-500/5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-sm text-green-400 font-medium">
                Available for new projects
              </span>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="relative">
              {/* Form Card */}
              <div className="relative p-8 md:p-10 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl">
                <div className="relative space-y-6">
                  {/* Form Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-display font-semibold mb-2">
                      Send a Message
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Fill out the form below and I'll get back to you within 24
                      hours.
                    </p>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField
                      label="Your Name"
                      name="name"
                      type="text"
                      value={formState.name}
                      onChange={handleFormChange}
                      placeholder="John Doe"
                      focused={focusedField === 'name'}
                      onFocus={handleFocusChange('name')}
                      onBlur={handleFocusChange(null)}
                    />
                    <FormField
                      label="Your Email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleFormChange}
                      placeholder="any@example.com"
                      focused={focusedField === 'email'}
                      onFocus={handleFocusChange('email')}
                      onBlur={handleFocusChange(null)}
                    />
                  </div>

                  {/* Subject */}
                  <FormField
                    label="Subject"
                    name="subject"
                    type="text"
                    value={formState.subject}
                    onChange={handleFormChange}
                    placeholder="What's this about?"
                    focused={focusedField === 'subject'}
                    onFocus={handleFocusChange('subject')}
                    onBlur={handleFocusChange(null)}
                  />

                  {/* Message */}
                  <FormField
                    label="Your Message"
                    name="message"
                    type="textarea"
                    value={formState.message}
                    onChange={handleFormChange}
                    placeholder="Tell me about your project, goals, and timeline..."
                    focused={focusedField === 'message'}
                    onFocus={handleFocusChange('message')}
                    onBlur={handleFocusChange(null)}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <MagneticButton
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-10 py-4 bg-gradient-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-primary/25"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-t from-primary/30 to-transparent" />
    </section>
  )
}

// ============ Form Field Component ============

const FormField = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  focused,
  onFocus,
  onBlur,
}) => {
  const isTextarea = type === 'textarea'
  const InputComponent = isTextarea ? 'textarea' : 'input'
  const focusRef = useRef(null)

  useEffect(() => {
    if (focusRef.current && focused) {
      gsap.to(focusRef.current, {
        color: '#1d55ec',
        duration: 0.2,
      })
    } else if (focusRef.current && !focused) {
      gsap.to(focusRef.current, {
        color: '#fff',
        duration: 0.2,
      })
    }
  }, [focused])

  return (
    <div className="space-y-2">
      <label
        ref={focusRef}
        htmlFor={name}
        className="text-sm font-medium block transition-colors"
      >
        {label}
      </label>
      <div className="relative group">
        {/* Focus glow */}
        <div
          className="absolute -inset-0.5 rounded-xl blur-sm transition-opacity"
          style={{
            background: 'var(--gradient-primary)',
            opacity: focused ? 0.3 : 0,
          }}
        />

        <InputComponent
          id={name}
          name={name}
          type={isTextarea ? undefined : type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={isTextarea ? 5 : undefined}
          className={`
            relative w-full px-5 py-4 rounded-xl
            bg-background/50 border border-border/50
            placeholder:text-muted-foreground/40
            focus:outline-none focus:border-primary/50 focus:bg-background/80
            transition-all duration-300 resize-none
            ${focused ? 'border-primary/50 bg-background/80' : ''}
          `}
        />

        {/* Animated underline */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-primary rounded-full"
          style={{
            width: focused ? '100%' : 0,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}

export default ContactSection
