import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackOverlay from '../components/game/FeedbackOverlay';
import ProgressBar from '../components/game/ProgressBar';
import QuestionCard from '../components/game/QuestionCard';
import { useAuth } from '../hooks/useAuth';
import { useGameState } from '../hooks/useGameState';
import styles from './GamePage.module.css';

export default function GamePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    currentIndex,
    correctCount,
    gameStatus,
    lastAnswerCorrect,
    lastCorrectAnswer,
    currentTerm,
    terms,
    startGame,
    submitAnswer,
    getScore,
  } = useGameState();

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (gameStatus === 'finished') {
      const score = getScore();
      navigate('/game-result', { state: { score } });
    }
  }, [gameStatus, getScore, navigate]);

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <div className={styles.page}>
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
        {isAuthenticated ? (
          <div className={styles.userInfo}>
            <span className={styles.username}>Hola, {user?.username}</span>
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.loginButton}
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </button>
        )}
      </header>

      <main className={styles.main}>
        {gameStatus === 'loading' && (
          <div data-testid="game-loading" className={styles.stateMessage}>Cargando términos...</div>
        )}

        {gameStatus === 'error' && (
          <div className={styles.stateMessage}>
            <p>Error al cargar el juego.</p>
            <button type="button" className={styles.retryBtn} onClick={startGame}>
              Reintentar
            </button>
          </div>
        )}

        {(gameStatus === 'playing' || gameStatus === 'feedback') && currentTerm && (
          <div data-testid="game-container" className={styles.gameArea}>
            <ProgressBar
              current={currentIndex}
              total={terms.length}
              correctCount={correctCount}
            />
            <div className={styles.cardWrapper}>
              <QuestionCard
                term={currentTerm}
                questionNumber={currentIndex + 1}
                totalQuestions={terms.length}
                onAnswer={submitAnswer}
                disabled={gameStatus === 'feedback'}
              />
              <FeedbackOverlay
                isCorrect={lastAnswerCorrect}
                correctAnswer={lastCorrectAnswer}
                visible={gameStatus === 'feedback'}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
