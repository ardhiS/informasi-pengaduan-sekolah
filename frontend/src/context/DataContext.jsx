import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import { usersService } from '../services/dataService';
import complaintsService from '../services/complaintsService';

// Single initialization flag - using object to persist across re-renders
const initStatus = {
  isInitializing: false,
  hasInitialized: false,
};

// Initial state template
const createInitialState = () => ({
  users: {
    data: [],
    total: 0,
    admin: 0,
    guru: 0,
    siswa: 0,
    loading: false,
    error: null,
  },
  complaints: { data: [], total: 0, loading: false, error: null },
  isInitialized: false,
  globalLoading: false,
});

const initialState = createInitialState();

// Action types
const ACTIONS = {
  SET_GLOBAL_LOADING: 'SET_GLOBAL_LOADING',
  SET_LOADING: 'SET_LOADING',
  SET_DATA: 'SET_DATA',
  SET_ERROR: 'SET_ERROR',
  SET_INITIALIZED: 'SET_INITIALIZED',
};

// Utility functions
const countUsersByRole = (users) => {
  if (!Array.isArray(users)) return { total: 0, admin: 0, guru: 0, siswa: 0 };
  return {
    total: users.length,
    admin: users.filter((u) => u.role === 'admin').length,
    guru: users.filter((u) => ['guru', 'teacher'].includes(u.role)).length,
    siswa: users.filter((u) => ['siswa', 'student'].includes(u.role)).length,
  };
};

const extractArrayData = (response, arrayName) => {
  if (!response) return [];
  if (Array.isArray(response[arrayName])) return response[arrayName];
  if (response.data && Array.isArray(response.data[arrayName]))
    return response.data[arrayName];
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

// Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_GLOBAL_LOADING:
      return { ...state, globalLoading: action.payload };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        [action.category]: {
          ...state[action.category],
          loading: action.payload,
        },
      };

    case ACTIONS.SET_DATA:
      const { category, data } = action.payload;
      let categoryData = {
        data,
        total: data.length,
        loading: false,
        error: null,
      };

      if (category === 'users') {
        categoryData = { ...categoryData, ...countUsersByRole(data) };
      }

      return { ...state, [category]: categoryData };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        [action.category]: {
          ...state[action.category],
          loading: false,
          error: action.payload,
        },
      };

    case ACTIONS.SET_INITIALIZED:
      return { ...state, isInitialized: action.payload };

    default:
      return state;
  }
};

// Context
const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};

// Provider
export const DataProvider = ({ children }) => {
  console.log('🏗️ DataProvider mounted/re-rendered');
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Data fetchers
  const fetchData = useCallback(async (category, service, serviceName) => {
    dispatch({ type: ACTIONS.SET_LOADING, category, payload: true });
    try {
      const response = await service.getAll();
      const data = extractArrayData(response, serviceName);
      dispatch({ type: ACTIONS.SET_DATA, payload: { category, data } });
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${category}:`, error);
      dispatch({ type: ACTIONS.SET_ERROR, category, payload: error.message });
      return [];
    }
  }, []);

  const fetchUsers = useCallback(
    () => fetchData('users', usersService, 'users'),
    [fetchData]
  );

  const fetchComplaints = useCallback(async () => {
    dispatch({
      type: ACTIONS.SET_LOADING,
      category: 'complaints',
      payload: true,
    });
    try {
      const response = await complaintsService.getComplaints();
      const data = response?.complaints || [];
      dispatch({
        type: ACTIONS.SET_DATA,
        payload: { category: 'complaints', data },
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      dispatch({
        type: ACTIONS.SET_DATA,
        payload: { category: 'complaints', data: [] },
      });
      return [];
    }
  }, []);

  // Initialize all data - REMOVE ALL STATE DEPENDENCIES
  const initializeData = useCallback(async () => {
    // Triple protection against multiple calls
    if (initStatus.isInitializing || initStatus.hasInitialized) {
      console.log(
        'DataContext: Skipping - already initialized or initializing'
      );
      return;
    }

    console.log('DataContext: Starting initialization...');
    initStatus.isInitializing = true;
    dispatch({ type: ACTIONS.SET_GLOBAL_LOADING, payload: true });

    try {
      // Direct API calls without dependencies
      const [users, complaints] = await Promise.all([
        usersService
          .getAll()
          .then((response) => extractArrayData(response, 'users')),
        complaintsService
          .getComplaints()
          .then((response) => response?.complaints || []),
      ]);

      // Dispatch all data
      dispatch({
        type: ACTIONS.SET_DATA,
        payload: { category: 'users', data: users },
      });
      dispatch({
        type: ACTIONS.SET_DATA,
        payload: { category: 'complaints', data: complaints },
      });
      dispatch({ type: ACTIONS.SET_INITIALIZED, payload: true });

      initStatus.hasInitialized = true;
      console.log('DataContext: Initialization complete ✅');
    } catch (error) {
      console.error('DataContext: Initialization failed ❌', error);
    } finally {
      dispatch({ type: ACTIONS.SET_GLOBAL_LOADING, payload: false });
      initStatus.isInitializing = false;
    }
  }, []); // NO DEPENDENCIES!

  // Actions object
  const actions = {
    fetchUsers,
    fetchComplaints,
    initializeData,
    getSummary: () => ({
      totalUsers: state.users.total,
      totalComplaints: state.complaints.total,
      userBreakdown: {
        admin: state.users.admin,
        guru: state.users.guru,
        siswa: state.users.siswa,
      },
    }),
  };

  // Initialize on mount - ABSOLUTE SINGLE EXECUTION
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initStatus.isInitializing && !initStatus.hasInitialized) {
        console.log('DataContext: Triggering one-time initialization');
        initializeData();
      }
    }, 100); // Small delay to prevent race conditions

    return () => clearTimeout(timer);
  }, []); // COMPLETELY EMPTY - never re-run

  const value = {
    state,
    actions,
    users: state.users,
    complaints: state.complaints,
    isLoading: state.globalLoading,
    isInitialized: state.isInitialized,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
