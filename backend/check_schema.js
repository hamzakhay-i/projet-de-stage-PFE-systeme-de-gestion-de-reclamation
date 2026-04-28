const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Admin123!@localhost:5432/sgr_db' });

pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'")
  .then(r => {
    fs.writeFileSync('schema_dump.json', JSON.stringify(r.rows, null, 2));
  })
  .catch(console.error)
  .finally(() => pool.end());
