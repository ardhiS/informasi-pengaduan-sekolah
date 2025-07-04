import React, { useState, useEffect, useMemo, useCallback } from 'react';
import complaintsService from '../services/complaintsService';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';
import { useToast } from '../hooks/useToast';
import { useAsyncOperation, usePagination, useDebounce } from '../hooks';
import {
  COMPLAINT_STATUS,
  COMPLAINT_PRIORITY,
  COMPLAINT_CATEGORIES,
  PAGINATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
} from '../constants';
import { storage, logger, errorHandler } from '../utils/helpers';
import ToastContainer from '../components/ToastContainer';
import {
  ComplaintsHeader,
  ComplaintsStats,
  ComplaintsFilters,
  ComplaintsViewModeToggle,
  ComplaintsTable,
  ComplaintsEmptyState,
  ComplaintsPagination,
  ComplaintsFormModal,
  ComplaintsDetailModal,
} from '../components/Complaints';

const Complaints = () => {
  const { user } = useAuth();
  const { complaints: dataContextComplaints, isInitialized } = useData();
  const { isDarkMode, language } = useTheme();
  const { t } = useTranslation(language);
  const { toasts, showSuccess, showError, hideToast } = useToast();

  // Core states
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [showStats, setShowStats] = useState(() =>
    storage.get(STORAGE_KEYS.COMPLAINTS_STATS_VISIBLE, true)
  );

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedCategory: '',
    selectedStatus: '',
    selectedPriority: '',
    selectedApprovalStatus: '',
    viewMode: 'all',
  });

  // Selection states
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Loading guard state
  const [isCurrentlyLoading, setIsCurrentlyLoading] = useState(false);

  // Use hooks for better state management
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);
  const {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    setTotalItems,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination({
    initialPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  });

  // Async operations for form submissions and data updates
  const {
    loading,
    error: fetchError,
    execute: refreshData,
  } = useAsyncOperation(async () => {
    const complaintsData = await complaintsService.getComplaints({
      category: filters.selectedCategory,
      status: filters.selectedStatus,
      priority: filters.selectedPriority,
      approval_status: filters.selectedApprovalStatus,
      view_mode: filters.viewMode,
      page: currentPage,
      limit: pageSize,
    });

    const statsData = await complaintsService.getStats();
    return { complaintsData, statsData };
  });

  // Use data from DataContext when available, fallback to local API calls
  useEffect(() => {
    // Prevent repeated calls if already loading
    if (isCurrentlyLoading) {
      console.log('⏭️ Complaints: Already loading, skipping request');
      return;
    }

    const loadData = async () => {
      try {
        setIsCurrentlyLoading(true);

        // Use DataContext data if available and initialized
        if (isInitialized && dataContextComplaints?.data?.length > 0) {
          console.log('📋 Complaints: Using DataContext complaints data');
          setComplaints(dataContextComplaints.data);
          setTotalItems(
            dataContextComplaints.total || dataContextComplaints.data.length
          );

          // Still need to fetch stats separately
          const statsData = await complaintsService.getStats();
          setStats(statsData || {});
          return;
        }

        // Fallback to API call if DataContext not ready
        console.log('📞 Complaints: Fetching data via API');
        const result = await refreshData();
        if (result) {
          setComplaints(result.complaintsData?.complaints || []);
          setStats(result.statsData || {});
          setTotalItems(result.complaintsData?.total || 0);
        }
      } catch (error) {
        logger.error('Error loading complaints data:', error);
        const errorMessage = errorHandler.getMessage(error);
        if (
          !errorMessage.includes('token') &&
          !errorMessage.includes('expired')
        ) {
          showError(ERROR_MESSAGES.GENERIC_ERROR);
        }
        setComplaints([]);
        setStats({});
        setTotalItems(0);
      } finally {
        setIsCurrentlyLoading(false);
      }
    };

    loadData();
  }, [isInitialized, dataContextComplaints]); // Only depend on DataContext state

  // Constants using imported values
  const categories = Object.values(COMPLAINT_CATEGORIES);
  const priorities = Object.values(COMPLAINT_PRIORITY);
  const statuses = Object.values(COMPLAINT_STATUS);
  const reporterTypes = complaintsService.getReporterTypes();

  // Storage effects
  useEffect(() => {
    storage.set(STORAGE_KEYS.COMPLAINTS_STATS_VISIBLE, showStats);
  }, [showStats]);

  // Computed values with debounced search
  const filteredComplaints = useMemo(() => {
    if (!debouncedSearchTerm) return complaints;

    return complaints.filter(
      (complaint) =>
        complaint.title
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        complaint.description
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        complaint.reporter_name
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [complaints, debouncedSearchTerm]);

  // Current page data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentComplaints = filteredComplaints.slice(startIndex, endIndex);

  // Handlers with improved error handling
  const handleSubmit = async (formData) => {
    try {
      if (editingComplaint) {
        await complaintsService.updateComplaint(editingComplaint.id, formData);
        showSuccess(SUCCESS_MESSAGES.DATA_UPDATED);
      } else {
        await complaintsService.createComplaint(formData);
        showSuccess(SUCCESS_MESSAGES.DATA_SAVED);
      }

      // Refresh data
      const result = await refreshData();
      if (result) {
        setComplaints(result.complaintsData?.complaints || []);
        setStats(result.statsData || {});
        setTotalItems(result.complaintsData?.total || 0);
      }

      setShowModal(false);
      setEditingComplaint(null);
    } catch (error) {
      logger.error('Error saving complaint:', error);
      showError(errorHandler.getMessage(error));
    }
  };

  const handleEdit = useCallback((complaint) => {
    setEditingComplaint(complaint);
    setShowModal(true);
  }, []);

  const handleView = useCallback((complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        t('confirmDelete', 'Apakah Anda yakin ingin menghapus pengaduan ini?')
      )
    ) {
      try {
        await complaintsService.deleteComplaint(id);
        showSuccess(SUCCESS_MESSAGES.DATA_DELETED);

        // Refresh data
        const result = await refreshData();
        if (result) {
          setComplaints(result.complaintsData?.complaints || []);
          setStats(result.statsData || {});
          setTotalItems(result.complaintsData?.total || 0);
        }
      } catch (error) {
        logger.error('Error deleting complaint:', error);
        showError(errorHandler.getMessage(error));
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await complaintsService.approveComplaint(id);
      showSuccess(SUCCESS_MESSAGES.DATA_UPDATED);

      // Refresh data
      const result = await fetchData();
      if (result) {
        setComplaints(result.complaintsData?.complaints || []);
        setStats(result.statsData || {});
        setTotalItems(result.complaintsData?.total || 0);
      }
    } catch (error) {
      logger.error('Error approving complaint:', error);
      showError(errorHandler.getMessage(error));
    }
  };

  const handleReject = async (id) => {
    try {
      await complaintsService.rejectComplaint(id);
      showSuccess(SUCCESS_MESSAGES.DATA_UPDATED);

      // Refresh data
      const result = await fetchData();
      if (result) {
        setComplaints(result.complaintsData?.complaints || []);
        setStats(result.statsData || {});
        setTotalItems(result.complaintsData?.total || 0);
      }
    } catch (error) {
      logger.error('Error rejecting complaint:', error);
      showError(errorHandler.getMessage(error));
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await complaintsService.updateComplaintStatus(id, newStatus);
      showSuccess(SUCCESS_MESSAGES.DATA_UPDATED);

      // Refresh data
      const result = await fetchData();
      if (result) {
        setComplaints(result.complaintsData?.complaints || []);
        setStats(result.statsData || {});
        setTotalItems(result.complaintsData?.total || 0);
      }
    } catch (error) {
      logger.error('Error updating complaint status:', error);
      showError(errorHandler.getMessage(error));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(
        filteredComplaints.map((complaint) => complaint.id)
      );
      setSelectedItems(allIds);
      setSelectAll(true);
    }
  };

  const handleSelectItem = (complaintId) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(complaintId)) {
      newSelectedItems.delete(complaintId);
    } else {
      newSelectedItems.add(complaintId);
    }
    setSelectedItems(newSelectedItems);
    setSelectAll(newSelectedItems.size === filteredComplaints.length);
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingComplaint(null);
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div
          className={`text-lg ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {t('loading', 'Memuat data pengaduan...')}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 pb-safe'>
      <ToastContainer toasts={toasts} onHideToast={hideToast} />

      <ComplaintsHeader
        isDarkMode={isDarkMode}
        t={t}
        showStats={showStats}
        setShowStats={setShowStats}
        setShowModal={setShowModal}
        user={user}
      />

      <ComplaintsStats
        showStats={showStats}
        stats={stats}
        isDarkMode={isDarkMode}
        t={t}
      />

      <ComplaintsFilters
        filters={filters}
        updateFilter={updateFilter}
        categories={categories}
        statuses={statuses}
        priorities={priorities}
        isDarkMode={isDarkMode}
        t={t}
        user={user}
      />

      {user && (
        <ComplaintsViewModeToggle
          viewMode={filters.viewMode}
          setViewMode={(mode) => updateFilter('viewMode', mode)}
          isDarkMode={isDarkMode}
          user={user}
        />
      )}

      <ComplaintsTable
        currentComplaints={currentComplaints}
        categories={categories}
        priorities={priorities}
        statuses={statuses}
        selectedItems={selectedItems}
        selectAll={selectAll}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={handleReject}
        onStatusUpdate={handleStatusUpdate}
        isDarkMode={isDarkMode}
        t={t}
        user={user}
      />

      {filteredComplaints.length === 0 && !loading && (
        <ComplaintsEmptyState
          filteredComplaints={filteredComplaints}
          loading={loading}
          searchTerm={filters.searchTerm}
          setShowModal={setShowModal}
          isDarkMode={isDarkMode}
          t={t}
        />
      )}

      {totalItems > pageSize && (
        <ComplaintsPagination
          filteredComplaints={filteredComplaints}
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          setCurrentPage={goToPage}
          onNextPage={goToNextPage}
          onPreviousPage={goToPreviousPage}
          isDarkMode={isDarkMode}
          t={t}
        />
      )}

      {showModal && (
        <ComplaintsFormModal
          isOpen={showModal}
          onClose={resetForm}
          onSubmit={handleSubmit}
          editingComplaint={editingComplaint}
          categories={categories}
          priorities={priorities}
          statuses={statuses}
          reporterTypes={reporterTypes}
          isDarkMode={isDarkMode}
          t={t}
          user={user}
        />
      )}

      {showDetailModal && selectedComplaint && (
        <ComplaintsDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          complaint={selectedComplaint}
          onEdit={handleEdit}
          categories={categories}
          priorities={priorities}
          statuses={statuses}
          isDarkMode={isDarkMode}
          t={t}
          user={user}
        />
      )}
    </div>
  );
};

export default Complaints;
