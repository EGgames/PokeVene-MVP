import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import GameResult from '../../../components/game/GameResult';

function renderComponent(overrides = {}) {
  const props = {
    score: { percentage: 70, correct: 7, total: 10, won: true },
    onSaveScore: vi.fn(),
    onRetry: vi.fn(),
    onGoHome: vi.fn(),
    onGoLeaderboard: vi.fn(),
    isAuthenticated: true,
    isSaving: false,
    scoreSaved: false,
    ...overrides,
  };

  render(<GameResult {...props} />);
  return props;
}

describe('GameResult', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows score percentage when score is provided', () => {
    // Arrange + Act
    renderComponent();

    // Assert
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('shows won message when won is true', () => {
    // Arrange + Act
    renderComponent({ score: { percentage: 70, correct: 7, total: 10, won: true } });

    // Assert
    expect(screen.getByText(/¡ganaste!/i)).toBeInTheDocument();
  });

  it('shows retry message when won is false', () => {
    // Arrange + Act
    renderComponent({ score: { percentage: 40, correct: 4, total: 10, won: false } });

    // Assert
    expect(screen.getByText(/intenta de nuevo/i)).toBeInTheDocument();
  });

  it('shows save button when user is authenticated and won', () => {
    // Arrange + Act
    renderComponent({ isAuthenticated: true, score: { percentage: 70, correct: 7, total: 10, won: true } });

    // Assert
    expect(screen.getByRole('button', { name: /guardar en tabla general/i })).toBeInTheDocument();
  });

  it('shows register button when user is not authenticated and won', () => {
    // Arrange + Act
    renderComponent({ isAuthenticated: false, score: { percentage: 70, correct: 7, total: 10, won: true } });

    // Assert
    expect(screen.getByRole('button', { name: /crear cuenta para guardar/i })).toBeInTheDocument();
  });

  it('shows play again button always', () => {
    // Arrange + Act
    renderComponent({ score: { percentage: 40, correct: 4, total: 10, won: false } });

    // Assert
    expect(screen.getByRole('button', { name: /jugar de nuevo/i })).toBeInTheDocument();
  });

  it('calls onSaveScore when save button is clicked', () => {
    // Arrange
    const props = renderComponent();

    // Act
    fireEvent.click(screen.getByRole('button', { name: /guardar en tabla general/i }));

    // Assert
    expect(props.onSaveScore).toHaveBeenCalledTimes(1);
  });

  it('calls onRetry when retry button is clicked', () => {
    // Arrange
    const props = renderComponent();

    // Act
    fireEvent.click(screen.getByRole('button', { name: /jugar de nuevo/i }));

    // Assert
    expect(props.onRetry).toHaveBeenCalledTimes(1);
  });
});
