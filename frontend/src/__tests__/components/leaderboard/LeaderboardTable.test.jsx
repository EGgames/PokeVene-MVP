import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LeaderboardTable from '../../../components/leaderboard/LeaderboardTable';

const rows = [
  { rank: 1, user_id: 'u1', username: 'ash', score_percentage: 95, created_at: '2026-04-15T00:00:00Z' },
  { rank: 2, user_id: 'u2', username: 'misty', score_percentage: 90, created_at: '2026-04-14T00:00:00Z' },
  { rank: 3, user_id: 'u3', username: 'brock', score_percentage: 88, created_at: '2026-04-13T00:00:00Z' },
  { rank: 4, user_id: 'u4', username: 'gary', score_percentage: 80, created_at: '2026-04-12T00:00:00Z' },
];

describe('LeaderboardTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table headers when loading is false and data exists', () => {
    // Arrange + Act
    render(<LeaderboardTable scores={rows} loading={false} />);

    // Assert
    expect(screen.getByRole('columnheader', { name: /posición/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /usuario/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /puntaje/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /fecha/i })).toBeInTheDocument();
  });

  it('renders score rows with username and rounded score values', () => {
    // Arrange + Act
    render(<LeaderboardTable scores={rows} loading={false} />);

    // Assert
    expect(screen.getByText('ash')).toBeInTheDocument();
    expect(screen.getByText('misty')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('shows gold silver and bronze badges for top 3 ranks', () => {
    // Arrange + Act
    render(<LeaderboardTable scores={rows} loading={false} />);

    // Assert
    expect(screen.getByText('🥇')).toBeInTheDocument();
    expect(screen.getByText('🥈')).toBeInTheDocument();
    expect(screen.getByText('🥉')).toBeInTheDocument();
  });

  it('shows loading state when loading is true', () => {
    // Arrange + Act
    render(<LeaderboardTable scores={[]} loading />);

    // Assert
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });
});
