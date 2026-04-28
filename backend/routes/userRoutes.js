// ============================================
// SGR V2 — User Routes (Admin)
// ============================================
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// Toutes les routes nécessitent l'authentification
router.use(auth);

// Routes accessibles par Admin uniquement
router.get('/agents', authorize('admin'), UserController.getAgents);
router.get('/pending', authorize('admin'), UserController.getPendingAgents);
router.put('/approve/:id', authorize('admin'), UserController.approveAgent);
router.delete('/reject/:id', authorize('admin'), UserController.rejectAgent);
router.get('/stats', authorize('admin'), UserController.getStats);
router.get('/', authorize('admin'), UserController.getAll);
router.get('/:id', authorize('admin'), UserController.getById);
router.post('/', authorize('admin'), UserController.create);
router.put('/:id', authorize('admin'), UserController.update);
router.delete('/:id', authorize('admin'), UserController.delete);

module.exports = router;
