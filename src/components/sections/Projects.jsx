import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../../data/projects';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const featuresRef = useRef(null);
  const imageMotionRef = useRef(null);
  const imageMotionSectionRef = useRef(null);

  // Duplicate projects for infinite loop effect
  const carouselItems = [...projects, ...projects];
  const totalItems = carouselItems.length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image motion scroll animation - exact CodePen style
      if (imageMotionRef.current) {
        gsap.set(imageMotionRef.current, { transform: 'rotateX(90deg)' });

        gsap.to(imageMotionRef.current, {
          transform: 'rotateX(0deg)',
          scrollTrigger: {
            trigger: imageMotionSectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Subtitle animation
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Features animation
      if (featuresRef.current) {
        const features = featuresRef.current.querySelectorAll(`.${styles.feature}`);
        gsap.fromTo(features,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleProjectClick = (project) => {
    if (project.live) {
      window.open(project.live, '_blank');
    } else if (project.github) {
      window.open(project.github, '_blank');
    }
  };

  return (
    <section id="projects" className={styles.projects} ref={sectionRef}>
      {/* Carousel Section */}
      <div className={styles.loopImages}>
        <div
          className={styles.carouselTrack}
          style={{ '--time': '60s', '--total': totalItems }}
        >
          {carouselItems.map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className={styles.carouselItem}
              style={{ '--i': index + 1 }}
              onClick={() => handleProjectClick(project)}
              title={project.title}
            >
              <img src={project.image} alt={project.title} />
              <div className={styles.carouselOverlay}>
                <span className={styles.carouselTitle}>{project.title}</span>
              </div>
            </div>
          ))}
        </div>
        <span className={styles.scrollDown}>
          {t('scrollDown')} <span className={styles.arrow}>↓</span>
        </span>
      </div>

      {/* Image Motion Section */}
      <div className={styles.imageMotionSection} ref={imageMotionSectionRef}>
        <div className={styles.imageMotion} ref={imageMotionRef}>
          <picture>
            <img src="https://i.postimg.cc/1ztkf4hX/moveimage.png" alt="transition" />
          </picture>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.container}>
          <h2 className={styles.title} ref={titleRef}>{t('projectsTitle')}</h2>
          <p className={styles.subtitle} ref={subtitleRef}>{t('projectsSubtitle')}</p>

          <div className={styles.textContent}>
            <p className={styles.text}>
              {t('projectsText1')}
            </p>
            <p className={styles.text}>
              {t('projectsText2')}
            </p>
          </div>

          <div className={styles.features} ref={featuresRef}>
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className={styles.feature}
                onClick={() => handleProjectClick(project)}
              >
                <h3>{project.title}</h3>
                <p>{project.description.slice(0, 100)}...</p>
                <div className={styles.techTags}>
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className={styles.techTag}>{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
