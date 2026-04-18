import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameResult from '../components/game/GameResult';
import { useAuth } from '../hooks/useAuth';
import { saveScore } from '../services/gameService';
import styles from './GameResultPage.module.css';

export default function GameResultPage() {
  const { isAuthenticated, token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [xpResult, setXpResult] = useState(null);

  // Recuperar score del state de navegación. Si no hay state, redirigir.
  const score = location.state?.score;

  if (!score) {
    navigate('/game', { replace: true });
    return null;
  }

  async function handleSaveScore() {
    if (!isAuthenticated) {
      // Invitado → redirigir a registro con score en state
      navigate('/register', { state: { score } });
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const result = await saveScore(score.percentage, score.total, score.correct, token);
      setScoreSaved(true);
      if (result) {
        setXpResult({
          xpGained: result.xp_gained,
          totalXp: result.total_xp,
          level: result.level,
          leveledUp: result.leveled_up,
        });
        // Actualizar el estado global del usuario con el nuevo nivel/xp
        if (typeof refreshUser === 'function') {
          refreshUser();
        }
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Error al guardar el puntaje. Inténtalo de nuevo.';
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  }

  function handleRetry() {
    navigate('/game');
  }

  function handleGoHome() {
    navigate(isAuthenticated ? '/dashboard' : '/');
  }

  function handleGoLeaderboard() {
    navigate('/leaderboard');
  }

  return (
    <div data-testid="game-result-page" className={styles.page}>
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
        <button
          type="button"
          className={styles.leaderboardLink}
          onClick={handleGoLeaderboard}
        >
          📊 Tabla de Posiciones
        </button>
      </header>

      <main className={styles.main}>
        <GameResult
          score={score}
          onSaveScore={handleSaveScore}
          onRetry={handleRetry}
          onGoHome={handleGoHome}
          onGoLeaderboard={handleGoLeaderboard}
          isAuthenticated={isAuthenticated}
          isSaving={isSaving}
          scoreSaved={scoreSaved}
        />

        {saveError && <p className={styles.error}>{saveError}</p>}
        {scoreSaved && (
          <p data-testid="save-success" className={styles.success}>¡Puntaje guardado exitosamente!</p>
        )}
        {xpResult && (
          <div data-testid="xp-result" className={styles.xpResult}>
            <p>+{xpResult.xpGained} XP ganados · Nivel {xpResult.level}</p>
            {xpResult.leveledUp && (
              <p data-testid="level-up-notification" className={styles.levelUp}>
                🎉 ¡Subiste de nivel!
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
