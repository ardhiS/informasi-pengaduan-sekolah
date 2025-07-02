// Test the complaints stats endpoint specifically
const testStatsEndpoint = async () => {
  try {
    console.log('🔍 Testing complaints stats endpoint...');

    // Get token first
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

    // Test stats endpoint
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

    console.log('📊 Stats endpoint status:', statsResponse.status);

    if (statsResponse.ok) {
      const data = await statsResponse.json();
      console.log('✅ Stats success:', JSON.stringify(data, null, 2));
    } else {
      const error = await statsResponse.text();
      console.log('❌ Stats error:', error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
};

testStatsEndpoint();
