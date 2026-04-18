const express = require('express');
const request = require('supertest');

jest.mock('../../src/middleware/authMiddleware', () =>
  jest.fn((req, _res, next) => {
    req.user = { id: 'u1', level: 12 };
    next();
  })
);

jest.mock('../../src/database/connection', () => ({}));
jest.mock('../../src/repositories/suggestionRepository', () => jest.fn());
jest.mock('../../src/repositories/settingsRepository', () => jest.fn());
jest.mock('../../src/services/suggestionService');

const SuggestionService = require('../../src/services/suggestionService');
const suggestionRoutes = require('../../src/routes/suggestionRoutes');

describe('suggestionRoutes integration', () => {
  let app;
  let service;

  beforeEach(() => {
    service = {
      createSuggestion: jest.fn(),
      getUserSuggestions: jest.fn(),
    };

    SuggestionService.mockImplementation(() => service);

    app = express();
    app.use(express.json());
    app.use('/api/v1/suggestions', suggestionRoutes);
  });

  it('test_POST_root_201_creates_suggestion', async () => {
    // GIVEN
    service.createSuggestion.mockResolvedValue({
      id: 's1',
      user_id: 'u1',
      text: 'Typhlosion',
      category: 'pokemon',
      status: 'pending',
    });

    // WHEN
    const response = await request(app)
      .post('/api/v1/suggestions')
      .send({ text: 'Typhlosion', category: 'pokemon' });

    // THEN
    expect(response.status).toBe(201);
    expect(service.createSuggestion).toHaveBeenCalledWith('u1', 12, 'Typhlosion', 'pokemon');
    expect(response.body).toMatchObject({ id: 's1', status: 'pending' });
  });

  it('test_GET_me_200_returns_user_suggestions', async () => {
    // GIVEN
    service.getUserSuggestions.mockResolvedValue([{ id: 's1' }, { id: 's2' }]);

    // WHEN
    const response = await request(app).get('/api/v1/suggestions/me');

    // THEN
    expect(response.status).toBe(200);
    expect(service.getUserSuggestions).toHaveBeenCalledWith('u1');
    expect(response.body).toEqual([{ id: 's1' }, { id: 's2' }]);
  });
});
