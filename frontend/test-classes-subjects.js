// Test script untuk mengecek endpoint /classes dan /subjects
const testClassesAndSubjects = async () => {
  try {
    console.log('=== TESTING CLASSES AND SUBJECTS ENDPOINTS ===\n');

    // Login untuk mendapatkan token
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:5000/authentications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123',
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Could not login');
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.accessToken;
    console.log('✅ Login successful');

    // Test subjects endpoint
    console.log('\n2. Testing /subjects endpoint...');
    const subjectsResponse = await fetch('http://localhost:5000/subjects', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Subjects Response status:', subjectsResponse.status);
    const subjectsData = await subjectsResponse.text();
    console.log('Subjects Response body:', subjectsData);

    if (subjectsResponse.ok) {
      console.log('✅ Subjects endpoint working!');
      try {
        const parsed = JSON.parse(subjectsData);
        console.log('Number of subjects:', parsed.data?.subjects?.length || 0);
      } catch (e) {
        console.log('Could not parse JSON');
      }
    } else {
      console.log('❌ Subjects endpoint failed');
    }

    // Test classes endpoint
    console.log('\n3. Testing /classes endpoint...');
    const classesResponse = await fetch('http://localhost:5000/classes', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Classes Response status:', classesResponse.status);
    const classesData = await classesResponse.text();
    console.log('Classes Response body:', classesData);

    if (classesResponse.ok) {
      console.log('✅ Classes endpoint working!');
      try {
        const parsed = JSON.parse(classesData);
        console.log('Number of classes:', parsed.data?.classes?.length || 0);
      } catch (e) {
        console.log('Could not parse JSON');
      }
    } else {
      console.log('❌ Classes endpoint failed');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testClassesAndSubjects();
