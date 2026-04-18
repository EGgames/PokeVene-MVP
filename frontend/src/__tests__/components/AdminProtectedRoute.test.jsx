import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AdminProtectedRoute from '../../components/AdminProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="redirect">{to}</div>,
}));

describe('AdminProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to /dashboard when user is authenticated but not admin', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { role: 'user' },
    });

    render(
      <AdminProtectedRoute>
        <div>contenido admin</div>
      </AdminProtectedRoute>
    );

    expect(screen.getByTestId('redirect')).toHaveTextContent('/dashboard');
  });

  it('should render children when user is admin', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { role: 'admin' },
    });

    render(
      <AdminProtectedRoute>
        <div>contenido admin</div>
      </AdminProtectedRoute>
    );

    expect(screen.getByText('contenido admin')).toBeInTheDocument();
  });
});
