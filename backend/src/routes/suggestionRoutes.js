// Routes: Controladores HTTP de sugerencias de términos — DI instanciada en cada handler (SPEC-004)

const { Router } = require('express');
const pool = require('../database/connection');
const SuggestionRepository = require('../repositories/suggestionRepository');
const SettingsRepository = require('../repositories/settingsRepository');
const SuggestionService = require('../services/suggestionService');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

function handle_error(res, err) {
  const status = err.statusCode || 500;
  return res.status(status).json({ error: err.message });
}

// POST /api/v1/suggestions — HU-06: Usuario sugiere un término (requiere nivel suficiente)
router.post('/', authMiddleware, async (req, res) => {
  const suggestion_repo = new SuggestionRepository(pool);
  const settings_repo = new SettingsRepository(pool);
  const service = new SuggestionService(suggestion_repo, settings_repo);

  try {
    const { text, category } = req.body;
    const suggestion = await service.createSuggestion(
      req.user.id,
      req.user.level,
      text,
      category
    );
    return res.status(201).json(suggestion);
  } catch (err) {
    return handle_error(res, err);
  }
});

// GET /api/v1/suggestions/threshold — Devuelve el umbral de nivel para sugerir (autenticado, no requiere admin)
router.get('/threshold', authMiddleware, async (req, res) => {
  const settings_repo = new SettingsRepository(pool);
  try {
    const value = await settings_repo.get('suggestion_level_threshold');
    return res.status(200).json({ suggestion_level_threshold: parseInt(value, 10) || 10 });
  } catch (err) {
    return handle_error(res, err);
  }
});

// GET /api/v1/suggestions/me — HU-06: Lista sugerencias del usuario autenticado
router.get('/me', authMiddleware, async (req, res) => {
  const suggestion_repo = new SuggestionRepository(pool);
  const settings_repo = new SettingsRepository(pool);
  const service = new SuggestionService(suggestion_repo, settings_repo);

  try {
    const suggestions = await service.getUserSuggestions(req.user.id);
    return res.status(200).json(suggestions);
  } catch (err) {
    return handle_error(res, err);
  }
});

module.exports = router;
