const http = require('http');

// Simple HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlParts = new URL(url);
    const isHttps = urlParts.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlParts.hostname,
      port: urlParts.port || (isHttps ? 443 : 80),
      path: urlParts.pathname + urlParts.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    console.log('Request options:', JSON.stringify(requestOptions, null, 2));

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

async function testAuth() {
  const API_BASE = 'http://localhost:5000/api';

  console.log('🔑 Testing login...');

  // Login first
  const loginResponse = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      username: 'admin01',
      password: 'admin123',
    }),
  });

  console.log('Login response:', JSON.stringify(loginResponse, null, 2));

  if (loginResponse.status >= 200 && loginResponse.status < 300) {
    const token = loginResponse.data.data.accessToken;
    console.log(`Token: ${token.substring(0, 50)}...`);

    console.log('\n🔍 Testing authenticated request...');

    // Now test authenticated request
    const complaintsResponse = await makeRequest(`${API_BASE}/complaints`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      'Complaints response:',
      JSON.stringify(complaintsResponse, null, 2)
    );
  }
}

testAuth().catch(console.error);
