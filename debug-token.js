// Debug JWT Token Structure
const { jwtDecode } = require('jwt-decode');

const debugToken = async () => {
  try {
    console.log('🔐 Getting token and debugging...');

    // Get token
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

    const authData = await authResponse.json();
    const token = authData.data.accessToken;

    console.log('📋 Raw Token:', token);

    // Decode token
    try {
      const decoded = jwtDecode(token);
      console.log('🔍 Decoded Token:', JSON.stringify(decoded, null, 2));
    } catch (error) {
      console.error('❌ Token decode failed:', error.message);
    }
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
};

debugToken();
