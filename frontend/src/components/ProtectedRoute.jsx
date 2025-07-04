import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 pb-safe'>
        <div className='text-center space-y-4'>
          <div className='animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto'></div>
          <p className='text-sm sm:text-base text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Store the attempted URL for redirect after login
    localStorage.setItem('redirectUrl', location.pathname);

    // Redirect to appropriate login page based on current path
    const currentPath = location.pathname;
    if (currentPath.includes('/admin')) {
      return <Navigate to='/login/admin' replace />;
    } else if (currentPath.includes('/guru')) {
      return <Navigate to='/login/guru' replace />;
    } else if (currentPath.includes('/siswa')) {
      return <Navigate to='/login/siswa' replace />;
    } else {
      // Default to landing page for dashboard and unknown routes
      return <Navigate to='/' replace />;
    }
  }

  // Check role-based access if required
  if (requiredRole && user.role !== requiredRole) {
    console.warn(
      `Access denied. Required role: ${requiredRole}, User role: ${user.role}`
    );
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;
