import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '../utils/helpers';

/**
 * Hook for managing async operations with loading states
 * @param {Function} asyncFunction - Async function to execute
 * @param {Array} dependencies - Dependencies array
 * @returns {Object} { data, loading, error, execute, reset }
 */
export const useAsyncOperation = (asyncFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const result = await asyncFunction(...args);

      if (mountedRef.current) {
        setData(result);
      }

      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err);
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, dependencies);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

/**
 * Hook for managing form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Function} validationSchema - Validation function
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(
    (name, value) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors]
  );

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setValue(name, type === 'checkbox' ? checked : value);
    },
    [setValue]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setFieldTouched(name, true);
    },
    [setFieldTouched]
  );

  const validate = useCallback(() => {
    if (!validationSchema) return {};

    try {
      const validationErrors = validationSchema(values);
      setErrors(validationErrors || {});
      return validationErrors || {};
    } catch (error) {
      console.error('Validation error:', error);
      return {};
    }
  }, [values, validationSchema]);

  const isValid = useCallback(() => {
    const validationErrors = validate();
    return Object.keys(validationErrors).length === 0;
  }, [validate]);

  const handleSubmit = useCallback(
    (onSubmit) => {
      return async (e) => {
        if (e) e.preventDefault();

        setIsSubmitting(true);

        // Mark all fields as touched
        const touchedFields = Object.keys(values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(touchedFields);

        const validationErrors = validate();

        if (Object.keys(validationErrors).length === 0) {
          try {
            await onSubmit(values);
          } catch (error) {
            console.error('Form submission error:', error);
          }
        }

        setIsSubmitting(false);
      };
    },
    [values, validate]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    isValid,
    reset,
  };
};

/**
 * Hook for debounced value
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for pagination logic
 * @param {Array} data - Data to paginate
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination state and controls
 */
export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = useCallback(
    (page) => {
      const newPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(newPage);
    },
    [totalPages]
  );

  const goToNext = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPrevious = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToFirst = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLast = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return {
    currentPage,
    totalPages,
    totalItems,
    currentData,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, totalItems),
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    goToPage,
    goToNext,
    goToPrevious,
    goToFirst,
    goToLast,
  };
};

/**
 * Hook for managing search and filtering
 * @param {Array} data - Data to search/filter
 * @param {Object} options - Search options
 * @returns {Object} Search state and filtered data
 */
export const useSearch = (data = [], options = {}) => {
  const {
    searchFields = [],
    filterFunctions = {},
    sortField = null,
    sortOrder = 'asc',
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: sortField,
    order: sortOrder,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (debouncedSearchTerm && searchFields.length > 0) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return value?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (filterFunctions[key]) {
          result = result.filter((item) => filterFunctions[key](item, value));
        } else {
          result = result.filter((item) => item[key] === value);
        }
      }
    });

    // Apply sorting
    if (sortConfig.field) {
      result.sort((a, b) => {
        const aValue = sortConfig.field
          .split('.')
          .reduce((obj, key) => obj?.[key], a);
        const bValue = sortConfig.field
          .split('.')
          .reduce((obj, key) => obj?.[key], b);

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.order === 'asc' ? 1 : -1;
        if (bValue == null) return sortConfig.order === 'asc' ? -1 : 1;

        if (aValue < bValue) return sortConfig.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [
    data,
    debouncedSearchTerm,
    filters,
    sortConfig,
    searchFields,
    filterFunctions,
  ]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  const setSorting = useCallback((field, order = 'asc') => {
    setSortConfig({ field, order });
  }, []);

  const toggleSort = useCallback((field) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    sortConfig,
    setSorting,
    toggleSort,
    filteredData,
    resultCount: filteredData.length,
  };
};

/**
 * Hook for managing modal state
 * @param {boolean} initialOpen - Initial open state
 * @returns {Object} Modal state and controls
 */
export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [data, setData] = useState(null);

  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  };
};

/**
 * Hook for managing selection state (checkboxes, etc.)
 * @param {Array} items - Items that can be selected
 * @param {string} keyField - Field to use as unique key
 * @returns {Object} Selection state and controls
 */
export const useSelection = (items = [], keyField = 'id') => {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const isSelected = useCallback(
    (item) => {
      return selectedItems.has(item[keyField]);
    },
    [selectedItems, keyField]
  );

  const isAllSelected = useMemo(() => {
    return (
      items.length > 0 &&
      items.every((item) => selectedItems.has(item[keyField]))
    );
  }, [items, selectedItems, keyField]);

  const isIndeterminate = useMemo(() => {
    const selectedCount = items.filter((item) =>
      selectedItems.has(item[keyField])
    ).length;
    return selectedCount > 0 && selectedCount < items.length;
  }, [items, selectedItems, keyField]);

  const toggleItem = useCallback(
    (item) => {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        const key = item[keyField];

        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }

        return newSet;
      });
    },
    [keyField]
  );

  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item[keyField])));
    }
  }, [items, isAllSelected, keyField]);

  const selectItems = useCallback(
    (itemsToSelect) => {
      setSelectedItems(new Set(itemsToSelect.map((item) => item[keyField])));
    },
    [keyField]
  );

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const getSelectedItems = useCallback(() => {
    return items.filter((item) => selectedItems.has(item[keyField]));
  }, [items, selectedItems, keyField]);

  const selectedCount = selectedItems.size;

  return {
    selectedItems,
    selectedCount,
    isSelected,
    isAllSelected,
    isIndeterminate,
    toggleItem,
    toggleAll,
    selectItems,
    clearSelection,
    getSelectedItems,
  };
};

/**
 * Hook for managing toggle state with localStorage persistence
 * @param {string} key - localStorage key
 * @param {boolean} defaultValue - Default value
 * @returns {Array} [value, toggle, setValue]
 */
export const useToggle = (key, defaultValue = false) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const toggle = useCallback(() => {
    setValue((prev) => {
      const newValue = !prev;
      localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  }, [key]);

  const setToggleValue = useCallback(
    (newValue) => {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  return [value, toggle, setToggleValue];
};

/**
 * Hook for managing previous value
 * @param {*} value - Current value
 * @returns {*} Previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

/**
 * Hook for detecting outside clicks
 * @param {Function} callback - Function to call when clicked outside
 * @returns {Object} Ref to attach to element
 */
export const useClickOutside = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);

  return ref;
};

/**
 * Hook for managing window size
 * @returns {Object} { width, height, isMobile, isTablet, isDesktop }
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...windowSize,
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
  };
};

/**
 * Hook for scroll position
 * @returns {Object} { scrollX, scrollY }
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  });

  useEffect(() => {
    const handleScroll = debounce(() => {
      setScrollPosition({
        scrollX: window.pageXOffset,
        scrollY: window.pageYOffset,
      });
    }, 50);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};
