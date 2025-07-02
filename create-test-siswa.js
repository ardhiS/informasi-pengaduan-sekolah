// Create test siswa user for testing
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const createTestSiswa = async () => {
  const pool = new Pool({
    user: 'developer',
    host: 'localhost',
    database: 'notesapp',
    password: 'supersecretpassword',
    port: 5432,
  });

  try {
    // Generate unique ID for user (similar to existing pattern)
    const userId = `user-${Date.now()}-siswa`;

    // Hash password
    const hashedPassword = await bcrypt.hash('siswa123', 10);

    // Insert test siswa
    const result = await pool.query(
      'INSERT INTO users (id, username, password, fullname, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (username) DO UPDATE SET password = $3, fullname = $4, role = $5 RETURNING *;',
      [userId, 'siswa01', hashedPassword, 'Test Siswa User', 'siswa']
    );

    console.log('✅ Test siswa user created/updated:', result.rows[0]);
  } catch (error) {
    console.error('Error creating test siswa:', error.message);
  } finally {
    await pool.end();
  }
};

createTestSiswa();
