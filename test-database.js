// Test Database Connection
const { Pool } = require('pg');

const testDatabase = async () => {
  const pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'password',
    database: process.env.PGDATABASE || 'school_management',
  });

  try {
    console.log('🔍 Testing database connection...');

    // Test 1: Basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');

    // Test 2: Check if complaints table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'complaints'
      );
    `);

    console.log('📊 Complaints table exists:', tableCheck.rows[0].exists);

    // Test 3: Count rows in complaints table
    if (tableCheck.rows[0].exists) {
      const countResult = await client.query('SELECT COUNT(*) FROM complaints');
      console.log('📈 Total complaints:', countResult.rows[0].count);

      // Test 4: Sample query (same as API)
      const sampleQuery = await client.query(`
        SELECT c.*
        FROM complaints c
        WHERE 1=1
        ORDER BY c.reported_at DESC LIMIT 10 OFFSET 0
      `);
      console.log('📋 Sample complaints:', sampleQuery.rows.length, 'rows');
    } else {
      console.log('❌ Complaints table does not exist!');
    }

    client.release();
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('❌ Full error:', error);
  } finally {
    await pool.end();
  }
};

testDatabase();
