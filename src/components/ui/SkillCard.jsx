import styles from './SkillCard.module.css';

const SkillCard = ({ skill }) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{skill.icon}</div>
      <h4 className={styles.name}>{skill.name}</h4>
      {skill.level && (
        <div className={styles.levelBar}>
          <div
            className={styles.levelFill}
            style={{ width: `${skill.level}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default SkillCard;
