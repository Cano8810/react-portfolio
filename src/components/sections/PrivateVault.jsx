import { useState, lazy, Suspense, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './PrivateVault.module.css';

const Lanyard = lazy(() => import('../ui/Lanyard'));

// ============================================
// CONFIGURATION - Change your access code here
// ============================================
const ACCESS_CODE = '1234'; // Change this to your secret code
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';

const PrivateVault = () => {
  const { language } = useLanguage();
  const [inputCode, setInputCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeClosed, setEyeClosed] = useState(false);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [scrambleText, setScrambleText] = useState(null);
  const eyeRef = useRef(null);
  const blinkTimerRef = useRef(null);
  const scrambleRef = useRef(null);

  // Labels based on language
  const labels = {
    title: language === 'de' ? 'Privater Tresor' : language === 'tr' ? 'Özel Kasa' : 'Private Vault',
    subtitle: language === 'de'
      ? 'Geben Sie den Zugangscode ein'
      : language === 'tr'
        ? 'Erişim kodunu girin'
        : 'Enter access code',
    placeholder: language === 'de' ? 'Code eingeben...' : language === 'tr' ? 'Kod girin...' : 'Enter code...',
    unlock: language === 'de' ? 'Entsperren' : language === 'tr' ? 'Kilidi Aç' : 'Unlock',
    wrongCode: language === 'de' ? 'Falscher Code' : language === 'tr' ? 'Yanlış kod' : 'Wrong code',
    welcome: language === 'de' ? 'Willkommen im Tresor' : language === 'tr' ? 'Kasaya hoş geldiniz' : 'Welcome to the Vault',
    lock: language === 'de' ? 'Sperren' : language === 'tr' ? 'Kilitle' : 'Lock',
  };

  // Blinking effect
  useEffect(() => {
    if (eyeClosed || isUnlocked) return;

    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 6000;
      blinkTimerRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          if (Math.random() > 0.5) {
            // Double blink
            setTimeout(() => {
              setIsBlinking(true);
              setTimeout(() => {
                setIsBlinking(false);
                scheduleBlink();
              }, 75);
            }, 150);
          } else {
            scheduleBlink();
          }
        }, 75);
      }, delay);
    };

    scheduleBlink();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, [eyeClosed, isUnlocked]);

  // Pointer tracking
  useEffect(() => {
    if (isUnlocked) return;

    let resetTimer;
    const onMove = (e) => {
      if (!eyeRef.current || eyeClosed) return;

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        setEyePos({ x: 0, y: 0 });
      }, 2000);

      const rect = eyeRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const maxMove = 8;
      const ratio = Math.min(dist / 200, 1);

      setEyePos({
        x: (dx / dist) * maxMove * ratio,
        y: (dy / dist) * maxMove * ratio,
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [eyeClosed, isUnlocked]);

  // Cleanup scramble on unmount
  useEffect(() => {
    return () => {
      if (scrambleRef.current) clearInterval(scrambleRef.current);
    };
  }, []);

  const togglePassword = useCallback(() => {
    if (scrambleText !== null) return;

    const newShowPassword = !showPassword;
    const newEyeClosed = !newShowPassword;
    setEyeClosed(newEyeClosed);

    if (newEyeClosed) {
      setEyePos({ x: 0, y: 0 });
    }

    if (!inputCode) {
      setShowPassword(newShowPassword);
      return;
    }

    // Scramble effect
    const val = inputCode;
    const totalSteps = 15;
    const stepDuration = 50;
    let step = 0;

    if (newShowPassword) {
      // Revealing: show text, scramble from random to actual
      setShowPassword(true);
      scrambleRef.current = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        const revealed = Math.floor(progress * val.length);
        let display = '';
        for (let i = 0; i < val.length; i++) {
          if (i < revealed) {
            display += val[i];
          } else {
            display += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }
        setScrambleText(display);
        if (step >= totalSteps) {
          clearInterval(scrambleRef.current);
          scrambleRef.current = null;
          setScrambleText(null);
        }
      }, stepDuration);
    } else {
      // Hiding: scramble from actual to random, then hide
      scrambleRef.current = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        let display = '';
        const dotsCount = Math.floor(progress * val.length);
        for (let i = 0; i < val.length; i++) {
          if (i >= val.length - dotsCount) {
            display += '•';
          } else {
            display += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }
        setScrambleText(display);
        if (step >= totalSteps) {
          clearInterval(scrambleRef.current);
          scrambleRef.current = null;
          setScrambleText(null);
          setShowPassword(false);
        }
      }, stepDuration);
    }
  }, [showPassword, inputCode, scrambleText]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputCode === ACCESS_CODE) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setInputCode('');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setInputCode('');
    setShowPassword(false);
    setEyeClosed(false);
  };

  const lidIsClosed = isBlinking || eyeClosed;

  return (
    <section id="vault" className={styles.section}>
      <div className={styles.container}>
        {!isUnlocked ? (
          // Locked State - Show Code Input
          <div className={styles.lockLayout}>
            <div className={styles.lockScreen}>
              <div className={styles.lockIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <h2 className={styles.title}>{labels.title}</h2>
              <p className={styles.subtitle}>{labels.subtitle}</p>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={`${styles.inputWrapper} ${isShaking ? styles.shake : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={scrambleText !== null ? scrambleText : inputCode}
                    onChange={(e) => {
                      if (scrambleText !== null) return;
                      setInputCode(e.target.value);
                      setError(false);
                    }}
                    readOnly={scrambleText !== null}
                    placeholder={labels.placeholder}
                    className={`${styles.input} ${error ? styles.inputError : ''}`}
                    autoComplete="off"
                  />
                  <div className={styles.eyeAnchor}>
                    <button
                      type="button"
                      className={styles.eyeClick}
                      onClick={togglePassword}
                      aria-label="Toggle password visibility"
                      aria-pressed={showPassword}
                    />
                    <div className={styles.eyeVisual}>
                      <svg
                        ref={eyeRef}
                        className={styles.eyeSvg}
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <clipPath id="vault-eye-clip">
                            <path d="M50,25 C25,25 10,50 10,50 C10,50 25,75 50,75 C75,75 90,50 90,50 C90,50 75,25 50,25 Z" />
                          </clipPath>
                        </defs>
                        {/* Pupil + glint (clipped to eye shape) */}
                        <g clipPath="url(#vault-eye-clip)">
                          <circle
                            cx={50 + eyePos.x}
                            cy={50 + eyePos.y}
                            r="12"
                            fill="currentColor"
                          />
                          <circle
                            cx={52 + eyePos.x}
                            cy={48 + eyePos.y}
                            r="4"
                            fill="var(--color-background)"
                          />
                        </g>
                        {/* Upper lid fill (covers pupil when closed) */}
                        <path
                          className={`${styles.lidUpper} ${lidIsClosed ? styles.lidClosed : ''}`}
                          d="M0 -5 L100 -5 L100 50 L90 50 Q50 30 10 50 L0 50 Z"
                          fill="var(--color-background)"
                          stroke="none"
                        />
                        {/* Lower lid fill */}
                        <path
                          d="M0 105 L100 105 L100 50 L90 50 Q50 70 10 50 L0 50 Z"
                          fill="var(--color-background)"
                          stroke="none"
                        />
                        {/* Eye outline */}
                        <path
                          d="M50,25 C25,25 10,50 10,50 C10,50 25,75 50,75 C75,75 90,50 90,50 C90,50 75,25 50,25 Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        {/* Upper lid stroke */}
                        <path
                          className={`${styles.lidUpperStroke} ${lidIsClosed ? styles.lidStrokeClosed : ''}`}
                          d="M10 50 Q50 30 90 50"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {/* Lower lid stroke */}
                        <path
                          d="M10,50 Q50,70 90,50"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {error && <p className={styles.error}>{labels.wrongCode}</p>}

                <button type="submit" className={styles.button}>
                  {labels.unlock}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>

            <div className={styles.lanyardWrapper}>
              <Suspense fallback={null}>
                <Lanyard position={[0, 0, 13]} fov={30} />
              </Suspense>
            </div>
          </div>
        ) : (
          // Unlocked State - Show Private Content
          <div className={styles.vaultContent}>
            <div className={styles.header}>
              <div className={styles.unlockedIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
              </div>
              <h2 className={styles.title}>{labels.welcome}</h2>
              <button onClick={handleLock} className={styles.lockButton}>
                {labels.lock}
              </button>
            </div>

            {/* ============================================
                PRIVATE CONTENT - Add your content here
                ============================================ */}
            <div className={styles.content}>
              <div className={styles.contentCard}>
                <h3>Private Documents</h3>
                <p>Add your private content here. This could be:</p>
                <ul>
                  <li>Private project files</li>
                  <li>Exclusive content</li>
                  <li>Personal notes</li>
                  <li>Hidden portfolio pieces</li>
                </ul>
              </div>

              <div className={styles.contentCard}>
                <h3>Secret Projects</h3>
                <p>Share work-in-progress or confidential projects with selected people.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PrivateVault;
