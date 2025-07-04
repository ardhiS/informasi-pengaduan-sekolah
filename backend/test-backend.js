// Test backend configuration
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });

console.log('🔧 Testing Backend Configuration...');
console.log('Environment variables:');
console.log('- PGUSER:', process.env.PGUSER);
console.log('- PGHOST:', process.env.PGHOST);
console.log('- PGPORT:', process.env.PGPORT);
console.log('- PGDATABASE:', process.env.PGDATABASE);
console.log('- PORT:', process.env.PORT);

// Test PostgreSQL connection
const { Pool } = require('pg');

const testConnection = async () => {
  try {
    const pool = new Pool({
      user: process.env.PGUSER || 'developer',
      host: process.env.PGHOST || 'localhost',
      database: process.env.PGDATABASE || 'notesapp',
      password: process.env.PGPASSWORD || 'supersecretpassword',
      port: process.env.PGPORT || 5432,
    });

    console.log('🔍 Testing database connection...');
    const client = await pool.connect();
    await client.query('SELECT 1 as test');
    client.release();

    console.log('✅ Database connection successful!');

    // Test complaints table
    const testQuery = await pool.query('SELECT COUNT(*) FROM complaints');
    console.log(
      '✅ Complaints table exists, total records:',
      testQuery.rows[0].count
    );

    await pool.end();

    console.log('🚀 Backend is ready to start!');
    console.log('Run: node backend/src/server.js');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check PostgreSQL service and database configuration');
  }
};

testConnection();
