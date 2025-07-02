import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
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
  if (!isAuthenticated) {
    // Redirect to landing page when not authenticated
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;
