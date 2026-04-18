const express = require('express');
const request = require('supertest');

jest.mock('../../src/middleware/authMiddleware', () =>
  jest.fn((req, _res, next) => {
    req.user = { id: 'admin-1', role: 'admin', level: 20 };
    next();
  })
);

jest.mock('../../src/middleware/adminMiddleware', () =>
  jest.fn((_req, _res, next) => next())
);

jest.mock('../../src/database/connection', () => ({}));
jest.mock('../../src/repositories/adminRepository', () => jest.fn());
jest.mock('../../src/repositories/termRepository', () => jest.fn());
jest.mock('../../src/repositories/suggestionRepository', () => jest.fn());
jest.mock('../../src/repositories/settingsRepository', () => jest.fn());
jest.mock('../../src/services/adminService');

const AdminService = require('../../src/services/adminService');
const adminRoutes = require('../../src/routes/adminRoutes');

describe('adminRoutes integration', () => {
  let app;
  let service;

  beforeEach(() => {
    service = {
      listUsers: jest.fn(),
      updateUserRole: jest.fn(),
      banUser: jest.fn(),
      unbanUser: jest.fn(),
      addTerm: jest.fn(),
      deleteTerm: jest.fn(),
      listSuggestions: jest.fn(),
      reviewSuggestion: jest.fn(),
      getSettings: jest.fn(),
      updateSettings: jest.fn(),
    };

    AdminService.mockImplementation(() => service);

    app = express();
    app.use(express.json());
    app.use('/api/v1/admin', adminRoutes);
  });

  it('test_GET_users_200_returns_list', async () => {
    // GIVEN
    service.listUsers.mockResolvedValue({ users: [{ id: 'u1' }], total: 1 });

    // WHEN
    const response = await request(app).get('/api/v1/admin/users');

    // THEN
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ users: [{ id: 'u1' }], total: 1 });
  });

  it('test_PATCH_user_role_200_updates_role', async () => {
    // GIVEN
    service.updateUserRole.mockResolvedValue({ id: 'u2', role: 'admin' });

    // WHEN
    const response = await request(app)
      .patch('/api/v1/admin/users/u2/role')
      .send({ role: 'admin' });

    // THEN
    expect(response.status).toBe(200);
    expect(service.updateUserRole).toHaveBeenCalledWith('admin-1', 'u2', 'admin');
    expect(response.body).toEqual({ id: 'u2', role: 'admin' });
  });

  it('test_PATCH_user_ban_200_returns_message', async () => {
    // GIVEN
    service.banUser.mockResolvedValue({ message: 'Usuario baneado exitosamente' });

    // WHEN
    const response = await request(app).patch('/api/v1/admin/users/u2/ban');

    // THEN
    expect(response.status).toBe(200);
    expect(service.banUser).toHaveBeenCalledWith('admin-1', 'u2');
    expect(response.body).toEqual({ message: 'Usuario baneado exitosamente' });
  });

  it('test_PATCH_user_unban_200_returns_message', async () => {
    // GIVEN
    service.unbanUser.mockResolvedValue({ message: 'Usuario desbaneado exitosamente' });

    // WHEN
    const response = await request(app).patch('/api/v1/admin/users/u2/unban');

    // THEN
    expect(response.status).toBe(200);
    expect(service.unbanUser).toHaveBeenCalledWith('u2');
    expect(response.body).toEqual({ message: 'Usuario desbaneado exitosamente' });
  });

  it('test_POST_terms_201_creates_term', async () => {
    // GIVEN
    service.addTerm.mockResolvedValue({ id: 't1', text: 'Totodile', category: 'pokemon' });

    // WHEN
    const response = await request(app)
      .post('/api/v1/admin/terms')
      .send({ text: 'Totodile', category: 'pokemon' });

    // THEN
    expect(response.status).toBe(201);
    expect(service.addTerm).toHaveBeenCalledWith('Totodile', 'pokemon');
    expect(response.body).toEqual({ id: 't1', text: 'Totodile', category: 'pokemon' });
  });

  it('test_DELETE_terms_204_deletes_term', async () => {
    // GIVEN
    service.deleteTerm.mockResolvedValue(undefined);

    // WHEN
    const response = await request(app).delete('/api/v1/admin/terms/t1');

    // THEN
    expect(response.status).toBe(204);
    expect(service.deleteTerm).toHaveBeenCalledWith('t1');
  });

  it('test_GET_suggestions_200_returns_items', async () => {
    // GIVEN
    service.listSuggestions.mockResolvedValue({ suggestions: [{ id: 's1' }], total: 1 });

    // WHEN
    const response = await request(app).get('/api/v1/admin/suggestions?status=pending');

    // THEN
    expect(response.status).toBe(200);
    expect(service.listSuggestions).toHaveBeenCalledWith('pending', 20, 0);
    expect(response.body).toEqual({ suggestions: [{ id: 's1' }], total: 1 });
  });

  it('test_PATCH_suggestions_200_reviews_suggestion', async () => {
    // GIVEN
    service.reviewSuggestion.mockResolvedValue({ id: 's1', status: 'approved' });

    // WHEN
    const response = await request(app)
      .patch('/api/v1/admin/suggestions/s1')
      .send({ status: 'approved' });

    // THEN
    expect(response.status).toBe(200);
    expect(service.reviewSuggestion).toHaveBeenCalledWith('s1', 'approved', 'admin-1', undefined);
    expect(response.body).toEqual({ id: 's1', status: 'approved' });
  });

  it('test_GET_settings_200_returns_settings', async () => {
    // GIVEN
    service.getSettings.mockResolvedValue({ suggestion_level_threshold: '10' });

    // WHEN
    const response = await request(app).get('/api/v1/admin/settings');

    // THEN
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ suggestion_level_threshold: '10' });
  });

  it('test_PUT_settings_200_updates_settings', async () => {
    // GIVEN
    service.updateSettings.mockResolvedValue({ suggestion_level_threshold: { key: 'suggestion_level_threshold', value: '15' } });

    // WHEN
    const response = await request(app)
      .put('/api/v1/admin/settings')
      .send({ suggestion_level_threshold: 15 });

    // THEN
    expect(response.status).toBe(200);
    expect(service.updateSettings).toHaveBeenCalledWith({ suggestion_level_threshold: 15 }, 'admin-1');
    expect(response.body).toEqual({
      suggestion_level_threshold: { key: 'suggestion_level_threshold', value: '15' },
    });
  });
});
