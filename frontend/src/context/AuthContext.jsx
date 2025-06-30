import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

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
          const userInfo = {
            id: decodedToken.payload?.userId,
            username: decodedToken.payload?.username,
            fullname: decodedToken.payload?.fullname,
            role: decodedToken.payload?.role || 'user',
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

  const login = async (username, password) => {
    try {
      const response = await api.post('/authentications', {
        username,
        password,
      });

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
        const userInfo = {
          id: decodedToken.payload?.userId,
          username: decodedToken.payload?.username || username,
          fullname: decodedToken.payload?.fullname,
          role: decodedToken.payload?.role || 'user',
        };
        setUser(userInfo);
        console.log('Decoded user info:', userInfo);
      } catch (decodeError) {
        console.error('Failed to decode token:', decodeError);
        // Fallback to basic user info
        setUser({ username, role: 'user' });
      }

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
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
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete api.defaults.headers.common['Authorization'];
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
