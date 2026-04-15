const express = require('express');
const request = require('supertest');

jest.mock('../../src/database/connection', () => ({
  query: jest.fn(),
}));

const pool = require('../../src/database/connection');
const termRoutes = require('../../src/routes/termRoutes');

describe('termRoutes integration', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/terms', termRoutes);
  });

  it('test_GET_random_200_returns_array_of_terms', async () => {
    // GIVEN
    const rows = [
      { id: 't1', text: 'Pikachu', category: 'pokemon' },
      { id: 't2', text: 'Arepa', category: 'venezolano' },
    ];
    pool.query.mockResolvedValueOnce({ rows });

    // WHEN
    const response = await request(app).get('/api/v1/terms/random');

    // THEN
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
  });

  it('test_GET_random_count_5_returns_five_terms', async () => {
    // GIVEN
    const rows = Array.from({ length: 5 }, (_, idx) => ({
      id: `t${idx + 1}`,
      text: `Term${idx + 1}`,
      category: idx % 2 === 0 ? 'pokemon' : 'venezolano',
    }));
    pool.query.mockResolvedValueOnce({ rows });

    // WHEN
    const response = await request(app).get('/api/v1/terms/random?count=5');

    // THEN
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
  });

  it('test_GET_random_count_0_returns_400_bad_request', async () => {
    // GIVEN
    const path = '/api/v1/terms/random?count=0';

    // WHEN
    const response = await request(app).get(path);

    // THEN
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('El par\u00e1metro count debe ser un entero mayor a 0');
  });
});
