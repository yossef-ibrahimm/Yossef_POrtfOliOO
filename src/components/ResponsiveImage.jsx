import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

/* -------------------------------------------
  Responsive Image (Lazy + Priority)
------------------------------------------- */
export const ResponsiveImage = ({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [imageSrc, setImageSrc] = useState(priority ? src : null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setImageSrc(src);
      return;
    }

    if ("IntersectionObserver" in window && imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01, rootMargin: "50px" }
      );

      observer.observe(imgRef.current);

      return () => {
        if (imgRef.current) observer.unobserve(imgRef.current);
      };
    } else {
      setImageSrc(src);
    }
  }, [src, priority]);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={imageSrc || undefined}
        alt={alt}
        sizes={sizes}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`w-full h-full object-cover ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
        style={{ transform: "scale(1.5)"}}
      />
    </motion.div>
  );
};

/* -------------------------------------------
  Responsive Picture with WebP support
------------------------------------------- */
export const ResponsivePicture = ({ src, alt, className = "", width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if ("IntersectionObserver" in window && imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsLoaded(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01, rootMargin: "50px" }
      );

      observer.observe(imgRef.current);
      return () => {
        if (imgRef.current) observer.unobserve(imgRef.current);
      };
    }
  }, []);

  return (
    <picture className={className}>
      <source srcSet={src.replace(/\.\w+$/, ".webp")} type="image/webp" />
      <img
        ref={imgRef}
        src={isLoaded ? src : undefined}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover ${
          isLoaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
      />
    </picture>
  );
};

export default ResponsiveImage;
