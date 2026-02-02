import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './PrivateVault.module.css';

// ============================================
// CONFIGURATION - Change your access code here
// ============================================
const ACCESS_CODE = '1234'; // Change this to your secret code

const PrivateVault = () => {
  const { language } = useLanguage();
  const [inputCode, setInputCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

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
  };

  return (
    <section id="vault" className={styles.section}>
      <div className={styles.container}>
        {!isUnlocked ? (
          // Locked State - Show Code Input
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
                  type="password"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    setError(false);
                  }}
                  placeholder={labels.placeholder}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  autoComplete="off"
                />
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
