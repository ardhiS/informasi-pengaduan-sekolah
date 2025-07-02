import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  usersService,
  classesService,
  subjectsService,
  complaintsService,
} from '../services/dataService';

// Initial state
const initialState = {
  users: {
    data: [],
    total: 0,
    admin: 0,
    guru: 0,
    siswa: 0,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  classes: {
    data: [],
    total: 0,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  subjects: {
    data: [],
    total: 0,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  complaints: {
    data: [],
    total: 0,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  isInitialized: false,
  globalLoading: false,
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_GLOBAL_LOADING: 'SET_GLOBAL_LOADING',
  SET_USERS_DATA: 'SET_USERS_DATA',
  SET_CLASSES_DATA: 'SET_CLASSES_DATA',
  SET_SUBJECTS_DATA: 'SET_SUBJECTS_DATA',
  SET_COMPLAINTS_DATA: 'SET_COMPLAINTS_DATA',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_INITIALIZED: 'SET_INITIALIZED',
  REFRESH_ALL_DATA: 'REFRESH_ALL_DATA',
};

// Helper function to count users by role
const countUsersByRole = (users) => {
  if (!Array.isArray(users)) return { total: 0, admin: 0, guru: 0, siswa: 0 };

  return {
    total: users.length,
    admin: users.filter((u) => u.role === 'admin').length,
    guru: users.filter((u) => u.role === 'guru' || u.role === 'teacher').length,
    siswa: users.filter((u) => u.role === 'siswa' || u.role === 'student')
      .length,
  };
};

// Helper function to extract array data from various API response formats
const extractArrayData = (response, arrayName) => {
  if (!response) return [];

  // Strategy 1: Check for response[arrayName] (e.g., response.users)
  if (Array.isArray(response[arrayName])) {
    return response[arrayName];
  }

  // Strategy 2: Check for response.data[arrayName]
  if (response.data && Array.isArray(response.data[arrayName])) {
    return response.data[arrayName];
  }

  // Strategy 3: Check for response.data as array
  if (Array.isArray(response.data)) {
    return response.data;
  }

  // Strategy 4: Check if response itself is an array
  if (Array.isArray(response)) {
    return response;
  }

  // Strategy 5: Look for any array property in the response
  if (response && typeof response === 'object') {
    const possibleArrays = Object.values(response).filter(Array.isArray);
    if (possibleArrays.length > 0) {
      return possibleArrays[0];
    }
  }

  return [];
};

// Reducer function
const dataReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_GLOBAL_LOADING:
      return {
        ...state,
        globalLoading: action.payload,
      };

    case actionTypes.SET_LOADING:
      return {
        ...state,
        [action.category]: {
          ...state[action.category],
          loading: action.payload,
        },
      };

    case actionTypes.SET_USERS_DATA:
      const userCounts = countUsersByRole(action.payload);
      return {
        ...state,
        users: {
          data: action.payload,
          ...userCounts,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString(),
        },
      };

    case actionTypes.SET_CLASSES_DATA:
      return {
        ...state,
        classes: {
          data: action.payload,
          total: action.payload.length,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString(),
        },
      };

    case actionTypes.SET_SUBJECTS_DATA:
      return {
        ...state,
        subjects: {
          data: action.payload,
          total: action.payload.length,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString(),
        },
      };

    case actionTypes.SET_COMPLAINTS_DATA:
      return {
        ...state,
        complaints: {
          data: action.payload,
          total: action.payload.length,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString(),
        },
      };

    case actionTypes.SET_ERROR:
      return {
        ...state,
        [action.category]: {
          ...state[action.category],
          loading: false,
          error: action.payload,
        },
      };

    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        [action.category]: {
          ...state[action.category],
          error: null,
        },
      };

    case actionTypes.SET_INITIALIZED:
      return {
        ...state,
        isInitialized: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const DataContext = createContext();

// Custom hook to use data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Data provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Action creators
  const actions = {
    setGlobalLoading: (loading) => {
      dispatch({ type: actionTypes.SET_GLOBAL_LOADING, payload: loading });
    },

    setLoading: (category, loading) => {
      dispatch({ type: actionTypes.SET_LOADING, category, payload: loading });
    },

    setError: (category, error) => {
      dispatch({ type: actionTypes.SET_ERROR, category, payload: error });
    },

    clearError: (category) => {
      dispatch({ type: actionTypes.CLEAR_ERROR, category });
    },

    // Fetch users data
    fetchUsers: async () => {
      dispatch({
        type: actionTypes.SET_LOADING,
        category: 'users',
        payload: true,
      });
      try {
        const response = await usersService.getAll();
        const users = extractArrayData(response, 'users');
        console.log('DataContext: Users fetched:', users.length);
        dispatch({ type: actionTypes.SET_USERS_DATA, payload: users });
        return users;
      } catch (error) {
        console.error('DataContext: Failed to fetch users:', error);
        dispatch({
          type: actionTypes.SET_ERROR,
          category: 'users',
          payload: error.message,
        });
        return [];
      }
    },

    // Fetch classes data
    fetchClasses: async () => {
      dispatch({
        type: actionTypes.SET_LOADING,
        category: 'classes',
        payload: true,
      });
      try {
        console.log('🔄 DataContext: Fetching classes data...');
        const response = await classesService.getAll();
        console.log('📦 DataContext: Raw classes response:', response);

        const classes = extractArrayData(response, 'classes');
        console.log(
          '✅ DataContext: Extracted classes array:',
          classes.length,
          'items'
        );
        console.log('📋 DataContext: Classes sample:', classes.slice(0, 2));

        dispatch({ type: actionTypes.SET_CLASSES_DATA, payload: classes });
        return classes;
      } catch (error) {
        console.error('❌ DataContext: Failed to fetch classes:', error);
        dispatch({
          type: actionTypes.SET_ERROR,
          category: 'classes',
          payload: error.message,
        });
        return [];
      }
    },

    // Fetch subjects data
    fetchSubjects: async () => {
      dispatch({
        type: actionTypes.SET_LOADING,
        category: 'subjects',
        payload: true,
      });
      try {
        const response = await subjectsService.getAll();
        const subjects = extractArrayData(response, 'subjects');
        console.log('DataContext: Subjects fetched:', subjects.length);
        dispatch({ type: actionTypes.SET_SUBJECTS_DATA, payload: subjects });
        return subjects;
      } catch (error) {
        console.error('DataContext: Failed to fetch subjects:', error);
        dispatch({
          type: actionTypes.SET_ERROR,
          category: 'subjects',
          payload: error.message,
        });
        return [];
      }
    },

    // Fetch complaints data
    fetchComplaints: async () => {
      dispatch({
        type: actionTypes.SET_LOADING,
        category: 'complaints',
        payload: true,
      });
      try {
        const response = await complaintsService.getAll();
        const complaints = extractArrayData(response, 'complaints');
        console.log('DataContext: Complaints fetched:', complaints.length);
        dispatch({
          type: actionTypes.SET_COMPLAINTS_DATA,
          payload: complaints,
        });
        return complaints;
      } catch (error) {
        console.warn(
          'DataContext: Failed to fetch complaints (expected if endpoint not available):',
          error
        );
        dispatch({ type: actionTypes.SET_COMPLAINTS_DATA, payload: [] });
        return [];
      }
    },

    // Fetch all data
    fetchAllData: async () => {
      dispatch({ type: actionTypes.SET_GLOBAL_LOADING, payload: true });
      try {
        console.log('DataContext: Fetching all data...');
        await Promise.all([
          actions.fetchUsers(),
          actions.fetchClasses(),
          actions.fetchSubjects(),
          actions.fetchComplaints(),
        ]);
        dispatch({ type: actionTypes.SET_INITIALIZED, payload: true });
        console.log('DataContext: All data fetched successfully');
      } catch (error) {
        console.error('DataContext: Error fetching all data:', error);
      } finally {
        dispatch({ type: actionTypes.SET_GLOBAL_LOADING, payload: false });
      }
    },

    // Refresh specific category
    refreshCategory: async (category) => {
      console.log(`🔄 DataContext: Refreshing category "${category}"...`);
      try {
        let result;
        switch (category) {
          case 'users':
            result = await actions.fetchUsers();
            break;
          case 'classes':
            result = await actions.fetchClasses();
            break;
          case 'subjects':
            result = await actions.fetchSubjects();
            break;
          case 'complaints':
            result = await actions.fetchComplaints();
            break;
          default:
            console.warn(
              '⚠️ DataContext: Unknown category for refresh:',
              category
            );
            return [];
        }
        console.log(
          `✅ DataContext: Category "${category}" refreshed successfully with ${result.length} items`
        );
        return result;
      } catch (error) {
        console.error(
          `❌ DataContext: Failed to refresh category "${category}":`,
          error
        );
        return [];
      }
    },

    // Get summary statistics
    getSummary: () => ({
      totalUsers: state.users.total,
      totalClasses: state.classes.total,
      totalSubjects: state.subjects.total,
      totalComplaints: state.complaints.total,
      userBreakdown: {
        admin: state.users.admin,
        guru: state.users.guru,
        siswa: state.users.siswa,
      },
      lastUpdated: {
        users: state.users.lastUpdated,
        classes: state.classes.lastUpdated,
        subjects: state.subjects.lastUpdated,
        complaints: state.complaints.lastUpdated,
      },
    }),
  };

  // Initialize data on mount
  useEffect(() => {
    if (!state.isInitialized) {
      actions.fetchAllData();
    }
  }, []);

  // Listen for external data update events (from sample data generator)
  useEffect(() => {
    const handleDataUpdate = (event) => {
      console.log(
        'DataContext: External data update event received:',
        event.detail
      );

      const { type, category } = event.detail;

      if (type === 'sampleDataGenerated' || type === 'sampleDataCleared') {
        // Refresh specific category or all data
        if (category) {
          actions.refreshCategory(category);
        } else {
          actions.fetchAllData();
        }
      }
    };

    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const value = {
    state,
    actions,
    // Convenience getters
    users: state.users,
    classes: state.classes,
    subjects: state.subjects,
    complaints: state.complaints,
    isLoading: state.globalLoading,
    isInitialized: state.isInitialized,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
