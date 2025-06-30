// Test yang bisa dijalankan di Node.js untuk debug users endpoint
const testUsersWithRealToken = async () => {
  try {
    console.log('=== TESTING USERS ENDPOINT WITH REAL AUTH ===\n');

    // Step 1: Register new user
    console.log('1. Registering new user...');
    const registerResponse = await fetch(
      'http://localhost:5000/auth/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: `user${Date.now()}`,
          password: 'password123',
          fullname: 'Test User',
          role: 'siswa',
        }),
      }
    );

    const registerData = await registerResponse.json();
    console.log('Register response:', registerData);

    // Step 2: Login to get token
    console.log('\n2. Logging in...');
    const loginResponse = await fetch('http://localhost:5000/authentications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `user${Date.now() - 1000}`, // Use different username for existing user
        password: 'password123',
      }),
    });

    if (!loginResponse.ok) {
      // Try with a test user that might exist
      console.log('Login failed, trying with test credentials...');
      const loginResponse2 = await fetch(
        'http://localhost:5000/authentications',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'admin',
            password: 'admin123',
          }),
        }
      );

      if (!loginResponse2.ok) {
        console.log('❌ Could not login. Creating admin user first...');

        // Register admin user
        await fetch('http://localhost:5000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'admin',
            password: 'admin123',
            fullname: 'Administrator',
            role: 'admin',
          }),
        });

        // Now try login again
        const loginResponse3 = await fetch(
          'http://localhost:5000/authentications',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'admin',
              password: 'admin123',
            }),
          }
        );

        if (!loginResponse3.ok) {
          console.log('❌ Still cannot login');
          return;
        }

        const loginData = await loginResponse3.json();
        console.log('Login successful:', loginData);

        // Step 3: Test users endpoint
        console.log('\n3. Testing users endpoint...');
        const usersResponse = await fetch('http://localhost:5000/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${loginData.data.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Users response status:', usersResponse.status);
        const usersData = await usersResponse.text();
        console.log('Users response body:', usersData);

        if (usersResponse.ok) {
          console.log('✅ Users endpoint working!');
          try {
            const parsed = JSON.parse(usersData);
            console.log('Number of users:', parsed.data?.users?.length || 0);
          } catch (e) {
            console.log('Could not parse JSON');
          }
        } else {
          console.log('❌ Users endpoint failed');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testUsersWithRealToken();
