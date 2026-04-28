// ============================================
// SGR V2 — Auth Controller
// ============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const AuthController = {
  // POST /api/auth/register
  async register(req, res) {
    try {
      const { nom, prenom, email, password, role } = req.body;

      // Validation
      if (!nom || !prenom || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' });
      }

      // Only allow 'client' or 'agent' during registration
      const chosenRole = (role === 'agent') ? 'agent' : 'client';

      // Vérifier si l'email existe déjà
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Agents need admin approval, clients are auto-approved
      const approved = chosenRole === 'client';

      // Créer l'utilisateur
      const user = await UserModel.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        role: chosenRole,
        approved
      });

      // If agent, don't give them a token — they must wait for approval
      if (chosenRole === 'agent') {
        return res.status(201).json({
          message: 'Demande d\'agent soumise avec succès. Veuillez attendre l\'approbation de l\'administrateur.',
          pending: true,
          user: {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            approved: user.approved
          }
        });
      }

      // Clients get a token immediately
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.status(201).json({
        message: 'Inscription réussie',
        token,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
          approved: user.approved
        }
      });
    } catch (error) {
      console.error('Erreur register:', error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
      }

      // Trouver l'utilisateur
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      // Block unapproved agents
      if (!user.approved) {
        return res.status(403).json({
          error: 'Votre compte agent est en attente d\'approbation par l\'administrateur.',
          pending: true
        });
      }

      // Générer le token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erreur login:', error);
      res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
  },

  // GET /api/auth/profile
  async getProfile(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
      res.json(user);
    } catch (error) {
      console.error('Erreur getProfile:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du profil.' });
    }
  }
};

module.exports = AuthController;
