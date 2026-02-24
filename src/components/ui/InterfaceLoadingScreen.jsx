import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './InterfaceLoadingScreen.module.css';

gsap.registerPlugin(ScrollTrigger);

const InterfaceLoadingScreen = () => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const path1 = "M 130.9 132.4 L 115.4 132.4 L 113.6 131.9 L 113.8 127.4 L 118.6 125.1 L 118.4 101.8 L 113.7 99.1 L 114.0 94.4 L 131.3 94.8 L 131.3 99.0 L 126.8 101.6 L 126.9 125.1 L 131.3 127.8 L 130.9 132.4 Z";
    const path2 = "M 167.2 161.1 L 77.9 161.1 L 77.2 160.4 L 77.6 159.1 L 77.1 159.6 L 77.1 159.0 L 78.4 158.2 L 167.4 158.3 L 167.9 158.9 L 167.9 160.4 L 167.2 161.1 Z";

    const paths = containerRef.current.querySelectorAll('.teil1, .teil2');
    if (paths.length === 0) return;

    // Pfad-Daten und Deckkraft setzen
    gsap.set(containerRef.current.querySelectorAll('.teil1'), {
      attr: { d: path1 },
      opacity: (i) => 1 - i * 0.33
    });
    gsap.set(containerRef.current.querySelectorAll('.teil2'), {
      attr: { d: path2 },
      opacity: (i) => 1 - i * 0.33
    });

    // Get path lengths and set up stroke-dasharray
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    // Timeline die mit Scroll gesteuert wird
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 65%', // Startet bei 65% (leicht später als vorher)
        end: 'top -35%', // Balancierter Scroll-Bereich für optimales Timing
        scrub: 1,
        // markers: true, // Für Debugging
      }
    });

    // Die Animation:
    // 1. Die Linien wachsen von 0 auf 100%
    tl.to(paths, {
      strokeDashoffset: 0,
      ease: 'power3.inOut',
      stagger: 0.05
    })
    // 2. Pause: Icon bleibt vollständig sichtbar
    .to({}, { duration: 0.8 })
    // 3. Die Linien verschwinden nach hinten weg
    .to(paths, {
      strokeDashoffset: (i, target) => -target.getTotalLength(),
      ease: 'circ.inOut',
      stagger: 0.05
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.loadingContainer}>
      <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={styles.svg}>
        <g fill="none" stroke="#fff" strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="butt">
          {/* Pfad 1 (Oben) - 3x für den Geistereffekt */}
          <path className="teil1" d=""/>
          <path className="teil1" d=""/>
          <path className="teil1" d=""/>

          {/* Pfad 2 (Unten) - 3x für den Geistereffekt */}
          <path className="teil2" d=""/>
          <path className="teil2" d=""/>
          <path className="teil2" d=""/>
        </g>
      </svg>
    </div>
  );
};

export default InterfaceLoadingScreen;
