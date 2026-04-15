import styles from './GameResult.module.css';

/**
 * Pantalla de resultado al finalizar una partida.
 * @param {{
 *   score: { percentage: number, correct: number, total: number, won: boolean },
 *   onSaveScore: Function,
 *   onRetry: Function,
 *   onGoHome: Function,
 *   onGoLeaderboard: Function,
 *   isAuthenticated: boolean,
 *   isSaving: boolean,
 *   scoreSaved: boolean,
 * }} props
 */
export default function GameResult({
  score,
  onSaveScore,
  onRetry,
  onGoHome,
  onGoLeaderboard,
  isAuthenticated,
  isSaving,
  scoreSaved,
}) {
  const { percentage, correct, total, won } = score;
  const errors = total - correct;

  return (
    <div className={styles.container}>
      <div data-testid="game-status" className={`${styles.statusBadge} ${won ? styles.won : styles.lost}`}>
        {won ? '¡GANASTE!' : 'Intenta de nuevo'}
      </div>

      <div data-testid="score-percentage" className={styles.percentage}>{Math.round(percentage)}%</div>

      <div className={styles.breakdown}>
        <span className={styles.correct}>✓ {correct} correctas</span>
        <span className={styles.separator}>·</span>
        <span className={styles.errors}>✗ {errors} errores</span>
      </div>

      <div className={styles.actions}>
        {won && isAuthenticated && !scoreSaved && (
          <button
            id="btn-save-score"
            type="button"
            className={styles.saveButton}
            onClick={onSaveScore}
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : '🏆 Guardar en Tabla General'}
          </button>
        )}

        {won && isAuthenticated && scoreSaved && (
          <button
            type="button"
            className={styles.leaderboardButton}
            onClick={onGoLeaderboard}
          >
            📊 Ver Tabla de Posiciones
          </button>
        )}

        {won && !isAuthenticated && (
          <button
            id="btn-register-to-save"
            type="button"
            className={styles.saveButton}
            onClick={onSaveScore}
          >
            👤 Crear Cuenta para Guardar
          </button>
        )}

        <button id="btn-retry" type="button" className={styles.retryButton} onClick={onRetry}>
          🔄 Jugar de Nuevo
        </button>

        <button id="btn-go-home" type="button" className={styles.homeButton} onClick={onGoHome}>
          🏠 Volver al Inicio
        </button>
      </div>
    </div>
  );
}
