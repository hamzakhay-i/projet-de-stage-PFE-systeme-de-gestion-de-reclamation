// ============================================
// SGR V2 — Role Authorization Middleware
// ============================================

/**
 * Middleware de vérification des rôles
 * Usage: authorize('admin', 'agent')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Accès interdit. Rôle insuffisant.',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

module.exports = authorize;
