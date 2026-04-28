require('dotenv').config();
const pool = require('./config/db.js');

async function debug() {
  try {
     await pool.query("ALTER TABLE reclamations ADD CONSTRAINT reclamations_priorite_check CHECK (priorite IN ('normale', 'urgente'));");
     console.log("ADDED constraint!");
  } catch(e) {
     console.log("ADD ERROR: " + e.message);
  }
  process.exit();
}
debug();
