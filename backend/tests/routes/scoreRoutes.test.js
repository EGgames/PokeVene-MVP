const express = require('express');
const request = require('supertest');

jest.mock('../../src/database/connection', () => ({
  query: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const pool = require('../../src/database/connection');
const jwt = require('jsonwebtoken');
const scoreRoutes = require('../../src/routes/scoreRoutes');

describe('scoreRoutes integration', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/scores', scoreRoutes);

    process.env.JWT_SECRET = 'test-secret-key';
  });

  it('test_POST_scores_201_with_auth_and_valid_body', async () => {
    // GIVEN
    jwt.verify.mockReturnValue({ id: 'u1' });
    pool.query
      .mockResolvedValueOnce({
        rows: [{
          id: 'u1',
          username: 'poke',
          role: 'user',
          xp: 40,
          level: 0,
          banned_at: null,
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
          id: 's1',
          user_id: 'u1',
          score_percentage: 60,
          terms_answered: 10,
          correct_count: 6,
          created_at: '2026-01-01T00:00:00.000Z',
        }],
      })
      .mockResolvedValueOnce({
        rows: [{
          id: 'u1',
          username: 'poke',
          role: 'user',
          xp: 40,
          level: 1,
          banned_at: null,
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
        }],
      })
      .mockResolvedValueOnce({
        rows: [{ id: 'u1', xp: 100, level: 2 }],
      });

    // WHEN
    const response = await request(app)
      .post('/api/v1/scores')
      .set('Authorization', 'Bearer valid-token')
      .send({ score_percentage: 60, terms_answered: 10, correct_count: 6 });

    // THEN
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 's1',
      user_id: 'u1',
      score_percentage: 60,
      xp_gained: 60,
      total_xp: 100,
      level: 2,
      leveled_up: true,
    });
  });

  it('test_POST_scores_401_without_auth', async () => {
    // GIVEN
    const body = { score_percentage: 60, terms_answered: 10, correct_count: 6 };

    // WHEN
    const response = await request(app)
      .post('/api/v1/scores')
      .send(body);

    // THEN
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Token de autenticaci\u00f3n requerido');
  });

  it('test_POST_scores_400_with_score_less_than_51', async () => {
    // GIVEN
    jwt.verify.mockReturnValue({ id: 'u1' });
    pool.query.mockResolvedValueOnce({
      rows: [{
        id: 'u1',
        username: 'poke',
        role: 'user',
        xp: 40,
        level: 0,
        banned_at: null,
      }],
    });

    // WHEN
    const response = await request(app)
      .post('/api/v1/scores')
      .set('Authorization', 'Bearer valid-token')
      .send({ score_percentage: 50, terms_answered: 10, correct_count: 5 });

    // THEN
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No puedes guardar un puntaje con menos de 51%');
  });

  it('test_GET_leaderboard_200_returns_array', async () => {
    // GIVEN
    const rows = [{ rank: 1, user_id: 'u1', username: 'poke', score_percentage: 90 }];
    pool.query.mockResolvedValueOnce({ rows });

    // WHEN
    const response = await request(app).get('/api/v1/scores/leaderboard');

    // THEN
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toMatchObject({ rank: 1, username: 'poke' });
  });

  it('test_GET_me_200_with_auth_returns_user_scores', async () => {
    // GIVEN
    jwt.verify.mockReturnValue({ id: 'u1' });
    const rows = [{ id: 's1', user_id: 'u1', score_percentage: 60 }];
    pool.query
      .mockResolvedValueOnce({
        rows: [{
          id: 'u1',
          username: 'poke',
          role: 'user',
          xp: 40,
          level: 0,
          banned_at: null,
        }],
      })
      .mockResolvedValueOnce({ rows });

    // WHEN
    const response = await request(app)
      .get('/api/v1/scores/me')
      .set('Authorization', 'Bearer valid-token');

    // THEN
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toMatchObject({ id: 's1', user_id: 'u1' });
  });

  it('test_GET_me_401_without_auth', async () => {
    // GIVEN
    // request without token

    // WHEN
    const response = await request(app).get('/api/v1/scores/me');

    // THEN
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Token de autenticaci\u00f3n requerido');
  });
});
