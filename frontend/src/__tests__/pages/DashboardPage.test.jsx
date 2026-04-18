import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../../pages/DashboardPage';
import { useDashboard } from '../../hooks/useDashboard';
import { useSuggestions } from '../../hooks/useSuggestions';

vi.mock('../../hooks/useDashboard', () => ({
  useDashboard: vi.fn(),
}));

vi.mock('../../hooks/useSuggestions', () => ({
  useSuggestions: vi.fn(),
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ logout: vi.fn() }),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSuggestions.mockReturnValue({
      suggestions: [],
      loading: false,
      submit: vi.fn(),
      refresh: vi.fn(),
    });
  });

  it('should render greeting, level badge and start game button', () => {
    useDashboard.mockReturnValue({
      user: { username: 'ash', level: 5, xp: 550, role: 'user' },
      canSuggest: true,
      suggestionThreshold: 10,
      loading: false,
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('¡Hola, ash!')).toBeInTheDocument();
    expect(screen.getByTestId('level-badge')).toBeInTheDocument();
    expect(screen.getByTestId('btn-start-game')).toBeInTheDocument();
  });

  it('should show SuggestionForm when canSuggest is true', () => {
    useDashboard.mockReturnValue({
      user: { username: 'misty', level: 12, xp: 1200, role: 'user' },
      canSuggest: true,
      suggestionThreshold: 10,
      loading: false,
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('suggestion-form')).toBeInTheDocument();
  });

  it('should show locked message when canSuggest is false', () => {
    useDashboard.mockReturnValue({
      user: { username: 'brock', level: 3, xp: 320, role: 'user' },
      canSuggest: false,
      suggestionThreshold: 10,
      loading: false,
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('🔒 Alcanza el nivel 10 para sugerir términos')).toBeInTheDocument();
  });
});
