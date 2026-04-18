const adminMiddleware = require('../../src/middleware/adminMiddleware');

describe('adminMiddleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { user: undefined };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('test_adminMiddleware_calls_next_when_user_role_is_admin', () => {
    // GIVEN
    req.user = { id: 'u1', role: 'admin' };

    // WHEN
    adminMiddleware(req, res, next);

    // THEN
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('test_adminMiddleware_returns_403_when_user_role_is_not_admin', () => {
    // GIVEN
    req.user = { id: 'u2', role: 'user' };

    // WHEN
    adminMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'No tienes permisos de administrador' });
    expect(next).not.toHaveBeenCalled();
  });

  it('test_adminMiddleware_returns_403_when_req_user_is_undefined', () => {
    // GIVEN
    req.user = undefined;

    // WHEN
    adminMiddleware(req, res, next);

    // THEN
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'No tienes permisos de administrador' });
    expect(next).not.toHaveBeenCalled();
  });
});
