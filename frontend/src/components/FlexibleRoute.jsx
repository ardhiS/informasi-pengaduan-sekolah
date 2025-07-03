import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FlexibleRoute = ({
  children,
  allowPublic = false,
  requiredRoles = null,
}) => {
  const { isAuthenticated, loading, user } = useAuth();

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

  // If public access is allowed, render component regardless of auth status
  if (allowPublic) {
    return children;
  }

  // If not authenticated and public access not allowed, redirect to login
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  // If specific roles required, check user role
  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
};

export default FlexibleRoute;
