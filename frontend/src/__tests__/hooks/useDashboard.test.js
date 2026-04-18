import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDashboard } from '../../hooks/useDashboard';
import { getSuggestionThreshold } from '../../services/suggestionService';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../services/suggestionService', () => ({
  getSuggestionThreshold: vi.fn(),
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should finish with loading false and canSuggest false when there is no token', async () => {
    useAuth.mockReturnValue({
      user: { username: 'ash', level: 5 },
      token: null,
      refreshUser: vi.fn(),
    });

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.canSuggest).toBe(false);
    expect(getSuggestionThreshold).not.toHaveBeenCalled();
  });

  it('should set canSuggest true when user level meets threshold from settings', async () => {
    useAuth.mockReturnValue({
      user: { username: 'misty', level: 12 },
      token: 'jwt',
      refreshUser: vi.fn(),
    });
    getSuggestionThreshold.mockResolvedValue({ suggestion_level_threshold: 10 });

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getSuggestionThreshold).toHaveBeenCalledWith('jwt');
    expect(result.current.suggestionThreshold).toBe(10);
    expect(result.current.canSuggest).toBe(true);
  });

  it('should set canSuggest false when user level is below threshold', async () => {
    useAuth.mockReturnValue({
      user: { username: 'brock', level: 3 },
      token: 'jwt',
      refreshUser: vi.fn(),
    });
    getSuggestionThreshold.mockResolvedValue({ suggestion_level_threshold: 10 });

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.canSuggest).toBe(false);
  });
});
