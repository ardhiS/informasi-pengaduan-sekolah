// Create test guru user for testing
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const createTestGuru = async () => {
  const pool = new Pool({
    user: 'developer',
    host: 'localhost',
    database: 'notesapp',
    password: 'supersecretpassword',
    port: 5432,
  });

  try {
    // Generate unique ID for user (similar to existing pattern)
    const userId = `user-${Date.now()}-guru`;

    // Hash password
    const hashedPassword = await bcrypt.hash('guru123', 10);

    // Insert test guru
    const result = await pool.query(
      'INSERT INTO users (id, username, password, fullname, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username) DO UPDATE SET password = $3, fullname = $4, role = $5 RETURNING *;',
      [userId, 'guru01', hashedPassword, 'Test Guru User', 'guru']
    );

    console.log('✅ Test guru user created/updated:', result.rows[0]);
  } catch (error) {
    console.error('Error creating test guru:', error.message);
  } finally {
    await pool.end();
  }
};

createTestGuru();
