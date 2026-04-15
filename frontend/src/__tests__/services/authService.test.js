import axios from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loginUser, logoutUser, registerUser, validateToken } from '../../services/authService';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls register endpoint with body when registerUser is executed', async () => {
    // Arrange
    const payload = { id: '1', username: 'ash', token: 'jwt', created_at: '2026-04-15T00:00:00Z' };
    axios.post.mockResolvedValue({ data: payload });

    // Act
    await registerUser('ash', 'MyPassword123');

    // Assert
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/auth/register'),
      { username: 'ash', password: 'MyPassword123' }
    );
  });

  it('returns token and user data when registerUser succeeds', async () => {
    // Arrange
    const payload = { id: '1', username: 'ash', token: 'jwt', created_at: '2026-04-15T00:00:00Z' };
    axios.post.mockResolvedValue({ data: payload });

    // Act
    const result = await registerUser('ash', 'MyPassword123');

    // Assert
    expect(result).toEqual(payload);
  });

  it('throws duplicate username error when registerUser receives status 409', async () => {
    // Arrange
    const error409 = { response: { status: 409, data: {} } };
    axios.post.mockRejectedValue(error409);
    axios.isAxiosError.mockReturnValue(true);

    // Act + Assert
    await expect(registerUser('ash', 'MyPassword123')).rejects.toThrow('El nombre de usuario ya existe.');
  });

  it('calls login endpoint when loginUser is executed', async () => {
    // Arrange
    axios.post.mockResolvedValue({ data: { token: 'jwt' } });

    // Act
    await loginUser('ash', 'MyPassword123');

    // Assert
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/auth/login'),
      { username: 'ash', password: 'MyPassword123' }
    );
  });

  it('returns token when loginUser succeeds', async () => {
    // Arrange
    const payload = { id: '1', username: 'ash', token: 'jwt', expiresIn: 604800 };
    axios.post.mockResolvedValue({ data: payload });

    // Act
    const result = await loginUser('ash', 'MyPassword123');

    // Assert
    expect(result).toEqual(payload);
  });

  it('throws invalid credentials error when loginUser receives status 401', async () => {
    // Arrange
    const error401 = { response: { status: 401, data: {} } };
    axios.post.mockRejectedValue(error401);
    axios.isAxiosError.mockReturnValue(true);

    // Act + Assert
    await expect(loginUser('ash', 'bad')).rejects.toThrow('Usuario o contraseña incorrectos.');
  });

  it('calls me endpoint with Authorization header when validateToken is executed', async () => {
    // Arrange
    const payload = { id: '1', username: 'ash' };
    axios.get.mockResolvedValue({ data: payload });

    // Act
    await validateToken('jwt-token');

    // Assert
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/auth/me'),
      {
        headers: { Authorization: 'Bearer jwt-token' },
      }
    );
  });

  it('removes auth_token from localStorage when logoutUser is called', () => {
    // Arrange
    const removeSpy = vi.spyOn(Storage.prototype, 'removeItem');

    // Act
    logoutUser();

    // Assert
    expect(removeSpy).toHaveBeenCalledWith('auth_token');
    expect(removeSpy).toHaveBeenCalledWith('auth_user');
  });
});
