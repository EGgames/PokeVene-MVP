// Routes: Controladores HTTP de scores — DI instanciada en cada handler (SPEC-003)

const { Router } = require('express');
const pool = require('../database/connection');
const ScoreRepository = require('../repositories/scoreRepository');
const ScoreService = require('../services/scoreService');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

function handle_error(res, err) {
  const status = err.statusCode || 500;
  return res.status(status).json({ error: err.message });
}

// POST /api/v1/scores — Guarda el puntaje del usuario autenticado (SPEC-003 HU-03)
// Requiere auth. Valida score >= 51% y consistencia anti-cheating.
router.post('/', authMiddleware, async (req, res) => {
  const score_repo = new ScoreRepository(pool);
  const score_service = new ScoreService(score_repo);

  try {
    const { score_percentage, terms_answered, correct_count } = req.body;
    const score = await score_service.saveScore(
      req.user.id,
      score_percentage,
      terms_answered,
      correct_count
    );
    return res.status(201).json(score);
  } catch (err) {
    return handle_error(res, err);
  }
});

// GET /api/v1/scores/leaderboard — Tabla de clasificación pública (SPEC-003 HU-04)
// No requiere auth — acceso público.
router.get('/leaderboard', async (req, res) => {
  const score_repo = new ScoreRepository(pool);
  const score_service = new ScoreService(score_repo);

  try {
    const limit = req.query.limit !== undefined
      ? parseInt(req.query.limit, 10)
      : 50;
    const offset = req.query.offset !== undefined
      ? parseInt(req.query.offset, 10)
      : 0;

    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({ error: 'limit y offset deben ser números enteros' });
    }

    const leaderboard = await score_service.getLeaderboard(limit, offset);
    return res.status(200).json(leaderboard);
  } catch (err) {
    return handle_error(res, err);
  }
});

// GET /api/v1/scores/me — Scores del usuario autenticado (SPEC-003)
// Requiere auth.
router.get('/me', authMiddleware, async (req, res) => {
  const score_repo = new ScoreRepository(pool);

  try {
    const limit = req.query.limit !== undefined
      ? parseInt(req.query.limit, 10)
      : 10;
    const offset = req.query.offset !== undefined
      ? parseInt(req.query.offset, 10)
      : 0;

    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).json({ error: 'limit y offset deben ser números enteros' });
    }

    const scores = await score_repo.findByUserId(req.user.id, limit, offset);
    return res.status(200).json(scores);
  } catch (err) {
    return handle_error(res, err);
  }
});

module.exports = router;
