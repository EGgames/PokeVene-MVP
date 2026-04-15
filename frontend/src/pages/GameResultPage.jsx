import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GameResult from '../components/game/GameResult';
import { useAuth } from '../hooks/useAuth';
import { saveScore } from '../services/gameService';
import styles from './GameResultPage.module.css';

export default function GameResultPage() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

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
      await saveScore(score.percentage, score.total, score.correct, token);
      setScoreSaved(true);
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
    navigate('/');
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
          onClick={() => navigate('/')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
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
      </main>
    </div>
  );
}
