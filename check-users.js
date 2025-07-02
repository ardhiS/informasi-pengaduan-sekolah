// Check available users in database
const { Pool } = require('pg');

const checkUsers = async () => {
  const pool = new Pool({
    user: 'developer',
    host: 'localhost',
    database: 'notesapp',
    password: 'supersecretpassword',
    port: 5432,
  });

  try {
    const result = await pool.query(
      'SELECT username, role, fullname FROM users ORDER BY role, username;'
    );
    console.log('Available users in database:');
    result.rows.forEach((row) => {
      console.log(`- ${row.username} (${row.role}) - ${row.fullname}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
};

checkUsers();
