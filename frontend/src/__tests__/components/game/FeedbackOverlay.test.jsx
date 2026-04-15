import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FeedbackOverlay from '../../../components/game/FeedbackOverlay';

describe('FeedbackOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows correct message when isCorrect is true', () => {
    // Arrange + Act
    render(<FeedbackOverlay isCorrect correctAnswer="pokemon" visible />);

    // Assert
    expect(screen.getByText(/¡correcto!/i)).toBeInTheDocument();
  });

  it('shows incorrect message when isCorrect is false', () => {
    // Arrange + Act
    render(<FeedbackOverlay isCorrect={false} correctAnswer="venezolano" visible />);

    // Assert
    expect(screen.getByText(/incorrecto/i)).toBeInTheDocument();
  });

  it('displays correct answer text when answer is wrong', () => {
    // Arrange + Act
    render(<FeedbackOverlay isCorrect={false} correctAnswer="venezolano" visible />);

    // Assert
    expect(screen.getByText(/la respuesta era:/i)).toBeInTheDocument();
    expect(screen.getByText(/venezolano/i)).toBeInTheDocument();
  });

  it('renders nothing when visible is false', () => {
    // Arrange + Act
    render(<FeedbackOverlay isCorrect correctAnswer="pokemon" visible={false} />);

    // Assert
    expect(screen.queryByText(/¡correcto!/i)).not.toBeInTheDocument();
  });
});
