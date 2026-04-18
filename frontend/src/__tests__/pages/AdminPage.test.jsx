import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from '../../pages/AdminPage';
import { useAdmin } from '../../hooks/useAdmin';

vi.mock('../../hooks/useAdmin', () => ({
  useAdmin: vi.fn(),
}));

vi.mock('../../components/admin/UserTable', () => ({
  default: () => <div data-testid="users-section">users-section</div>,
}));

vi.mock('../../components/admin/TermManager', () => ({
  default: () => <div data-testid="terms-section">terms-section</div>,
}));

vi.mock('../../components/admin/SuggestionReview', () => ({
  default: () => <div data-testid="suggestions-section">suggestions-section</div>,
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AdminPage', () => {
  const baseAdminHook = {
    users: [],
    suggestions: [],
    settings: { suggestion_level_threshold: 10 },
    loading: false,
    error: null,
    fetchUsers: vi.fn(),
    banUser: vi.fn(),
    unbanUser: vi.fn(),
    updateRole: vi.fn(),
    fetchSuggestions: vi.fn(),
    reviewSuggestion: vi.fn(),
    fetchSettings: vi.fn(),
    updateSettings: vi.fn(),
    addTerm: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useAdmin.mockReturnValue(baseAdminHook);
  });

  it('should render admin page with tabs and users tab by default', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Panel de Administración')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-users')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-terms')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-suggestions')).toBeInTheDocument();
    expect(screen.getByTestId('users-section')).toBeInTheDocument();

    await waitFor(() => {
      expect(baseAdminHook.fetchUsers).toHaveBeenCalledTimes(1);
      expect(baseAdminHook.fetchSettings).toHaveBeenCalledTimes(1);
    });
  });

  it('should switch between terms and suggestions sections when tabs are clicked', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('admin-tab-terms'));
    expect(screen.getByTestId('terms-section')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('admin-tab-suggestions'));
    expect(screen.getByTestId('suggestions-section')).toBeInTheDocument();

    await waitFor(() => {
      expect(baseAdminHook.fetchSuggestions).toHaveBeenCalledTimes(1);
    });
  });
});
