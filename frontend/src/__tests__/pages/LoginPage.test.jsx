import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LoginPage from '../../pages/LoginPage';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
    login: mockLogin,
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders LoginForm fields when page loads', () => {
    // Arrange + Act
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it('shows link to register page when page loads', () => {
    // Arrange + Act
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByRole('link', { name: /regístrate/i })).toHaveAttribute('href', '/register');
  });
});
