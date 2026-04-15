import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProtectedRoute from '../../../components/routing/ProtectedRoute';

const mockUseAuth = vi.fn();

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    // Arrange
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false });

    // Act
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={<ProtectedRoute><div>contenido privado</div></ProtectedRoute>}
          />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('contenido privado')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Arrange
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false });

    // Act
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={<ProtectedRoute><div>contenido privado</div></ProtectedRoute>}
          />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('shows loading spinner when auth status is loading', () => {
    // Arrange
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true });

    // Act
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>contenido privado</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByLabelText(/verificando sesión/i)).toBeInTheDocument();
  });
});
