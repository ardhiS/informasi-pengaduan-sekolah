// Verify token generation for siswa and compare with guru
const jwt = require('jsonwebtoken');
const axios = require('axios');

const verifyTokenGeneration = async () => {
  console.log('🔍 VERIFYING TOKEN GENERATION FOR SISWA VS GURU');
  console.log('===============================================\n');

  const JWT_SECRET = 'your-secret-key';

  try {
    // Test both user types
    const users = [
      { username: 'guru01', password: 'guru123', role: 'guru' },
      { username: 'siswa01', password: 'siswa123', role: 'siswa' },
    ];

    for (const testUser of users) {
      console.log(
        `📝 Testing ${testUser.role.toUpperCase()} (${testUser.username}):`
      );

      // Simulate login
      const loginResponse = await axios.post(
        'http://localhost:5000/authentications',
        {
          username: testUser.username,
          password: testUser.password,
        }
      );

      const token = loginResponse.data.data.accessToken;

      // Decode and analyze token
      const decoded = jwt.verify(token, JWT_SECRET);

      console.log(`✅ Token generated successfully for ${testUser.username}`);
      console.log('Token payload:', {
        userId: decoded.userId,
        username: decoded.username,
        fullname: decoded.fullname,
        role: decoded.role,
        exp: new Date(decoded.exp * 1000),
        isExpired: decoded.exp * 1000 < Date.now(),
      });

      // Test if token works for complaints endpoint
      try {
        const complaintsResponse = await axios.get(
          'http://localhost:5000/complaints',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          `Complaints access: ✅ SUCCESS (${complaintsResponse.status})`
        );
      } catch (error) {
        console.log(
          `Complaints access: ❌ FAILED (${error.response?.status || 'ERROR'})`
        );
        if (error.response?.data) {
          console.log('Error details:', error.response.data);
        }
      }

      // Test stats endpoint
      try {
        const statsResponse = await axios.get(
          'http://localhost:5000/complaints/stats',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(`Stats access: ✅ SUCCESS (${statsResponse.status})`);
        console.log('Stats sample:', {
          total: statsResponse.data.data.stats.total,
          role: statsResponse.data.data.stats.user_permissions?.role,
        });
      } catch (error) {
        console.log(
          `Stats access: ❌ FAILED (${error.response?.status || 'ERROR'})`
        );
        if (error.response?.data) {
          console.log('Error details:', error.response.data);
        }
      }

      console.log(''); // Blank line between users
    }
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
};

verifyTokenGeneration().catch(console.error);
