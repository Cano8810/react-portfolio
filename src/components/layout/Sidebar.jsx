import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiUser, FiBook, FiFileText, FiMail, FiMenu, FiX, FiMoon, FiSun, FiSettings } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Sidebar.module.css';

// Custom Interface Studios Icon
const InterfaceStudiosIcon = ({ size = 20, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="70 88 105 80"
    width={size}
    height={size}
    className={className}
    style={{ minWidth: size }}
  >
    <path fill="currentColor" d="M 130.9 132.4 L 115.4 132.4 L 113.6 131.9 L 113.8 127.4 L 118.6 125.1 L 118.4 101.8 L 113.7 99.1 L 114.0 94.4 L 131.3 94.8 L 131.3 99.0 L 126.8 101.6 L 126.9 125.1 L 131.3 127.8 L 130.9 132.4 Z"/>
    <path fill="currentColor" d="M 167.2 161.1 L 77.9 161.1 L 77.2 160.4 L 77.6 159.1 L 77.1 159.6 L 77.1 159.0 L 78.4 158.2 L 167.4 158.3 L 167.9 158.9 L 167.9 160.4 L 167.2 161.1 Z"/>
  </svg>
);

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const links = [
    { label: t('about'), href: '#about', icon: FiUser },
    { label: t('work'), href: '#projects', icon: FiBriefcase },
    { label: t('studies'), href: '#studies', icon: FiBook },
    { label: t('interfaceStudios'), href: '#interface-studios', icon: InterfaceStudiosIcon },
    { label: t('resume'), href: '#resume', icon: FiFileText },
    { label: t('contact'), href: '#contact', icon: FiMail },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        className={styles.sidebar}
        initial={false}
        animate={{
          width: isOpen ? 280 : 60,
          x: 0,
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className={styles.sidebarContent}>
          {/* Logo / Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>C</div>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  className={styles.brandText}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Portfolio
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <div className={styles.links}>
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={styles.link}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  title={link.label}
                >
                  <Icon className={styles.linkIcon} size={20} />
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        className={styles.linkText}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              );
            })}
          </div>

          {/* Settings Section */}
          <div className={styles.settingsSection}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={styles.settingsButton}
              aria-label="Settings"
              title={t('settings')}
            >
              <FiSettings className={`${styles.linkIcon} ${showSettings ? styles.rotating : ''}`} size={20} />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    className={styles.linkText}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t('settings')}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {showSettings && isOpen && (
                <motion.div
                  className={styles.settingsPanel}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Theme Toggle */}
                  <div className={styles.settingItem}>
                    <div className={styles.themeToggleGroup}>
                      <button
                        onClick={() => theme !== 'light' && toggleTheme()}
                        className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
                      >
                        <FiSun size={16} />
                        <span>{t('lightMode')}</span>
                      </button>
                      <button
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
                      >
                        <FiMoon size={16} />
                        <span>{t('darkMode')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div className={styles.settingItem}>
                    <div className={styles.languageList}>
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`${styles.languageOption} ${language === lang.code ? styles.active : ''}`}
                        >
                          <span className={styles.flag}>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Sidebar;
