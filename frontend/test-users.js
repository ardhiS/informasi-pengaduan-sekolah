// Test script untuk mengecek endpoint /users
const testUsersEndpoint = async () => {
  try {
    console.log('Testing /users endpoint...');

    // Step 1: Test register untuk mendapatkan user baru
    console.log('\n1. Testing registration...');
    const registerResponse = await fetch(
      'http://localhost:5000/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'testuser123',
          password: 'testpass123',
          fullname: 'Test User 123',
          role: 'siswa',
        }),
      }
    );

    console.log('Register Response status:', registerResponse.status);
    const registerData = await registerResponse.text();
    console.log('Register Response body:', registerData);

    // Step 2: Test login untuk mendapatkan token
    console.log('\n2. Testing login...');
    const loginResponse = await fetch('http://localhost:5000/authentications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        password: 'testpass123',
      }),
    });

    console.log('Login Response status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login Response body:', loginData);

    if (!loginResponse.ok) {
      console.log('❌ Login failed, cannot test /users endpoint');
      return;
    }

    const accessToken = loginData.data.accessToken;

    // Step 3: Test GET /users dengan token
    console.log('\n3. Testing GET /users...');
    const usersResponse = await fetch('http://localhost:5000/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Users Response status:', usersResponse.status);
    const usersData = await usersResponse.text();
    console.log('Users Response body:', usersData);

    if (usersResponse.ok) {
      console.log('✅ /users endpoint working!');
    } else {
      console.log('❌ /users endpoint failed!');
    }
  } catch (error) {
    console.error('❌ Error testing /users endpoint:', error);
  }
};

testUsersEndpoint();
