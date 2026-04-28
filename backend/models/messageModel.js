// ============================================
// SGR V2 — Message Model
// ============================================
const pool = require('../config/db');

const MessageModel = {
  // Créer un message
  async create({ reclamation_id, sender_id, contenu }) {
    const result = await pool.query(
      `INSERT INTO messages (reclamation_id, sender_id, contenu)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [reclamation_id, sender_id, contenu]
    );
    return result.rows[0];
  },

  // Trouver les messages d'une réclamation
  async findByReclamationId(reclamationId) {
    const result = await pool.query(
      `SELECT m.*,
              u.nom as sender_nom, u.prenom as sender_prenom, u.role as sender_role
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.reclamation_id = $1
       ORDER BY m.created_at ASC`,
      [reclamationId]
    );
    return result.rows;
  },

  // Marquer les messages comme lus
  async markAsRead(reclamationId, userId) {
    const result = await pool.query(
      `UPDATE messages SET lu = true
       WHERE reclamation_id = $1 AND sender_id != $2 AND lu = false
       RETURNING id`,
      [reclamationId, userId]
    );
    return result.rows;
  },

  // Compter les messages non lus pour un utilisateur
  async countUnread(userId) {
    const result = await pool.query(
      `SELECT COUNT(*)::int as count
       FROM messages m
       JOIN reclamations r ON m.reclamation_id = r.id
       WHERE m.lu = false AND m.sender_id != $1
         AND (r.client_id = $1 OR r.agent_id = $1)`,
      [userId]
    );
    return result.rows[0].count;
  }
};

module.exports = MessageModel;
