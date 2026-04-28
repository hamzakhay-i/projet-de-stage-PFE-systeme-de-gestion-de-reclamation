require('dotenv').config();
const pool = require('./config/db.js');

async function debug() {
  try {
     await pool.query("ALTER TABLE reclamations DROP CONSTRAINT reclamations_priorite_check;");
     console.log("DROPPED!");
  } catch(e) {
     console.log("DROP ERROR: " + e.message);
  }
  process.exit();
}
debug();
