// ============================================
// SGR V2 — Reclamation Model
// ============================================
const pool = require('../config/db');

const ReclamationModel = {
  // Créer une réclamation
  async create({ titre, description, priorite = 'normale', client_id }) {
    const result = await pool.query(
      `INSERT INTO reclamations (titre, description, priorite, client_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [titre, description, priorite, client_id]
    );
    return result.rows[0];
  },

  // Trouver toutes les réclamations (avec info utilisateurs)
  async findAll() {
    const result = await pool.query(
      `SELECT r.*,
              c.nom as client_nom, c.prenom as client_prenom, c.email as client_email,
              a.nom as agent_nom, a.prenom as agent_prenom, a.email as agent_email
       FROM reclamations r
       LEFT JOIN users c ON r.client_id = c.id
       LEFT JOIN users a ON r.agent_id = a.id
       ORDER BY r.created_at DESC`
    );
    return result.rows;
  },

  // Trouver les réclamations d'un client
  async findByClientId(clientId) {
    const result = await pool.query(
      `SELECT r.*,
              a.nom as agent_nom, a.prenom as agent_prenom
       FROM reclamations r
       LEFT JOIN users a ON r.agent_id = a.id
       WHERE r.client_id = $1
       ORDER BY r.created_at DESC`,
      [clientId]
    );
    return result.rows;
  },

  // Trouver les réclamations assignées à un agent
  async findByAgentId(agentId) {
    const result = await pool.query(
      `SELECT r.*,
              c.nom as client_nom, c.prenom as client_prenom, c.email as client_email
       FROM reclamations r
       LEFT JOIN users c ON r.client_id = c.id
       WHERE r.agent_id = $1
       ORDER BY r.created_at DESC`,
      [agentId]
    );
    return result.rows;
  },

  // Trouver une réclamation par ID
  async findById(id) {
    const result = await pool.query(
      `SELECT r.*,
              c.nom as client_nom, c.prenom as client_prenom, c.email as client_email,
              a.nom as agent_nom, a.prenom as agent_prenom, a.email as agent_email
       FROM reclamations r
       LEFT JOIN users c ON r.client_id = c.id
       LEFT JOIN users a ON r.agent_id = a.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  // Mettre à jour une réclamation
  async update(id, { titre, description, statut, priorite, agent_id }) {
    const result = await pool.query(
      `UPDATE reclamations
       SET titre = COALESCE($1, titre),
           description = COALESCE($2, description),
           statut = COALESCE($3, statut),
           priorite = COALESCE($4, priorite),
           agent_id = COALESCE($5, agent_id),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [titre, description, statut, priorite, agent_id, id]
    );
    return result.rows[0] || null;
  },

  // Supprimer une réclamation
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM reclamations WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  },

  // Statistiques
  async getStats() {
    const result = await pool.query(
      `SELECT
         COUNT(*)::int as total,
         COUNT(*) FILTER (WHERE statut = 'en_attente')::int as en_attente,
         COUNT(*) FILTER (WHERE statut = 'en_cours')::int as en_cours,
         COUNT(*) FILTER (WHERE statut = 'resolue')::int as resolue,
         COUNT(*) FILTER (WHERE statut = 'rejetee')::int as rejetee
       FROM reclamations`
    );
    return result.rows[0];
  },

  // Statistiques pour un client
  async getStatsByClient(clientId) {
    const result = await pool.query(
      `SELECT
         COUNT(*)::int as total,
         COUNT(*) FILTER (WHERE statut = 'en_attente')::int as en_attente,
         COUNT(*) FILTER (WHERE statut = 'en_cours')::int as en_cours,
         COUNT(*) FILTER (WHERE statut = 'resolue')::int as resolue,
         COUNT(*) FILTER (WHERE statut = 'rejetee')::int as rejetee
       FROM reclamations WHERE client_id = $1`,
      [clientId]
    );
    return result.rows[0];
  },

  // Statistiques pour un agent
  async getStatsByAgent(agentId) {
    const result = await pool.query(
      `SELECT
         COUNT(*)::int as total,
         COUNT(*) FILTER (WHERE statut = 'en_attente')::int as en_attente,
         COUNT(*) FILTER (WHERE statut = 'en_cours')::int as en_cours,
         COUNT(*) FILTER (WHERE statut = 'resolue')::int as resolue,
         COUNT(*) FILTER (WHERE statut = 'rejetee')::int as rejetee
       FROM reclamations WHERE agent_id = $1`,
      [agentId]
    );
    return result.rows[0];
  }
};

module.exports = ReclamationModel;
