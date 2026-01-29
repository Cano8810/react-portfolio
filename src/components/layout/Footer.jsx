import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';
import { content } from '../../data/content';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.social}>
            <a
              href={content.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={content.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={`mailto:${content.social.email}`}
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
