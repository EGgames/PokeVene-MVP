import { useState, useCallback } from 'react';
import { getRandomTerms } from '../services/gameService';

/**
 * Gestiona el estado completo de una partida.
 * gameStatus: 'loading' | 'playing' | 'feedback' | 'finished' | 'error'
 */
export function useGameState() {
  const [terms, setTerms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [gameStatus, setGameStatus] = useState('loading');
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState(null);

  const startGame = useCallback(async () => {
    setGameStatus('loading');
    setCurrentIndex(0);
    setCorrectCount(0);
    setAnswers([]);
    setLastAnswerCorrect(false);
    setLastCorrectAnswer(null);

    try {
      const fetchedTerms = await getRandomTerms(10);
      setTerms(fetchedTerms);
      setGameStatus('playing');
    } catch {
      setGameStatus('error');
    }
  }, []);

  const submitAnswer = useCallback(
    (answer) => {
      if (gameStatus !== 'playing') return;

      const currentTerm = terms[currentIndex];
      const isCorrect = answer === currentTerm.category;
      const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;

      setLastAnswerCorrect(isCorrect);
      setLastCorrectAnswer(currentTerm.category);
      setCorrectCount(newCorrectCount);
      setAnswers((prev) => [
        ...prev,
        {
          termId: currentTerm.id,
          userAnswer: answer,
          correctAnswer: currentTerm.category,
          isCorrect,
        },
      ]);
      setGameStatus('feedback');

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= terms.length) {
          setGameStatus('finished');
        } else {
          setCurrentIndex(nextIndex);
          setGameStatus('playing');
        }
      }, 1500);
    },
    [gameStatus, terms, currentIndex, correctCount]
  );

  /**
   * Calcula el resultado de la partida actual.
   * Condición de victoria: percentage > 50 + (100 / total)
   * Para 10 preguntas: necesita > 60% → 6+ correctas.
   */
  const getScore = useCallback(() => {
    const total = terms.length;
    const correct = correctCount;
    const percentage = total > 0 ? (correct / total) * 100 : 0;
    const winThreshold = 50 + 100 / total;
    const won = percentage > winThreshold;

    return { percentage, correct, total, won };
  }, [terms, correctCount]);

  return {
    terms,
    currentIndex,
    correctCount,
    answers,
    gameStatus,
    lastAnswerCorrect,
    lastCorrectAnswer,
    currentTerm: terms[currentIndex] || null,
    startGame,
    submitAnswer,
    getScore,
  };
}
