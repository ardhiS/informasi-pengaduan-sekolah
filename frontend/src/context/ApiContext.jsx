import React, { createContext, useContext, useState, useCallback } from 'react';

const ApiContext = createContext(null);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error('useApi must be used within an ApiProvider');
  return context;
};

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const handleApiCall = useCallback(async (apiFunction) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    loading,
    error,
    clearError,
    handleApiCall,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
