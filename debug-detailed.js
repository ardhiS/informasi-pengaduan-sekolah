// Step-by-step debug for complaints endpoint
const { Pool } = require('pg');

const testDetailedDebugging = async () => {
  console.log('🔍 DETAILED DEBUGGING STARTED...\n');

  // Step 1: Test database connection
  console.log('1️⃣ Testing database connection...');
  const pool = new Pool({
    user: process.env.PGUSER || 'developer',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'notesapp',
    password: process.env.PGPASSWORD || 'supersecretpassword',
    port: process.env.PGPORT || 5432,
  });

  try {
    const dbResult = await pool.query('SELECT * FROM complaints LIMIT 2');
    console.log(
      '✅ Database connected, found',
      dbResult.rows.length,
      'complaints'
    );
  } catch (error) {
    console.error('❌ Database error:', error.message);
    return;
  }

  // Step 2: Test token validation manually
  console.log('\n2️⃣ Testing token validation...');
  try {
    // Get token
    const authResponse = await fetch('http://localhost:5000/authentications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin01', password: 'admin123' }),
    });

    if (!authResponse.ok) {
      console.log('❌ Auth failed:', authResponse.status);
      return;
    }

    const authData = await authResponse.json();
    const token = authData.data.accessToken;
    console.log('✅ Token obtained successfully');

    // Test simple endpoint first (not complaints)
    console.log('\n3️⃣ Testing simple protected endpoint...');
    const usersResponse = await fetch('http://localhost:5000/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('📊 Users endpoint status:', usersResponse.status);
    if (usersResponse.ok) {
      console.log('✅ Basic auth working with other endpoints');
    } else {
      const errorText = await usersResponse.text();
      console.log('❌ Basic auth failing:', errorText);
    }

    // Test complaints endpoint step by step
    console.log('\n4️⃣ Testing complaints endpoint specifically...');
    const complaintsResponse = await fetch('http://localhost:5000/complaints', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('📊 Complaints endpoint status:', complaintsResponse.status);

    if (complaintsResponse.ok) {
      const data = await complaintsResponse.json();
      console.log('✅ Complaints success:', data);
    } else {
      const errorText = await complaintsResponse.text();
      console.log('❌ Complaints error:', errorText);

      // Check response headers for more info
      console.log('📋 Response headers:');
      for (const [key, value] of complaintsResponse.headers.entries()) {
        console.log(`  ${key}: ${value}`);
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
};

testDetailedDebugging();
