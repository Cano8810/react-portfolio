import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { useLanguage } from '../../context/LanguageContext';
import styles from './StudiesIntro.module.css';

gsap.registerPlugin(ScrollTrigger);

const CampusScene = lazy(() => import('../ui/CampusScene'));

const StudiesIntro = () => {
  const { t } = useLanguage();
  const wrapperRef = useRef(null);
  const titleRef = useRef(null);
  const progressRef = useRef(0);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP ScrollTrigger for rotation progress
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => trigger.kill();
  }, []);

  // GSAP title blur-in animation
  useEffect(() => {
    const el = wrapperRef.current;
    const title = titleRef.current;
    if (!el || !title) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: '60% bottom',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // Phase 1: Blur-in (0% → 50% of timeline)
    tl.fromTo(
      title,
      { filter: 'blur(10px)', opacity: 0, y: 30 },
      { filter: 'blur(0px)', opacity: 1, y: 0, ease: 'power2.out', duration: 0.5 }
    );

    // Phase 2: Swipe up (50% → 100% of timeline)
    tl.to(title, {
      y: -120,
      opacity: 0,
      ease: 'power2.in',
      duration: 0.5,
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.introWrapper}>
      <div className={styles.stickyContainer}>
        {!isMobile ? (
          <div className={styles.canvasContainer}>
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [0, 3, 18], fov: 35 }}
                dpr={[1, 2]}
                gl={{
                  alpha: true,
                  antialias: true,
                  powerPreference: 'high-performance',
                }}
                onCreated={({ gl }) => {
                  gl.setClearColor(new THREE.Color(0x000000), 0);
                  gl.toneMapping = THREE.NoToneMapping;
                  gl.outputColorSpace = THREE.SRGBColorSpace;
                }}
              >
                <CampusScene progressRef={progressRef} />
              </Canvas>
            </Suspense>
          </div>
        ) : (
          <div className={styles.mobileFallback}>
            <div className={styles.mobileIcon}>🏛️</div>
          </div>
        )}

        <div className={styles.titleContainer}>
          <h2 ref={titleRef} className={styles.introTitle}>
            {t('studiesIntroTitle')}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StudiesIntro;
