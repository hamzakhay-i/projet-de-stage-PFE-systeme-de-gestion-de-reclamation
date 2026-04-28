const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Admin123!@localhost:5432/sgr_db' });

pool.query(`INSERT INTO users (nom, prenom, email, password, role, approved)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nom, prenom, email, role, approved, created_at`,
      ['t', 't', 't@t.com', 't', 'client', true])
  .then(res => console.log('Success:', res.rows[0]))
  .catch(e => {
     const errorDetails = Object.getOwnPropertyNames(e).map(k => k + ': ' + e[k]).join('\n');
     fs.writeFileSync('db_error.txt', errorDetails);
  })
  .finally(() => pool.end());
