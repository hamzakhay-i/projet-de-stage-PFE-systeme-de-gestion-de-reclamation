-- ============================================
-- SGR V2 — Système de Gestion des Réclamations
-- Script d'initialisation PostgreSQL
-- ============================================

-- Créer la base de données (exécuter séparément si nécessaire)
-- CREATE DATABASE sgr_db;

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'agent', 'client')),
    approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: reclamations
-- ============================================
CREATE TABLE IF NOT EXISTS reclamations (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    statut VARCHAR(30) NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_cours', 'resolue', 'rejetee')),
    priorite VARCHAR(20) NOT NULL DEFAULT 'normale' CHECK (priorite IN ('normale', 'urgente')),
    client_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: messages
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    reclamation_id INTEGER NOT NULL REFERENCES reclamations(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contenu TEXT NOT NULL,
    lu BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEX pour les performances
-- ============================================
CREATE INDEX IF NOT EXISTS idx_reclamations_client ON reclamations(client_id);
CREATE INDEX IF NOT EXISTS idx_reclamations_agent ON reclamations(agent_id);
CREATE INDEX IF NOT EXISTS idx_reclamations_statut ON reclamations(statut);
CREATE INDEX IF NOT EXISTS idx_messages_reclamation ON messages(reclamation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
-- ============================================
-- SEED: Compte administrateur par défaut
-- Mot de passe: Admin123!
-- Hash bcrypt généré avec 10 rounds
-- ============================================
INSERT INTO users (nom, prenom, email, password, role, approved)
VALUES (
    'Admin',
    'SGR',
    'admin@sgr.com',
    '$2a$10$8KzaNdKIMyOkASCykq/MOuVf3MJMdOBGskR4hGLqy5M3R5LVg0Ky',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- Vérification
-- ============================================
-- SELECT * FROM users;
-- SELECT * FROM reclamations;
-- SELECT * FROM messages;
