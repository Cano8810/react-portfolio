import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './AboutSection.module.css';

// ============================================
// DATA - Edit your content here
// ============================================

const aboutData = {
  work: {
    header: { left: 'Chronik', center: 'Designer', right: 'Gegenwärtig' },
    items: [
      { name: 'Interface Studios', role: 'Web Designer', period: '2024–Present' },
      { name: 'HAW Hamburg', role: 'Maschinenbau Student', period: '2021–Present' },
      { name: 'Freelance', role: 'Frontend Entwickler', period: '2020–21' },
    ],
  },

  online: [
    { name: 'can.yildiz@email.de', action: 'E-Mail', url: 'mailto:can.yildiz@email.de' },
    { name: 'Twitter', action: 'Folgen', url: 'https://twitter.com/canyildiz' },
    { name: 'Instagram', action: 'Folgen', url: 'https://instagram.com/canyildiz' },
    { name: 'LinkedIn', action: 'Folgen', url: 'https://linkedin.com/in/canyildiz' },
  ],

  where: {
    videoSrc: '/videos/about-loop.mp4',
    location: 'Hamburg, Deutschland',
  },

  extras: [
    { name: 'Lebenslauf', action: 'Link', url: '/documents/resume.pdf' },
    { name: 'Portfolio-Broschüre', action: 'Link', url: '/documents/portfolio.pdf' },
  ],
};

// ============================================
// ROW COMPONENT - Text + Fill Line + Action
// ============================================

const TableRow = ({ left, center, right, rightAction, href, isHeader }) => {
  const content = (
    <div className={`${styles.row} ${isHeader ? styles.rowHeader : ''}`}>
      <span className={styles.rowLeft}>{left}</span>
      {center && <span className={styles.rowCenter}>{center}</span>}
      <span className={styles.rowLine} />
      <span className={`${styles.rowRight} ${rightAction ? styles.rowAction : ''}`}>
        {right}
        {rightAction && (
          <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        )}
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} className={styles.rowLink} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return content;
};

// ============================================
// MAIN COMPONENT
// ============================================

const AboutSection = () => {
  const { t, language } = useLanguage();
  const [videoError, setVideoError] = useState(false);

  // Labels based on language
  const labels = {
    work: language === 'de' ? 'Arbeiten' : language === 'tr' ? 'Kariyer' : 'Work',
    online: 'Online',
    where: language === 'de' ? 'Wo' : language === 'tr' ? 'Nerede' : 'Where',
    extras: 'Extras',
  };

  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>

        {/* BLOCK 1: Work */}
        <div className={styles.block}>
          <div className={styles.label}>{labels.work}</div>
          <div className={styles.content}>
            {/* Header row */}
            <TableRow
              left={`✦ ${aboutData.work.header.left}`}
              right={aboutData.work.header.center}
              rightAction={false}
              isHeader={true}
            />
            {/* Work items */}
            {aboutData.work.items.map((item, i) => (
              <TableRow
                key={i}
                left={item.name}
                center={item.role}
                right={item.period}
                rightAction={false}
              />
            ))}
          </div>
        </div>

        {/* BLOCK 2: Online */}
        <div className={styles.block}>
          <div className={styles.label}>{labels.online}</div>
          <div className={styles.content}>
            {aboutData.online.map((item, i) => (
              <TableRow
                key={i}
                left={item.name}
                right={item.action}
                rightAction={true}
                href={item.url}
              />
            ))}
          </div>
        </div>

        {/* BLOCK 3: Where */}
        <div className={styles.block}>
          <div className={styles.label}>{labels.where}</div>
          <div className={styles.content}>
            <div className={styles.mediaWrapper}>
              <div className={styles.mediaContainer}>
                {!videoError ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={styles.media}
                    onError={() => setVideoError(true)}
                  >
                    <source src={aboutData.where.videoSrc} type="video/mp4" />
                  </video>
                ) : (
                  <div className={styles.mediaPlaceholder}>
                    <span>Video</span>
                  </div>
                )}
              </div>
              <div className={styles.location}>{aboutData.where.location}</div>
            </div>
          </div>
        </div>

        {/* BLOCK 4: Extras */}
        <div className={styles.block}>
          <div className={styles.label}>{labels.extras}</div>
          <div className={styles.content}>
            {aboutData.extras.map((item, i) => (
              <TableRow
                key={i}
                left={item.name}
                right={item.action}
                rightAction={true}
                href={item.url}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
