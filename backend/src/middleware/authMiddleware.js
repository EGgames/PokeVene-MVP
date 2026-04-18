// Middleware: Validación de JWT para endpoints protegidos (SPEC-002, SPEC-004)

const jwt = require('jsonwebtoken');
const pool = require('../database/connection');

/**
 * Extrae y verifica el token JWT del header Authorization: Bearer <token>.
 * Consulta DB para obtener role, xp, level y banned_at actualizados.
 * Adjunta req.user = { id, username, role, xp, level, banned_at } si el token es válido.
 * Retorna 403 si el usuario está baneado.
 */
async function authMiddleware(req, res, next) {
  const auth_header = req.headers['authorization'];

  if (!auth_header || !auth_header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  const token = auth_header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT id, username, role, xp, level, banned_at
       FROM users
       WHERE id = $1
         AND deleted_at IS NULL`,
      [decoded.id]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    if (user.banned_at !== null) {
      return res.status(403).json({ error: 'Tu cuenta ha sido suspendida' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      xp: user.xp,
      level: user.level,
      banned_at: user.banned_at,
    };
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = authMiddleware;
