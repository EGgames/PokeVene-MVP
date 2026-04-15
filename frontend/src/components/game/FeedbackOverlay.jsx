import styles from './FeedbackOverlay.module.css';

/**
 * Overlay de feedback tras responder una pregunta.
 * Aparece 1.5 segundos y desaparece automáticamente.
 * @param {{ isCorrect: boolean, correctAnswer: string, visible: boolean }} props
 */
export default function FeedbackOverlay({ isCorrect, correctAnswer, visible }) {
  if (!visible) return null;

  const answerLabel = correctAnswer === 'pokemon' ? 'Pokémon' : 'Venezolano';

  return (
    <div data-testid="feedback-overlay" className={`${styles.overlay} ${isCorrect ? styles.correct : styles.incorrect}`}>
      <div className={styles.content}>
        <span className={styles.icon}>{isCorrect ? '✓' : '✗'}</span>
        <p className={styles.message} data-testid="feedback-message">{isCorrect ? '¡Correcto!' : '¡Incorrecto!'}</p>
        {!isCorrect && (
          <p className={styles.answer} data-testid="correct-answer">
            La respuesta era: <strong>{answerLabel}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
