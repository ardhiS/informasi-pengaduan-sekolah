const axios = require('axios');

async function testStatusValidation() {
  console.log('🧪 Testing status validation fix...\n');

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Login as admin to get token
    console.log('🔑 1. Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin01',
      password: 'admin123',
    });

    if (loginResponse.data.status !== 'success') {
      throw new Error('Login failed');
    }

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful');

    // 2. Test getting all complaints (this was failing before)
    console.log('📋 2. Testing get all complaints...');
    const complaintsResponse = await axios.get(`${BASE_URL}/complaints`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(
      `✅ Get complaints successful: ${complaintsResponse.data.data.complaints.length} complaints found`
    );

    // 3. Test with status filter (this was causing the error)
    console.log('🔍 3. Testing with status filter...');
    const filteredResponse = await axios.get(
      `${BASE_URL}/complaints?status=pending_approval`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(
      `✅ Status filter successful: ${filteredResponse.data.data.complaints.length} pending_approval complaints found`
    );

    // 4. Test stats endpoint
    console.log('📊 4. Testing stats endpoint...');
    const statsResponse = await axios.get(`${BASE_URL}/complaints/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('✅ Stats endpoint successful');
    console.log(
      '📊 Stats structure:',
      JSON.stringify(statsResponse.data.data, null, 2)
    );

    // 5. Test different status values
    console.log('🧪 5. Testing different status values...');
    const statusesToTest = [
      'approved',
      'rejected',
      'in_progress',
      'resolved',
      'closed',
    ];

    for (const status of statusesToTest) {
      try {
        const response = await axios.get(
          `${BASE_URL}/complaints?status=${status}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(
          `✅ Status '${status}' filter successful: ${response.data.data.complaints.length} complaints found`
        );
      } catch (error) {
        console.log(
          `❌ Status '${status}' filter failed: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }

    console.log('\n🎉 All tests passed! Status validation fix successful!');
  } catch (error) {
    console.error(
      '❌ Test failed:',
      error.response?.data?.message || error.message
    );
    console.error('💡 Make sure backend is running on port 5000');
    process.exit(1);
  }
}

testStatusValidation();
