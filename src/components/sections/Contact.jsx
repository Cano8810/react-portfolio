import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { content } from '../../data/content';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Contact.module.css';

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: t('sending') });

    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        'YOUR_PUBLIC_KEY'
      );

      setStatus({
        type: 'success',
        message: t('messageSent'),
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus({
        type: 'error',
        message: t('messageError'),
      });
    }
  };

  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <h2 className={styles.sectionTitle}>{t('contactTitle')}</h2>
        <p className={styles.sectionDescription}>
          {t('contactSubtitle')}
        </p>

        <div className={styles.content}>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <FaEnvelope className={styles.infoIcon} />
              <div>
                <h3>{t('emailLabel')}</h3>
                <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaPhone className={styles.infoIcon} />
              <div>
                <h3>{t('basedIn')}</h3>
                <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`}>
                  {content.contact.phone}
                </a>
              </div>
            </div>

            <div className={styles.infoItem}>
              <FaMapMarkerAlt className={styles.infoIcon} />
              <div>
                <h3>{t('basedIn')}</h3>
                <p>{content.contact.location}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">{t('nameLabel')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('namePlaceholder')}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">{t('emailLabel')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('emailPlaceholder')}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">{t('messageLabel')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder={t('messagePlaceholder')}
              />
            </div>

            {status.message && (
              <div className={`${styles.status} ${styles[status.type]}`}>
                {status.message}
              </div>
            )}

            <button type="submit" className={styles.submitButton} disabled={status.type === 'loading'}>
              {status.type === 'loading' ? t('sending') : t('sendMessage')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
