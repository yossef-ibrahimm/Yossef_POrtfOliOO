import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, FormEvent, ReactNode, MouseEvent } from "react";
import { Mail, MapPin, Phone, Send, ArrowUpRight, Sparkles, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { GlitchText } from "./AnimatedText";

// ============ Animated Text Components ============



// ============ Magnetic Button ============

const MagneticButton = ({ children, className = "", onClick, type = "button", disabled }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 200 });
  const springY = useSpring(y, { damping: 15, stiffness: 200 });

  const handleMouseMove = (e) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden group ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// ============ Floating Orb Decoration ============
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{
      y: [-30, 30, -30],
      x: [-20, 20, -20],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

// ============ Contact Info ============
const contactInfo = [
  { icon: Mail, label: "Email", value: "yossg.ibrahim@gmail.com", href: "mailto:hello@yossef.dev" },
  { icon: Phone, label: "Phone", value: "+201028599903", href: "tel:201028599903" },
   { icon: Phone, label: "Phone", value: "+01030006425", href: "tel:01030006425" },
  { icon: MapPin, label: "Location", value: "10th of Ramadan Shrqia", href: "#" },
];

const socialLinks = [
  { icon: Github, name: "GitHub", href: "https://github.com/yossef-ibrahimm", color: "hover:text-foreground" },
  { icon: Linkedin, name: "LinkedIn", href: "https://linkedin.com/in/yossef-ibrahim", color: "hover:text-[#0A66C2]" },
];

// ============ Main Contact Section ============
export const ContactSection = () => {
  const containerRef = useRef(null);
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    console.log(formState);
    setIsSubmitting(false);
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative min-h-screen py-32 px-4 md:px-8 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingOrb className="w-[600px] h-[600px] -top-40 -right-40 bg-primary/10" delay={0} />
        <FloatingOrb className="w-[500px] h-[500px] -bottom-32 -left-32 bg-secondary/10" delay={2} />
        <FloatingOrb className="w-[300px] h-[300px] top-1/2 left-1/3 bg-accent/5" delay={4} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <motion.div style={{ y: backgroundY }} className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          style={{ scale: headerScale, opacity: headerOpacity }}
          className="text-center mb-20 md:mb-28"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary tracking-wide">Let's Connect</span>
          </motion.div>

          {/* Main Title */}
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-8">
            <GlitchText text="Wait for what?!" className="text-foreground" />
            <br />
                       <GlitchText text="Hier Me" className="text-foreground" />

          </h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-10"
          >
            {/* Info Card */}
            <div className="relative p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden group">
              {/* Card glow effect */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-semibold mb-3">Get in Touch</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ready to bring your ideas to life? Let's collaborate and create something extraordinary together.
                  </p>
                </div>

                {/* Contact Items */}
                <div className="space-y-4 pt-4">
                  {contactInfo.map((item, i) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, duration: 0.5 }}
                      whileHover={{ x: 8, backgroundColor: "hsl(var(--primary) / 0.05)" }}
                      className="flex items-center gap-4 p-4 -mx-4 rounded-2xl transition-colors group/item"
                    >
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center group-hover/item:border-primary/30 transition-colors">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1.2 }}
                        />
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
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-5"
            >
              <h4 className="text-sm uppercase tracking-widest text-muted-foreground">Follow Me</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm flex items-center justify-center text-muted-foreground ${social.color} transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10`}
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 p-4 rounded-2xl border border-green-500/20 bg-green-500/5"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-sm text-green-400 font-medium">Available for new projects</span>
            </motion.div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="relative">
              {/* Form Card */}
              <div className="relative p-8 md:p-10 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl">
                {/* Animated border gradient */}
                <motion.div
                  className="absolute -inset-[1px] rounded-3xl opacity-0"
                  style={{ background: "var(--gradient-primary)" }}
                  animate={{ opacity: focusedField ? 0.3 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative space-y-6">
                  {/* Form Header */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-display font-semibold mb-2">Send a Message</h3>
                    <p className="text-muted-foreground text-sm">Fill out the form below and I'll get back to you within 24 hours.</p>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField
                      label="Your Name"
                      name="name"
                      type="text"
                      value={formState.name}
                      onChange={(v) => setFormState({ ...formState, name: v })}
                      placeholder="John Doe"
                      focused={focusedField === "name"}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <FormField
                      label="Your Email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={(v) => setFormState({ ...formState, email: v })}
                      placeholder="john@example.com"
                      focused={focusedField === "email"}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  {/* Subject */}
                  <FormField
                    label="Subject"
                    name="subject"
                    type="text"
                    value={formState.subject}
                    onChange={(v) => setFormState({ ...formState, subject: v })}
                    placeholder="What's this about?"
                    focused={focusedField === "subject"}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                  />

                  {/* Message */}
                  <FormField
                    label="Your Message"
                    name="message"
                    type="textarea"
                    value={formState.message}
                    onChange={(v) => setFormState({ ...formState, message: v })}
                    placeholder="Tell me about your project, goals, and timeline..."
                    focused={focusedField === "message"}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
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
                          <motion.div
                            className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
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
          </motion.div>
        </div>

        {/* Bottom CTA */}
      
      </motion.div>

      {/* Decorative Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-t from-primary/30 to-transparent" />
    </section>
  );
};

// ============ Form Field Component ============

const FormField = ({ label, name, type, value, onChange, placeholder, focused, onFocus, onBlur }) => {
  const isTextarea = type === "textarea";
  const InputComponent = isTextarea ? "textarea" : "input";

  return (
    <div className="space-y-2">
      <motion.label
        htmlFor={name}
        className="text-sm font-medium block transition-colors"
        animate={{ color: focused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
      >
        {label}
      </motion.label>
      <div className="relative group">
        {/* Focus glow */}
        <motion.div
          className="absolute -inset-0.5 rounded-xl blur-sm transition-opacity"
          style={{ background: "var(--gradient-primary)" }}
          animate={{ opacity: focused ? 0.3 : 0 }}
        />
        
        <InputComponent
          id={name}
          name={name}
          type={isTextarea ? undefined : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: focused ? "100%" : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default ContactSection;
