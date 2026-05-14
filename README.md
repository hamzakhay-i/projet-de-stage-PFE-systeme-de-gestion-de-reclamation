 Gestion des Réclamations

Une plateforme web full-stack pour la gestion centralisée des réclamations clients.

## ✨ Fonctionnalités
- **Gestion des Tickets** : Création, suivi de statut et priorisation.
- **Chat en Temps Réel** : Discussion interactive entre agents et clients.
- **Administration** : Gestion des utilisateurs et statistiques globales.
- **Sécurité** : Authentification JWT et rôles (Admin/Agent/Client).

## 🛠 Stack Technique
- **Frontend** : Angular 17+ (Signals, Standalone)
- **Backend** : Node.js & Express
- **Base de Données** : PostgreSQL

## 🚀 Installation Rapide

### 1. Base de données
Créer `sgr_db` et exécuter le script :
```bash
psql -U postgres -d sgr_db -f database/init.sql
```

### 2. Lancement (2 terminaux)
- **Backend** : `cd backend && npm install && npm run dev`
- **Frontend** : `cd frontend && npm install && npm start`

## 🔑 Accès Démo (Admin)
- **Email** : `admin@sgr.com`
- **Mot de passe** : `Admin123!`


## 📂 Structure du Projet

```text
gestion_rec/
├── backend/                # API REST Node.js & Express
│   ├── config/             # Connexion DB
│   ├── controllers/        # Logique métier par entité
│   ├── middleware/         # Auth JWT & Protection des routes
│   ├── models/             # Modèles de données & Requêtes SQL
│   └── routes/             # Définition des endpoints API
├── frontend/               # Application Angular (Client)
│   ├── src/app/
│   │   ├── pages/          # Composants de pages (Chat, Dashboard, Listes...)
│   │   ├── services/       # Services de communication API
│   │   └── guards/         # Protection des routes frontend
├── database/               # Scripts SQL d'initialisation
└── README.md               # Documentation principale
```

---

