import { useState, useEffect, useMemo } from 'react';
import { content } from '../../data/content';
import LiquidEther from '../ui/LiquidEther';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Hero.module.css';

const greetings = [
  'Hallo', 'Hello', 'Bonjour', 'Hola', 'Ciao',
  'Olá', 'Привет', '你好', 'こんにちは', '안녕하세요',
  'مرحبا', 'Merhaba', 'Γειά σου', 'Hej', 'Salut'
];

const Hero = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  // Monochrome colors based on theme - testing with bright colors
  const liquidColors = useMemo(() => {
    return theme === 'dark'
      ? ['#ff00ff', '#00ffff', '#ffff00'] // Dark mode: super bright test colors
      : ['#cccccc', '#aaaaaa', '#888888']; // Light mode: visible grays for testing
  }, [theme]);

  const liquidStyle = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1
  }), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentGreeting((prev) => (prev + 1) % greetings.length);
        setIsChanging(false);
      }, 200);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Get current time in CET/CEST
    const updateTime = () => {
      const now = new Date();
      const cetTime = now.toLocaleTimeString('de-DE', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const timeElement = document.getElementById('current-time');
      if (timeElement) {
        timeElement.textContent = `${cetTime} CET`;
      }
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(timeInterval);
  }, []);

  return (
    <section id="hero" className={styles.hero}>
      <LiquidEther
        colors={liquidColors}
        mouseForce={30}
        cursorSize={100}
        isViscous={false}
        autoDemo={true}
        autoSpeed={0.3}
        autoIntensity={1.5}
        isBounce={false}
        resolution={0.3}
        style={liquidStyle}
      />
      <div className="container">
        <div className={styles.greeting}>
          <span className={`${styles.greetingText} ${isChanging ? styles.changing : ''}`}>
            {greetings[currentGreeting]}
          </span>
        </div>

        <h1 className={styles.title}>
          {t('heroStatement')}
        </h1>

        <div className={styles.subtitle}>
          <p>{t('heroDescription')}</p>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{t('basedIn')}</span>
            <span className={styles.metaValue}>{content.contact.location}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{t('localTime')}</span>
            <span className={styles.metaValue} id="current-time">--:-- CET</span>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>{t('scrollToExplore')}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
