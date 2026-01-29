import { useLanguage } from '../../context/LanguageContext';
import styles from './InterfaceStudios.module.css';

const InterfaceStudios = () => {
  const { t } = useLanguage();

  const services = [
    {
      id: 1,
      icon: '🎨',
      titleKey: 'serviceDesign',
      descKey: 'serviceDesignDesc',
    },
    {
      id: 2,
      icon: '💻',
      titleKey: 'serviceDev',
      descKey: 'serviceDevDesc',
    },
    {
      id: 3,
      icon: '📱',
      titleKey: 'serviceMobile',
      descKey: 'serviceMobileDesc',
    },
    {
      id: 4,
      icon: '🚀',
      titleKey: 'serviceConsulting',
      descKey: 'serviceConsultingDesc',
    },
  ];

  const stats = [
    { value: '50+', labelKey: 'statProjects' },
    { value: '30+', labelKey: 'statClients' },
    { value: '5+', labelKey: 'statYears' },
    { value: '100%', labelKey: 'statSatisfaction' },
  ];

  return (
    <section id="interface-studios" className={styles.interfaceStudios}>
      <div className={styles.backgroundPattern} />

      <div className="container">
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◆</span>
            <span className={styles.logoText}>Interface Studios</span>
          </div>
          <h2 className={styles.title}>{t('studioTitle')}</h2>
          <p className={styles.subtitle}>{t('studioSubtitle')}</p>
        </div>

        {/* Services */}
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <span className={styles.serviceIcon}>{service.icon}</span>
              <h3 className={styles.serviceTitle}>{t(service.titleKey)}</h3>
              <p className={styles.serviceDesc}>{t(service.descKey)}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className={styles.statsBar}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{t(stat.labelKey)}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <p className={styles.ctaText}>{t('studioCta')}</p>
          <a href="#contact" className={styles.ctaButton}>
            {t('studioContact')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default InterfaceStudios;
