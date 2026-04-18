// Routes: Controladores HTTP de administración — DI instanciada en cada handler (SPEC-004)

const { Router } = require('express');
const pool = require('../database/connection');
const AdminRepository = require('../repositories/adminRepository');
const TermRepository = require('../repositories/termRepository');
const SuggestionRepository = require('../repositories/suggestionRepository');
const SettingsRepository = require('../repositories/settingsRepository');
const AdminService = require('../services/adminService');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = Router();

function handle_error(res, err) {
  const status = err.statusCode || 500;
  return res.status(status).json({ error: err.message });
}

function build_service() {
  const admin_repo = new AdminRepository(pool);
  const term_repo = new TermRepository(pool);
  const suggestion_repo = new SuggestionRepository(pool);
  const settings_repo = new SettingsRepository(pool);
  return new AdminService(admin_repo, term_repo, suggestion_repo, settings_repo, pool);
}

// Todas las rutas de admin requieren auth + rol admin
router.use(authMiddleware, adminMiddleware);

// GET /api/v1/admin/users — HU-07: Lista usuarios con paginación y búsqueda
router.get('/users', async (req, res) => {
  const service = build_service();
  try {
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : 20;
    const offset = req.query.offset !== undefined ? parseInt(req.query.offset, 10) : 0;
    const search = req.query.search || '';
    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({ error: 'limit y offset deben ser números enteros' });
    }
    const result = await service.listUsers(limit, offset, search);
    return res.status(200).json(result);
  } catch (err) {
    return handle_error(res, err);
  }
});

// PATCH /api/v1/admin/users/:id/role — HU-01: Actualiza el rol de un usuario
router.patch('/users/:id/role', async (req, res) => {
  const service = build_service();
  try {
    const { role } = req.body;
    const result = await service.updateUserRole(req.user.id, req.params.id, role);
    return res.status(200).json(result);
  } catch (err) {
    return handle_error(res, err);
  }
});

// PATCH /api/v1/admin/users/:id/ban — HU-02: Banea a un usuario
router.patch('/users/:id/ban', async (req, res) => {
  const service = build_service();
  try {
    const result = await service.banUser(req.user.id, req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    return handle_error(res, err);
  }
});

// PATCH /api/v1/admin/users/:id/unban — HU-02: Desbanea a un usuario
router.patch('/users/:id/unban', async (req, res) => {
  const service = build_service();
  try {
    const result = await service.unbanUser(req.params.id);
    return res.status(200).json(result);
  } catch (err) {
    return handle_error(res, err);
  }
});

// POST /api/v1/admin/terms — HU-03: Admin agrega un nuevo término
router.post('/terms', async (req, res) => {
  const service = build_service();
  try {
    const { text, category } = req.body;
    const term = await service.addTerm(text, category);
    return res.status(201).json(term);
  } catch (err) {
    return handle_error(res, err);
  }
});

// DELETE /api/v1/admin/terms/:id — HU-03: Admin elimina un término
router.delete('/terms/:id', async (req, res) => {
  const service = build_service();
  try {
    await service.deleteTerm(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return handle_error(res, err);
  }
});

// GET /api/v1/admin/suggestions — HU-06/07: Lista sugerencias por status
router.get('/suggestions', async (req, res) => {
  const service = build_service();
  try {
    const status = req.query.status || 'pending';
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : 20;
    const offset = req.query.offset !== undefined ? parseInt(req.query.offset, 10) : 0;
    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({ error: 'limit y offset deben ser números enteros' });
    }
    const result = await service.listSuggestions(status, limit, offset);
    return res.status(200).json(result);
  } catch (err) {
    return handle_error(res, err);
  }
});

// PATCH /api/v1/admin/suggestions/:id — HU-06: Admin aprueba o rechaza una sugerencia
router.patch('/suggestions/:id', async (req, res) => {
  const service = build_service();
  try {
    const { status, review_note } = req.body;
    const result = await service.reviewSuggestion(
      req.params.id,
      status,
      req.user.id,
      review_note
    );
    return res.status(200).json(result);
  } catch (err) {
    return handle_error(res, err);
  }
});

// GET /api/v1/admin/settings — HU-08: Retorna configuración del sistema
router.get('/settings', async (req, res) => {
  const service = build_service();
  try {
    const settings = await service.getSettings();
    return res.status(200).json(settings);
  } catch (err) {
    return handle_error(res, err);
  }
});

// PUT /api/v1/admin/settings — HU-08: Actualiza configuración del sistema
router.put('/settings', async (req, res) => {
  const service = build_service();
  try {
    const result = await service.updateSettings(req.body, req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    return handle_error(res, err);
  }
});

module.exports = router;
