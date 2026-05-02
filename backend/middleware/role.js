// ============================================
// SGR V2 — Role Authorization Middleware
// ============================================

/**
 * Middleware pour restreindre l'accès à certains rôles.
 * @param {...string} allowedRoles - Les rôles autorisés (ex: 'admin', 'agent')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Accès interdit. Requis : ${allowedRoles.join(' ou ')}` 
      });
    }

    next();
  };
};

module.exports = authorize;
