// Middleware: Verificación de rol administrador — debe usarse después de authMiddleware (SPEC-004)

/**
 * Verifica que el usuario autenticado tenga rol 'admin'.
 * Requiere que authMiddleware haya adjuntado req.user previamente.
 */
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No tienes permisos de administrador' });
  }
  next();
}

module.exports = adminMiddleware;
