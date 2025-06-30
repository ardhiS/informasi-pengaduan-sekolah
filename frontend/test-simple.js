// Test koneksi sederhana ke backend
const testSimpleConnection = async () => {
  try {
    console.log('Testing simple backend connection...');

    // Test endpoint dasar yang tidak memerlukan auth
    const response = await fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test' + Date.now(),
        password: 'test123',
        fullname: 'Test User',
        role: 'siswa',
      }),
    });

    console.log('Status:', response.status);
    console.log('StatusText:', response.statusText);

    const text = await response.text();
    console.log('Response:', text);

    if (response.ok) {
      console.log('✅ Backend is running!');
    } else {
      console.log('❌ Backend response error');
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend:', error.message);
  }
};

testSimpleConnection();
