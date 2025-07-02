// Test frontend complaints access for siswa
const testFrontendSiswaAccess = async () => {
  try {
    console.log('🧪 Testing frontend complaints access for siswa...\n');

    // First check if backend is running
    console.log('0. Checking backend connectivity...');
    try {
      const healthResponse = await fetch('http://localhost:5000/');
      console.log('✅ Backend is reachable');
    } catch (error) {
      console.log('❌ Backend not reachable:', error.message);
      return;
    }

    // 1. Test login siswa
    const loginData = {
      username: 'siswa01',
      password: 'siswa123',
    };

    console.log('1. Testing siswa login...');
    const authResponse = await fetch('http://localhost:5000/authentications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    if (!authResponse.ok) {
      console.log('❌ Login failed:', authResponse.status);
      return;
    }

    const authData = await authResponse.json();
    const token = authData.data.accessToken;
    console.log('✅ Siswa login successful');

    // 2. Test complaints endpoint
    console.log('\n2. Testing complaints endpoint...');
    const complaintsResponse = await fetch('http://localhost:5000/complaints', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (complaintsResponse.ok) {
      const complaintsData = await complaintsResponse.json();
      console.log('✅ Complaints endpoint accessible');
      console.log(
        'Complaints count:',
        complaintsData.data.complaints?.length || 0
      );
    } else {
      console.log('❌ Complaints endpoint failed:', complaintsResponse.status);
      const error = await complaintsResponse.text();
      console.log('Error:', error);
    }

    // 3. Test stats endpoint
    console.log('\n3. Testing stats endpoint...');
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

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Stats endpoint accessible');
      console.log('Stats summary:', {
        total: statsData.data.stats.total,
        pending: statsData.data.stats.pending,
        role: statsData.data.stats.user_permissions?.role,
      });
    } else {
      console.log('❌ Stats endpoint failed:', statsResponse.status);
      const error = await statsResponse.text();
      console.log('Error:', error);
    }

    console.log('\n🎉 All frontend tests completed!');
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

testFrontendSiswaAccess();
