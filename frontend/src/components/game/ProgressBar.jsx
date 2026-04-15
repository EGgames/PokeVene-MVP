import styles from './ProgressBar.module.css';

/**
 * Barra visual de progreso de la partida.
 * @param {{ current: number, total: number, correctCount: number }} props
 */
export default function ProgressBar({ current, total, correctCount }) {
  const progressPercent = total > 0 ? (current / total) * 100 : 0;
  const incorrectCount = current - correctCount;

  return (
    <div data-testid="progress-bar" className={styles.container}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
      <div className={styles.stats}>
        <span data-testid="correct-count" className={styles.correct}>✓ {correctCount}</span>
        <span className={styles.counter}>{current} / {total}</span>
        <span className={styles.incorrect}>✗ {incorrectCount}</span>
      </div>
    </div>
  );
}
