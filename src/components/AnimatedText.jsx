import React, { useState, useEffect, useRef } from 'react';

// Hook for intersection observer
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options.once) observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
};

// Animated Text by Words
export const AnimatedText = ({ 
  text, 
  className = "", 
  delay = 0,
  staggerDelay = 0.05,
  animation = "slideUp" // slideUp, slideDown, scale, fade, blur, glitch
}) => {
  const [ref, isInView] = useInView({ once: true });
  const words = text.split(" ");

  const animations = {
    slideUp: { from: 'translate-y-12 opacity-0', to: 'translate-y-0 opacity-100' },
    slideDown: { from: '-translate-y-12 opacity-0', to: 'translate-y-0 opacity-100' },
    scale: { from: 'scale-50 opacity-0', to: 'scale-100 opacity-100' },
    fade: { from: 'opacity-0', to: 'opacity-100' },
    blur: { from: 'blur-md opacity-0', to: 'blur-0 opacity-100' },
    glitch: { from: 'translate-x-4 opacity-0', to: 'translate-x-0 opacity-100' },
  };

  const { from, to } = animations[animation] || animations.slideUp;

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block mr-2 transition-all duration-700 ease-out ${
            isInView ? to : from
          }`}
          style={{
            transitionDelay: `${delay + index * staggerDelay}s`,
          }}
        >
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
  const [ref, isInView] = useInView({ once: true });
  const letters = text.split("");

  const animations = {
    rotate: { from: 'rotate-90 opacity-0 translate-y-4', to: 'rotate-0 opacity-100 translate-y-0' },
    wave: { from: 'translate-y-8 opacity-0', to: 'translate-y-0 opacity-100' },
    bounce: { from: 'scale-0 opacity-0', to: 'scale-100 opacity-100' },
    flip: { from: 'rotateX-90 opacity-0', to: 'rotateX-0 opacity-100' },
    zoom: { from: 'scale-150 opacity-0', to: 'scale-100 opacity-100' },
    typewriter: { from: 'opacity-0 blur-sm', to: 'opacity-100 blur-0' },
  };

  const { from, to } = animations[animation] || animations.rotate;

  return (
    <span ref={ref} className={`inline-flex ${className}`} style={{ perspective: '1000px' }}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-700 ease-out ${
            isInView ? to : from
          }`}
          style={{
            transitionDelay: `${delay + index * staggerDelay}s`,
            transformStyle: 'preserve-3d',
          }}
        >
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
  const [ref, isInView] = useInView({ once: true });

  return (
    <span
      ref={ref}
      className={`inline-block bg-gradient-to-r ${gradient} bg-clip-text text-transparent transition-all duration-1000 ${
        isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      } ${animate ? 'bg-300% animate-gradient' : ''} ${className}`}
    >
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 300% 300%;
        }
        .bg-300\\% { background-size: 300% 300%; }
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
  const [ref, isInView] = useInView({ once: true });
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 100000);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [isInView, delay]);

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
      <span className={`relative z-10 ${isInView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        {text}
      </span>
      {glitching && (
        <>
          <span 
            className="absolute inset-0 text-cyan-400 opacity-70"
            style={{ animation: 'glitch-1 0.3s infinite' }}
          >
            {text}
          </span>
          <span 
            className="absolute inset-0 text-red-400 opacity-70"
            style={{ animation: 'glitch-2 0.3s infinite' }}
          >
            {text}
          </span>
        </>
      )}
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
  const [ref, isInView] = useInView({ once: true });
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    const startTimer = setTimeout(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);
        return () => clearTimeout(timer);
      }
    }, delay * 1000);

    return () => clearTimeout(startTimer);
  }, [isInView, currentIndex, text, speed, delay]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {displayText}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-5 bg-current ml-1 animate-pulse" />
      )}
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