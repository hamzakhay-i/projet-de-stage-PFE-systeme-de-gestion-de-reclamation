// ============================================
// SGR V2 — User Controller (Admin)
// ============================================
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

const UserController = {
  // GET /api/users
  async getAll(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json(users);
    } catch (error) {
      console.error('Erreur getAll users:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    }
  },

  // GET /api/users/agents
  async getAgents(req, res) {
    try {
      const agents = await UserModel.findAgents();
      res.json(agents);
    } catch (error) {
      console.error('Erreur getAgents:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des agents.' });
    }
  },

  // GET /api/users/pending
  async getPendingAgents(req, res) {
    try {
      const pending = await UserModel.findPendingAgents();
      res.json(pending);
    } catch (error) {
      console.error('Erreur getPendingAgents:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des demandes.' });
    }
  },

  // PUT /api/users/approve/:id
  async approveAgent(req, res) {
    try {
      const user = await UserModel.approve(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Agent non trouvé ou déjà approuvé.' });
      }
      res.json({ message: 'Agent approuvé avec succès', user });
    } catch (error) {
      console.error('Erreur approveAgent:', error);
      res.status(500).json({ error: 'Erreur lors de l\'approbation.' });
    }
  },

  // DELETE /api/users/reject/:id
  async rejectAgent(req, res) {
    try {
      const user = await UserModel.reject(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Demande non trouvée.' });
      }
      res.json({ message: 'Demande d\'agent rejetée.' });
    } catch (error) {
      console.error('Erreur rejectAgent:', error);
      res.status(500).json({ error: 'Erreur lors du rejet.' });
    }
  },

  // GET /api/users/stats
  async getStats(req, res) {
    try {
      const stats = await UserModel.countByRole();
      res.json(stats);
    } catch (error) {
      console.error('Erreur getStats:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques.' });
    }
  },

  // GET /api/users/:id
  async getById(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
      res.json(user);
    } catch (error) {
      console.error('Erreur getById:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur.' });
    }
  },

  // POST /api/users (Admin crée un agent/utilisateur)
  async create(req, res) {
    try {
      const { nom, prenom, email, password, role } = req.body;

      if (!nom || !prenom || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Admin-created users are always approved
      const user = await UserModel.create({
        nom,
        prenom,
        email,
        password: hashedPassword,
        role: role || 'client',
        approved: true
      });

      res.status(201).json({ message: 'Utilisateur créé avec succès', user });
    } catch (error) {
      console.error('Erreur create user:', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
    }
  },

  // PUT /api/users/:id
  async update(req, res) {
    try {
      const { nom, prenom, email, role } = req.body;
      const user = await UserModel.update(req.params.id, { nom, prenom, email, role });

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }

      res.json({ message: 'Utilisateur mis à jour', user });
    } catch (error) {
      console.error('Erreur update user:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
  },

  // DELETE /api/users/:id
  async delete(req, res) {
    try {
      const user = await UserModel.delete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé.' });
      }
      res.json({ message: 'Utilisateur supprimé avec succès.' });
    } catch (error) {
      console.error('Erreur delete user:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  }
};

module.exports = UserController;
