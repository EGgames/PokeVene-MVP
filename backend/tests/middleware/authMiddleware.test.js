jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('../../src/database/connection', () => ({
  query: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const pool = require('../../src/database/connection');
const authMiddleware = require('../../src/middleware/authMiddleware');

describe('authMiddleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('test_authMiddleware_valid_token_sets_user_and_calls_next', async () => {
    // GIVEN
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue({ id: 'u1' });
    pool.query.mockResolvedValue({
      rows: [{
        id: 'u1',
        username: 'poke',
        role: 'user',
        xp: 80,
        level: 0,
        banned_at: null,
      }],
    });

    // WHEN
    await authMiddleware(req, res, next);

    // THEN
    expect(req.user).toEqual({
      id: 'u1',
      username: 'poke',
      role: 'user',
      xp: 80,
      level: 0,
      banned_at: null,
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('test_authMiddleware_missing_authorization_header_returns_401', async () => {
    // GIVEN
    req.headers = {};

    // WHEN
    await authMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token de autenticaci\u00f3n requerido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('test_authMiddleware_invalid_token_returns_401', async () => {
    // GIVEN
    req.headers.authorization = 'Bearer invalid-token';
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid');
    });

    // WHEN
    await authMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inv\u00e1lido o expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('test_authMiddleware_user_not_found_returns_401', async () => {
    // GIVEN
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue({ id: 'missing' });
    pool.query.mockResolvedValue({ rows: [] });

    // WHEN
    await authMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inv\u00e1lido o expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('test_authMiddleware_banned_user_returns_403', async () => {
    // GIVEN
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue({ id: 'u1' });
    pool.query.mockResolvedValue({
      rows: [{
        id: 'u1',
        username: 'poke',
        role: 'user',
        xp: 100,
        level: 1,
        banned_at: '2026-01-01T00:00:00.000Z',
      }],
    });

    // WHEN
    await authMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Tu cuenta ha sido suspendida' });
    expect(next).not.toHaveBeenCalled();
  });

  it('test_authMiddleware_malformed_bearer_header_returns_401', async () => {
    // GIVEN
    req.headers.authorization = 'Bearer';

    // WHEN
    await authMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token de autenticaci\u00f3n requerido' });
    expect(next).not.toHaveBeenCalled();
  });
});
