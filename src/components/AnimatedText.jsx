import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Animated Text by Words
export const AnimatedText = ({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 0.05,
  animation = "slideUp" // slideUp, slideDown, scale, fade, blur, glitch
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const words = ref.current.querySelectorAll('span');
    if (words.length === 0) return;

    const animationPresets = {
      slideUp: {
        from: { y: 48, opacity: 0 },
        to: { y: 0, opacity: 1 },
      },
      slideDown: {
        from: { y: -48, opacity: 0 },
        to: { y: 0, opacity: 1 },
      },
      scale: {
        from: { scale: 0.5, opacity: 0 },
        to: { scale: 1, opacity: 1 },
      },
      fade: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      blur: {
        from: { filter: 'blur(10px)', opacity: 0 },
        to: { filter: 'blur(0px)', opacity: 1 },
      },
      glitch: {
        from: { x: 10, opacity: 0 },
        to: { x: 0, opacity: 1 },
      },
    };

    const preset = animationPresets[animation] || animationPresets.slideUp;
    
    // Set initial state
    gsap.set(words, preset.from);

    // Animate on scroll
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(words, {
          ...preset.to,
          duration: 0.6,
          stagger: staggerDelay,
          delay,
          ease: 'power2.out',
        });
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [text, animation, delay, staggerDelay]);

  const words = text.split(" ");

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="inline-block mr-2">
          {word}
        </span>
      ))}
    </span>
  );
};


// Animated Text by Letters
export const AnimatedLetters = ({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 0.03,
  animation = "rotate" // rotate, wave, bounce, flip, zoom, typewriter
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const letters = ref.current.querySelectorAll('span');
    if (letters.length === 0) return;

    const animationPresets = {
      rotate: {
        from: { rotation: 90, opacity: 0, y: 10 },
        to: { rotation: 0, opacity: 1, y: 0 },
      },
      wave: {
        from: { y: 20, opacity: 0 },
        to: { y: 0, opacity: 1 },
      },
      bounce: {
        from: { scale: 0, opacity: 0 },
        to: { scale: 1, opacity: 1 },
      },
      flip: {
        from: { rotationY: -90, opacity: 0 },
        to: { rotationY: 0, opacity: 1 },
      },
      zoom: {
        from: { scale: 1.5, opacity: 0 },
        to: { scale: 1, opacity: 1 },
      },
      typewriter: {
        from: { opacity: 0, filter: 'blur(5px)' },
        to: { opacity: 1, filter: 'blur(0px)' },
      },
    };

    const preset = animationPresets[animation] || animationPresets.rotate;

    // Set initial state
    gsap.set(letters, { ...preset.from, transformPerspective: 1000 });

    // Animate on scroll
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(letters, {
          ...preset.to,
          duration: 0.5,
          stagger: staggerDelay,
          delay,
          ease: 'back.out',
        });
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [text, animation, delay, staggerDelay]);

  const letters = text.split("");

  return (
    <span ref={ref} className={`inline-flex ${className}`} style={{ perspective: '1000px' }}>
      {letters.map((letter, index) => (
        <span key={index} className="inline-block">
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </span>
  );
};



// Gradient Text with Animation
export const GradientText = ({ 
  text, 
  className = "",
  gradient = "from-cyan-400 via-blue-500 to-purple-600",
  animate = true
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !animate) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(ref.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
        });
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    gsap.set(ref.current, { opacity: 0, scale: 0.9 });
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [animate]);

  return (
    <span
      ref={ref}
      className={`inline-block bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${animate ? 'opacity-0' : 'opacity-100'} ${className}`}
      style={{
        backgroundSize: animate ? '300% 300%' : 'auto',
        animation: animate ? 'gradient-shift 3s ease infinite' : 'none',
      }}
    >
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      {text}
    </span>
  );
};



// Glitch Text Effect
export const GlitchText = ({ 
  text, 
  className = "",
  delay = 0
}) => {
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        timeoutRef.current = setTimeout(() => {
          gsap.to(ref.current, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          });
        }, delay * 1000);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    gsap.set(ref.current, { opacity: 0 });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay]);

  return (
    <span ref={ref} className={`inline-block relative ${className}`}>
      <style>{`
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-3px, 3px); }
          40% { transform: translate(-3px, -3px); }
          60% { transform: translate(3px, 3px); }
          80% { transform: translate(3px, -3px); }
        }
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(3px, -3px); }
          40% { transform: translate(3px, 3px); }
          60% { transform: translate(-3px, -3px); }
          80% { transform: translate(-3px, 3px); }
        }
      `}</style>
      <span className="relative z-10">
        {text}
      </span>
    </span>
  );
};



// Typewriter Effect
export const TypewriterText = ({ 
  text, 
  className = "",
  speed = 50,
  delay = 0
}) => {
  const ref = useRef(null);
  const displayRef = useRef('');
  const indexRef = useRef(0);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        indexRef.current = 0;
        displayRef.current = '';
        ref.current.textContent = '';

        const startTimer = setTimeout(() => {
          const typeChar = () => {
            if (indexRef.current < text.length) {
              displayRef.current += text[indexRef.current];
              ref.current.textContent = displayRef.current;
              indexRef.current++;
              setTimeout(typeChar, speed);
            }
          };
          typeChar();
        }, delay * 1000);

        return () => clearTimeout(startTimer);
      }
    }, { threshold: 0.1 });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [text, speed, delay]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {text.substring(0, 1)}
    </span>
  );
};

// Demo Component
/* const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-16 py-12">
        
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-white">
            <AnimatedText text="مكتبة الأنيميشن الخرافية" animation="slideUp" />
          </h1>
          <p className="text-gray-400 text-xl">
            <AnimatedText text="أروع المؤثرات للنصوص في React" delay={0.5} animation="fade" />
          </p>
        </div>

        <div className="space-y-8 bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-4">Animation Types:</h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-sm mb-2">Slide Up Animation</p>
              <h3 className="text-2xl font-bold text-white">
                <AnimatedText text="This text slides up smoothly" animation="slideUp" />
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-2">Scale Animation</p>
              <h3 className="text-2xl font-bold text-white">
                <AnimatedText text="This text scales into view" animation="scale" />
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-2">Blur Animation</p>
              <h3 className="text-2xl font-bold text-white">
                <AnimatedText text="This text fades from blur" animation="blur" />
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-2">Letter Rotation</p>
              <h3 className="text-2xl font-bold text-white">
                <AnimatedLetters text="Each letter rotates in" animation="rotate" />
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-2">Wave Effect</p>
              <h3 className="text-2xl font-bold text-white">
                <AnimatedLetters text="Letters wave elegantly" animation="wave" staggerDelay={0.05} />
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-2">Bounce Effect</p>
              <h3 className="text-2xl font-bold text-white">
                <AnimatedLetters text="Bouncing letters!" animation="bounce" />
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-2">Gradient Text</p>
              <h3 className="text-4xl font-bold">
                <GradientText text="Beautiful gradient animation" />
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-2">Glitch Effect</p>
              <h3 className="text-3xl font-bold text-white">
                <GlitchText text="GLITCH EFFECT" delay={0.5} />
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-2">Typewriter Effect</p>
              <h3 className="text-2xl font-bold text-white">
                <TypewriterText text="This text types itself out..." speed={80} />
              </h3>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-12 rounded-2xl border border-cyan-500/20">
          <h2 className="text-5xl font-black">
            <GradientText 
              text="استخدمها في مشاريعك" 
              gradient="from-cyan-400 via-purple-500 to-pink-500"
            />
          </h2>
          <p className="text-xl text-gray-300">
            <AnimatedLetters text="100% Customizable & Reusable" animation="flip" delay={0.5} />
          </p>
        </div>

      </div>
    </div>
  );
};

export default Demo; */