// Routes: Controladores HTTP de términos — DI instanciada en cada handler (SPEC-003)

const { Router } = require('express');
const pool = require('../database/connection');
const TermRepository = require('../repositories/termRepository');
const GameService = require('../services/gameService');

const router = Router();

function handle_error(res, err) {
  const status = err.statusCode || 500;
  return res.status(status).json({ error: err.message });
}

// GET /api/v1/terms/random — Obtiene N términos aleatorios para una partida (SPEC-003 HU-01)
// No requiere auth — invitados y usuarios autenticados pueden jugar
router.get('/random', async (req, res) => {
  const term_repo = new TermRepository(pool);
  const game_service = new GameService(term_repo);

  try {
    const count = req.query.count !== undefined
      ? parseInt(req.query.count, 10)
      : 10;

    const exclude_ids = req.query.exclude
      ? req.query.exclude.split(',').map((id) => id.trim()).filter(Boolean)
      : [];

    if (isNaN(count)) {
      return res.status(400).json({ error: 'El parámetro count debe ser un número entero' });
    }

    const terms = await game_service.getRandomTerms(count, exclude_ids);
    return res.status(200).json(terms);
  } catch (err) {
    return handle_error(res, err);
  }
});

module.exports = router;
