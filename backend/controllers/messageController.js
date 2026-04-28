// ============================================
// SGR V2 — Message Controller
// ============================================
const MessageModel = require('../models/messageModel');
const ReclamationModel = require('../models/reclamationModel');

const MessageController = {
  // POST /api/messages
  async send(req, res) {
    try {
      const { reclamation_id, contenu } = req.body;

      if (!reclamation_id || !contenu) {
        return res.status(400).json({ error: 'reclamation_id et contenu sont obligatoires.' });
      }

      // Vérifier que la réclamation existe et que l'utilisateur y a accès
      const reclamation = await ReclamationModel.findById(reclamation_id);
      if (!reclamation) {
        return res.status(404).json({ error: 'Réclamation non trouvée.' });
      }

      // Les clients ne peuvent pas accéder aux autres réclamations
      const userId = req.user.id;
      const role = req.user.role;
      if (role === 'client' && reclamation.client_id !== userId) {
        return res.status(403).json({ error: 'Accès interdit.' });
      }
      // Les agents et admins ont accès à tout

      const message = await MessageModel.create({
        reclamation_id,
        sender_id: userId,
        contenu
      });

      res.status(201).json({ message: 'Message envoyé', data: message });
    } catch (error) {
      console.error('Erreur send message:', error);
      res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
    }
  },

  // GET /api/messages/:reclamationId
  async getByReclamation(req, res) {
    try {
      const reclamationId = req.params.reclamationId;

      // Vérifier l'accès à la réclamation
      const reclamation = await ReclamationModel.findById(reclamationId);
      if (!reclamation) {
        return res.status(404).json({ error: 'Réclamation non trouvée.' });
      }

      const userId = req.user.id;
      const role = req.user.role;
      if (role === 'client' && reclamation.client_id !== userId) {
        return res.status(403).json({ error: 'Accès interdit.' });
      }
      // Agents et admins ont un accès complet

      const messages = await MessageModel.findByReclamationId(reclamationId);

      // Marquer les messages comme lus
      await MessageModel.markAsRead(reclamationId, userId);

      res.json(messages);
    } catch (error) {
      console.error('Erreur getByReclamation:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
    }
  },

  // PUT /api/messages/read/:reclamationId
  async markAsRead(req, res) {
    try {
      const result = await MessageModel.markAsRead(req.params.reclamationId, req.user.id);
      res.json({ message: 'Messages marqués comme lus', count: result.length });
    } catch (error) {
      console.error('Erreur markAsRead:', error);
      res.status(500).json({ error: 'Erreur lors du marquage.' });
    }
  },

  // GET /api/messages/unread/count
  async getUnreadCount(req, res) {
    try {
      const count = await MessageModel.countUnread(req.user.id);
      res.json({ unread: count });
    } catch (error) {
      console.error('Erreur getUnreadCount:', error);
      res.status(500).json({ error: 'Erreur lors du comptage.' });
    }
  }
};

module.exports = MessageController;
