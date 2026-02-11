import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BlurText = ({
  text = '',
  delay = 0.05,
  className = '',
  animateBy = 'words',
  direction = 'top',
  scrollStart = 'top 80%',
  scrollEnd = 'top 20%',
}) => {
  const containerRef = useRef(null);

  const elements = useMemo(() => {
    const parts = animateBy === 'words' ? text.split(' ') : text.split('');
    return parts.map((segment, index) => (
      <span
        key={index}
        className="blur-char"
        style={{
          display: 'inline-block',
          willChange: 'transform, filter, opacity'
        }}
      >
        {segment === ' ' ? '\u00A0' : segment}
        {animateBy === 'words' && index < parts.length - 1 && '\u00A0'}
      </span>
    ));
  }, [text, animateBy]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const charElements = el.querySelectorAll('.blur-char');

    const yStart = direction === 'top' ? -30 : 30;

    gsap.fromTo(
      charElements,
      {
        filter: 'blur(10px)',
        opacity: 0,
        y: yStart,
      },
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        stagger: delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: scrollStart,
          end: scrollEnd,
          scrub: 1,
          toggleActions: 'play reverse play reverse',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, [delay, direction, scrollStart, scrollEnd]);

  return (
    <p ref={containerRef} className={className}>
      {elements}
    </p>
  );
};

export default BlurText;
