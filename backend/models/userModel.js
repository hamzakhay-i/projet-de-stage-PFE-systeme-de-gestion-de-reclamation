// ============================================
// SGR V2 — User Model
// ============================================
const pool = require('../config/db');

const UserModel = {
  // Trouver un utilisateur par email
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  // Trouver un utilisateur par ID
  async findById(id) {
    const result = await pool.query(
      'SELECT id, nom, prenom, email, role, approved, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Créer un utilisateur
  async create({ nom, prenom, email, password, role = 'client', approved = true }) {
    const result = await pool.query(
      `INSERT INTO users (nom, prenom, email, password, role, approved)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nom, prenom, email, role, approved, created_at`,
      [nom, prenom, email, password, role, approved]
    );
    return result.rows[0];
  },

  // Lister tous les utilisateurs
  async findAll() {
    const result = await pool.query(
      'SELECT id, nom, prenom, email, role, approved, created_at FROM users ORDER BY created_at DESC'
    );
    return result.rows;
  },

  // Lister les agents approuvés uniquement
  async findAgents() {
    const result = await pool.query(
      `SELECT id, nom, prenom, email, role, approved, created_at FROM users WHERE role = 'agent' AND approved = true ORDER BY nom`
    );
    return result.rows;
  },

  // Lister les agents en attente d'approbation
  async findPendingAgents() {
    const result = await pool.query(
      `SELECT id, nom, prenom, email, role, approved, created_at FROM users WHERE role = 'agent' AND approved = false ORDER BY created_at DESC`
    );
    return result.rows;
  },

  // Mettre à jour un utilisateur
  async update(id, { nom, prenom, email, role }) {
    const result = await pool.query(
      `UPDATE users SET nom = COALESCE($1, nom), prenom = COALESCE($2, prenom),
       email = COALESCE($3, email), role = COALESCE($4, role)
       WHERE id = $5
       RETURNING id, nom, prenom, email, role, approved, created_at`,
      [nom, prenom, email, role, id]
    );
    return result.rows[0] || null;
  },

  // Approuver un agent
  async approve(id) {
    const result = await pool.query(
      `UPDATE users SET approved = true WHERE id = $1 AND role = 'agent'
       RETURNING id, nom, prenom, email, role, approved, created_at`,
      [id]
    );
    return result.rows[0] || null;
  },

  // Rejeter un agent (supprime le compte)
  async reject(id) {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 AND role = 'agent' AND approved = false RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  },

  // Supprimer un utilisateur
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  },

  // Compter les utilisateurs par rôle
  async countByRole() {
    const result = await pool.query(
      `SELECT role, COUNT(*)::int as count FROM users GROUP BY role`
    );
    return result.rows;
  }
};

module.exports = UserModel;
