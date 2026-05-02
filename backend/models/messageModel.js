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

  // Trouver tous les messages d'une réclamation (avec info expéditeur)
  async findByReclamationId(reclamationId) {
    const result = await pool.query(
      `SELECT m.*, u.nom as sender_nom, u.prenom as sender_prenom, u.role as sender_role
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.reclamation_id = $1
       ORDER BY m.created_at ASC`,
      [reclamationId]
    );
    return result.rows;
  },

  // Marquer comme lu (pour un utilisateur donné dans une réclamation donnée)
  // On marque comme lus les messages que l'autre a envoyés
  async markAsRead(reclamationId, userId) {
    const result = await pool.query(
      `UPDATE messages
       SET lu = true
       WHERE reclamation_id = $1 AND sender_id != $2 AND lu = false
       RETURNING *`,
      [reclamationId, userId]
    );
    return result.rows;
  },

  // Compter les messages non lus pour un utilisateur
  // (ceux envoyés par les autres dans les tickets où il est impliqué)
  async countUnread(userId) {
    // Note: Cette requête peut être plus complexe selon la logique métier exacte.
    // Ici, on compte tous les messages non lus envoyés par quelqu'un d'autre 
    // dans des réclamations liées à cet utilisateur.
    const result = await pool.query(
      `SELECT COUNT(*)::int
       FROM messages m
       JOIN reclamations r ON m.reclamation_id = r.id
       WHERE m.sender_id != $1 
       AND m.lu = false
       AND (r.client_id = $1 OR r.agent_id = $1 OR (SELECT role FROM users WHERE id = $1) = 'admin')`,
      [userId]
    );
    return result.rows[0].count;
  }
};

module.exports = MessageModel;
