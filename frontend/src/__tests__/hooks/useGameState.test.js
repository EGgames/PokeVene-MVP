import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useGameState } from '../../hooks/useGameState';
import { getRandomTerms } from '../../services/gameService';

vi.mock('../../services/gameService', () => ({
  getRandomTerms: vi.fn(),
}));

function makeTerms(total = 10) {
  return Array.from({ length: total }).map((_, index) => ({
    id: String(index + 1),
    text: `Term ${index + 1}`,
    category: index % 2 === 0 ? 'pokemon' : 'venezolano',
  }));
}

describe('useGameState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches terms and switches to playing when startGame succeeds', async () => {
    // Arrange
    const terms = makeTerms(10);
    getRandomTerms.mockResolvedValue(terms);

    // Act
    const { result } = renderHook(() => useGameState());
    await act(async () => {
      await result.current.startGame();
    });

    // Assert
    expect(getRandomTerms).toHaveBeenCalledWith(10);
    expect(result.current.terms).toEqual(terms);
    expect(result.current.gameStatus).toBe('playing');
  });

  it('increments correctCount when submitAnswer receives correct option', async () => {
    // Arrange
    const terms = makeTerms(2);
    getRandomTerms.mockResolvedValue(terms);
    const { result } = renderHook(() => useGameState());
    await act(async () => {
      await result.current.startGame();
    });

    // Act
    act(() => {
      result.current.submitAnswer('pokemon');
    });

    // Assert
    expect(result.current.correctCount).toBe(1);
    expect(result.current.lastAnswerCorrect).toBe(true);
  });

  it('does not increment correctCount when submitAnswer receives wrong option', async () => {
    // Arrange
    const terms = makeTerms(2);
    getRandomTerms.mockResolvedValue(terms);
    const { result } = renderHook(() => useGameState());
    await act(async () => {
      await result.current.startGame();
    });

    // Act
    act(() => {
      result.current.submitAnswer('venezolano');
    });

    // Assert
    expect(result.current.correctCount).toBe(0);
    expect(result.current.lastAnswerCorrect).toBe(false);
  });

  it('advances to next question after feedback timeout', async () => {
    // Arrange
    const terms = makeTerms(2);
    getRandomTerms.mockResolvedValue(terms);
    const { result } = renderHook(() => useGameState());
    await act(async () => {
      await result.current.startGame();
    });

    // Act
    act(() => {
      result.current.submitAnswer('pokemon');
    });
    expect(result.current.gameStatus).toBe('feedback');

    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Assert
    expect(result.current.gameStatus).toBe('playing');
    expect(result.current.currentIndex).toBe(1);
  });

  it('calculates score percentage correctly when getScore is called', async () => {
    // Arrange
    const terms = makeTerms(10);
    getRandomTerms.mockResolvedValue(terms);
    const { result } = renderHook(() => useGameState());
    await act(async () => {
      await result.current.startGame();
    });

    // Act
    for (let i = 0; i < 7; i += 1) {
      act(() => {
        const answer = result.current.currentTerm.category;
        result.current.submitAnswer(answer);
      });
      act(() => {
        vi.runOnlyPendingTimers();
      });
    }
    for (let i = 0; i < 3; i += 1) {
      act(() => {
        const wrong = result.current.currentTerm.category === 'pokemon' ? 'venezolano' : 'pokemon';
        result.current.submitAnswer(wrong);
      });
      act(() => {
        vi.runOnlyPendingTimers();
      });
    }

    const score = result.current.getScore();

    // Assert
    expect(score.percentage).toBe(70);
    expect(score.correct).toBe(7);
    expect(score.total).toBe(10);
  });

  it('returns won true when score percentage is above threshold', async () => {
    // Arrange
    const terms = makeTerms(10);
    getRandomTerms.mockResolvedValue(terms);
    const { result } = renderHook(() => useGameState());
    await act(async () => {
      await result.current.startGame();
    });

    // Act
    for (let i = 0; i < 7; i += 1) {
      act(() => {
        result.current.submitAnswer(result.current.currentTerm.category);
      });
      act(() => {
        vi.runOnlyPendingTimers();
      });
    }
    for (let i = 0; i < 3; i += 1) {
      act(() => {
        const wrong = result.current.currentTerm.category === 'pokemon' ? 'venezolano' : 'pokemon';
        result.current.submitAnswer(wrong);
      });
      act(() => {
        vi.runOnlyPendingTimers();
      });
    }

    const score = result.current.getScore();

    // Assert
    expect(score.won).toBe(true);
  });

  it('switches to finished status when all questions are answered', async () => {
    // Arrange
    const terms = [{ id: '1', text: 'Pikachu', category: 'pokemon' }];
    getRandomTerms.mockResolvedValue(terms);
    const { result } = renderHook(() => useGameState());
    await act(async () => {
      await result.current.startGame();
    });

    // Act
    act(() => {
      result.current.submitAnswer('pokemon');
    });
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Assert
    expect(result.current.gameStatus).toBe('finished');
  });
});
