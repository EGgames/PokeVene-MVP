import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSuggestions } from '../../hooks/useSuggestions';
import { useAuth } from '../../hooks/useAuth';
import {
  submitSuggestion,
  getMySuggestions,
} from '../../services/suggestionService';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/suggestionService', () => ({
  submitSuggestion: vi.fn(),
  getMySuggestions: vi.fn(),
}));

describe('useSuggestions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ token: 'user-token' });
  });

  it('should expose initial state', () => {
    const { result } = renderHook(() => useSuggestions());

    expect(result.current.suggestions).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should refresh suggestions and toggle loading state', async () => {
    getMySuggestions.mockResolvedValue({
      suggestions: [{ id: 's1', text: 'Typhlosion', status: 'pending' }],
    });
    const { result } = renderHook(() => useSuggestions());

    await act(async () => {
      await result.current.refresh();
    });

    expect(getMySuggestions).toHaveBeenCalledWith('user-token');
    expect(result.current.loading).toBe(false);
    expect(result.current.suggestions).toHaveLength(1);
  });

  it('should submit suggestion and call refresh flow', async () => {
    submitSuggestion.mockResolvedValue({ id: 's2', status: 'pending' });
    getMySuggestions.mockResolvedValue({
      suggestions: [{ id: 's2', text: 'Totodile', status: 'pending' }],
    });
    const { result } = renderHook(() => useSuggestions());

    await act(async () => {
      await result.current.submit({ text: 'Totodile', category: 'pokemon' });
    });

    expect(submitSuggestion).toHaveBeenCalledWith(
      { text: 'Totodile', category: 'pokemon' },
      'user-token'
    );
    expect(getMySuggestions).toHaveBeenCalledWith('user-token');
    expect(result.current.suggestions).toHaveLength(1);
  });

  it('should set error when refresh fails', async () => {
    getMySuggestions.mockRejectedValue(new Error('No autorizado'));
    const { result } = renderHook(() => useSuggestions());

    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.error).toBe('No autorizado');
    });
    expect(result.current.loading).toBe(false);
  });
});
