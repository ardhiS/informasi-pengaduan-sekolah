// Test Backend Complaints with Valid Token
const testComplaintsWithValidToken = async () => {
  try {
    console.log('🔐 Step 1: Getting valid token...');

    // First get a valid token
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

    if (!authResponse.ok) {
      const error = await authResponse.text();
      console.error('❌ Auth failed:', error);
      return;
    }

    const authData = await authResponse.json();
    const token = authData.data.accessToken;
    console.log('✅ Got valid token:', token.substring(0, 50) + '...');

    console.log('📊 Step 2: Testing complaints endpoint with valid token...');

    // Now test complaints with valid token
    const complaintsResponse = await fetch(
      'http://localhost:5000/complaints?limit=100',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('📊 Complaints Response Status:', complaintsResponse.status);

    if (complaintsResponse.ok) {
      const data = await complaintsResponse.json();
      console.log('✅ Complaints Success:', data);
    } else {
      const error = await complaintsResponse.text();
      console.log('❌ Complaints Error:', error);
      console.log(
        '❌ Error Headers:',
        Object.fromEntries(complaintsResponse.headers.entries())
      );
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
};

testComplaintsWithValidToken();
