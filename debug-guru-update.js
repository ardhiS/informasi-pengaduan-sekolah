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

async function debugGuruUpdate() {
  const API_BASE = 'http://localhost:5000/api';

  // Login as guru first
  console.log('🔑 Logging in as guru...');
  const loginResponse = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      username: 'guru01',
      password: 'guru123',
    }),
  });

  if (loginResponse.status !== 200) {
    console.log('❌ Login failed:', loginResponse);
    return;
  }

  const token = loginResponse.data.data.accessToken;
  console.log('✅ Login successful');

  // Get all complaints
  console.log('📋 Getting all complaints...');
  const complaintsResponse = await makeRequest(`${API_BASE}/complaints`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(
    'Complaints response:',
    JSON.stringify(complaintsResponse, null, 2)
  );

  if (
    complaintsResponse.status === 200 &&
    complaintsResponse.data.data.complaints.length > 0
  ) {
    const complaint = complaintsResponse.data.data.complaints[0];
    console.log(
      `\n📝 Trying to update complaint ${complaint.id} (status: ${complaint.status})`
    );

    // Try to update status
    const updateResponse = await makeRequest(
      `${API_BASE}/complaints/${complaint.id}/progress`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({
          status: 'in_progress',
          notes: 'Sedang ditindaklanjuti oleh guru',
        }),
      }
    );

    console.log('Update response:', JSON.stringify(updateResponse, null, 2));
  } else {
    console.log('❌ No complaints found or error getting complaints');
  }
}

debugGuruUpdate().catch(console.error);
