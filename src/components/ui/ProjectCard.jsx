import { FaArrowRight } from 'react-icons/fa';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ project }) => {
  const handleClick = () => {
    if (project.live) {
      window.open(project.live, '_blank');
    } else if (project.github) {
      window.open(project.github, '_blank');
    }
  };

  return (
    <article className={styles.card} onClick={handleClick}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <h3 className={styles.title}>{project.title}</h3>
          <FaArrowRight className={styles.arrow} />
        </div>
        <span className={styles.year}>{project.year || '2024'}</span>
      </div>

      <p className={styles.description}>{project.description}</p>

      <div className={styles.tags}>
        {project.technologies.map((tech) => (
          <span key={tech} className={styles.tag}>
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
};

export default ProjectCard;
