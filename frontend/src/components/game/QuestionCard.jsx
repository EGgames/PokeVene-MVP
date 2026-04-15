import styles from './QuestionCard.module.css';

/**
 * Tarjeta de pregunta con el término y los dos botones de respuesta.
 * @param {{ term: {id: string, text: string, category: string}, questionNumber: number, totalQuestions: number, onAnswer: Function, disabled: boolean }} props
 */
export default function QuestionCard({ term, questionNumber, totalQuestions, onAnswer, disabled }) {
  return (
    <div className={styles.card}>
      <p className={styles.progress} data-testid="question-counter">
        Pregunta {questionNumber} de {totalQuestions}
      </p>
      <div className={styles.termContainer}>
        <h2 className={styles.term} data-testid="term-text">{term?.text}</h2>
      </div>
      <div className={styles.buttons}>
        <button
          id="btn-pokemon"
          type="button"
          className={`${styles.button} ${styles.pokemonButton}`}
          onClick={() => onAnswer('pokemon')}
          disabled={disabled}
        >
          <span className={styles.buttonIcon}>🎮</span>
          <span>Pokémon</span>
        </button>
        <button
          id="btn-venezolano"
          type="button"
          className={`${styles.button} ${styles.venezolanoButton}`}
          onClick={() => onAnswer('venezolano')}
          disabled={disabled}
        >
          <span className={styles.buttonIcon}>🌟</span>
          <span>Venezolano</span>
        </button>
      </div>
    </div>
  );
}
