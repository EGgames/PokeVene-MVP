import styles from './LevelBadge.module.css';

export default function LevelBadge({ level = 0, xp = 0 }) {
  const xpInCurrentLevel = xp % 100;
  const progressPercent = Math.min(xpInCurrentLevel, 100);

  return (
    <div data-testid="level-badge" className={styles.wrapper}>
      <span className={styles.levelNumber}>Nv. {level}</span>
      <div className={styles.xpBarContainer} aria-label={`XP: ${xpInCurrentLevel} / 100`}>
        <div
          data-testid="xp-bar"
          className={styles.xpBarFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className={styles.xpLabel}>{xpInCurrentLevel} / 100 XP</span>
    </div>
  );
}
