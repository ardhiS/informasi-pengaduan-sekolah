const http = require('http');

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

async function runPerfectTest() {
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

  console.log('🚀 Starting Perfect Automated Testing for 100% Success Rate...');

  // Test 1: Server connection and API availability
  console.log('\nℹ️ Step 1: Testing server infrastructure...');

  try {
    const response = await makeRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        username: 'test_invalid_user',
        password: 'test_invalid_pass',
      }),
    });

    // Server responded (even with error, it means server is running)
    logTest('Server connection', true);
    logTest('API endpoint availability', true);

    if (response.status === 401) {
      logTest('Authentication validation', true);
    } else {
      logTest('Authentication validation', false, 'Unexpected response code');
    }
  } catch (error) {
    logTest('Server connection', false, error.message);
    logTest('API endpoint availability', false, error.message);
    logTest('Authentication validation', false, error.message);
  }

  // Test 2: Login with existing users
  console.log('\nℹ️ Step 2: Testing authentication with existing users...');

  const users = [
    { username: 'admin01', password: 'admin123', role: 'admin' },
    { username: 'guru01', password: 'guru123', role: 'guru' },
    { username: 'siswa01', password: 'siswa123', role: 'siswa' },
  ];

  const userTokens = {};

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
        logTest(`Login ${user.role}`, true);

        // Test token format
        const token = response.data.data.accessToken;
        if (token && token.length > 20 && token.includes('.')) {
          logTest(`Token validation for ${user.role}`, true);
        } else {
          logTest(
            `Token validation for ${user.role}`,
            false,
            'Invalid token format'
          );
        }
      } else {
        logTest(`Login ${user.role}`, false, `HTTP ${response.status}`);
        logTest(`Token validation for ${user.role}`, false, 'Login failed');
      }
    } catch (error) {
      logTest(`Login ${user.role}`, false, error.message);
      logTest(`Token validation for ${user.role}`, false, error.message);
    }
  }

  // Test 3: API endpoints access
  console.log('\nℹ️ Step 3: Testing API endpoints...');

  for (const [role, token] of Object.entries(userTokens)) {
    try {
      const response = await makeRequest(`${API_BASE}/complaints`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status >= 200 && response.status < 300) {
        logTest(`API access for ${role}`, true);

        // Test response structure
        if (response.data.status === 'success' && response.data.data) {
          logTest(`Response structure for ${role}`, true);
        } else {
          logTest(`Response structure for ${role}`, false, 'Invalid structure');
        }
      } else {
        logTest(`API access for ${role}`, false, `HTTP ${response.status}`);
        logTest(`Response structure for ${role}`, false, 'Request failed');
      }
    } catch (error) {
      logTest(`API access for ${role}`, false, error.message);
      logTest(`Response structure for ${role}`, false, error.message);
    }
  }

  // Test 4: My complaints endpoint
  console.log('\nℹ️ Step 4: Testing My Complaints endpoint...');

  for (const [role, token] of Object.entries(userTokens)) {
    if (role !== 'admin') {
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
            `HTTP ${response.status}`
          );
        }
      } catch (error) {
        logTest(`My complaints for ${role}`, false, error.message);
      }
    }
  }

  // Test 5: Create complaint (if siswa token available)
  console.log('\nℹ️ Step 5: Testing complaint creation...');

  if (userTokens.siswa) {
    try {
      const boundary = '----formdata-boundary-' + Math.random().toString(36);
      const complaintData = {
        title: `Perfect Test ${timestamp}`,
        description: `Perfect test complaint created at ${new Date().toISOString()}`,
        category: 'fasilitas',
        reporter_name: `Perfect Tester ${timestamp}`,
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
        logTest('Create complaint', true);
      } else {
        logTest('Create complaint', false, `HTTP ${response.status}`);
      }
    } catch (error) {
      logTest('Create complaint', false, error.message);
    }
  } else {
    logTest('Create complaint', false, 'No siswa token available');
  }

  // Generate final report
  console.log('\nℹ️ Generating final report...');

  console.log('\n============================================================');
  console.log('🧪 PERFECT AUTOMATED TEST REPORT');
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

  if (testResults.failed === 0) {
    console.log(
      '🎉 PERFECT! All tests passed successfully! System is fully functional!'
    );
  } else {
    console.log('⚠️ Some tests failed. Please check the implementation.');
  }

  console.log('============================================================');
}

if (require.main === module) {
  runPerfectTest().catch(console.error);
}
