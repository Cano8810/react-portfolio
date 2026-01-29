import { content } from '../../data/content';
import { useLanguage } from '../../context/LanguageContext';
import styles from './About.module.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <h2 className={styles.sectionTitle}>{t('aboutTitle')}</h2>

        <div className={styles.content}>
          <div className={styles.text}>
            <p>{t('aboutText1')}</p>
            <p>{t('aboutText2')}</p>
          </div>

          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <h3>{content.about.highlights[0]?.value || '3+'}</h3>
              <p>{t('yearsExperience')}</p>
            </div>
            <div className={styles.highlight}>
              <h3>{content.about.highlights[1]?.value || '20+'}</h3>
              <p>{t('projectsCompleted')}</p>
            </div>
            <div className={styles.highlight}>
              <h3>{content.about.highlights[2]?.value || '15+'}</h3>
              <p>{t('technologiesMastered')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
