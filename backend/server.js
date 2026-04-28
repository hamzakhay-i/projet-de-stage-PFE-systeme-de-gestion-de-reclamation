// ============================================
// SGR V2 — Server Entry Point
// ============================================
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reclamationRoutes = require('./routes/reclamationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3500;

// ============================================
// Middleware globaux
// ============================================
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4300',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Routes API
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reclamations', reclamationRoutes);
app.use('/api/messages', messageRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SGR V2 API is running', timestamp: new Date() });
});

// ============================================
// Gestion des erreurs 404
// ============================================
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ============================================
// Gestion des erreurs globales
// ============================================
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// ============================================
// Démarrage du serveur
// ============================================
const startServer = async () => {
  try {
    // Test de connexion à la base de données
    const client = await pool.connect();
    console.log('✅ Connexion PostgreSQL réussie');
    client.release();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur SGR V2 démarré sur le port ${PORT}`);
      console.log(`📡 API disponible sur http://localhost:${PORT}/api`);
      console.log(`🔧 Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Impossible de se connecter à PostgreSQL:', error.message);
    process.exit(1);
  }
};

startServer();
