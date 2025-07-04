// Application constants
export const APP_CONFIG = {
  NAME: 'Website Pengaduan SMP PLUS AT-THAHIRIN',
  SHORT_NAME: 'SMP AT-THAHIRIN',
  VERSION: '2.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'development',
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/authentications',
    REFRESH: '/api/authentications',
    LOGOUT: '/api/authentications',
  },
  USERS: {
    BASE: '/api/users',
    ALL: '/api/users/all',
    PROFILE: '/api/users/profile',
  },
  COMPLAINTS: {
    BASE: '/api/complaints',
    PUBLIC: '/api/complaints/all',
    ALL: '/api/complaints/all',
    STATS: '/api/complaints/stats',
  },
  CLASSES: {
    BASE: '/api/classes',
    ALL: '/api/classes/all',
    PUBLIC: '/api/classes/all',
  },
  SUBJECTS: {
    BASE: '/api/subjects',
    ALL: '/api/subjects/all',
    PUBLIC: '/api/subjects/all',
  },
  COLLABORATIONS: {
    BASE: '/api/collaborations',
  },
  DATA: {
    STATS: '/api/data/stats',
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  GURU: 'guru',
  SISWA: 'siswa',
  TEACHER: 'teacher', // Legacy support
};

// Complaint Status
export const COMPLAINT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REJECTED: 'rejected',
};

// Complaint Priority
export const COMPLAINT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Complaint Categories
export const COMPLAINT_CATEGORIES = {
  ACADEMIC: 'academic',
  FACILITY: 'facility',
  STAFF: 'staff',
  TECHNICAL: 'technical',
  OTHER: 'other',
};

// Approval Status
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100,
};

// Form Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_TEXT_LENGTH: 1000,
  MAX_TITLE_LENGTH: 200,
  MAX_USERNAME_LENGTH: 50,
  MAX_FULLNAME_LENGTH: 100,
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'darkMode',
  LANGUAGE: 'language',
  COMPLAINTS_STATS_VISIBLE: 'complaintsStatsVisible',
};

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  DEFAULT_LANGUAGE: 'id',
  AVAILABLE_LANGUAGES: ['id', 'en'],
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  GENERIC_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in.',
  LOGOUT_SUCCESS: 'Successfully logged out.',
  DATA_SAVED: 'Data saved successfully.',
  DATA_UPDATED: 'Data updated successfully.',
  DATA_DELETED: 'Data deleted successfully.',
  EMAIL_SENT: 'Email sent successfully.',

  // Profile messages
  PROFILE_UPDATED: 'Profile updated successfully.',

  // Subject messages
  SUBJECT_CREATED: 'Subject created successfully.',
  SUBJECT_UPDATED: 'Subject updated successfully.',
  SUBJECT_DELETED: 'Subject deleted successfully.',

  // Class messages
  CLASS_CREATED: 'Class created successfully.',
  CLASS_UPDATED: 'Class updated successfully.',
  CLASS_DELETED: 'Class deleted successfully.',

  // User messages
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',

  // Complaint messages
  COMPLAINT_CREATED: 'Complaint created successfully.',
  COMPLAINT_UPDATED: 'Complaint updated successfully.',
  COMPLAINT_DELETED: 'Complaint deleted successfully.',
  COMPLAINT_APPROVED: 'Complaint approved successfully.',
  COMPLAINT_REJECTED: 'Complaint rejected successfully.',

  // Collaboration messages
  COLLABORATION_CREATED: 'Collaboration created successfully.',
  COLLABORATION_DELETED: 'Collaboration deleted successfully.',
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN_LOGIN: '/admin-login',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  CLASSES: '/classes',
  SUBJECTS: '/subjects',
  COMPLAINTS: '/complaints',
  PROFILE: '/profile',
  API_TESTING: '/api-testing',
  SAMPLE_DATA: '/sample-data-generator',
  SISWA: '/siswa',
  GURU: '/guru',
  WELCOME: '/welcome',
};

// Color Schemes
export const COLORS = {
  PRIMARY: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  SECONDARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  ACCENT: {
    500: '#eab308',
    600: '#ca8a04',
  },
};

// Media Queries
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};

// Animation Durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
};

// Default Values
export const DEFAULTS = {
  AVATAR: '/assets/default-avatar.png',
  IMAGE: '/assets/default-image.png',
  LOGO: '/assets/logo.png',
};
