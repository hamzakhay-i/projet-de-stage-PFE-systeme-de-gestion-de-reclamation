const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Admin123!@localhost:5432/sgr_db' });

(async () => {
  try {
    console.log('Dropping old tables...');
    await pool.query('DROP TABLE IF EXISTS messages CASCADE;');
    await pool.query('DROP TABLE IF EXISTS reclamations CASCADE;');
    await pool.query('DROP TABLE IF EXISTS users CASCADE;');
    
    console.log('Reading init.sql...');
    const initSql = fs.readFileSync('../database/init.sql', 'utf8');
    
    console.log('Executing init.sql...');
    await pool.query(initSql);
    console.log('Database successfully re-initialized!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
})();
