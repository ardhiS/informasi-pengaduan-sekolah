import React, { useState, useEffect } from 'react';
import {
  Plus,
  BarChart3,
  ChevronUp,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import complaintsService from '../services/complaintsService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';
import { useToast } from '../hooks/useToast';
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
  const { isDarkMode, language } = useTheme();
  const { t } = useTranslation(language);
  const { toasts, showSuccess, showError, hideToast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    reporter_name: '',
    reporter_email: '',
    reporter_phone: '',
    reporter_type: 'siswa',
    reporter_class: '',
    status: 'pending_approval',
    admin_notes: '',
    resolution: '',
    assigned_to: '',
    images: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'my', 'assigned'
  const [showStats, setShowStats] = useState(() => {
    // Load stats visibility preference from localStorage
    const saved = localStorage.getItem('complaintsStatsVisible');
    return saved !== null ? JSON.parse(saved) : true;
  }); // State for toggling stats visibility

  // Checkbox selection state
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const categories = complaintsService.getCategories();
  const priorities = complaintsService.getPriorities();
  const statuses = complaintsService.getStatuses();
  const reporterTypes = complaintsService.getReporterTypes();

  useEffect(() => {
    fetchData();
  }, [
    selectedCategory,
    selectedStatus,
    selectedPriority,
    selectedApprovalStatus,
    viewMode,
  ]);

  // Clean up expired tokens on page load
  useEffect(() => {
    const cleanExpiredToken = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = tokenPayload.exp * 1000 < Date.now();

          if (isExpired) {
            console.log('🧹 Cleaning expired token from localStorage');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        } catch (error) {
          console.log('🧹 Cleaning invalid token from localStorage');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    };

    cleanExpiredToken();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setIsReadOnlyMode(false);
    try {
      let complaintsData;

      // Fetch data based on view mode
      if (viewMode === 'my' && user) {
        complaintsData = await complaintsService.getMy();
      } else if (viewMode === 'assigned' && user?.role === 'guru') {
        complaintsData = await complaintsService.getAssigned();
      } else {
        complaintsData = await complaintsService.getAll({
          category: selectedCategory || undefined,
          status: selectedStatus || undefined,
          priority: selectedPriority || undefined,
          approval_status:
            user?.role === 'admin'
              ? selectedApprovalStatus || undefined
              : undefined,
          limit: 100,
        });
      }

      const statsData = await complaintsService.getStats();

      setComplaints(complaintsData || []);
      setStats(statsData || {});

      // Check if we're in read-only mode (no authentication)
      if (!user) {
        setIsReadOnlyMode(true);
        showSuccess(
          'Menampilkan data dalam mode publik (hanya baca). Login untuk fitur lengkap.'
        );
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      // Check if it's an auth error
      if (err.response && [401, 403].includes(err.response.status)) {
        setIsReadOnlyMode(true);
        showError(
          'Sesi login telah berakhir. Menampilkan data publik (hanya baca).'
        );
      } else {
        showError('Gagal memuat data pengaduan. Pastikan backend berjalan.');
      }
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingComplaint) {
        await complaintsService.update(editingComplaint.id, formData);
        showSuccess('Pengaduan berhasil diperbarui!');
      } else {
        await complaintsService.create(formData);
        showSuccess('Pengaduan berhasil dibuat!');
      }

      await fetchData();
      resetForm();
    } catch (err) {
      showError(err.response?.data?.message || 'Operasi gagal');
    }
  };

  const handleEdit = (complaint) => {
    setEditingComplaint(complaint);
    setFormData({
      title: complaint.title || '',
      description: complaint.description || '',
      category: complaint.category || '',
      priority: complaint.priority || 'medium',
      reporter_name: complaint.reporter_name || '',
      reporter_email: complaint.reporter_email || '',
      reporter_phone: complaint.reporter_phone || '',
      reporter_type: complaint.reporter_type || 'siswa',
      reporter_class: complaint.reporter_class || '',
      status: complaint.status || 'pending',
      admin_notes: complaint.admin_notes || '',
      resolution: complaint.resolution || '',
      assigned_to: complaint.assigned_to || '',
    });
    setShowModal(true);
  };

  const handleView = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pengaduan ini?'))
      return;

    try {
      await complaintsService.delete(id);
      showSuccess('Pengaduan berhasil dihapus!');
      await fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Hapus gagal');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      reporter_name: '',
      reporter_email: '',
      reporter_phone: '',
      reporter_type: 'siswa',
      reporter_class: '',
      status: 'pending_approval',
      admin_notes: '',
      resolution: '',
      assigned_to: '',
      images: [],
    });
    setSelectedImages([]);
    // Clean up preview URLs
    imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviewUrls([]);
    setEditingComplaint(null);
    setShowModal(false);
  };

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.reporter_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComplaints = filteredComplaints.slice(startIndex, endIndex);

  const getCategoryInfo = (category) => {
    return (
      categories.find((c) => c.value === category) || {
        label: category,
        icon: '💬',
      }
    );
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find((p) => p.value === priority);
    return priorityObj?.color || 'gray';
  };

  const getStatusColor = (status) => {
    const statusObj = statuses.find((s) => s.value === status);
    return statusObj?.color || 'gray';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB per file

    if (files.length > maxFiles) {
      showError(`Maksimal ${maxFiles} gambar yang dapat diunggah`);
      return;
    }

    const validFiles = [];
    const previewUrls = [];

    for (const file of files) {
      if (file.size > maxSize) {
        showError(`File ${file.name} terlalu besar. Maksimal 5MB per file.`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        showError(`File ${file.name} bukan gambar yang valid.`);
        continue;
      }

      validFiles.push(file);
      previewUrls.push(URL.createObjectURL(file));
    }

    setSelectedImages(validFiles);
    setImagePreviewUrls(previewUrls);
    setFormData({ ...formData, images: validFiles });
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);

    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);

    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
    setFormData({ ...formData, images: newImages });
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menyetujui pengaduan ini?'))
      return;

    try {
      await complaintsService.approve(id);
      showSuccess('Pengaduan berhasil disetujui!');
      await fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal menyetujui pengaduan');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Masukkan alasan penolakan:');
    if (!reason) return;

    try {
      await complaintsService.reject(id, reason);
      showSuccess('Pengaduan berhasil ditolak!');
      await fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal menolak pengaduan');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const notes = prompt('Masukkan catatan (opsional):') || '';

    try {
      await complaintsService.updateProgress(id, newStatus, notes);
      showSuccess('Status pengaduan berhasil diperbarui!');
      await fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Gagal memperbarui status');
    }
  };

  // Save stats visibility preference to localStorage
  useEffect(() => {
    localStorage.setItem('complaintsStatsVisible', JSON.stringify(showStats));
  }, [showStats]);

  // Checkbox selection handlers
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

  // Update selectAll state when filtered complaints change
  useEffect(() => {
    if (filteredComplaints.length > 0) {
      setSelectAll(
        selectedItems.size === filteredComplaints.length &&
          filteredComplaints.every((complaint) =>
            selectedItems.has(complaint.id)
          )
      );
    } else {
      setSelectAll(false);
    }
  }, [filteredComplaints, selectedItems]);

  if (loading) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-64 space-y-4 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            isDarkMode ? 'border-primary-400' : 'border-primary-600'
          }`}
        ></div>
        <div>{t('loading', 'Memuat data pengaduan...')}</div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 pb-safe'>
      <ToastContainer toasts={toasts} onHideToast={hideToast} />

      <ComplaintsHeader
        isDarkMode={isDarkMode}
        t={t}
        isReadOnlyMode={isReadOnlyMode}
        showStats={showStats}
        setShowStats={setShowStats}
        setShowModal={setShowModal}
      />

      <ComplaintsStats
        isDarkMode={isDarkMode}
        t={t}
        showStats={showStats}
        stats={stats}
      />

      <ComplaintsFilters
        isDarkMode={isDarkMode}
        t={t}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedApprovalStatus={selectedApprovalStatus}
        setSelectedApprovalStatus={setSelectedApprovalStatus}
        categories={categories}
        statuses={statuses}
        priorities={priorities}
        user={user}
      />

      <ComplaintsViewModeToggle
        isDarkMode={isDarkMode}
        user={user}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className='mx-2 sm:mx-0'>
        {/* Mobile View - we'll need to create ComplaintCard component */}
        <div className='block lg:hidden space-y-4'>
          {currentComplaints.map((complaint) => (
            <div key={complaint.id} className="complaint-card">
              {/* Mobile card content - to be implemented */}
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <ComplaintsTable
          isDarkMode={isDarkMode}
          handleSelectAll={handleSelectAll}
          selectAll={selectAll}
          user={user}
          currentComplaints={currentComplaints}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          getCategoryInfo={getCategoryInfo}
          getImageDisplay={getImageDisplay}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
          formatDateTime={formatDateTime}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          statuses={statuses}
          priorities={priorities}
        />

        <ComplaintsEmptyState
          isDarkMode={isDarkMode}
          t={t}
          filteredComplaints={filteredComplaints}
          loading={loading}
          searchTerm={searchTerm}
          setShowModal={setShowModal}
        />
      </div>

      <ComplaintsPagination
        isDarkMode={isDarkMode}
        t={t}
        filteredComplaints={filteredComplaints}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      <ComplaintsFormModal
        showModal={showModal}
        isDarkMode={isDarkMode}
        t={t}
        editingComplaint={editingComplaint}
        resetForm={resetForm}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        priorities={priorities}
        reporterTypes={reporterTypes}
        handleImageChange={handleImageChange}
        imagePreviewUrls={imagePreviewUrls}
        removeImage={removeImage}
        selectedImages={selectedImages}
        user={user}
        statuses={statuses}
      />

      <ComplaintsDetailModal
        showDetailModal={showDetailModal}
        selectedComplaint={selectedComplaint}
        setShowDetailModal={setShowDetailModal}
        isDarkMode={isDarkMode}
        user={user}
        getCategoryInfo={getCategoryInfo}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
        statuses={statuses}
        priorities={priorities}
        formatDateTime={formatDateTime}
        handleEdit={handleEdit}
      />
    </div>
  );
    <div className='space-y-4 sm:space-y-6 pb-safe'>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onHideToast={hideToast} />

      {/* Mobile-friendly header */}
      <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0 px-2 sm:px-0'>
        <h1
          className={`text-mobile sm:text-3xl font-bold ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {t('complaintsManagement', 'Manajemen Pengaduan')}
          {isReadOnlyMode && (
            <span className='ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full'>
              Mode Publik
            </span>
          )}
        </h1>
        <div className='flex items-center gap-2'>
          {/* Stats Toggle Button */}
          <button
            onClick={() => setShowStats(!showStats)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-100'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
            }`}
            title={showStats ? 'Sembunyikan Statistik' : 'Tampilkan Statistik'}
          >
            <BarChart3 className='h-4 w-4' />
            <span className='hidden sm:inline'>
              {showStats ? 'Sembunyikan' : 'Tampilkan'} Statistik
            </span>
            {showStats ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </button>

          {!isReadOnlyMode && (
            <button
              onClick={() => setShowModal(true)}
              className='btn-primary w-full xs:w-auto justify-center'
            >
              <Plus className='h-4 w-4 mr-2' />
              <span className='text-xs sm:text-sm'>
                {t('addComplaint', 'Tambah Pengaduan')}
              </span>
            </button>
          )}
        </div>

        {isReadOnlyMode && (
          <div className='text-sm text-yellow-600 text-center'>
            <AlertCircle className='h-4 w-4 inline mr-1' />
            Login untuk membuat atau mengedit pengaduan
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showStats
            ? 'max-h-96 opacity-100 transform translate-y-0'
            : 'max-h-0 opacity-0 transform -translate-y-4'
        }`}
      >
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mx-2 sm:mx-0 pb-4'>
          <div
            className={`card p-3 sm:p-6 stats-card-hover ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <MessageSquare
                  className={`h-6 w-6 sm:h-8 sm:w-8 ${
                    isDarkMode ? 'text-primary-400' : 'text-primary-600'
                  }`}
                />
              </div>
              <div className='ml-3 sm:ml-5 w-0 flex-1'>
                <dl>
                  <dt
                    className={`text-xs sm:text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } truncate`}
                  >
                    {t('totalComplaints', 'Total Pengaduan')}
                  </dt>
                  <dd
                    className={`text-lg sm:text-2xl font-bold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    {stats.total || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div
            className={`card p-3 sm:p-6 stats-card-hover ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <Clock
                  className={`h-6 w-6 sm:h-8 sm:w-8 ${
                    isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`}
                />
              </div>
              <div className='ml-3 sm:ml-5 w-0 flex-1'>
                <dl>
                  <dt
                    className={`text-xs sm:text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } truncate`}
                  >
                    {t('pending', 'Menunggu')}
                  </dt>
                  <dd
                    className={`text-lg sm:text-2xl font-bold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    {stats.pending || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div
            className={`card p-3 sm:p-6 stats-card-hover ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <AlertCircle
                  className={`h-6 w-6 sm:h-8 sm:w-8 ${
                    isDarkMode ? 'text-orange-400' : 'text-orange-600'
                  }`}
                />
              </div>
              <div className='ml-3 sm:ml-5 w-0 flex-1'>
                <dl>
                  <dt
                    className={`text-xs sm:text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } truncate`}
                  >
                    {t('urgent', 'Mendesak')}
                  </dt>
                  <dd
                    className={`text-lg sm:text-2xl font-bold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    {stats.urgent || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div
            className={`card p-3 sm:p-6 stats-card-hover ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <CheckCircle
                  className={`h-6 w-6 sm:h-8 sm:w-8 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}
                />
              </div>
              <div className='ml-3 sm:ml-5 w-0 flex-1'>
                <dl>
                  <dt
                    className={`text-xs sm:text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } truncate`}
                  >
                    {t('resolved', 'Selesai')}
                  </dt>
                  <dd
                    className={`text-lg sm:text-2xl font-bold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    {stats.resolved || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className='flex flex-col gap-3 sm:gap-4 mx-2 sm:mx-0'>
        {/* Search bar */}
        <div className='relative flex-1'>
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`}
          />
          <input
            type='text'
            placeholder={t('searchComplaints', 'Cari pengaduan...')}
            className={`w-full pl-10 sm:pl-12 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3'>
          <select
            className={`w-full px-3 py-2 border rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value=''>{t('allCategories', 'Semua Kategori')}</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>

          <select
            className={`w-full px-3 py-2 border rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value=''>{t('allStatuses', 'Semua Status')}</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            className={`w-full px-3 py-2 border rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600 text-gray-100'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value=''>{t('allPriorities', 'Semua Prioritas')}</option>
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>

          {/* Admin-only approval status filter */}
          {user?.role === 'admin' && (
            <select
              className={`w-full px-3 py-2 border rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={selectedApprovalStatus}
              onChange={(e) => setSelectedApprovalStatus(e.target.value)}
            >
              <option value=''>Semua Status Persetujuan</option>
              <option value='pending_approval'>Menunggu Persetujuan</option>
              <option value='approved'>Disetujui</option>
              <option value='rejected'>Ditolak</option>
            </select>
          )}
        </div>
      </div>

      {/* View Mode Tabs */}
      {user && (
        <div className='mx-2 sm:mx-0'>
          <div
            className={`card p-1 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className='flex space-x-1'>
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'all'
                    ? isDarkMode
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-600 text-white'
                    : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Semua Pengaduan
              </button>
              <button
                onClick={() => setViewMode('my')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'my'
                    ? isDarkMode
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-600 text-white'
                    : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Pengaduan Saya
              </button>
              {user.role === 'guru' && (
                <button
                  onClick={() => setViewMode('assigned')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'assigned'
                      ? isDarkMode
                        ? 'bg-primary-600 text-white'
                        : 'bg-primary-600 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Yang Ditugaskan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Complaints List - Mobile Cards, Desktop Table */}
      <div className='mx-2 sm:mx-0'>
        {/* Mobile Cards */}
        <div className='block lg:hidden space-y-4'>
          {currentComplaints.map((complaint) => {
            const categoryInfo = getCategoryInfo(complaint.category);
            return (
              <div
                key={complaint.id}
                className={`p-4 rounded-lg border shadow-sm ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1 min-w-0'>
                    <h3
                      className={`text-sm font-semibold truncate ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      {complaint.title}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {categoryInfo.icon} {categoryInfo.label}
                    </p>
                  </div>
                  <div className='flex space-x-1 ml-2'>
                    <button
                      onClick={() => handleView(complaint)}
                      className={`p-1.5 rounded ${
                        isDarkMode
                          ? 'text-gray-400 hover:text-blue-400'
                          : 'text-gray-500 hover:text-blue-600'
                      }`}
                    >
                      <Eye className='h-4 w-4' />
                    </button>
                    {!isReadOnlyMode && (
                      <>
                        <button
                          onClick={() => handleEdit(complaint)}
                          className={`p-1.5 rounded ${
                            isDarkMode
                              ? 'text-gray-400 hover:text-primary-400'
                              : 'text-gray-500 hover:text-primary-600'
                          }`}
                        >
                          <Edit className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => handleDelete(complaint.id)}
                          className='p-1.5 text-gray-500 hover:text-red-600 rounded'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  {/* Hide reporter info for students to maintain privacy */}
                  {user?.role !== 'siswa' && (
                    <div className='flex items-center justify-between text-xs'>
                      <span className='text-gray-600'>Pelapor:</span>
                      <span className='font-medium'>
                        {complaint.reporter_name}
                      </span>
                    </div>
                  )}

                  <div className='flex items-center justify-between'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(
                        complaint.status
                      )}-100 text-${getStatusColor(complaint.status)}-800`}
                    >
                      {statuses.find((s) => s.value === complaint.status)
                        ?.label || complaint.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium bg-${getPriorityColor(
                        complaint.priority
                      )}-100 text-${getPriorityColor(complaint.priority)}-800`}
                    >
                      {priorities.find((p) => p.value === complaint.priority)
                        ?.label || complaint.priority}
                    </span>
                  </div>

                  <div className='text-xs text-gray-500 pt-1 border-t'>
                    {formatDateTime(complaint.reported_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table */}
        <div
          className={`hidden lg:block card overflow-hidden ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className='overflow-x-auto'>
            <table
              className={`min-w-full divide-y ${
                isDarkMode ? 'divide-gray-600' : 'divide-gray-200'
              }`}
            >
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className={`form-checkbox h-4 w-4 ${
                          isDarkMode
                            ? 'text-primary-400 bg-gray-700 border-gray-600'
                            : 'text-primary-600 bg-white border-gray-300'
                        }`}
                        aria-label='Pilih Semua'
                      />
                      <span className='ml-2'>
                        {t('titleAndCategory', 'Judul & Kategori')}
                      </span>
                    </div>
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {t('actions', 'Aksi')}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {t('images', 'Gambar')}
                  </th>
                  {/* Reporter Column - Hidden for students to maintain privacy */}
                  {user?.role !== 'siswa' && (
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {t('reporter', 'Pelapor')}
                    </th>
                  )}
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {t('status', 'Status')}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {t('priority', 'Prioritas')}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {t('date', 'Tanggal')}
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode
                    ? 'bg-gray-800 divide-gray-600'
                    : 'bg-white divide-gray-200'
                }`}
              >
                {currentComplaints.map((complaint) => {
                  const categoryInfo = getCategoryInfo(complaint.category);
                  return (
                    <tr
                      key={complaint.id}
                      className={
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }
                    >
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <input
                            type='checkbox'
                            checked={selectedItems.has(complaint.id)}
                            onChange={() => handleSelectItem(complaint.id)}
                            className={`form-checkbox h-4 w-4 ${
                              isDarkMode
                                ? 'text-primary-400 bg-gray-700 border-gray-600'
                                : 'text-primary-600 bg-white border-gray-300'
                            }`}
                            aria-label={`Pilih ${complaint.title}`}
                          />
                          <div className='ml-3'>
                            <div
                              className={`text-sm font-medium ${
                                isDarkMode ? 'text-gray-100' : 'text-gray-900'
                              }`}
                            >
                              {complaint.title}
                            </div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              {categoryInfo.icon} {categoryInfo.label}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className='flex justify-end space-x-1'>
                          <button
                            onClick={() => handleView(complaint)}
                            className={`p-1 transition-colors ${
                              isDarkMode
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-blue-600 hover:text-blue-900'
                            }`}
                            title='Lihat Detail'
                          >
                            <Eye className='h-4 w-4' />
                          </button>

                          {/* Admin actions */}
                          {user?.role === 'admin' && (
                            <>
                              {complaint.approval_status ===
                                'pending_approval' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(complaint.id)}
                                    className='p-1 text-green-600 hover:text-green-700'
                                    title='Setujui'
                                  >
                                    <CheckCircle className='h-4 w-4' />
                                  </button>
                                  <button
                                    onClick={() => handleReject(complaint.id)}
                                    className='p-1 text-red-600 hover:text-red-700'
                                    title='Tolak'
                                  >
                                    <X className='h-4 w-4' />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleEdit(complaint)}
                                className={`p-1 transition-colors ${
                                  isDarkMode
                                    ? 'text-primary-400 hover:text-primary-300'
                                    : 'text-primary-600 hover:text-primary-900'
                                }`}
                                title='Edit'
                              >
                                <Edit className='h-4 w-4' />
                              </button>
                              <button
                                onClick={() => handleDelete(complaint.id)}
                                className={`p-1 transition-colors ${
                                  isDarkMode
                                    ? 'text-red-400 hover:text-red-300'
                                    : 'text-red-600 hover:text-red-900'
                                }`}
                                title='Hapus'
                              >
                                <Trash2 className='h-4 w-4' />
                              </button>
                            </>
                          )}

                          {/* Guru actions */}
                          {user?.role === 'guru' &&
                            complaint.approval_status === 'approved' && (
                              <>
                                {complaint.status === 'approved' && (
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(
                                        complaint.id,
                                        'in_progress'
                                      )
                                    }
                                    className='p-1 text-blue-600 hover:text-blue-700'
                                    title='Mulai Proses'
                                  >
                                    <Clock className='h-4 w-4' />
                                  </button>
                                )}
                                {complaint.status === 'in_progress' && (
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(
                                        complaint.id,
                                        'resolved'
                                      )
                                    }
                                    className='p-1 text-green-600 hover:text-green-700'
                                    title='Selesaikan'
                                  >
                                    <CheckCircle className='h-4 w-4' />
                                  </button>
                                )}
                              </>
                            )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {complaint.images && complaint.images.length > 0 ? (
                          <div className='flex space-x-1'>
                            {complaint.images
                              .slice(0, 3)
                              .map((image, index) => (
                                <img
                                  key={index}
                                  src={image.file_path}
                                  alt={`Gambar ${index + 1}`}
                                  className='w-8 h-8 object-cover rounded border'
                                />
                              ))}
                            {complaint.images.length > 3 && (
                              <div className='w-8 h-8 bg-gray-200 rounded border flex items-center justify-center text-xs'>
                                +{complaint.images.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            Tidak ada
                          </span>
                        )}
                      </td>
                      {/* Reporter Column - Hidden for students to maintain privacy */}
                      {user?.role !== 'siswa' && (
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {user?.role === 'admin' ? (
                            <div>
                              <div
                                className={`text-sm ${
                                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                                }`}
                              >
                                {complaint.reporter_name}
                              </div>
                              <div
                                className={`text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}
                              >
                                {complaint.reporter_type}
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            >
                              Informasi disembunyikan
                            </div>
                          )}
                        </td>
                      )}
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isDarkMode
                              ? `bg-${getStatusColor(
                                  complaint.status
                                )}-900/30 text-${getStatusColor(
                                  complaint.status
                                )}-400 border border-${getStatusColor(
                                  complaint.status
                                )}-700`
                              : `bg-${getStatusColor(
                                  complaint.status
                                )}-100 text-${getStatusColor(
                                  complaint.status
                                )}-800`
                          }`}
                        >
                          {statuses.find((s) => s.value === complaint.status)
                            ?.label || complaint.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isDarkMode
                              ? `bg-${getPriorityColor(
                                  complaint.priority
                                )}-900/30 text-${getPriorityColor(
                                  complaint.priority
                                )}-400 border border-${getPriorityColor(
                                  complaint.priority
                                )}-700`
                              : `bg-${getPriorityColor(
                                  complaint.priority
                                )}-100 text-${getPriorityColor(
                                  complaint.priority
                                )}-800`
                          }`}
                        >
                          {priorities.find(
                            (p) => p.value === complaint.priority
                          )?.label || complaint.priority}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {formatDateTime(complaint.reported_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredComplaints.length === 0 && !loading && (
          <div className='text-center py-12'>
            <MessageSquare
              className={`mx-auto h-12 w-12 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
            <h3
              className={`mt-2 text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              {t('noComplaints', 'Tidak ada pengaduan')}
            </h3>
            <p
              className={`mt-1 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {searchTerm
                ? t('tryDifferentKeyword', 'Coba ubah kata kunci pencarian.')
                : t('noComplaintsYet', 'Belum ada pengaduan yang tersedia.')}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className='mt-4 btn-primary'
            >
              {t('createFirstComplaint', 'Buat Pengaduan Pertama')}
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredComplaints.length > itemsPerPage && (
        <div
          className={`flex items-center justify-between border-t px-4 py-3 sm:px-6 mx-2 sm:mx-0 rounded-lg ${
            isDarkMode
              ? 'border-gray-600 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className='flex flex-1 justify-between sm:hidden'>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('previous', 'Previous')}
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('next', 'Next')}
            </button>
          </div>
          <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
            <div>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {t('showing', 'Menampilkan')}{' '}
                <span className='font-medium'>{startIndex + 1}</span>{' '}
                {t('to', 'sampai')}{' '}
                <span className='font-medium'>
                  {Math.min(endIndex, filteredComplaints.length)}
                </span>{' '}
                {t('of', 'dari')}{' '}
                <span className='font-medium'>{filteredComplaints.length}</span>{' '}
                {t('results', 'hasil')}
              </p>
            </div>
            <div>
              <nav className='isolate inline-flex -space-x-px rounded-md shadow-sm'>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === page
                          ? isDarkMode
                            ? 'z-10 bg-primary-600 text-white'
                            : 'z-10 bg-primary-600 text-white'
                          : isDarkMode
                          ? 'text-gray-300 ring-1 ring-inset ring-gray-600 hover:bg-gray-700'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form - akan dibuat di bagian selanjutnya */}
      {/* Modal Detail - akan dibuat di bagian selanjutnya */}

      {/* Modal Form untuk Create/Edit */}
      {showModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4'>
          <div
            className={`relative rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className='p-4 sm:p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3
                  className={`text-lg font-medium ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {editingComplaint
                    ? t('editComplaint', 'Edit Pengaduan')
                    : t('createNewComplaint', 'Buat Pengaduan Baru')}
                </h3>
                <button
                  onClick={resetForm}
                  className={
                    isDarkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-400 hover:text-gray-600'
                  }
                >
                  <X className='h-6 w-6' />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Basic Info */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='sm:col-span-2'>
                    <label className='label text-xs sm:text-sm'>
                      Judul Pengaduan
                    </label>
                    <input
                      type='text'
                      required
                      className='input-field text-sm'
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder='Masukkan judul pengaduan'
                    />
                  </div>

                  <div>
                    <label className='label text-xs sm:text-sm'>Kategori</label>
                    <select
                      required
                      className='input-field text-sm'
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value=''>Pilih kategori</option>
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className='label text-xs sm:text-sm'>
                      Prioritas
                    </label>
                    <select
                      className='input-field text-sm'
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='sm:col-span-2'>
                    <label className='label text-xs sm:text-sm'>
                      Deskripsi
                    </label>
                    <textarea
                      required
                      className='input-field text-sm'
                      rows='4'
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder='Jelaskan detail pengaduan Anda'
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className='label text-xs sm:text-sm'>
                      Gambar Pendukung (Opsional)
                    </label>
                    <input
                      type='file'
                      multiple
                      accept='image/*'
                      onChange={handleImageChange}
                      className='input-field text-sm'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      Maksimal 5 gambar, ukuran masing-masing maksimal 5MB
                    </p>

                    {/* Image Previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className='mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2'>
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className='relative'>
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className='w-full h-20 object-cover rounded border'
                            />
                            <button
                              type='button'
                              onClick={() => removeImage(index)}
                              className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reporter Info */}
                <div className='border-t pt-4'>
                  <h4 className='text-sm font-medium text-gray-900 mb-3'>
                    Informasi Pelapor
                  </h4>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='label text-xs sm:text-sm'>
                        Nama Lengkap
                      </label>
                      <input
                        type='text'
                        required
                        className='input-field text-sm'
                        value={formData.reporter_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reporter_name: e.target.value,
                          })
                        }
                        placeholder='Nama lengkap pelapor'
                      />
                    </div>

                    <div>
                      <label className='label text-xs sm:text-sm'>
                        Tipe Pelapor
                      </label>
                      <select
                        required
                        className='input-field text-sm'
                        value={formData.reporter_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reporter_type: e.target.value,
                          })
                        }
                      >
                        {reporterTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='label text-xs sm:text-sm'>Email</label>
                      <input
                        type='email'
                        className='input-field text-sm'
                        value={formData.reporter_email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reporter_email: e.target.value,
                          })
                        }
                        placeholder='email@example.com'
                      />
                    </div>

                    <div>
                      <label className='label text-xs sm:text-sm'>
                        No. Telepon
                      </label>
                      <input
                        type='tel'
                        className='input-field text-sm'
                        value={formData.reporter_phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reporter_phone: e.target.value,
                          })
                        }
                        placeholder='08xxxxxxxxxx'
                      />
                    </div>

                    {formData.reporter_type === 'siswa' && (
                      <div className='sm:col-span-2'>
                        <label className='label text-xs sm:text-sm'>
                          Kelas
                        </label>
                        <input
                          type='text'
                          className='input-field text-sm'
                          value={formData.reporter_class}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reporter_class: e.target.value,
                            })
                          }
                          placeholder='contoh: VII-A, VIII-B'
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Fields (untuk edit) */}
                {editingComplaint && user?.role === 'admin' && (
                  <div className='border-t pt-4'>
                    <h4 className='text-sm font-medium text-gray-900 mb-3'>
                      Tindak Lanjut Admin
                    </h4>
                    <div className='space-y-4'>
                      <div>
                        <label className='label text-xs sm:text-sm'>
                          Status
                        </label>
                        <select
                          className='input-field text-sm'
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                        >
                          {statuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className='label text-xs sm:text-sm'>
                          Catatan Admin
                        </label>
                        <textarea
                          className='input-field text-sm'
                          rows='3'
                          value={formData.admin_notes}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              admin_notes: e.target.value,
                            })
                          }
                          placeholder='Catatan tindak lanjut dari admin'
                        />
                      </div>

                      {(formData.status === 'resolved' ||
                        formData.status === 'closed') && (
                        <div>
                          <label className='label text-xs sm:text-sm'>
                            Solusi/Penyelesaian
                          </label>
                          <textarea
                            className='input-field text-sm'
                            rows='3'
                            value={formData.resolution}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                resolution: e.target.value,
                              })
                            }
                            placeholder='Jelaskan solusi yang diberikan'
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Images Upload */}
                <div className='border-t pt-4'>
                  <h4 className='text-sm font-medium text-gray-900 mb-3'>
                    Unggah Gambar (opsional)
                  </h4>
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <div className='flex-1'>
                      <input
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={handleImageChange}
                        className='hidden'
                        id='image-upload'
                      />
                      <label
                        htmlFor='image-upload'
                        className={`flex items-center justify-center h-32 rounded-lg border cursor-pointer transition-all ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        {selectedImages.length === 0 && (
                          <span
                            className={`text-gray-500 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            <Camera className='h-8 w-8 mx-auto mb-2' />
                            Klik untuk mengunggah gambar
                          </span>
                        )}
                      </label>
                    </div>

                    {/* Preview Images */}
                    {imagePreviewUrls.length > 0 && (
                      <div className='grid grid-cols-3 gap-2 w-full h-full'>
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className='relative'>
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className='w-full h-24 object-cover rounded border'
                            />
                            <button
                              type='button'
                              onClick={() => removeImage(index)}
                              className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col xs:flex-row gap-3 xs:gap-3 xs:justify-end pt-4'>
                  <button
                    type='button'
                    onClick={resetForm}
                    className='btn-secondary w-full xs:w-auto justify-center'
                  >
                    {t('cancel', 'Batal')}
                  </button>
                  <button
                    type='submit'
                    className='btn-primary w-full xs:w-auto justify-center'
                  >
                    {editingComplaint
                      ? t('updateComplaint', 'Update Pengaduan')
                      : t('submitComplaint', 'Kirim Pengaduan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {showDetailModal && selectedComplaint && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4'>
          <div
            className={`relative rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className='p-4 sm:p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3
                  className={`text-lg font-medium ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Detail Pengaduan
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className={
                    isDarkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-400 hover:text-gray-600'
                  }
                >
                  <X className='h-6 w-6' />
                </button>
              </div>

              <div className='space-y-6'>
                {/* Header Info */}
                <div
                  className={`rounded-lg p-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                      <h4
                        className={`text-lg font-semibold ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {selectedComplaint.title}
                      </h4>
                      <div className='flex items-center space-x-2 mt-2'>
                        <span
                          className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          {getCategoryInfo(selectedComplaint.category).icon}{' '}
                          {getCategoryInfo(selectedComplaint.category).label}
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-2'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode
                            ? `bg-${getStatusColor(
                                selectedComplaint.status
                              )}-900/30 text-${getStatusColor(
                                selectedComplaint.status
                              )}-400 border border-${getStatusColor(
                                selectedComplaint.status
                              )}-700`
                            : `bg-${getStatusColor(
                                selectedComplaint.status
                              )}-100 text-${getStatusColor(
                                selectedComplaint.status
                              )}-800`
                        }`}
                      >
                        {statuses.find(
                          (s) => s.value === selectedComplaint.status
                        )?.label || selectedComplaint.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode
                            ? `bg-${getPriorityColor(
                                selectedComplaint.priority
                              )}-900/30 text-${getPriorityColor(
                                selectedComplaint.priority
                              )}-400 border border-${getPriorityColor(
                                selectedComplaint.priority
                              )}-700`
                            : `bg-${getPriorityColor(
                                selectedComplaint.priority
                              )}-100 text-${getPriorityColor(
                                selectedComplaint.priority
                              )}-800`
                        }`}
                      >
                        {priorities.find(
                          (p) => p.value === selectedComplaint.priority
                        )?.label || selectedComplaint.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h5
                    className={`text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    Deskripsi:
                  </h5>
                  <p
                    className={`text-sm rounded p-3 whitespace-pre-wrap ${
                      isDarkMode
                        ? 'text-gray-300 bg-gray-700'
                        : 'text-gray-700 bg-gray-50'
                    }`}
                  >
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Reporter Info - Hidden for students */}
                {user?.role !== 'siswa' && (
                  <div>
                    <h5
                      className={`text-sm font-medium mb-3 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      Informasi Pelapor:
                    </h5>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                      <div className='flex items-center space-x-2'>
                        <User
                          className={`h-4 w-4 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                          }`}
                        />
                        <span
                          className={
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }
                        >
                          Nama:
                        </span>
                        <span
                          className={`font-medium ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}
                        >
                          {selectedComplaint.reporter_name}
                        </span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <UserCheck
                          className={`h-4 w-4 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                          }`}
                        />
                        <span
                          className={
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }
                        >
                          Tipe:
                        </span>
                        <span
                          className={`font-medium capitalize ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}
                        >
                          {selectedComplaint.reporter_type}
                        </span>
                      </div>
                      {selectedComplaint.reporter_email && (
                        <div className='flex items-center space-x-2'>
                          <Mail
                            className={`h-4 w-4 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-400'
                            }`}
                          />
                          <span
                            className={
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }
                          >
                            Email:
                          </span>
                          <span
                            className={`font-medium ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}
                          >
                            {selectedComplaint.reporter_email}
                          </span>
                        </div>
                      )}
                      {selectedComplaint.reporter_phone && (
                        <div className='flex items-center space-x-2'>
                          <Phone
                            className={`h-4 w-4 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-400'
                            }`}
                          />
                          <span
                            className={
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }
                          >
                            Telepon:
                          </span>
                          <span
                            className={`font-medium ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}
                          >
                            {selectedComplaint.reporter_phone}
                          </span>
                        </div>
                      )}
                      {selectedComplaint.reporter_class && (
                        <div className='flex items-center space-x-2'>
                          <Tag
                            className={`h-4 w-4 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-400'
                            }`}
                          />
                          <span
                            className={
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }
                          >
                            Kelas:
                          </span>
                          <span
                            className={`font-medium ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-900'
                            }`}
                          >
                            {selectedComplaint.reporter_class}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h5
                    className={`text-sm font-medium mb-3 ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    Timeline:
                  </h5>
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-3'>
                      <Calendar
                        className={`h-4 w-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Dilaporkan:
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}
                      >
                        {formatDateTime(selectedComplaint.reported_at)}
                      </span>
                    </div>
                    {selectedComplaint.resolved_at && (
                      <div className='flex items-center space-x-3'>
                        <CheckCircle className='h-4 w-4 text-green-500' />
                        <span
                          className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          Diselesaikan:
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}
                        >
                          {formatDateTime(selectedComplaint.resolved_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedComplaint.admin_notes && (
                  <div>
                    <h5
                      className={`text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      Catatan Admin:
                    </h5>
                    <p
                      className={`text-sm rounded p-3 whitespace-pre-wrap ${
                        isDarkMode
                          ? 'text-gray-300 bg-blue-900/30 border border-blue-700'
                          : 'text-gray-700 bg-blue-50'
                      }`}
                    >
                      {selectedComplaint.admin_notes}
                    </p>
                  </div>
                )}

                {/* Resolution */}
                {selectedComplaint.resolution && (
                  <div>
                    <h5
                      className={`text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      Solusi:
                    </h5>
                    <p
                      className={`text-sm rounded p-3 whitespace-pre-wrap ${
                        isDarkMode
                          ? 'text-gray-300 bg-green-900/30 border border-green-700'
                          : 'text-gray-700 bg-green-50'
                      }`}
                    >
                      {selectedComplaint.resolution}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className='flex flex-col xs:flex-row gap-3 xs:gap-3 xs:justify-end pt-4 border-t'>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className='btn-secondary w-full xs:w-auto justify-center'
                  >
                    Tutup
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        handleEdit(selectedComplaint);
                      }}
                      className='btn-primary w-full xs:w-auto justify-center'
                    >
                      <Edit className='h-4 w-4 mr-2' />
                      Edit Pengaduan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
