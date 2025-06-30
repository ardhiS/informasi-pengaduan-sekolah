import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  Tag,
  Flag,
  FileText,
  UserCheck,
  X,
} from 'lucide-react';
import complaintsService from '../services/complaintsService';
import { useAuth } from '../context/AuthContext';

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
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
    status: 'pending',
    admin_notes: '',
    resolution: '',
    assigned_to: '',
  });

  const categories = complaintsService.getCategories();
  const priorities = complaintsService.getPriorities();
  const statuses = complaintsService.getStatuses();
  const reporterTypes = complaintsService.getReporterTypes();

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedStatus, selectedPriority]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [complaintsData, statsData] = await Promise.all([
        complaintsService.getAll({
          category: selectedCategory || undefined,
          status: selectedStatus || undefined,
          priority: selectedPriority || undefined,
          limit: 100,
        }),
        complaintsService.getStats(),
      ]);

      setComplaints(complaintsData || []);
      setStats(statsData || {});
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data pengaduan. Pastikan backend berjalan.');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingComplaint) {
        await complaintsService.update(editingComplaint.id, formData);
        setSuccess('Pengaduan berhasil diperbarui!');
      } else {
        await complaintsService.create(formData);
        setSuccess('Pengaduan berhasil dibuat!');
      }

      await fetchData();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Operasi gagal');
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
      setSuccess('Pengaduan berhasil dihapus!');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Hapus gagal');
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
      status: 'pending',
      admin_notes: '',
      resolution: '',
      assigned_to: '',
    });
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

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600'></div>
        <div className='text-gray-600'>Memuat data pengaduan...</div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6 pb-safe'>
      {/* Mobile-friendly header */}
      <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0 px-2 sm:px-0'>
        <h1 className='text-mobile sm:text-3xl font-bold text-gray-900'>
          Manajemen Pengaduan
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className='btn-primary w-full xs:w-auto justify-center'
        >
          <Plus className='h-4 w-4 mr-2' />
          <span className='text-xs sm:text-sm'>Tambah Pengaduan</span>
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className='alert-error mx-2 sm:mx-0'>
          <div className='flex items-start'>
            <AlertCircle className='h-4 w-4 sm:h-5 sm:w-5 text-red-400 mt-0.5 flex-shrink-0' />
            <div className='ml-2 sm:ml-3 text-xs sm:text-sm text-red-800 break-words'>
              {error}
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className='alert-success mx-2 sm:mx-0'>
          <div className='flex items-start'>
            <CheckCircle className='h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 flex-shrink-0' />
            <div className='ml-2 sm:ml-3 text-xs sm:text-sm text-green-800 break-words'>
              {success}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mx-2 sm:mx-0'>
        <div className='card p-3 sm:p-6'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <MessageSquare className='h-6 w-6 sm:h-8 sm:w-8 text-primary-600' />
            </div>
            <div className='ml-3 sm:ml-5 w-0 flex-1'>
              <dl>
                <dt className='text-xs sm:text-sm font-medium text-gray-500 truncate'>
                  Total Pengaduan
                </dt>
                <dd className='text-lg sm:text-2xl font-bold text-gray-900'>
                  {stats.total || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className='card p-3 sm:p-6'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <Clock className='h-6 w-6 sm:h-8 sm:w-8 text-yellow-600' />
            </div>
            <div className='ml-3 sm:ml-5 w-0 flex-1'>
              <dl>
                <dt className='text-xs sm:text-sm font-medium text-gray-500 truncate'>
                  Menunggu
                </dt>
                <dd className='text-lg sm:text-2xl font-bold text-gray-900'>
                  {stats.pending || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className='card p-3 sm:p-6'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <AlertCircle className='h-6 w-6 sm:h-8 sm:w-8 text-orange-600' />
            </div>
            <div className='ml-3 sm:ml-5 w-0 flex-1'>
              <dl>
                <dt className='text-xs sm:text-sm font-medium text-gray-500 truncate'>
                  Mendesak
                </dt>
                <dd className='text-lg sm:text-2xl font-bold text-gray-900'>
                  {stats.urgent || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className='card p-3 sm:p-6'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <CheckCircle className='h-6 w-6 sm:h-8 sm:w-8 text-green-600' />
            </div>
            <div className='ml-3 sm:ml-5 w-0 flex-1'>
              <dl>
                <dt className='text-xs sm:text-sm font-medium text-gray-500 truncate'>
                  Selesai
                </dt>
                <dd className='text-lg sm:text-2xl font-bold text-gray-900'>
                  {stats.resolved || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className='flex flex-col gap-3 sm:gap-4 mx-2 sm:mx-0'>
        {/* Search bar */}
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400' />
          <input
            type='text'
            placeholder='Cari pengaduan...'
            className='input-field pl-10 sm:pl-12 text-sm'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <select
            className='input-field text-xs sm:text-sm'
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value=''>Semua Kategori</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.icon} {category.label}
              </option>
            ))}
          </select>

          <select
            className='input-field text-xs sm:text-sm'
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value=''>Semua Status</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            className='input-field text-xs sm:text-sm'
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value=''>Semua Prioritas</option>
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints List - Mobile Cards, Desktop Table */}
      <div className='mx-2 sm:mx-0'>
        {/* Mobile Cards */}
        <div className='block lg:hidden space-y-4'>
          {currentComplaints.map((complaint) => {
            const categoryInfo = getCategoryInfo(complaint.category);
            return (
              <div key={complaint.id} className='card p-4'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-sm font-semibold text-gray-900 truncate'>
                      {complaint.title}
                    </h3>
                    <p className='text-xs text-gray-500 mt-1'>
                      {categoryInfo.icon} {categoryInfo.label}
                    </p>
                  </div>
                  <div className='flex space-x-1 ml-2'>
                    <button
                      onClick={() => handleView(complaint)}
                      className='p-1.5 text-gray-500 hover:text-blue-600 rounded'
                    >
                      <Eye className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleEdit(complaint)}
                      className='p-1.5 text-gray-500 hover:text-primary-600 rounded'
                    >
                      <Edit className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(complaint.id)}
                      className='p-1.5 text-gray-500 hover:text-red-600 rounded'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-gray-600'>Pelapor:</span>
                    <span className='font-medium'>
                      {complaint.reporter_name}
                    </span>
                  </div>

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
        <div className='hidden lg:block card overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Judul & Kategori
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Pelapor
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Prioritas
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tanggal
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {currentComplaints.map((complaint) => {
                  const categoryInfo = getCategoryInfo(complaint.category);
                  return (
                    <tr key={complaint.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {complaint.title}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {categoryInfo.icon} {categoryInfo.label}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {complaint.reporter_name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {complaint.reporter_type}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getStatusColor(
                            complaint.status
                          )}-100 text-${getStatusColor(complaint.status)}-800`}
                        >
                          {statuses.find((s) => s.value === complaint.status)
                            ?.label || complaint.status}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getPriorityColor(
                            complaint.priority
                          )}-100 text-${getPriorityColor(
                            complaint.priority
                          )}-800`}
                        >
                          {priorities.find(
                            (p) => p.value === complaint.priority
                          )?.label || complaint.priority}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {formatDateTime(complaint.reported_at)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className='flex justify-end space-x-2'>
                          <button
                            onClick={() => handleView(complaint)}
                            className='text-blue-600 hover:text-blue-900'
                          >
                            <Eye className='h-4 w-4' />
                          </button>
                          <button
                            onClick={() => handleEdit(complaint)}
                            className='text-primary-600 hover:text-primary-900'
                          >
                            <Edit className='h-4 w-4' />
                          </button>
                          <button
                            onClick={() => handleDelete(complaint.id)}
                            className='text-red-600 hover:text-red-900'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </div>
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
            <MessageSquare className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-2 text-sm font-medium text-gray-900'>
              Tidak ada pengaduan
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              {searchTerm
                ? 'Coba ubah kata kunci pencarian.'
                : 'Belum ada pengaduan yang tersedia.'}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className='mt-4 btn-primary'
            >
              Buat Pengaduan Pertama
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredComplaints.length > itemsPerPage && (
        <div className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mx-2 sm:mx-0 rounded-lg'>
          <div className='flex flex-1 justify-between sm:hidden'>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
            >
              Next
            </button>
          </div>
          <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Menampilkan{' '}
                <span className='font-medium'>{startIndex + 1}</span> sampai{' '}
                <span className='font-medium'>
                  {Math.min(endIndex, filteredComplaints.length)}
                </span>{' '}
                dari{' '}
                <span className='font-medium'>{filteredComplaints.length}</span>{' '}
                hasil
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
                          ? 'z-10 bg-primary-600 text-white'
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
          <div className='relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-4 sm:p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-medium text-gray-900'>
                  {editingComplaint ? 'Edit Pengaduan' : 'Buat Pengaduan Baru'}
                </h3>
                <button
                  onClick={resetForm}
                  className='text-gray-400 hover:text-gray-600'
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

                {/* Actions */}
                <div className='flex flex-col xs:flex-row gap-3 xs:gap-3 xs:justify-end pt-4 border-t'>
                  <button
                    type='button'
                    onClick={resetForm}
                    className='btn-secondary w-full xs:w-auto justify-center order-2 xs:order-1'
                  >
                    Batal
                  </button>
                  <button
                    type='submit'
                    className='btn-primary w-full xs:w-auto justify-center order-1 xs:order-2'
                  >
                    {editingComplaint ? 'Perbarui' : 'Simpan'}
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
          <div className='relative bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
            <div className='p-4 sm:p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Detail Pengaduan
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <X className='h-6 w-6' />
                </button>
              </div>

              <div className='space-y-6'>
                {/* Header Info */}
                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                    <div>
                      <h4 className='text-lg font-semibold text-gray-900'>
                        {selectedComplaint.title}
                      </h4>
                      <div className='flex items-center space-x-2 mt-2'>
                        <span className='text-sm text-gray-600'>
                          {getCategoryInfo(selectedComplaint.category).icon}{' '}
                          {getCategoryInfo(selectedComplaint.category).label}
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-2'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium bg-${getStatusColor(
                          selectedComplaint.status
                        )}-100 text-${getStatusColor(
                          selectedComplaint.status
                        )}-800`}
                      >
                        {statuses.find(
                          (s) => s.value === selectedComplaint.status
                        )?.label || selectedComplaint.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium bg-${getPriorityColor(
                          selectedComplaint.priority
                        )}-100 text-${getPriorityColor(
                          selectedComplaint.priority
                        )}-800`}
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
                  <h5 className='text-sm font-medium text-gray-900 mb-2'>
                    Deskripsi:
                  </h5>
                  <p className='text-sm text-gray-700 bg-gray-50 rounded p-3 whitespace-pre-wrap'>
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Reporter Info */}
                <div>
                  <h5 className='text-sm font-medium text-gray-900 mb-3'>
                    Informasi Pelapor:
                  </h5>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                    <div className='flex items-center space-x-2'>
                      <User className='h-4 w-4 text-gray-400' />
                      <span className='text-gray-600'>Nama:</span>
                      <span className='font-medium'>
                        {selectedComplaint.reporter_name}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <UserCheck className='h-4 w-4 text-gray-400' />
                      <span className='text-gray-600'>Tipe:</span>
                      <span className='font-medium capitalize'>
                        {selectedComplaint.reporter_type}
                      </span>
                    </div>
                    {selectedComplaint.reporter_email && (
                      <div className='flex items-center space-x-2'>
                        <Mail className='h-4 w-4 text-gray-400' />
                        <span className='text-gray-600'>Email:</span>
                        <span className='font-medium'>
                          {selectedComplaint.reporter_email}
                        </span>
                      </div>
                    )}
                    {selectedComplaint.reporter_phone && (
                      <div className='flex items-center space-x-2'>
                        <Phone className='h-4 w-4 text-gray-400' />
                        <span className='text-gray-600'>Telepon:</span>
                        <span className='font-medium'>
                          {selectedComplaint.reporter_phone}
                        </span>
                      </div>
                    )}
                    {selectedComplaint.reporter_class && (
                      <div className='flex items-center space-x-2'>
                        <Tag className='h-4 w-4 text-gray-400' />
                        <span className='text-gray-600'>Kelas:</span>
                        <span className='font-medium'>
                          {selectedComplaint.reporter_class}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h5 className='text-sm font-medium text-gray-900 mb-3'>
                    Timeline:
                  </h5>
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-3'>
                      <Calendar className='h-4 w-4 text-gray-400' />
                      <span className='text-sm text-gray-600'>Dilaporkan:</span>
                      <span className='text-sm font-medium'>
                        {formatDateTime(selectedComplaint.reported_at)}
                      </span>
                    </div>
                    {selectedComplaint.resolved_at && (
                      <div className='flex items-center space-x-3'>
                        <CheckCircle className='h-4 w-4 text-green-500' />
                        <span className='text-sm text-gray-600'>
                          Diselesaikan:
                        </span>
                        <span className='text-sm font-medium'>
                          {formatDateTime(selectedComplaint.resolved_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedComplaint.admin_notes && (
                  <div>
                    <h5 className='text-sm font-medium text-gray-900 mb-2'>
                      Catatan Admin:
                    </h5>
                    <p className='text-sm text-gray-700 bg-blue-50 rounded p-3 whitespace-pre-wrap'>
                      {selectedComplaint.admin_notes}
                    </p>
                  </div>
                )}

                {/* Resolution */}
                {selectedComplaint.resolution && (
                  <div>
                    <h5 className='text-sm font-medium text-gray-900 mb-2'>
                      Solusi:
                    </h5>
                    <p className='text-sm text-gray-700 bg-green-50 rounded p-3 whitespace-pre-wrap'>
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
