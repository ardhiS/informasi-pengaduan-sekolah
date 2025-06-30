// Test script untuk verifikasi koneksi frontend-backend
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const testBackendConnection = async () => {
  const results = {
    backend: false,
    endpoints: {
      auth: false,
      users: false,
      classes: false,
      subjects: false,
      collaborations: false,
    },
    errors: [],
  };

  try {
    // Test 1: Backend Health Check
    console.log('🔍 Testing backend connection...');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    results.backend = true;
    console.log('✅ Backend is running');

    // Test 2: Authentication Endpoint
    try {
      await axios.post(`${BASE_URL}/authentications`, {
        username: 'testuser',
        password: 'wrongpassword',
      });
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 401) {
        results.endpoints.auth = true;
        console.log('✅ Authentication endpoint is responsive');
      }
    }

    // Test 3: Users Endpoint (without auth)
    try {
      await axios.get(`${BASE_URL}/users`);
    } catch (error) {
      if (error.response?.status === 401) {
        results.endpoints.users = true;
        console.log('✅ Users endpoint is protected (requires auth)');
      }
    }

    // Test 4: Classes Endpoint (without auth)
    try {
      await axios.get(`${BASE_URL}/classes`);
    } catch (error) {
      if (error.response?.status === 401) {
        results.endpoints.classes = true;
        console.log('✅ Classes endpoint is protected (requires auth)');
      }
    }

    // Test 5: Subjects Endpoint (without auth)
    try {
      await axios.get(`${BASE_URL}/subjects`);
    } catch (error) {
      if (error.response?.status === 401) {
        results.endpoints.subjects = true;
        console.log('✅ Subjects endpoint is protected (requires auth)');
      }
    }

    // Test 6: Collaborations Endpoint (without auth)
    try {
      await axios.post(`${BASE_URL}/collaborations`, {});
    } catch (error) {
      if (error.response?.status === 401) {
        results.endpoints.collaborations = true;
        console.log('✅ Collaborations endpoint is protected (requires auth)');
      }
    }
  } catch (error) {
    results.errors.push(`Backend connection failed: ${error.message}`);
    console.log('❌ Backend is not running or not accessible');
  }

  return results;
};

export const testWithAuth = async (accessToken) => {
  const authResults = {
    authenticatedRequests: {
      users: false,
      classes: false,
      subjects: false,
    },
    errors: [],
  };

  const authHeaders = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  try {
    // Test authenticated requests
    const usersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: authHeaders,
    });
    authResults.authenticatedRequests.users = true;
    console.log('✅ Authenticated users request successful');

    const classesResponse = await axios.get(`${BASE_URL}/classes`, {
      headers: authHeaders,
    });
    authResults.authenticatedRequests.classes = true;
    console.log('✅ Authenticated classes request successful');

    const subjectsResponse = await axios.get(`${BASE_URL}/subjects`, {
      headers: authHeaders,
    });
    authResults.authenticatedRequests.subjects = true;
    console.log('✅ Authenticated subjects request successful');
  } catch (error) {
    authResults.errors.push(`Authenticated request failed: ${error.message}`);
    console.log('❌ Authenticated requests failed');
  }

  return authResults;
};

// Usage in browser console:
// testBackendConnection().then(results => console.log('Test Results:', results));
