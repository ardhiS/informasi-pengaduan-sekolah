// Test Database Connection with correct env
require('dotenv').config();
const { Pool } = require('pg');

const testDatabase = async () => {
  console.log('🔧 Using environment variables:');
  console.log('PGHOST:', process.env.PGHOST);
  console.log('PGPORT:', process.env.PGPORT);
  console.log('PGUSER:', process.env.PGUSER);
  console.log('PGDATABASE:', process.env.PGDATABASE);
  console.log('PGPASSWORD:', process.env.PGPASSWORD ? '***' : 'NOT SET');

  const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
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

    // Test 3: Get table list
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('📋 Available tables:');
    tables.rows.forEach((row) => {
      console.log(' -', row.table_name);
    });

    // Test 4: If complaints table exists, check structure
    if (tableCheck.rows[0].exists) {
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'complaints'
        ORDER BY ordinal_position;
      `);

      console.log('🏗️ Complaints table structure:');
      columns.rows.forEach((col) => {
        console.log(
          `  ${col.column_name}: ${col.data_type} ${
            col.is_nullable === 'NO' ? '(NOT NULL)' : ''
          }`
        );
      });

      // Test 5: Count records
      const count = await client.query('SELECT COUNT(*) FROM complaints');
      console.log('📈 Total complaints:', count.rows[0].count);
    }

    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('❌ Full error:', error);
  }
};

testDatabase();
