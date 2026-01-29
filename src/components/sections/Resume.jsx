import { FiDownload, FiBriefcase, FiAward, FiCode } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Resume.module.css';

const Resume = () => {
  const { t } = useLanguage();

  const experience = [
    {
      id: 1,
      role: 'Senior Frontend Developer',
      company: 'Tech Company GmbH',
      period: '2022 - Present',
      periodDe: '2022 - Heute',
      periodTr: '2022 - Günümüz',
      tasks: [
        'Led development of customer-facing web applications',
        'Implemented design systems and component libraries',
        'Mentored junior developers',
      ],
      tasksDe: [
        'Leitung der Entwicklung kundenorientierter Webanwendungen',
        'Implementierung von Design-Systemen und Komponentenbibliotheken',
        'Mentoring von Junior-Entwicklern',
      ],
      tasksTr: [
        'Müşteri odaklı web uygulamalarının geliştirilmesine liderlik',
        'Tasarım sistemleri ve bileşen kütüphanelerinin uygulanması',
        'Junior geliştiricilere mentorluk',
      ],
    },
    {
      id: 2,
      role: 'Frontend Developer',
      company: 'Digital Agency',
      period: '2020 - 2022',
      tasks: [
        'Built responsive websites for various clients',
        'Collaborated with designers and backend teams',
        'Optimized performance and accessibility',
      ],
      tasksDe: [
        'Erstellung responsiver Websites für verschiedene Kunden',
        'Zusammenarbeit mit Designern und Backend-Teams',
        'Optimierung von Performance und Barrierefreiheit',
      ],
      tasksTr: [
        'Çeşitli müşteriler için duyarlı web siteleri oluşturma',
        'Tasarımcılar ve backend ekipleriyle işbirliği',
        'Performans ve erişilebilirlik optimizasyonu',
      ],
    },
  ];

  const skills = {
    frontend: ['React', 'Vue.js', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    backend: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'],
    tools: ['Git', 'Docker', 'AWS', 'Figma'],
  };

  return (
    <section id="resume" className={styles.resume}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>{t('resumeTitle')}</h2>
          <p className={styles.sectionDescription}>{t('resumeSubtitle')}</p>
          <a href="/resume.pdf" download className={styles.downloadButton}>
            <FiDownload />
            <span>{t('downloadResume')}</span>
          </a>
        </div>

        <div className={styles.content}>
          {/* Experience */}
          <div className={styles.experienceSection}>
            <h3 className={styles.categoryTitle}>
              <FiBriefcase />
              <span>{t('workExperience')}</span>
            </h3>

            <div className={styles.experienceList}>
              {experience.map((exp) => (
                <div key={exp.id} className={styles.experienceCard}>
                  <div className={styles.experienceHeader}>
                    <h4 className={styles.role}>{exp.role}</h4>
                    <span className={styles.period}>
                      {t('language') === 'Sprache' ? (exp.periodDe || exp.period) :
                       t('language') === 'Dil' ? (exp.periodTr || exp.period) : exp.period}
                    </span>
                  </div>
                  <p className={styles.company}>{exp.company}</p>
                  <ul className={styles.taskList}>
                    {(t('language') === 'Sprache' ? exp.tasksDe :
                      t('language') === 'Dil' ? exp.tasksTr : exp.tasks).map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Summary */}
          <div className={styles.skillsSection}>
            <h3 className={styles.categoryTitle}>
              <FiCode />
              <span>{t('technicalSkills')}</span>
            </h3>

            <div className={styles.skillsGrid}>
              <div className={styles.skillCategory}>
                <h4>{t('frontend')}</h4>
                <div className={styles.skillTags}>
                  {skills.frontend.map((skill) => (
                    <span key={skill} className={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className={styles.skillCategory}>
                <h4>{t('backend')}</h4>
                <div className={styles.skillTags}>
                  {skills.backend.map((skill) => (
                    <span key={skill} className={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className={styles.skillCategory}>
                <h4>{t('tools')}</h4>
                <div className={styles.skillTags}>
                  {skills.tools.map((skill) => (
                    <span key={skill} className={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
