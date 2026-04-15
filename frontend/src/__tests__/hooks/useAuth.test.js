import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '../../hooks/useAuth';
import { loginUser, logoutUser, registerUser, validateToken } from '../../services/authService';

vi.mock('../../services/authService', () => ({
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  registerUser: vi.fn(),
  validateToken: vi.fn(),
}));

function Wrapper({ children }) {
  return React.createElement(AuthProvider, null, children);
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('provides unauthenticated state when there is no persisted token', async () => {
    // Arrange
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(getItemSpy).toHaveBeenCalledWith('auth_token');
  });

  it('calls login service and updates auth state when login succeeds', async () => {
    // Arrange
    loginUser.mockResolvedValue({
      id: '1',
      username: 'ash',
      token: 'jwt-login',
      created_at: '2026-04-15T00:00:00Z',
    });

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.login('ash', 'MyPassword123');
    });

    // Assert
    expect(loginUser).toHaveBeenCalledWith('ash', 'MyPassword123');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('jwt-login');
    expect(result.current.user).toMatchObject({ id: '1', username: 'ash' });
  });

  it('stores token in localStorage when login succeeds', async () => {
    // Arrange
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    loginUser.mockResolvedValue({
      id: '1',
      username: 'ash',
      token: 'jwt-login',
      created_at: '2026-04-15T00:00:00Z',
    });

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.login('ash', 'MyPassword123');
    });

    // Assert
    expect(setItemSpy).toHaveBeenCalledWith('auth_token', 'jwt-login');
    expect(setItemSpy).toHaveBeenCalledWith(
      'auth_user',
      expect.stringContaining('ash')
    );
  });

  it('calls register service and updates auth state when register succeeds', async () => {
    // Arrange
    registerUser.mockResolvedValue({
      id: '2',
      username: 'misty',
      token: 'jwt-register',
      created_at: '2026-04-15T00:00:00Z',
    });

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.register('misty', 'MyPassword123');
    });

    // Assert
    expect(registerUser).toHaveBeenCalledWith('misty', 'MyPassword123');
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('jwt-register');
    expect(result.current.user).toMatchObject({ id: '2', username: 'misty' });
  });

  it('clears state and storage when logout is executed', async () => {
    // Arrange
    loginUser.mockResolvedValue({
      id: '1',
      username: 'ash',
      token: 'jwt-login',
      created_at: '2026-04-15T00:00:00Z',
    });

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.login('ash', 'MyPassword123');
    });
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(logoutUser).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('validates token on mount when auth_token exists in localStorage', async () => {
    // Arrange
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'auth_token') return 'persisted-token';
      return null;
    });
    validateToken.mockResolvedValue({
      id: '3',
      username: 'brock',
      created_at: '2026-04-15T00:00:00Z',
    });

    // Act
    renderHook(() => useAuth(), { wrapper: Wrapper });

    // Assert
    await waitFor(() => expect(validateToken).toHaveBeenCalledWith('persisted-token'));
  });

  it('sets isAuthenticated true when persisted token is valid', async () => {
    // Arrange
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'auth_token') return 'persisted-token';
      return null;
    });
    validateToken.mockResolvedValue({
      id: '3',
      username: 'brock',
      created_at: '2026-04-15T00:00:00Z',
    });

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper: Wrapper });

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('persisted-token');
    expect(result.current.user).toMatchObject({ username: 'brock' });
  });
});
