// Test script untuk mengecek koneksi ke backend
const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');

    // Test basic connection
    const response = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass123',
        fullname: 'Test User',
        role: 'siswa',
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    const data = await response.text();
    console.log('Response body:', data);

    if (response.ok) {
      console.log('✅ Backend connection successful!');
    } else {
      console.log('❌ Backend connection failed!');
    }
  } catch (error) {
    console.error('❌ Error connecting to backend:', error);
  }
};

testBackendConnection();
