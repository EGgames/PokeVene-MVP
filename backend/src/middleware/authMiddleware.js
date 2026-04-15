// Middleware: Validación de JWT para endpoints protegidos (SPEC-002)

const jwt = require('jsonwebtoken');

/**
 * Extrae y verifica el token JWT del header Authorization: Bearer <token>.
 * Adjunta req.user = { id, username } si el token es válido.
 */
function authMiddleware(req, res, next) {
  const auth_header = req.headers['authorization'];

  if (!auth_header || !auth_header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  const token = auth_header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = authMiddleware;
