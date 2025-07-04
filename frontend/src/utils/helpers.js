import {
  STORAGE_KEYS,
  DATE_FORMATS,
  ERROR_MESSAGES,
  VALIDATION,
  REGEX,
} from '../constants';

/**
 * Local Storage Utilities
 */
export const storage = {
  /**
   * Get item from localStorage with error handling
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Parsed value or default
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting localStorage item "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Set item in localStorage with error handling
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Date Utilities
 */
export const dateUtils = {
  /**
   * Format date for display
   * @param {string|Date} date - Date to format
   * @param {string} format - Format type (default: DISPLAY)
   * @returns {string} Formatted date
   */
  format: (date, format = DATE_FORMATS.DISPLAY) => {
    if (!date) return 'No date available';

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid date';

      switch (format) {
        case DATE_FORMATS.DISPLAY:
          return dateObj.toLocaleDateString('id-ID');
        case DATE_FORMATS.DISPLAY_WITH_TIME:
          return `${dateObj.toLocaleDateString(
            'id-ID'
          )} ${dateObj.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          })}`;
        case DATE_FORMATS.API:
          return dateObj.toISOString().split('T')[0];
        case DATE_FORMATS.API_WITH_TIME:
          return dateObj.toISOString();
        default:
          return dateObj.toLocaleDateString('id-ID');
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  },

  /**
   * Check if date is today
   * @param {string|Date} date - Date to check
   * @returns {boolean}
   */
  isToday: (date) => {
    if (!date) return false;
    try {
      const today = new Date();
      const checkDate = new Date(date);
      return today.toDateString() === checkDate.toDateString();
    } catch {
      return false;
    }
  },

  /**
   * Get relative time (e.g., "2 hours ago")
   * @param {string|Date} date - Date to compare
   * @returns {string}
   */
  getRelativeTime: (date) => {
    if (!date) return '';

    try {
      const now = new Date();
      const targetDate = new Date(date);
      const diffMs = now - targetDate;
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return `${diffDays} hari yang lalu`;
      if (diffHours > 0) return `${diffHours} jam yang lalu`;
      if (diffMinutes > 0) return `${diffMinutes} menit yang lalu`;
      return 'Baru saja';
    } catch {
      return '';
    }
  },
};

/**
 * String Utilities
 */
export const stringUtils = {
  /**
   * Capitalize first letter
   * @param {string} str - String to capitalize
   * @returns {string}
   */
  capitalize: (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Convert to title case
   * @param {string} str - String to convert
   * @returns {string}
   */
  toTitleCase: (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Truncate string with ellipsis
   * @param {string} str - String to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string}
   */
  truncate: (str, maxLength = 100) => {
    if (!str || typeof str !== 'string') return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength).trim() + '...';
  },

  /**
   * Remove extra whitespace
   * @param {string} str - String to clean
   * @returns {string}
   */
  clean: (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.trim().replace(/\s+/g, ' ');
  },

  /**
   * Generate slug from string
   * @param {string} str - String to convert
   * @returns {string}
   */
  toSlug: (str) => {
    if (!str || typeof str !== 'string') return '';
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};

/**
 * Number Utilities
 */
export const numberUtils = {
  /**
   * Format number with thousands separator
   * @param {number} num - Number to format
   * @returns {string}
   */
  format: (num) => {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    return num.toLocaleString('id-ID');
  },

  /**
   * Format currency (Indonesian Rupiah)
   * @param {number} amount - Amount to format
   * @returns {string}
   */
  formatCurrency: (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Format percentage
   * @param {number} value - Value to format as percentage
   * @param {number} decimals - Number of decimal places
   * @returns {string}
   */
  formatPercentage: (value, decimals = 1) => {
    if (typeof value !== 'number' || isNaN(value)) return '0%';
    return `${(value * 100).toFixed(decimals)}%`;
  },

  /**
   * Clamp number between min and max
   * @param {number} num - Number to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number}
   */
  clamp: (num, min, max) => {
    return Math.min(Math.max(num, min), max);
  },
};

/**
 * Array Utilities
 */
export const arrayUtils = {
  /**
   * Remove duplicates from array
   * @param {Array} arr - Array to deduplicate
   * @param {string} key - Key to compare for objects
   * @returns {Array}
   */
  unique: (arr, key = null) => {
    if (!Array.isArray(arr)) return [];

    if (key) {
      const seen = new Set();
      return arr.filter((item) => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      });
    }

    return [...new Set(arr)];
  },

  /**
   * Group array by key
   * @param {Array} arr - Array to group
   * @param {string|Function} key - Key or function to group by
   * @returns {Object}
   */
  groupBy: (arr, key) => {
    if (!Array.isArray(arr)) return {};

    return arr.reduce((groups, item) => {
      const groupKey = typeof key === 'function' ? key(item) : item[key];
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
      return groups;
    }, {});
  },

  /**
   * Sort array by key with null handling
   * @param {Array} arr - Array to sort
   * @param {string} key - Key to sort by
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array}
   */
  sortBy: (arr, key, order = 'asc') => {
    if (!Array.isArray(arr)) return [];

    return [...arr].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return order === 'asc' ? 1 : -1;
      if (bValue == null) return order === 'asc' ? -1 : 1;

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  },

  /**
   * Paginate array
   * @param {Array} arr - Array to paginate
   * @param {number} page - Current page (1-based)
   * @param {number} pageSize - Items per page
   * @returns {Object} { data, totalPages, currentPage, hasNext, hasPrev }
   */
  paginate: (arr, page = 1, pageSize = 10) => {
    if (!Array.isArray(arr))
      return {
        data: [],
        totalPages: 0,
        currentPage: 1,
        hasNext: false,
        hasPrev: false,
      };

    const totalItems = arr.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      data: arr.slice(startIndex, endIndex),
      totalPages,
      currentPage,
      totalItems,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
    };
  },
};

/**
 * Object Utilities
 */
export const objectUtils = {
  /**
   * Deep clone object
   * @param {*} obj - Object to clone
   * @returns {*}
   */
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array)
      return obj.map((item) => objectUtils.deepClone(item));

    if (typeof obj === 'object') {
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = objectUtils.deepClone(obj[key]);
        }
      }
      return cloned;
    }

    return obj;
  },

  /**
   * Check if object is empty
   * @param {Object} obj - Object to check
   * @returns {boolean}
   */
  isEmpty: (obj) => {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    return Object.keys(obj).length === 0;
  },

  /**
   * Pick specific keys from object
   * @param {Object} obj - Source object
   * @param {Array} keys - Keys to pick
   * @returns {Object}
   */
  pick: (obj, keys) => {
    if (!obj || !Array.isArray(keys)) return {};

    return keys.reduce((result, key) => {
      if (key in obj) result[key] = obj[key];
      return result;
    }, {});
  },

  /**
   * Omit specific keys from object
   * @param {Object} obj - Source object
   * @param {Array} keys - Keys to omit
   * @returns {Object}
   */
  omit: (obj, keys) => {
    if (!obj || !Array.isArray(keys)) return obj;

    const result = { ...obj };
    keys.forEach((key) => delete result[key]);
    return result;
  },
};

/**
 * Validation Utilities
 */
export const validationUtils = {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  isValidEmail: (email) => {
    if (!email || typeof email !== 'string') return false;
    return REGEX.EMAIL.test(email);
  },

  /**
   * Validate phone number format
   * @param {string} phone - Phone to validate
   * @returns {boolean}
   */
  isValidPhone: (phone) => {
    if (!phone || typeof phone !== 'string') return false;
    return REGEX.PHONE.test(phone);
  },

  /**
   * Validate username format
   * @param {string} username - Username to validate
   * @returns {boolean}
   */
  isValidUsername: (username) => {
    if (!username || typeof username !== 'string') return false;
    return REGEX.USERNAME.test(username);
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} { isValid, score, feedback }
   */
  validatePassword: (password) => {
    if (!password || typeof password !== 'string') {
      return { isValid: false, score: 0, feedback: 'Password is required' };
    }

    const feedback = [];
    let score = 0;

    if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      feedback.push(
        `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`
      );
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain lowercase letters');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain uppercase letters');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      feedback.push('Password must contain numbers');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password should contain special characters');
    } else {
      score += 1;
    }

    return {
      isValid: score >= 3 && password.length >= VALIDATION.MIN_PASSWORD_LENGTH,
      score,
      feedback: feedback.length > 0 ? feedback : ['Password is strong'],
    };
  },

  /**
   * Validate required fields
   * @param {Object} data - Data to validate
   * @param {Array} requiredFields - Required field names
   * @returns {Object} { isValid, missingFields }
   */
  validateRequired: (data, requiredFields) => {
    if (!data || !Array.isArray(requiredFields)) {
      return { isValid: false, missingFields: [] };
    }

    const missingFields = requiredFields.filter((field) => {
      const value = data[field];
      return value === undefined || value === null || value === '';
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  },
};

/**
 * URL Utilities
 */
export const urlUtils = {
  /**
   * Build URL with query parameters
   * @param {string} baseUrl - Base URL
   * @param {Object} params - Query parameters
   * @returns {string}
   */
  buildUrl: (baseUrl, params = {}) => {
    if (!baseUrl) return '';

    const url = new URL(baseUrl, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, value);
      }
    });

    return url.toString();
  },

  /**
   * Parse query string to object
   * @param {string} queryString - Query string to parse
   * @returns {Object}
   */
  parseQuery: (queryString = window.location.search) => {
    const params = new URLSearchParams(queryString);
    const result = {};

    for (const [key, value] of params.entries()) {
      result[key] = value;
    }

    return result;
  },
};

/**
 * Logging Utilities
 */
export const logger = {
  /**
   * Log debug message (only in development)
   * @param {string} message - Message to log
   * @param {*} data - Additional data to log
   */
  debug: (message, data = null) => {
    if (import.meta.env.DEV) {
      console.log(`🔍 ${message}`, data);
    }
  },

  /**
   * Log info message
   * @param {string} message - Message to log
   * @param {*} data - Additional data to log
   */
  info: (message, data = null) => {
    console.info(`ℹ️ ${message}`, data);
  },

  /**
   * Log warning message
   * @param {string} message - Message to log
   * @param {*} data - Additional data to log
   */
  warn: (message, data = null) => {
    console.warn(`⚠️ ${message}`, data);
  },

  /**
   * Log error message
   * @param {string} message - Message to log
   * @param {*} data - Additional data to log
   */
  error: (message, data = null) => {
    console.error(`❌ ${message}`, data);
  },

  /**
   * Log success message
   * @param {string} message - Message to log
   * @param {*} data - Additional data to log
   */
  success: (message, data = null) => {
    console.log(`✅ ${message}`, data);
  },
};

/**
 * Error Handling Utilities
 */
export const errorUtils = {
  /**
   * Get user-friendly error message
   * @param {Error|Object} error - Error object
   * @returns {string}
   */
  getMessage: (error) => {
    if (!error) return ERROR_MESSAGES.GENERIC_ERROR;

    // Check for specific error types
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      switch (status) {
        case 400:
          return message || ERROR_MESSAGES.VALIDATION_ERROR;
        case 401:
          return ERROR_MESSAGES.UNAUTHORIZED;
        case 403:
          return ERROR_MESSAGES.FORBIDDEN;
        case 404:
          return ERROR_MESSAGES.NOT_FOUND;
        case 500:
          return ERROR_MESSAGES.SERVER_ERROR;
        default:
          return message || ERROR_MESSAGES.GENERIC_ERROR;
      }
    }

    if (error.message) return error.message;
    if (typeof error === 'string') return error;

    return ERROR_MESSAGES.GENERIC_ERROR;
  },

  /**
   * Log error with context
   * @param {Error|Object} error - Error to log
   * @param {string} context - Context where error occurred
   */
  log: (error, context = '') => {
    const timestamp = new Date().toISOString();
    const message = errorUtils.getMessage(error);

    console.error(
      `[${timestamp}] ${context ? `[${context}] ` : ''}${message}`,
      error
    );
  },
};

// Export errorUtils as errorHandler for compatibility
export const errorHandler = errorUtils;

/**
 * File Utilities
 */
export const fileUtils = {
  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   * @returns {string}
   */
  formatSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Get file extension
   * @param {string} filename - File name
   * @returns {string}
   */
  getExtension: (filename) => {
    if (!filename || typeof filename !== 'string') return '';
    return filename.split('.').pop().toLowerCase();
  },

  /**
   * Validate file type
   * @param {File} file - File to validate
   * @param {Array} allowedTypes - Allowed MIME types
   * @returns {boolean}
   */
  isValidType: (file, allowedTypes = []) => {
    if (!file || !allowedTypes.length) return false;
    return allowedTypes.includes(file.type);
  },

  /**
   * Validate file size
   * @param {File} file - File to validate
   * @param {number} maxSize - Maximum size in bytes
   * @returns {boolean}
   */
  isValidSize: (file, maxSize) => {
    if (!file || typeof maxSize !== 'number') return false;
    return file.size <= maxSize;
  },
};

/**
 * Debounce utility
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function}
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle utility
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Generate unique ID
 * @param {string} prefix - Prefix for the ID
 * @returns {string}
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if user is on mobile device
 * @returns {boolean}
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
};
