import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, MapPin, Phone, Github, Linkedin, CheckCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MagneticButton from "@/components/MagneticButton";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { scrollDirection } = useScrollDirection();

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const subject = formData.get("subject")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    if (!name || name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!subject || subject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!message || message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    
    if (!validateForm(formData)) {
      toast({
        title: "Validation Error",
        description: "Please check all fields and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual email service (Resend, SendGrid, etc.)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you as soon as possible.",
      });
      
      (e.target as HTMLFormElement).reset();
      setErrors({});
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "yossg.ibrahim@gmail.com",
      href: "mailto:yossg.ibrahim@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+20 1028599903",
      href: "tel:+201028599903",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "10th of Ramadan, Egypt",
      href: null,
    },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/yossefibrahimm", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/yossefibrahim/", label: "LinkedIn" },
  ];

  const inputVariants = {
    focused: { scale: 1.02, boxShadow: "0 0 30px hsl(var(--primary) / 0.2)" },
    unfocused: { scale: 1, boxShadow: "0 0 0px hsl(var(--primary) / 0)" },
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      
      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{
              opacity: 0,
              y: scrollDirection === 'up' ? -40 : 40,
              x: scrollDirection === 'up' ? -20 : 20,
            }}
            animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
            className="text-center mb-16"
          >
            <motion.span 
              className="text-primary font-heading font-semibold text-sm uppercase tracking-widest mb-4 block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1, letterSpacing: "0.3em" } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Get in Touch
            </motion.span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind? Let's discuss how I can help bring your ideas to life.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{
                opacity: 0,
                x: scrollDirection === 'up' ? -50 : 50,
                y: scrollDirection === 'up' ? -30 : 30,
              }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{
                delay: 0.2,
                duration: 0.6,
                type: "spring",
                stiffness: 120,
              }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-heading font-bold text-2xl text-foreground mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, x: -30 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl glass hover:bg-card/80 transition-all duration-300 group"
                      whileHover={{ x: 10, scale: 1.02 }}
                    >
                      <motion.div 
                        className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <info.icon className="w-5 h-5 text-primary" />
                      </motion.div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-medium text-foreground">{info.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-4">
                  Follow Me
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <MagneticButton key={social.label}>
                      <motion.a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl glass hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 block"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <social.icon className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                      </motion.a>
                    </MagneticButton>
                  ))}
                </div>
              </div>

              {/* Download CV */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Button asChild size="lg" className="w-full">
                  <a href="/cv.pdf" download="Youssef_Ibrahim_CV.pdf">
                    <Download className="w-5 h-5" />
                    Download My CV
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl glass" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: "name", label: "Name", type: "text", placeholder: "Your name" },
                    { id: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                  ].map((field) => (
                    <motion.div
                      key={field.id}
                      variants={inputVariants}
                      animate={focusedField === field.id ? "focused" : "unfocused"}
                      className="rounded-lg"
                    >
                      <label htmlFor={field.id} className="block text-sm font-medium text-foreground mb-2">
                        {field.label}
                      </label>
                      <Input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        required
                        onFocus={() => setFocusedField(field.id)}
                        onBlur={() => setFocusedField(null)}
                        className={`bg-secondary/50 border-border/50 focus:border-primary transition-all duration-300 ${
                          errors[field.id] ? "border-red-500 focus:border-red-500" : ""
                        }`}
                        aria-invalid={!!errors[field.id]}
                        aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                      />
                      {errors[field.id] && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 mt-1"
                          id={`${field.id}-error`}
                          role="alert"
                        >
                          {errors[field.id]}
                        </motion.p>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  variants={inputVariants}
                  animate={focusedField === "subject" ? "focused" : "unfocused"}
                  className="rounded-lg"
                >
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Project inquiry"
                    required
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    className={`bg-secondary/50 border-border/50 focus:border-primary transition-all duration-300 ${
                      errors.subject ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  />
                  {errors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1"
                      id="subject-error"
                      role="alert"
                    >
                      {errors.subject}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  variants={inputVariants}
                  animate={focusedField === "message" ? "focused" : "unfocused"}
                  className="rounded-lg"
                >
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project..."
                    rows={5}
                    required
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className={`bg-secondary/50 border-border/50 focus:border-primary resize-none transition-all duration-300 ${
                      errors.message ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1"
                      id="message-error"
                      role="alert"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </motion.div>

                <MagneticButton className="w-full">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full relative overflow-hidden"
                    disabled={isSubmitting}
                  >
                    <motion.span
                      className="flex items-center gap-2"
                      animate={isSubmitting ? { opacity: 0 } : { opacity: 1 }}
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </motion.span>
                    {isSubmitting && (
                      <motion.span
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Send className="w-4 h-4" />
                        </motion.div>
                      </motion.span>
                    )}
                  </Button>
                </MagneticButton>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
