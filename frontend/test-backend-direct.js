// Test Backend Connection
const testBackendAPI = async () => {
  try {
    console.log('🔍 Testing backend connection...');

    // Test 1: Basic connection
    const response = await fetch('http://localhost:5000/health', {
      method: 'GET',
    });

    if (response.ok) {
      console.log('✅ Backend is reachable');
    } else {
      console.log('❌ Backend health check failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
  }

  // Test 2: Authentication endpoint
  try {
    console.log('🔐 Testing authentication endpoint...');

    const authResponse = await fetch('http://localhost:5000/authentications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin01',
        password: 'admin123',
      }),
    });

    console.log('📊 Auth Response Status:', authResponse.status);

    if (authResponse.ok) {
      const data = await authResponse.json();
      console.log('✅ Auth Success:', data);
    } else {
      const error = await authResponse.text();
      console.log('❌ Auth Error:', error);
    }
  } catch (error) {
    console.error('❌ Auth test failed:', error.message);
  }
};

// Run test
testBackendAPI();
