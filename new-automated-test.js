const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlParts = new URL(url);
    const isHttps = urlParts.protocol === 'https:';
    const client = isHttps ? require('https') : http;

    const requestOptions = {
      hostname: urlParts.hostname,
      port: urlParts.port || (isHttps ? 443 : 80),
      path: urlParts.pathname + urlParts.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ data: jsonData, status: res.statusCode });
        } catch (e) {
          resolve({ data, status: res.statusCode });
        }
      });
    });

    req.on('error', reject);

    if (options.data) {
      req.write(options.data);
    }

    req.end();
  });
}

// Create multipart form data
function createMultipartData(fields, boundary) {
  let data = '';

  for (const [key, value] of Object.entries(fields)) {
    data += `--${boundary}\r\n`;
    data += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
    data += `${value}\r\n`;
  }

  data += `--${boundary}--\r\n`;
  return data;
}

async function runNewAutomatedTest() {
  const API_BASE = 'http://localhost:5000/api';
  const timestamp = Date.now().toString().slice(-4);

  const testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    details: [],
  };

  function logTest(name, success, message = '') {
    testResults.total++;
    if (success) {
      testResults.passed++;
      console.log(`✅ [${new Date().toLocaleTimeString()}] ${name}`);
    } else {
      testResults.failed++;
      console.log(
        `❌ [${new Date().toLocaleTimeString()}] ${name}: ${message}`
      );
    }
    testResults.details.push({ name, success, message });
  }

  console.log('🚀 Starting New Automated Testing...');

  // Step 1: Create new users
  console.log('\nℹ️ Step 1: Creating new test users...');

  const users = [
    {
      username: `admin${timestamp}`,
      password: 'admin123',
      fullname: `Admin Test ${timestamp}`,
      role: 'admin',
    },
    {
      username: `guru${timestamp}`,
      password: 'guru123',
      fullname: `Guru Test ${timestamp}`,
      role: 'guru',
    },
    {
      username: `siswa${timestamp}`,
      password: 'siswa123',
      fullname: `Siswa Test ${timestamp}`,
      role: 'siswa',
    },
  ];

  const userTokens = {};

  // Create users
  let usersCreated = false;
  for (const user of users) {
    try {
      const response = await makeRequest(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(user),
      });

      if (response.status >= 200 && response.status < 300) {
        logTest(`Create ${user.role} user (${user.username})`, true);
        usersCreated = true;
      } else {
        logTest(
          `Create ${user.role} user (${user.username})`,
          false,
          `HTTP ${response.status}: ${JSON.stringify(response.data)}`
        );
      }
    } catch (error) {
      logTest(
        `Create ${user.role} user (${user.username})`,
        false,
        error.message
      );
    }
  }

  // If user creation failed, use existing users
  if (!usersCreated) {
    console.log(
      '\n⚠️ User creation failed, using existing users for testing...'
    );
    users[0].username = 'admin01';
    users[0].password = 'admin123';
    users[1].username = 'guru01';
    users[1].password = 'guru123';
    users[2].username = 'siswa01';
    users[2].password = 'siswa123';
  }

  // Step 2: Test login for all users
  console.log('\nℹ️ Step 2: Testing login for new users...');

  for (const user of users) {
    try {
      const response = await makeRequest(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      });

      if (
        response.status >= 200 &&
        response.status < 300 &&
        response.data.data?.accessToken
      ) {
        userTokens[user.role] = response.data.data.accessToken;
        logTest(`Login ${user.role} (${user.username})`, true);
        console.log(
          `🔍 Token stored for ${
            user.role
          }: ${response.data.data.accessToken.substring(0, 20)}...`
        );

        // Test token validity by checking token format
        const token = response.data.data.accessToken;
        if (token && token.length > 20 && token.includes('.')) {
          logTest(`Valid token format for ${user.role}`, true);
        } else {
          logTest(
            `Valid token format for ${user.role}`,
            false,
            'Invalid token format'
          );
        }
      } else {
        logTest(
          `Login ${user.role} (${user.username})`,
          false,
          `HTTP ${response.status}: ${JSON.stringify(response.data)}`
        );
        logTest(`Valid token format for ${user.role}`, false, 'Login failed');
      }
    } catch (error) {
      logTest(`Login ${user.role} (${user.username})`, false, error.message);
    }
  }

  // Step 3: Test create complaint with multipart form data
  console.log('\nℹ️ Step 3: Testing create complaint (multipart)...');

  if (userTokens.siswa) {
    try {
      const boundary = '----formdata-boundary-' + Math.random().toString(36);
      const complaintData = {
        title: `Test Complaint ${timestamp}`,
        description: `This is a test complaint created by automated testing at ${new Date().toISOString()}`,
        category: 'fasilitas',
        reporter_name: `Siswa Test ${timestamp}`,
        reporter_type: 'siswa',
        reporter_class: '8A',
      };

      const formData = createMultipartData(complaintData, boundary);

      const response = await makeRequest(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          Authorization: `Bearer ${userTokens.siswa}`,
          'Content-Length': Buffer.byteLength(formData),
        },
        data: formData,
      });

      if (response.status >= 200 && response.status < 300) {
        logTest('Create complaint (multipart)', true);
        console.log(
          `🎯 Complaint created successfully: ${JSON.stringify(response.data)}`
        );
      } else {
        logTest(
          'Create complaint (multipart)',
          false,
          `HTTP ${response.status}: ${JSON.stringify(response.data)}`
        );
      }
    } catch (error) {
      logTest('Create complaint (multipart)', false, error.message);
    }
  } else {
    logTest('Create complaint (multipart)', false, 'No siswa token available');
  }

  // Step 4: Test role-based access
  console.log('\nℹ️ Step 4: Testing role-based complaint access...');

  for (const [role, token] of Object.entries(userTokens)) {
    try {
      const response = await makeRequest(`${API_BASE}/complaints`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status >= 200 && response.status < 300) {
        const complaints = response.data.data?.complaints || [];
        console.log(`ℹ️ ${role} can see ${complaints.length} complaints`);
        logTest(`Access complaints as ${role}`, true);

        // Test data structure
        if (response.data.status === 'success' && Array.isArray(complaints)) {
          logTest(`Valid data structure for ${role}`, true);
        } else {
          logTest(
            `Valid data structure for ${role}`,
            false,
            'Invalid response structure'
          );
        }
      } else {
        logTest(
          `Access complaints as ${role}`,
          false,
          `HTTP ${response.status}: ${JSON.stringify(response.data)}`
        );
        logTest(`Valid data structure for ${role}`, false, 'Request failed');
      }
    } catch (error) {
      logTest(`Access complaints as ${role}`, false, error.message);
      logTest(`Valid data structure for ${role}`, false, error.message);
    }
  }

  // Step 5: Test My Complaints endpoint
  console.log('\nℹ️ Step 5: Testing My Complaints endpoint...');

  for (const [role, token] of Object.entries(userTokens)) {
    if (role !== 'admin') {
      // Admin doesn't need "my complaints"
      try {
        const response = await makeRequest(`${API_BASE}/complaints/my`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status >= 200 && response.status < 300) {
          logTest(`My complaints for ${role}`, true);
        } else {
          logTest(
            `My complaints for ${role}`,
            false,
            `HTTP ${response.status}: ${JSON.stringify(response.data)}`
          );
        }
      } catch (error) {
        logTest(`My complaints for ${role}`, false, error.message);
      }
    }
  }

  // Generate final report
  console.log('\nℹ️ Generating test report...');

  console.log('\n============================================================');
  console.log('🧪 NEW AUTOMATED TEST REPORT');
  console.log('============================================================');
  console.log(`📊 Total Tests: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⏭️ Skipped: 0`);
  console.log('============================================================');
  console.log('📋 Detailed Results:');

  testResults.details.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const message = result.message ? ` - ${result.message}` : '';
    console.log(`${status} ${index + 1}. ${result.name}${message}`);
  });

  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(
    1
  );
  console.log(`🎯 Success Rate: ${successRate}%`);

  if (testResults.failed > 0) {
    console.log('⚠️ Some tests failed. Please check the implementation.');
  } else {
    console.log('🎉 All tests passed successfully!');
  }

  console.log('============================================================');

  // Display new user credentials
  console.log('\n📝 New Test User Credentials:');
  users.forEach((user) => {
    console.log(`${user.role}: ${user.username} / ${user.password}`);
  });
}

if (require.main === module) {
  runNewAutomatedTest().catch(console.error);
}
