const express = require('express');
const request = require('supertest');

jest.mock('../../src/database/connection', () => ({
  query: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

const pool = require('../../src/database/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRoutes = require('../../src/routes/authRoutes');

describe('authRoutes integration', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/auth', authRoutes);

    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRES_IN = '7d';

    jwt.sign.mockReturnValue('signed-token');
  });

  it('test_POST_register_201_with_valid_body', async () => {
    // GIVEN
    pool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{ id: 'u1', username: 'poke', created_at: '2026-01-01T00:00:00.000Z' }],
      });
    bcrypt.hash.mockResolvedValue('hashed-password');

    // WHEN
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'poke', password: 'Password123' });

    // THEN
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 'u1',
      username: 'poke',
      token: 'signed-token',
    });
  });

  it('test_POST_register_400_with_missing_fields', async () => {
    // GIVEN
    const body = { username: '', password: '' };

    // WHEN
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(body);

    // THEN
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('test_POST_register_409_with_duplicate_username', async () => {
    // GIVEN
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 'u-existing', username: 'poke', password_hash: 'hash' }],
    });

    // WHEN
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'poke', password: 'Password123' });

    // THEN
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('El nombre de usuario ya existe');
  });

  it('test_POST_login_200_with_valid_credentials', async () => {
    // GIVEN
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 'u1', username: 'poke', password_hash: 'hash' }],
    });
    bcrypt.compare.mockResolvedValue(true);

    // WHEN
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'poke', password: 'Password123' });

    // THEN
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 'u1',
      username: 'poke',
      token: 'signed-token',
      expiresIn: 604800,
    });
  });

  it('test_POST_login_401_with_bad_credentials', async () => {
    // GIVEN
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 'u1', username: 'poke', password_hash: 'hash' }],
    });
    bcrypt.compare.mockResolvedValue(false);

    // WHEN
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'poke', password: 'wrong-pass' });

    // THEN
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Usuario o contrase\u00f1a incorrectos');
  });

  it('test_GET_me_200_with_valid_token', async () => {
    // GIVEN
    jwt.verify.mockReturnValue({ id: 'u1' });
    pool.query
      .mockResolvedValueOnce({
        rows: [{
          id: 'u1',
          username: 'poke',
          role: 'user',
          xp: 80,
          level: 0,
          banned_at: null,
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
          id: 'u1',
          username: 'poke',
          role: 'user',
          xp: 80,
          level: 0,
          created_at: '2026-01-01T00:00:00.000Z',
        }],
      });

    // WHEN
    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer valid-token');

    // THEN
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'u1',
      username: 'poke',
      role: 'user',
      xp: 80,
      level: 0,
      created_at: '2026-01-01T00:00:00.000Z',
    });
  });

  it('test_GET_me_401_without_token', async () => {
    // GIVEN
    // request without Authorization header

    // WHEN
    const response = await request(app).get('/api/v1/auth/me');

    // THEN
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Token de autenticaci\u00f3n requerido');
  });
});
