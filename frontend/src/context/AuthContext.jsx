import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Utility functions
  const clearAuth = useCallback(() => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const setAuthToken = useCallback((token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const getUserFromToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) return null; // Token expired

      return {
        id: decoded.userId,
        username: decoded.username,
        fullname: decoded.fullname,
        role: decoded.role || 'user',
      };
    } catch {
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (accessToken) {
      const userInfo = getUserFromToken(accessToken);
      if (userInfo) {
        setUser(userInfo);
        setAuthToken(accessToken);
      } else {
        clearAuth();
      }
    }
    setLoading(false);
  }, [accessToken, getUserFromToken, setAuthToken, clearAuth]);

  const login = useCallback(
    async (username, password) => {
      try {
        const response = await axios.post('/api/authentications', {
          username,
          password,
        });
        const { accessToken: newToken, refreshToken: newRefresh } =
          response.data.data;

        const userInfo = getUserFromToken(newToken);
        if (!userInfo) throw new Error('Invalid token received');

        setUser(userInfo);
        setAuthToken(newToken);
        localStorage.setItem('refreshToken', newRefresh);

        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },
    [getUserFromToken, setAuthToken]
  );

  const logout = useCallback(async () => {
    try {
      if (refreshToken) {
        await axios.delete('/api/authentications', { data: { refreshToken } });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      clearAuth();

      // Redirect logic
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/welcome') return;

      if (currentPath.includes('/admin')) {
        window.location.href = '/login/admin';
      } else if (currentPath.includes('/guru')) {
        window.location.href = '/login/guru';
      } else {
        window.location.href = '/login/siswa';
      }
    }
  }, [refreshToken, clearAuth]);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!accessToken && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
