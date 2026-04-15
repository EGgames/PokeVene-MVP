// Routes: Controladores HTTP de autenticación — DI instanciada en cada handler (SPEC-002)

const { Router } = require('express');
const pool = require('../database/connection');
const UserRepository = require('../repositories/userRepository');
const AuthService = require('../services/authService');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

/**
 * Envía la respuesta de error apropiada según el statusCode del error lanzado.
 */
function handle_error(res, err) {
  const status = err.statusCode || 500;
  const body = err.errors
    ? { error: err.message, errors: err.errors }
    : { error: err.message };
  return res.status(status).json(body);
}

// POST /api/v1/auth/register — HU-01: Registro de nuevo usuario
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user_repo = new UserRepository(pool);
  const auth_service = new AuthService(user_repo);

  try {
    const result = await auth_service.register(username, password);
    return res.status(201).json(result);
  } catch (err) {
    return handle_error(res, err);
  }
});

// POST /api/v1/auth/login — HU-02: Inicio de sesión con credenciales
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user_repo = new UserRepository(pool);
  const auth_service = new AuthService(user_repo);

  try {
    const result = await auth_service.login(username, password);
    return res.status(200).json(result);
  } catch (err) {
    return handle_error(res, err);
  }
});

// GET /api/v1/auth/me — Retorna perfil del usuario autenticado (requiere JWT)
router.get('/me', authMiddleware, async (req, res) => {
  const user_repo = new UserRepository(pool);
  const auth_service = new AuthService(user_repo);

  try {
    const profile = await auth_service.getProfile(req.user.id);
    return res.status(200).json(profile);
  } catch (err) {
    return handle_error(res, err);
  }
});

module.exports = router;
