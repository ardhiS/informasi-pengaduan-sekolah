import axios from 'axios';

// Gunakan proxy yang sudah dikonfigurasi di vite.config.js
// Frontend akan proxy request ke backend secara otomatis
const BASE_URL = ''; // Empty karena menggunakan proxy Vite

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Define public endpoints that don't need authentication
    const publicEndpoints = [
      '/complaints/all',
      '/subjects/all',
      '/classes/all',
    ];

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      isPublic: isPublicEndpoint,
    });

    // Skip token check for public endpoints
    if (isPublicEndpoint) {
      console.log('📖 Public endpoint, skipping auth');
      return config;
    }

    const token = localStorage.getItem('accessToken');

    console.log('🔐 Auth check:', {
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 50) + '...' : 'none',
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;

      // Verify token is not expired
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = tokenPayload.exp * 1000 < Date.now();

        if (isExpired) {
          console.warn('⚠️ Token is expired!', {
            exp: new Date(tokenPayload.exp * 1000),
            now: new Date(),
          });
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Don't redirect immediately, let the response interceptor handle it
          return Promise.reject(new Error('Token expired'));
        }

        console.log('✅ Token is valid:', {
          userId: tokenPayload.userId,
          username: tokenPayload.username,
          role: tokenPayload.role,
          exp: new Date(tokenPayload.exp * 1000),
        });
      } catch (err) {
        console.error('❌ Token validation error:', err);
      }
    } else {
      console.warn('⚠️ No token found in localStorage');
    }

    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.response?.headers,
    });

    const originalRequest = error.config;

    // Handle 401/403 errors (unauthorized/forbidden)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('🚫 Authentication/Authorization failed');

      // Check if this is a token-related error
      const errorMessage = error.response?.data?.message || '';
      const isTokenError =
        errorMessage.includes('token') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('forbidden');

      if (isTokenError) {
        console.log('🔄 Clearing invalid tokens and redirecting to login');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Redirect to appropriate login page based on current route
        const currentPath = window.location.pathname;
        if (currentPath.includes('admin')) {
          window.location.href = '/login/admin';
        } else if (
          currentPath.includes('guru') ||
          localStorage.getItem('lastRole') === 'guru'
        ) {
          window.location.href = '/login/guru';
        } else {
          window.location.href = '/login/siswa';
        }
      }
    }

    // Try to refresh token for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          console.log('🔄 Attempting token refresh...');
          const response = await axios.put(`${BASE_URL}/authentications`, {
            refreshToken,
          });

          const { accessToken: newAccessToken } = response.data.data;
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          console.log('✅ Token refreshed successfully');
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login/siswa';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
