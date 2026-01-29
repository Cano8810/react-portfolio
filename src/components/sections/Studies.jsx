import { useLanguage } from '../../context/LanguageContext';
import styles from './Studies.module.css';

const Studies = () => {
  const { t } = useLanguage();

  const education = [
    {
      id: 1,
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      fieldDe: 'Informatik',
      fieldTr: 'Bilgisayar Mühendisliği',
      institution: 'Technical University',
      year: '2020 - 2024',
      description: 'Focus on web development, software engineering, and user experience design.',
      descriptionDe: 'Schwerpunkt auf Webentwicklung, Software Engineering und User Experience Design.',
      descriptionTr: 'Web geliştirme, yazılım mühendisliği ve kullanıcı deneyimi tasarımına odaklanma.',
    },
    {
      id: 2,
      degree: 'High School Diploma',
      field: 'Mathematics & Science',
      fieldDe: 'Mathematik & Naturwissenschaften',
      fieldTr: 'Matematik & Fen Bilimleri',
      institution: 'Gymnasium',
      year: '2012 - 2020',
      description: 'Strong foundation in analytical thinking and problem-solving.',
      descriptionDe: 'Starke Grundlage in analytischem Denken und Problemlösung.',
      descriptionTr: 'Analitik düşünme ve problem çözmede güçlü temel.',
    },
  ];

  const certifications = [
    {
      id: 1,
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      year: '2023',
    },
    {
      id: 2,
      name: 'React Professional Certificate',
      issuer: 'Meta',
      year: '2023',
    },
    {
      id: 3,
      name: 'Google UX Design',
      issuer: 'Google',
      year: '2022',
    },
  ];

  return (
    <section id="studies" className={styles.studies}>
      <div className="container">
        <h2 className={styles.sectionTitle}>{t('studiesTitle')}</h2>
        <p className={styles.sectionDescription}>{t('studiesSubtitle')}</p>

        <div className={styles.content}>
          {/* Education */}
          <div className={styles.educationSection}>
            <h3 className={styles.categoryTitle}>{t('education')}</h3>
            <div className={styles.timeline}>
              {education.map((edu) => (
                <div key={edu.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <span className={styles.year}>{edu.year}</span>
                    <h4 className={styles.degree}>{edu.degree}</h4>
                    <p className={styles.field}>
                      {t('language') === 'Sprache' ? edu.fieldDe :
                       t('language') === 'Dil' ? edu.fieldTr : edu.field}
                    </p>
                    <p className={styles.institution}>{edu.institution}</p>
                    <p className={styles.description}>
                      {t('language') === 'Sprache' ? edu.descriptionDe :
                       t('language') === 'Dil' ? edu.descriptionTr : edu.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className={styles.certificationsSection}>
            <h3 className={styles.categoryTitle}>{t('certifications')}</h3>
            <div className={styles.certGrid}>
              {certifications.map((cert) => (
                <div key={cert.id} className={styles.certCard}>
                  <div className={styles.certIcon}>🏆</div>
                  <h4 className={styles.certName}>{cert.name}</h4>
                  <p className={styles.certIssuer}>{cert.issuer}</p>
                  <span className={styles.certYear}>{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Studies;
