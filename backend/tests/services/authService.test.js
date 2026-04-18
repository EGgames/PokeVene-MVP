jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthService = require('../../src/services/authService');

describe('AuthService', () => {
  let userRepository;
  let service;

  beforeEach(() => {
    userRepository = {
      findByUsername: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };
    service = new AuthService(userRepository);
    jwt.sign.mockReturnValue('jwt-token');
  });

  it('test_register_success_creates_user_and_returns_token', async () => {
    // GIVEN
    userRepository.findByUsername.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed-password');
    userRepository.create.mockResolvedValue({
      id: 'u1',
      username: 'pokefan123',
      role: 'user',
      xp: 0,
      level: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    });

    // WHEN
    const result = await service.register('pokefan123', 'Password123');

    // THEN
    expect(userRepository.create).toHaveBeenCalledWith('pokefan123', 'hashed-password');
    expect(result).toEqual({
      id: 'u1',
      username: 'pokefan123',
      role: 'user',
      xp: 0,
      level: 1,
      token: 'jwt-token',
      created_at: '2026-01-01T00:00:00.000Z',
    });
  });

  it('test_register_duplicate_username_throws_409_error', async () => {
    // GIVEN
    userRepository.findByUsername.mockResolvedValue({ id: 'existing' });

    // WHEN
    const promise = service.register('pokefan123', 'Password123');

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 409,
      message: 'El nombre de usuario ya existe',
    });
  });

  it('test_register_invalid_input_throws_400_error', async () => {
    // GIVEN
    const username = 'ab';
    const password = '123';

    // WHEN
    const promise = service.register(username, password);

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it('test_register_hashes_password_with_bcrypt', async () => {
    // GIVEN
    userRepository.findByUsername.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('secure-hash-value');
    userRepository.create.mockResolvedValue({
      id: 'u1',
      username: 'pokefan123',
      role: 'user',
      xp: 0,
      level: 1,
      created_at: '2026-01-01T00:00:00.000Z',
    });

    // WHEN
    await service.register('pokefan123', 'Password123');

    // THEN
    expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);
    expect(userRepository.create.mock.calls[0][1]).toBe('secure-hash-value');
    expect(userRepository.create.mock.calls[0][1]).not.toBe('Password123');
  });

  it('test_login_success_returns_token_with_valid_credentials', async () => {
    // GIVEN
    userRepository.findByUsername.mockResolvedValue({
      id: 'u1',
      username: 'pokefan123',
      role: 'user',
      xp: 120,
      level: 1,
      banned_at: null,
      password_hash: 'hash',
    });
    bcrypt.compare.mockResolvedValue(true);

    // WHEN
    const result = await service.login('pokefan123', 'Password123');

    // THEN
    expect(result).toEqual({
      id: 'u1',
      username: 'pokefan123',
      role: 'user',
      xp: 120,
      level: 1,
      token: 'jwt-token',
      expiresIn: 604800,
    });
  });

  it('test_login_wrong_username_throws_401', async () => {
    // GIVEN
    userRepository.findByUsername.mockResolvedValue(null);

    // WHEN
    const promise = service.login('no-user', 'Password123');

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 401,
      message: 'Usuario o contrase\u00f1a incorrectos',
    });
  });

  it('test_login_wrong_password_throws_401', async () => {
    // GIVEN
    userRepository.findByUsername.mockResolvedValue({
      id: 'u1',
      username: 'pokefan123',
      role: 'user',
      xp: 120,
      level: 1,
      banned_at: null,
      password_hash: 'hash',
    });
    bcrypt.compare.mockResolvedValue(false);

    // WHEN
    const promise = service.login('pokefan123', 'bad-password');

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 401,
      message: 'Usuario o contrase\u00f1a incorrectos',
    });
  });

  it('test_login_banned_user_throws_403', async () => {
    // GIVEN
    userRepository.findByUsername.mockResolvedValue({
      id: 'u1',
      username: 'pokefan123',
      role: 'user',
      xp: 120,
      level: 1,
      banned_at: '2026-01-01T00:00:00.000Z',
      password_hash: 'hash',
    });
    bcrypt.compare.mockResolvedValue(true);

    // WHEN
    const promise = service.login('pokefan123', 'Password123');

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 403,
      message: 'Tu cuenta ha sido suspendida',
    });
  });

  it('test_login_invalid_input_throws_400', async () => {
    // GIVEN
    const username = '';
    const password = '';

    // WHEN
    const promise = service.login(username, password);

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it('test_getProfile_success_returns_user_data_without_password_hash', async () => {
    // GIVEN
    userRepository.findById.mockResolvedValue({
      id: 'u1',
      username: 'pokefan123',
      role: 'admin',
      xp: 500,
      level: 5,
      created_at: '2026-01-01T00:00:00.000Z',
      password_hash: 'hidden',
    });

    // WHEN
    const result = await service.getProfile('u1');

    // THEN
    expect(result).toEqual({
      id: 'u1',
      username: 'pokefan123',
      role: 'admin',
      xp: 500,
      level: 5,
      created_at: '2026-01-01T00:00:00.000Z',
    });
    expect(result.password_hash).toBeUndefined();
  });

  it('test_getProfile_non_existent_user_throws_not_found_error', async () => {
    // GIVEN
    userRepository.findById.mockResolvedValue(null);

    // WHEN
    const promise = service.getProfile('missing');

    // THEN
    await expect(promise).rejects.toMatchObject({
      statusCode: 403,
      message: 'Usuario no encontrado',
    });
  });
});
