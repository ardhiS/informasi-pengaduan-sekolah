// Debug script untuk test endpoint users dengan token yang valid
const debugUsersEndpoint = async () => {
  try {
    console.log('=== DEBUG USERS ENDPOINT ===');

    // Ambil token dari localStorage (seperti yang dilakukan frontend)
    const token = localStorage.getItem('accessToken');
    console.log('Token from localStorage:', token ? 'Found' : 'Not found');

    if (!token) {
      console.log('❌ No token found. Please login first.');
      return;
    }

    // Test endpoint users
    console.log('\nTesting GET /users with token...');
    const response = await fetch('http://localhost:5000/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);

    const data = await response.text();
    console.log('Response body:', data);

    if (response.ok) {
      console.log('✅ Users endpoint working!');
      try {
        const jsonData = JSON.parse(data);
        console.log('Parsed data:', jsonData);
        console.log('Users count:', jsonData.data?.users?.length || 0);
      } catch (e) {
        console.log('Could not parse as JSON');
      }
    } else {
      console.log('❌ Users endpoint failed!');
      if (response.status === 401) {
        console.log('Token might be expired or invalid');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Run in browser console
debugUsersEndpoint();
