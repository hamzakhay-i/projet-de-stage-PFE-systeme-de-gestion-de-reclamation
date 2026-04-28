const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:Admin123!@localhost:5432/sgr_db' });

(async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('Admin123!', salt);
    await pool.query("UPDATE users SET password = $1 WHERE email = 'admin@sgr.com'", [hash]);
    console.log('Admin password successfully reset to Admin123!');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
})();
