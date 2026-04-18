import { useNavigate } from 'react-router-dom';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import { useAuth } from '../hooks/useAuth';
import { useLeaderboard } from '../hooks/useLeaderboard';
import styles from './LeaderboardPage.module.css';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { scores, loading, error, refresh } = useLeaderboard();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span
          className={styles.brand}
          role="button"
          tabIndex={0}
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
          onKeyDown={(e) => e.key === 'Enter' && navigate(isAuthenticated ? '/dashboard' : '/')}
        >
          PokeVene
        </span>
        <nav className={styles.nav}>
          <button
            type="button"
            className={styles.navLink}
            onClick={() => navigate('/game')}
          >
            🎮 Jugar
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>🏆 Tabla de Posiciones</h1>
            <button
              id="btn-refresh-leaderboard"
              type="button"
              className={styles.refreshButton}
              onClick={refresh}
              disabled={loading}
            >
              {loading ? 'Cargando...' : '↻ Actualizar'}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <LeaderboardTable scores={scores} loading={loading} />
        </div>
      </main>
    </div>
  );
}
