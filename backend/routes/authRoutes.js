// ============================================
// SGR V2 — Auth Routes
// ============================================
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Routes publiques
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Routes protégées
router.get('/profile', auth, AuthController.getProfile);

module.exports = router;
