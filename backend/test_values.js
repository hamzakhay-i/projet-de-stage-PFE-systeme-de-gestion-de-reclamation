require('dotenv').config();
const pool = require('./config/db.js');

async function debug() {
  try {
     const res = await pool.query("SELECT DISTINCT priorite FROM reclamations;");
     console.log("Existing priorities:", res.rows.map(r => r.priorite).join(", "));
     
     // Let's just force update EVERYTHING that is not 'urgente' to 'normale'
     await pool.query("UPDATE reclamations SET priorite = 'normale' WHERE priorite != 'urgente';");
     console.log("Forced all non-urgent to normale.");
     
     await pool.query("ALTER TABLE reclamations ADD CONSTRAINT reclamations_priorite_check CHECK (priorite IN ('normale', 'urgente'));");
     console.log("Constraint added!");
  } catch(e) {
     console.log("ERROR: " + e.message);
  }
  process.exit();
}
debug();
