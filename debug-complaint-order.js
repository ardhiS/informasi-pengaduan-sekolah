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

async function checkComplaintOrder() {
  const API_BASE = 'http://localhost:5000/api';

  // Login as admin first
  console.log('🔑 Logging in as admin...');
  const loginResponse = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      username: 'admin01',
      password: 'admin123',
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

  if (complaintsResponse.status === 200) {
    const complaints = complaintsResponse.data.data.complaints;
    console.log(`\n📊 Found ${complaints.length} complaints:`);
    console.log('📅 Urutan berdasarkan reported_at:');

    complaints.forEach((complaint, index) => {
      const date = new Date(complaint.reported_at);
      console.log(
        `${index + 1}. ID: ${complaint.id} | ${date.toLocaleString()} | ${
          complaint.title
        }`
      );
    });

    // Check if it's sorted correctly (newest first)
    let isSortedCorrectly = true;
    for (let i = 1; i < complaints.length; i++) {
      const currentDate = new Date(complaints[i].reported_at);
      const previousDate = new Date(complaints[i - 1].reported_at);
      if (currentDate > previousDate) {
        isSortedCorrectly = false;
        break;
      }
    }

    console.log(
      `\n✅ Urutan sorting: ${
        isSortedCorrectly ? 'BENAR (newest first)' : 'SALAH'
      }`
    );
  } else {
    console.log('❌ Error getting complaints:', complaintsResponse);
  }
}

checkComplaintOrder().catch(console.error);
