// ============================================
// SGR V2 — Message Routes
// ============================================
const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Toutes les routes nécessitent l'authentification
router.use(auth);

router.post('/', MessageController.send);
router.get('/unread/count', MessageController.getUnreadCount);
router.get('/:reclamationId', MessageController.getByReclamation);
router.put('/read/:reclamationId', MessageController.markAsRead);

module.exports = router;
