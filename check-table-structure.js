// Check users table structure
const { Pool } = require('pg');

const checkUsersTable = async () => {
  const pool = new Pool({
    user: 'developer',
    host: 'localhost',
    database: 'notesapp',
    password: 'supersecretpassword',
    port: 5432,
  });

  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);

    console.log('Users table structure:');
    result.rows.forEach((row) => {
      console.log(
        `- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default})`
      );
    });

    // Also get the max ID to see what we should use
    const maxIdResult = await pool.query(
      'SELECT MAX(id) as max_id FROM users;'
    );
    console.log('\nCurrent max ID:', maxIdResult.rows[0].max_id);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
};

checkUsersTable();
