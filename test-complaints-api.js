// Test Frontend API call to complaints
const testComplaintsAPI = async () => {
  try {
    console.log('🔍 Testing complaints API call...');

    // Simulate the request that frontend makes
    const response = await fetch('http://localhost:5000/complaints?limit=100', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Try without auth first
      },
    });

    console.log('📊 Response Status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success:', data);
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }

  // Test with auth token
  try {
    console.log('🔐 Testing with auth token...');

    const authResponse = await fetch(
      'http://localhost:5000/complaints?limit=100',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer fake-token',
        },
      }
    );

    console.log('🔐 Auth Response Status:', authResponse.status);

    if (authResponse.ok) {
      const data = await authResponse.json();
      console.log('✅ Auth Success:', data);
    } else {
      const error = await authResponse.text();
      console.log('❌ Auth Error:', error);
    }
  } catch (error) {
    console.error('❌ Auth request failed:', error.message);
  }
};

testComplaintsAPI();
