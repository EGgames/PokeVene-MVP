import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LevelBadge from '../components/ui/LevelBadge';
import SuggestionForm from '../components/dashboard/SuggestionForm';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { useSuggestions } from '../hooks/useSuggestions';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user, canSuggest, suggestionThreshold, loading } = useDashboard();
  const { suggestions, loading: suggestLoading, submit, refresh } = useSuggestions();

  useEffect(() => {
    if (canSuggest) {
      refresh();
    }
  }, [canSuggest, refresh]);

  if (loading) {
    return (
      <div className={styles.loadingContainer} aria-label="Cargando dashboard">
        <span className={styles.spinner} />
      </div>
    );
  }

  async function handleSuggestionSubmit(data) {
    await submit(data);
  }

  return (
    <div data-testid="dashboard-page" className={styles.page}>
      <header className={styles.header}>
        <span
          className={styles.brand}
          role="button"
          tabIndex={0}
          onClick={() => navigate('/dashboard')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard')}
        >
          PokeVene
        </span>
        <div className={styles.headerRight}>
          {user?.role === 'admin' && (
            <Link
              data-testid="admin-link"
              to="/admin"
              className={styles.adminLink}
            >
              ⚙️ Panel Admin
            </Link>
          )}
          <button
            data-testid="btn-logout"
            type="button"
            className={styles.logoutButton}
            onClick={() => { logout(); navigate('/', { replace: true }); }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.welcome}>
          <h1 className={styles.greeting}>¡Hola, {user?.username}!</h1>
          <LevelBadge level={user?.level ?? 0} xp={user?.xp ?? 0} />
        </section>

        <section className={styles.gameSection}>
          <button
            data-testid="btn-start-game"
            type="button"
            className={styles.startButton}
            onClick={() => navigate('/game')}
          >
            🎮 Comenzar Partida
          </button>
          <button
            type="button"
            className={styles.leaderboardButton}
            onClick={() => navigate('/leaderboard')}
          >
            📊 Tabla de Posiciones
          </button>
        </section>

        <section className={styles.suggestionsSection}>
          {canSuggest ? (
            <>
              <SuggestionForm
                onSubmit={handleSuggestionSubmit}
                isLoading={suggestLoading}
              />
              {suggestions.length > 0 && (
                <div className={styles.mySuggestions}>
                  <h3 className={styles.sectionTitle}>Mis Sugerencias</h3>
                  <ul className={styles.suggestionList}>
                    {suggestions.map((s) => (
                      <li key={s.id} className={styles.suggestionItem}>
                        <span className={styles.suggestionText}>{s.text}</span>
                        <span className={styles.suggestionCategory}>{s.category}</span>
                        <span
                          className={
                            s.status === 'approved'
                              ? styles.statusApproved
                              : s.status === 'rejected'
                              ? styles.statusRejected
                              : styles.statusPending
                          }
                        >
                          {s.status === 'approved'
                            ? 'Aprobado'
                            : s.status === 'rejected'
                            ? 'Rechazado'
                            : 'Pendiente'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className={styles.suggestionLocked}>
              🔒 Alcanza el nivel {suggestionThreshold} para sugerir términos
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
