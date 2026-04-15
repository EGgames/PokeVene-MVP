import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import QuestionCard from '../../../components/game/QuestionCard';

describe('QuestionCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders term text prominently when term is provided', () => {
    // Arrange
    const term = { id: '1', text: 'Charmander', category: 'pokemon' };

    // Act
    render(
      <QuestionCard
        term={term}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={vi.fn()}
        disabled={false}
      />
    );

    // Assert
    expect(screen.getByRole('heading', { name: /charmander/i })).toBeInTheDocument();
  });

  it('renders pokemon and venezolano buttons when component loads', () => {
    // Arrange + Act
    render(
      <QuestionCard
        term={{ id: '1', text: 'Charmander', category: 'pokemon' }}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={vi.fn()}
        disabled={false}
      />
    );

    // Assert
    expect(screen.getByRole('button', { name: /pokémon/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /venezolano/i })).toBeInTheDocument();
  });

  it('calls onAnswer with pokemon when pokemon button is clicked', () => {
    // Arrange
    const onAnswer = vi.fn();
    render(
      <QuestionCard
        term={{ id: '1', text: 'Charmander', category: 'pokemon' }}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={onAnswer}
        disabled={false}
      />
    );

    // Act
    fireEvent.click(screen.getByRole('button', { name: /pokémon/i }));

    // Assert
    expect(onAnswer).toHaveBeenCalledWith('pokemon');
  });

  it('calls onAnswer with venezolano when venezolano button is clicked', () => {
    // Arrange
    const onAnswer = vi.fn();
    render(
      <QuestionCard
        term={{ id: '1', text: 'Arepita', category: 'venezolano' }}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={onAnswer}
        disabled={false}
      />
    );

    // Act
    fireEvent.click(screen.getByRole('button', { name: /venezolano/i }));

    // Assert
    expect(onAnswer).toHaveBeenCalledWith('venezolano');
  });

  it('shows question progress when questionNumber and totalQuestions are provided', () => {
    // Arrange + Act
    render(
      <QuestionCard
        term={{ id: '1', text: 'Arepita', category: 'venezolano' }}
        questionNumber={3}
        totalQuestions={10}
        onAnswer={vi.fn()}
        disabled={false}
      />
    );

    // Assert
    expect(screen.getByText(/pregunta 3 de 10/i)).toBeInTheDocument();
  });

  it('disables answer buttons when disabled prop is true', () => {
    // Arrange + Act
    render(
      <QuestionCard
        term={{ id: '1', text: 'Arepita', category: 'venezolano' }}
        questionNumber={1}
        totalQuestions={10}
        onAnswer={vi.fn()}
        disabled
      />
    );

    // Assert
    expect(screen.getByRole('button', { name: /pokémon/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /venezolano/i })).toBeDisabled();
  });
});
