import SkillCard from '../ui/SkillCard';
import { skills } from '../../data/skills';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Skills.module.css';

const Skills = () => {
  const { t } = useLanguage();

  // Map category names to translation keys
  const categoryTranslations = {
    'Frontend': 'frontend',
    'Backend': 'backend',
    'Tools & Others': 'tools',
    'Tools & Sonstiges': 'tools',
  };

  return (
    <section id="skills" className={styles.skills}>
      <div className="container">
        <h2 className={styles.sectionTitle}>{t('skillsTitle')}</h2>
        <p className={styles.sectionDescription}>
          {t('skillsSubtitle')}
        </p>

        <div className={styles.categories}>
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className={styles.category}>
              <h3 className={styles.categoryTitle}>
                {t(categoryTranslations[category]) || category}
              </h3>
              <div className={styles.grid}>
                {items.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
