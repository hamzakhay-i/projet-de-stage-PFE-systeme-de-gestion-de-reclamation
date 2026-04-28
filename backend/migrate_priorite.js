require('dotenv').config();
const pool = require('./config/db.js');

async function migrate() {
  try {
    // 1. Update data to match new domain
    await pool.query("UPDATE reclamations SET priorite = 'normale' WHERE priorite IN ('basse', 'moyenne', 'haute');");
    console.log("Updated rows.");
    
    // 2. Drop by trying both potential names (sometimes auto-generated differently)
    try {
      await pool.query("ALTER TABLE reclamations DROP CONSTRAINT reclamations_priorite_check;");
      console.log("Dropped strict constraint.");
    } catch (e) {
      console.log("No explicit constraint found or already dropped.");
    }

    try {
      // Find unknown constraint names dynamically
      const res = await pool.query(`
        SELECT conname, pg_get_constraintdef(pg_constraint.oid) as def
        FROM pg_constraint 
        JOIN pg_class ON conrelid = pg_class.oid 
        WHERE pg_class.relname = 'reclamations' AND contype = 'c';
      `);
      for (const row of res.rows) {
        if (row.def.includes('priorite')) {
           await pool.query(`ALTER TABLE reclamations DROP CONSTRAINT ${row.conname};`);
           console.log("Dropped dynamic constraint:", row.conname);
        }
      }
    } catch(e) {}

    // 3. Add new constraint safely
    await pool.query("ALTER TABLE reclamations ADD CONSTRAINT reclamations_priorite_check CHECK (priorite IN ('normale', 'urgente'));");
    // 4. Update default
    await pool.query("ALTER TABLE reclamations ALTER COLUMN priorite SET DEFAULT 'normale';");
    
    console.log("Migration de la base de données réussie.");
  } catch (err) {
    console.error("Erreur de migration GLOBALE :", err.message);
  } finally {
    process.exit(0);
  }
}
migrate();
