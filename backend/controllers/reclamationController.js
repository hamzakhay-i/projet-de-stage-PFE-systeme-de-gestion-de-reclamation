// ============================================
// SGR V2 — Reclamation Controller
// ============================================
const ReclamationModel = require('../models/reclamationModel');

const ReclamationController = {
  // POST /api/reclamations
  async create(req, res) {
    try {
      const { titre, description, priorite } = req.body;

      if (!titre || !description) {
        return res.status(400).json({ error: 'Titre et description sont obligatoires.' });
      }

      const reclamation = await ReclamationModel.create({
        titre,
        description,
        priorite,
        client_id: req.user.id
      });

      res.status(201).json({ message: 'Réclamation créée avec succès', reclamation });
    } catch (error) {
      console.error('Erreur create reclamation:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la réclamation.' });
    }
  },

  // GET /api/reclamations
  async getAll(req, res) {
    try {
      let reclamations;

      switch (req.user.role) {
        case 'admin':
        case 'agent':
          reclamations = await ReclamationModel.findAll();
          break;
        case 'client':
          reclamations = await ReclamationModel.findByClientId(req.user.id);
          break;
        default:
          return res.status(403).json({ error: 'Rôle non reconnu.' });
      }

      res.json(reclamations);
    } catch (error) {
      console.error('Erreur getAll reclamations:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des réclamations.' });
    }
  },

  // GET /api/reclamations/stats
  async getStats(req, res) {
    try {
      let stats;

      switch (req.user.role) {
        case 'admin':
        case 'agent':
          stats = await ReclamationModel.getStats();
          break;
        case 'client':
          stats = await ReclamationModel.getStatsByClient(req.user.id);
          break;
        default:
          return res.status(403).json({ error: 'Rôle non reconnu.' });
      }

      res.json(stats);
    } catch (error) {
      console.error('Erreur getStats:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques.' });
    }
  },

  // GET /api/reclamations/:id
  async getById(req, res) {
    try {
      const reclamation = await ReclamationModel.findById(req.params.id);

      if (!reclamation) {
        return res.status(404).json({ error: 'Réclamation non trouvée.' });
      }

      // Les clients ne peuvent voir que leurs propres réclamations
      if (req.user.role === 'client' && reclamation.client_id !== req.user.id) {
        return res.status(403).json({ error: 'Accès interdit à cette réclamation.' });
      }
      // Les agents et admins ont un accès complet

      res.json(reclamation);
    } catch (error) {
      console.error('Erreur getById reclamation:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de la réclamation.' });
    }
  },

  // PUT /api/reclamations/:id
  async update(req, res) {
    try {
      const { titre, description, statut, priorite, agent_id } = req.body;

      const reclamation = await ReclamationModel.update(req.params.id, {
        titre,
        description,
        statut,
        priorite,
        agent_id
      });

      if (!reclamation) {
        return res.status(404).json({ error: 'Réclamation non trouvée.' });
      }

      res.json({ message: 'Réclamation mise à jour', reclamation });
    } catch (error) {
      console.error('Erreur update reclamation:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
  },

  // DELETE /api/reclamations/:id
  async delete(req, res) {
    try {
      const reclamation = await ReclamationModel.delete(req.params.id);
      if (!reclamation) {
        return res.status(404).json({ error: 'Réclamation non trouvée.' });
      }
      res.json({ message: 'Réclamation supprimée avec succès.' });
    } catch (error) {
      console.error('Erreur delete reclamation:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  }
};

module.exports = ReclamationController;
