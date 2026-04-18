import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';
import {
  getUsers,
  updateUserRole,
  banUser,
  unbanUser,
  getSuggestions,
  reviewSuggestion,
  getSettings,
  updateSettings,
  addTerm,
  deleteTerm,
} from '../../services/adminService';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/adminService', () => ({
  getUsers: vi.fn(),
  updateUserRole: vi.fn(),
  banUser: vi.fn(),
  unbanUser: vi.fn(),
  getSuggestions: vi.fn(),
  reviewSuggestion: vi.fn(),
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
  addTerm: vi.fn(),
  deleteTerm: vi.fn(),
}));

describe('useAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ token: 'admin-token' });
  });

  it('should fetch users and update users + totalUsers state', async () => {
    getUsers.mockResolvedValue({
      users: [{ id: 'u1', username: 'ash', role: 'user', level: 2 }],
      total: 1,
    });
    const { result } = renderHook(() => useAdmin());

    await act(async () => {
      await result.current.fetchUsers({ limit: 10 });
    });

    expect(getUsers).toHaveBeenCalledWith('admin-token', { limit: 10 });
    expect(result.current.users).toHaveLength(1);
    expect(result.current.totalUsers).toBe(1);
  });

  it('should ban and unban user updating banned_at value in state', async () => {
    getUsers.mockResolvedValue({
      users: [{ id: 'u1', username: 'ash', role: 'user', banned_at: null }],
      total: 1,
    });
    banUser.mockResolvedValue({ message: 'ok' });
    unbanUser.mockResolvedValue({ message: 'ok' });
    const { result } = renderHook(() => useAdmin());

    await act(async () => {
      await result.current.fetchUsers();
    });

    await act(async () => {
      await result.current.banUser('u1');
    });
    expect(banUser).toHaveBeenCalledWith('u1', 'admin-token');
    expect(result.current.users[0].banned_at).toBeTruthy();

    await act(async () => {
      await result.current.unbanUser('u1');
    });
    expect(unbanUser).toHaveBeenCalledWith('u1', 'admin-token');
    expect(result.current.users[0].banned_at).toBeNull();
  });

  it('should update user role in state after updateRole', async () => {
    getUsers.mockResolvedValue({
      users: [{ id: 'u1', username: 'ash', role: 'user' }],
      total: 1,
    });
    updateUserRole.mockResolvedValue({ id: 'u1', role: 'admin' });
    const { result } = renderHook(() => useAdmin());

    await act(async () => {
      await result.current.fetchUsers();
    });

    await act(async () => {
      await result.current.updateRole('u1', 'admin');
    });

    expect(updateUserRole).toHaveBeenCalledWith('u1', 'admin', 'admin-token');
    expect(result.current.users[0].role).toBe('admin');
  });

  it('should fetch and review suggestions', async () => {
    getSuggestions.mockResolvedValue({
      suggestions: [{ id: 's1', text: 'Totodile', status: 'pending' }],
      total: 1,
    });
    reviewSuggestion.mockResolvedValue({ id: 's1', status: 'approved' });
    const { result } = renderHook(() => useAdmin());

    await act(async () => {
      await result.current.fetchSuggestions({ status: 'pending' });
    });

    expect(result.current.suggestions).toHaveLength(1);

    await act(async () => {
      await result.current.reviewSuggestion('s1', { status: 'approved' });
    });

    expect(reviewSuggestion).toHaveBeenCalledWith(
      's1',
      { status: 'approved' },
      'admin-token'
    );
    expect(result.current.suggestions[0].status).toBe('approved');
  });

  it('should fetch settings, update settings and call addTerm/deleteTerm', async () => {
    getSettings.mockResolvedValue({ suggestion_level_threshold: 10 });
    updateSettings.mockResolvedValue({ suggestion_level_threshold: 15 });
    addTerm.mockResolvedValue({ id: 't1' });
    deleteTerm.mockResolvedValue({ deleted: true });
    const { result } = renderHook(() => useAdmin());

    await act(async () => {
      await result.current.fetchSettings();
    });
    expect(result.current.settings).toEqual({ suggestion_level_threshold: 10 });

    await act(async () => {
      await result.current.updateSettings({ suggestion_level_threshold: 15 });
    });
    expect(result.current.settings).toEqual({ suggestion_level_threshold: 15 });

    await act(async () => {
      await result.current.addTerm({ text: 'Piplup', category: 'pokemon' });
      await result.current.deleteTerm('t1');
    });

    expect(addTerm).toHaveBeenCalledWith(
      { text: 'Piplup', category: 'pokemon' },
      'admin-token'
    );
    expect(deleteTerm).toHaveBeenCalledWith('t1', 'admin-token');
  });

  it('should set error when fetchUsers fails', async () => {
    getUsers.mockRejectedValue(new Error('No tienes permisos de administrador'));
    const { result } = renderHook(() => useAdmin());

    await act(async () => {
      await result.current.fetchUsers();
    });

    await waitFor(() => {
      expect(result.current.error).toBe('No tienes permisos de administrador');
    });
  });
});
