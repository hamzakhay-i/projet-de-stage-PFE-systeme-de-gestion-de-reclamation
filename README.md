# 🏢 Système de Gestion des Réclamations (SGR) - AL AMANA

Une solution logicielle d'entreprise moderne conçue pour centraliser, traiter et suivre les réclamations clients. Ce projet offre une architecture robuste et une interface utilisateur premium pour une gestion fluide du support client.

---

## ✨ Fonctionnalités Clés

### 🔒 Administration & Sécurité
*   **Contrôle d'accès basé sur les rôles (RBAC)** : Permissions distinctes pour Admin, Agents et Clients.
*   **Authentification Sécurisée** : Utilisation de JWT (JSON Web Tokens) et hachage de mots de passe via Bcrypt.
*   **Gestion des Agents** : Interface admin pour approuver, rejeter ou supprimer les accès des agents.

### 📩 Gestion des Tickets
*   **Flux de travail complet** : Création, assignation automatique/manuelle, et suivi des statuts (*En attente, En cours, Résolue, Rejetée*).
*   **Priorisation intelligente** : Gestion des niveaux d'urgence pour optimiser le temps de réponse.
*   **Recherche Avancée** : Recherche instantanée par ID, titre ou nom de client.

### 💬 Communication en Temps Réel
*   **Chat Enterprise-Grade** : Interface de discussion moderne type "Helpdesk" avec bulles de message, avatars et indicateurs de lecture.
*   **Contexte Initial** : Intégration claire de la description originale de la réclamation dans le flux de discussion.
*   **Verrouillage de sécurité** : Empêche les conflits en limitant la réponse au seul agent assigné au ticket.

---

## 🛠 Stack Technique

*   **Frontend** : [Angular 17+](https://angular.io/) (Composants Standalone, RxJS, Signal State Management).
*   **Backend** : [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/).
*   **Base de Données** : [PostgreSQL](https://www.postgresql.org/).
*   **Styling** : CSS3 moderne avec variables dynamiques (Design System personnalisé).

---

## 🚀 Installation & Configuration

### 1. Prérequis
*   Node.js (v18+)
*   PostgreSQL (v14+)
*   npm (v10+)

### 2. Configuration de la Base de Données
1. Créez une base de données nommée `sgr_db` dans PostgreSQL.
2. Exécutez le script d'initialisation :
   ```bash
   psql -U postgres -d sgr_db -f database/init.sql
   ```

### 3. Backend (Serveur)
1. Allez dans le dossier backend : `cd backend`
2. Installez les dépendances : `npm install`
3. Créez un fichier `.env` basé sur `.env.example` et renseignez vos identifiants PostgreSQL.
4. Lancez le serveur : `npm run dev`

### 4. Frontend (Interface)
1. Allez dans le dossier frontend : `cd frontend`
2. Installez les dépendances : `npm install`
3. Lancez l'application : `npm start`
4. Accédez à l'interface sur : `http://localhost:4300`

---

## 🔑 Identifiants de Test (Démo)

Lors de l'initialisation, un compte administrateur est créé par défaut :
*   **Email** : `admin@sgr.com`
*   **Mot de passe** : `Admin123!`

---

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

