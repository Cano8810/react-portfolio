import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import styles from "./HoverBorderGradient.module.css";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  ...props
}) {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const angleRef = useRef(0);
  const lastTimeRef = useRef(null);
  const animationRef = useRef(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    let isVisible = false;

    const animate = (timestamp) => {
      if (!isVisible) {
        animationRef.current = null;
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const speed = isHoveredRef.current ? 180 : 45;
      angleRef.current = (angleRef.current + (speed * delta) / 1000) % 360;

      if (glowRef.current) {
        glowRef.current.style.setProperty('--angle', `${angleRef.current}deg`);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!animationRef.current) {
        lastTimeRef.current = null;
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const stopAnimation = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startAnimation();
          } else {
            stopAnimation();
          }
        });
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      stopAnimation();
      observer.disconnect();
    };
  }, []);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (glowRef.current) {
      glowRef.current.classList.add(styles.glowBorderHover);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (glowRef.current) {
      glowRef.current.classList.remove(styles.glowBorderHover);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(styles.container, containerClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        ref={glowRef}
        className={styles.glowBorder}
      ></div>
      <div className={cn(styles.content, className)}>
        {children}
      </div>
    </div>
  );
}

export default HoverBorderGradient;
