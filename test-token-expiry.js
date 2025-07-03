const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlParts = new URL(url);
    const client = http;

    const requestOptions = {
      hostname: urlParts.hostname,
      port: urlParts.port || 80,
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

async function testTokenExpiry() {
  const API_BASE = 'http://localhost:5000/api';

  console.log('🧪 Testing expired token handling...');

  // Test dengan token yang sudah expired atau tidak valid
  const expiredToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJpbnZhbGlkIiwiaWF0IjoxNjA5NDU5MjAwLCJleHAiOjE2MDk0NjI4MDB9.invalid';

  const response = await makeRequest(`${API_BASE}/complaints`, {
    headers: { Authorization: `Bearer ${expiredToken}` },
  });

  console.log('📄 Response with expired token:');
  console.log('Status:', response.status);
  console.log('Data:', JSON.stringify(response.data, null, 2));

  // Test endpoint public sebagai fallback
  console.log('\n🌐 Testing public endpoint...');
  const publicResponse = await makeRequest(`${API_BASE}/complaints/all`);

  console.log('📄 Public endpoint response:');
  console.log('Status:', publicResponse.status);
  console.log('Data:', JSON.stringify(publicResponse.data, null, 2));
}

testTokenExpiry().catch(console.error);
