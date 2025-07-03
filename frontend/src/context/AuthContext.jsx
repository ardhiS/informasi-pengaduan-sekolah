import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('accessToken')
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem('refreshToken')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      // Set default authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      // Try to get user info
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchUserProfile = async () => {
    try {
      if (accessToken) {
        // Decode JWT to get user info
        try {
          const decodedToken = jwtDecode(accessToken);
          console.log('🔍 Restored token:', decodedToken);

          // Check if token is expired
          const isExpired = decodedToken.exp * 1000 < Date.now();
          if (isExpired) {
            console.warn('⚠️ Stored token is expired, clearing...');
            logout();
            return;
          }

          const userInfo = {
            id: decodedToken.userId,
            username: decodedToken.username,
            fullname: decodedToken.fullname,
            role: decodedToken.role || 'user',
          };
          setUser(userInfo);
          console.log('Restored user info from token:', userInfo);
        } catch (decodeError) {
          console.error('Failed to decode stored token:', decodeError);
          // Token might be invalid, logout
          logout();
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  };

  const login = async (username, password, role = null) => {
    try {
      console.log('🔐 Login attempt:', { username, password: '***', role });

      const requestData = {
        username,
        password,
      };

      console.log('📤 Sending to /authentications:', requestData);

      const response = await api.post('/authentications', requestData);

      console.log('✅ Login response:', response.data);

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data.data;

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

      // Decode JWT to get user info
      try {
        const decodedToken = jwtDecode(newAccessToken);
        console.log('🔍 Decoded token:', decodedToken);

        const userInfo = {
          id: decodedToken.userId,
          username: decodedToken.username || username,
          fullname: decodedToken.fullname,
          role: decodedToken.role || role || 'user',
        };
        setUser(userInfo);

        // Store role for logout redirect
        localStorage.setItem('lastRole', userInfo.role);

        console.log('✅ User info set:', userInfo);
        console.log('👤 Decoded user info:', userInfo);
      } catch (decodeError) {
        console.error('❌ Failed to decode token:', decodeError);
        // Fallback to basic user info
        setUser({ username, role: role || 'user' });
      }

      return true; // Return boolean untuk compatibility
    } catch (error) {
      console.error('❌ Login failed:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      return false; // Return false untuk error
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await api.delete('/authentications', {
          data: { refreshToken },
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear user state and tokens
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('lastRole'); // Clear any cached role
      delete api.defaults.headers.common['Authorization'];

      console.log('✅ Logout completed, user data cleared');
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await api.put('/authentications', {
        refreshToken,
      });

      const { accessToken: newAccessToken } = response.data.data;
      setAccessToken(newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    login,
    register,
    logout,
    refreshAccessToken,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
