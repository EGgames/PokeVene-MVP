import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import HomePage from '../../pages/HomePage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders PokeVene title when page loads', () => {
    // Arrange + Act
    render(<HomePage />);

    // Assert
    expect(screen.getByRole('heading', { name: /pokevene/i })).toBeInTheDocument();
  });

  it('renders login register and guest play buttons when page loads', () => {
    // Arrange + Act
    render(<HomePage />);

    // Assert
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /jugar como invitado/i })).toBeInTheDocument();
  });

  it('navigates to login when login button is clicked', () => {
    // Arrange
    render(<HomePage />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to register when register button is clicked', () => {
    // Arrange
    render(<HomePage />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('navigates to game when guest button is clicked', () => {
    // Arrange
    render(<HomePage />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: /jugar como invitado/i }));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/game');
  });
});
