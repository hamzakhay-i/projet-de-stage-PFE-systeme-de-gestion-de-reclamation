const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Admin123!@localhost:5432/sgr_db' });

pool.query("SELECT id, email, password FROM users WHERE email='admin@sgr.com'")
.then(r => console.log(r.rows))
.catch(console.error)
.finally(() => pool.end());
