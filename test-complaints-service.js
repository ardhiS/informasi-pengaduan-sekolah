// Test ComplaintsService directly
const { Pool } = require('pg');

// Test database connection with exact same credentials as backend
const testComplaintsService = async () => {
  try {
    console.log('🔍 Testing database connection...');

    // Use exact same credentials as .env file
    const pool = new Pool({
      host: 'localhost',
      port: 5432,
      user: 'developer',
      password: 'supersecretpassword',
      database: 'notesapp',
    });

    console.log('📊 Using credentials from .env:');
    console.log('PGHOST: localhost');
    console.log('PGPORT: 5432');
    console.log('PGUSER: developer');
    console.log('PGDATABASE: notesapp');
    console.log('PGPASSWORD: ***');

    // Test basic connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Test complaints query exact same as backend
    const query = `
      SELECT c.*
      FROM complaints c
      WHERE 1=1
      ORDER BY c.reported_at DESC LIMIT $1 OFFSET $2
    `;
    const values = [100, 0];

    console.log('📊 Testing complaints query...');
    console.log('Query:', query);
    console.log('Values:', values);

    const result = await pool.query({ text: query, values });
    console.log('✅ Query successful. Rows:', result.rows.length);
    console.log('📄 Sample data:', result.rows[0] || 'No data');

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Error details:', error);
  }
};

testComplaintsService();
