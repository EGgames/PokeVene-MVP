import styles from './LeaderboardTable.module.css';

const BADGES = { 1: '🥇', 2: '🥈', 3: '🥉' };

/**
 * Tabla de clasificación pública.
 * @param {{ scores: Array, loading: boolean }} props
 */
export default function LeaderboardTable({ scores, loading }) {
  if (loading) {
    return <div data-testid="leaderboard-loading" className={styles.state}>Cargando...</div>;
  }

  if (!scores || scores.length === 0) {
    return (
      <div className={styles.state}>
        No hay puntajes registrados aún. ¡Sé el primero!
      </div>
    );
  }

  return (
    <div data-testid="leaderboard-table" className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Posición</th>
            <th className={styles.th}>Usuario</th>
            <th className={styles.th}>Puntaje</th>
            <th className={styles.th}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry) => (
            <tr
              data-testid="leaderboard-row"
              key={`${entry.user_id}-${entry.rank}`}
              className={`${styles.row} ${entry.rank <= 3 ? styles.topRow : ''}`}
            >
              <td data-testid="rank-cell" className={`${styles.td} ${styles.rankCell}`}>
                {BADGES[entry.rank] ? (
                  <span className={styles.badge}>{BADGES[entry.rank]}</span>
                ) : (
                  <span className={styles.rankNumber}>{entry.rank}</span>
                )}
              </td>
              <td data-testid="username-cell" className={`${styles.td} ${styles.usernameCell}`}>
                {entry.username}
              </td>
              <td data-testid="score-cell" className={`${styles.td} ${styles.scoreCell}`}>
                {Math.round(entry.score_percentage)}%
              </td>
              <td className={`${styles.td} ${styles.dateCell}`}>
                {new Date(entry.created_at).toLocaleDateString('es-VE')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
