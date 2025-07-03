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

async function createNewUsers() {
  const API_BASE = 'http://localhost:5000/api';
  const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp

  console.log('🚀 Creating new test users...');

  const users = [
    {
      username: `admin${timestamp}`,
      email: `admin${timestamp}@test.com`,
      password: 'admin123',
      name: `Admin Test ${timestamp}`,
      role: 'admin',
    },
    {
      username: `guru${timestamp}`,
      email: `guru${timestamp}@test.com`,
      password: 'guru123',
      name: `Guru Test ${timestamp}`,
      role: 'guru',
    },
    {
      username: `siswa${timestamp}`,
      email: `siswa${timestamp}@test.com`,
      password: 'siswa123',
      name: `Siswa Test ${timestamp}`,
      role: 'siswa',
    },
  ];

  for (const user of users) {
    try {
      console.log(`📝 Creating ${user.role}: ${user.username}`);

      const response = await makeRequest(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(user),
      });

      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ Successfully created ${user.username}`);
      } else {
        console.log(`❌ Failed to create ${user.username}:`, response.data);
      }
    } catch (error) {
      console.log(`❌ Error creating ${user.username}:`, error.message);
    }
  }

  console.log('\n🔍 New users created with credentials:');
  users.forEach((user) => {
    console.log(`${user.role}: ${user.username} / ${user.password}`);
  });

  return users;
}

if (require.main === module) {
  createNewUsers().catch(console.error);
}

module.exports = { createNewUsers };
