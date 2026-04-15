jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const jwt = require('jsonwebtoken');
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

  it('test_authMiddleware_valid_token_sets_user_and_calls_next', () => {
    // GIVEN
    req.headers.authorization = 'Bearer valid-token';
    jwt.verify.mockReturnValue({ id: 'u1', username: 'poke' });

    // WHEN
    authMiddleware(req, res, next);

    // THEN
    expect(req.user).toEqual({ id: 'u1', username: 'poke' });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('test_authMiddleware_missing_authorization_header_returns_401', () => {
    // GIVEN
    req.headers = {};

    // WHEN
    authMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token de autenticaci\u00f3n requerido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('test_authMiddleware_invalid_token_returns_401', () => {
    // GIVEN
    req.headers.authorization = 'Bearer invalid-token';
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid');
    });

    // WHEN
    authMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inv\u00e1lido o expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('test_authMiddleware_expired_token_returns_401', () => {
    // GIVEN
    req.headers.authorization = 'Bearer expired-token';
    jwt.verify.mockImplementation(() => {
      const err = new Error('jwt expired');
      err.name = 'TokenExpiredError';
      throw err;
    });

    // WHEN
    authMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inv\u00e1lido o expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('test_authMiddleware_malformed_bearer_header_returns_401', () => {
    // GIVEN
    req.headers.authorization = 'Bearer';

    // WHEN
    authMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token de autenticaci\u00f3n requerido' });
    expect(next).not.toHaveBeenCalled();
  });
});
