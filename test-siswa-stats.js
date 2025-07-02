// Test stats endpoint specifically for siswa role
const testSiswaStatsAccess = async () => {
  try {
    console.log('🔍 Testing siswa access to stats endpoint...');

    // Login as siswa with known credentials
    const authResponse = await fetch('http://localhost:5000/authentications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'siswa01', password: 'siswa123' }),
    });

    if (!authResponse.ok) {
      console.log('❌ Siswa auth failed:', authResponse.status);
      const error = await authResponse.text();
      console.log('Auth error:', error);
      return;
    }

    const authData = await authResponse.json();
    const token = authData.data.accessToken;
    console.log('✅ Siswa token obtained successfully');
    console.log('Token preview:', token.substring(0, 50) + '...');

    // Test regular complaints endpoint first
    console.log('\n📋 Testing regular complaints endpoint...');
    const complaintsResponse = await fetch('http://localhost:5000/complaints', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Complaints endpoint status:', complaintsResponse.status);
    if (complaintsResponse.ok) {
      const complaintsData = await complaintsResponse.json();
      console.log('✅ Complaints accessible for siswa');
      console.log('User info:', complaintsData.data.user_info);
    } else {
      const error = await complaintsResponse.text();
      console.log('❌ Complaints error:', error);
    }

    // Test stats endpoint
    console.log('\n📊 Testing stats endpoint...');
    const statsResponse = await fetch(
      'http://localhost:5000/complaints/stats',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Stats endpoint status:', statsResponse.status);

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log(
        '✅ Stats accessible for siswa:',
        JSON.stringify(statsData, null, 2)
      );
    } else {
      const error = await statsResponse.text();
      console.log('❌ Stats error:', error);

      // Try to get response headers
      console.log('Response headers:');
      for (let [key, value] of statsResponse.headers.entries()) {
        console.log(`  ${key}: ${value}`);
      }
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
};

testSiswaStatsAccess();
