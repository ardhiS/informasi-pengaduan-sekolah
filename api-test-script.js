// Quick API Test Script
// Modified for Node.js execution

const http = require('http');

const API_BASE = 'http://localhost:5000/api';

// Simple fetch implementation for Node.js
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlParts = new URL(url);
    const requestOptions = {
      hostname: urlParts.hostname,
      port: urlParts.port || 80,
      path: urlParts.pathname + urlParts.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          json: () => Promise.resolve(JSON.parse(data)),
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// FormData implementation for Node.js
class FormData {
  constructor() {
    this.data = {};
    this.boundary = '----formdata-boundary-' + Math.random().toString(36);
  }

  append(key, value) {
    this.data[key] = value;
  }

  toString() {
    let result = '';
    for (const [key, value] of Object.entries(this.data)) {
      result += `--${this.boundary}\r\n`;
      result += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
      result += `${value}\r\n`;
    }
    result += `--${this.boundary}--\r\n`;
    return result;
  }

  getBoundary() {
    return this.boundary;
  }
}

// Test 1: Create Test Users
async function createTestUsers() {
  const users = [
    {
      username: 'admin01',
      password: 'admin123',
      fullname: 'Administrator Test',
      role: 'admin',
    },
    {
      username: 'guru01',
      password: 'guru123',
      fullname: 'Guru Test',
      role: 'guru',
    },
    {
      username: 'siswa01',
      password: 'siswa123',
      fullname: 'Siswa Test',
      role: 'siswa',
    },
  ];

  for (const user of users) {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const result = await response.json();
      console.log(`✅ Created user: ${user.username}`, result);
    } catch (error) {
      console.log(`❌ Failed to create ${user.username}:`, error.message);
    }
  }
}

// Test 2: Login and get token
async function testLogin(username, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    console.log(`✅ Login success for ${username}:`, result);
    return result.data.accessToken;
  } catch (error) {
    console.log(`❌ Login failed for ${username}:`, error.message);
  }
}

// Test 3: Test Complaints API with different roles
async function testComplaintsAPI(token, role) {
  try {
    const response = await fetch(`${API_BASE}/complaints`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    console.log(`✅ Complaints API for ${role}:`, result);
    return result;
  } catch (error) {
    console.log(`❌ Complaints API failed for ${role}:`, error.message);
  }
}

// Test 4: Create complaint with FormData (simulate image upload)
async function testCreateComplaint(token) {
  const formData = new FormData();
  formData.append('title', 'Test Complaint with Images');
  formData.append('description', 'Testing image upload functionality');
  formData.append('category', 'fasilitas');
  formData.append('priority', 'medium');
  formData.append('reporter_name', 'Test User');
  formData.append('reporter_type', 'siswa');

  try {
    const response = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        'Content-Length': Buffer.byteLength(formData.toString()),
      },
      body: formData.toString(),
    });
    const result = await response.json();
    console.log('✅ Create complaint:', result);
    return result;
  } catch (error) {
    console.log('❌ Create complaint failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting API Tests...');

  // Step 1: Create users
  console.log('\n1. Creating test users...');
  await createTestUsers();

  // Step 2: Test login for each role
  console.log('\n2. Testing login...');
  const adminToken = await testLogin('admin01', 'admin123');
  const guruToken = await testLogin('guru01', 'guru123');
  const siswaToken = await testLogin('siswa01', 'siswa123');

  // Step 3: Test complaints API for each role
  if (adminToken) {
    console.log('\n3. Testing complaints API as Admin...');
    await testComplaintsAPI(adminToken, 'admin');
  }

  if (guruToken) {
    console.log('\n4. Testing complaints API as Guru...');
    await testComplaintsAPI(guruToken, 'guru');
  }

  if (siswaToken) {
    console.log('\n5. Testing complaints API as Siswa...');
    await testComplaintsAPI(siswaToken, 'siswa');

    // Test create complaint
    console.log('\n6. Testing create complaint...');
    await testCreateComplaint(siswaToken);
  }

  console.log('\n✅ All tests completed!');
}

// Uncomment to run tests
runAllTests();

console.log('API Test Script loaded. Running all tests...');
