// ============================================
// SGR V2 — Reclamation Routes
// ============================================
const express = require('express');
const router = express.Router();
const ReclamationController = require('../controllers/reclamationController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Toutes les routes nécessitent l'authentification
router.use(auth);

// Stats (avant :id pour éviter conflit)
router.get('/stats', ReclamationController.getStats);

// CRUD
router.post('/', authorize('client'), ReclamationController.create);
router.get('/', ReclamationController.getAll);
router.get('/:id', ReclamationController.getById);
router.put('/:id', authorize('admin', 'agent'), ReclamationController.update);
router.delete('/:id', authorize('admin'), ReclamationController.delete);

module.exports = router;
