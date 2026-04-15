import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { getLeaderboard } from '../../services/gameService';

vi.mock('../../services/gameService', () => ({
  getLeaderboard: vi.fn(),
}));

describe('useLeaderboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches leaderboard on mount', async () => {
    // Arrange
    const data = [{ rank: 1, username: 'ash', score_percentage: 90 }];
    getLeaderboard.mockResolvedValue(data);

    // Act
    const { result } = renderHook(() => useLeaderboard());

    // Assert
    await waitFor(() => expect(result.current.scores).toEqual(data));
    expect(getLeaderboard).toHaveBeenCalledTimes(1);
    expect(result.current.scores).toEqual(data);
  });

  it('updates loading state correctly during fetch lifecycle', async () => {
    // Arrange
    const data = [{ rank: 1, username: 'ash', score_percentage: 90 }];
    let resolveRequest;
    getLeaderboard.mockImplementation(
      () => new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    // Act
    const { result } = renderHook(() => useLeaderboard());

    // Assert
    expect(result.current.loading).toBe(true);
    act(() => {
      resolveRequest(data);
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('re-fetches leaderboard when refresh is called', async () => {
    // Arrange
    getLeaderboard.mockResolvedValue([{ rank: 1, username: 'ash', score_percentage: 90 }]);
    const { result } = renderHook(() => useLeaderboard());
    await waitFor(() => expect(getLeaderboard).toHaveBeenCalledTimes(1));

    // Act
    await act(async () => {
      await result.current.refresh();
    });

    // Assert
    expect(getLeaderboard).toHaveBeenCalledTimes(2);
  });
});
