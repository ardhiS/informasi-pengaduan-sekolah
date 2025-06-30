import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  BookOpen,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Code,
  RefreshCw,
} from 'lucide-react';
import { subjectsService } from '../services/dataService';

// Helper function to format date
const formatDateTime = (dateString) => {
  if (!dateString) return 'No date available';
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} - ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching subjects from backend...');

      const response = await subjectsService.getAll();
      console.log('Subjects response:', response);

      setSubjects(response.data?.subjects || []);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError(`Failed to load subjects: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingSubject) {
        await subjectsService.update(editingSubject.id, formData);
        setSuccess('Subject updated successfully!');
      } else {
        await subjectsService.create(formData);
        setSuccess('Subject created successfully!');
      }

      await fetchSubjects();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code || '',
      description: subject.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?'))
      return;

    try {
      await subjectsService.delete(id);
      setSuccess('Subject deleted successfully!');
      await fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', description: '' });
    setEditingSubject(null);
    setShowModal(false);
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subject.code &&
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubjects = filteredSubjects.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <div className='spinner'></div>
        <div className='text-gray-600 text-center'>
          <div className='text-mobile-base font-medium'>
            Loading subjects from backend...
          </div>
          <div className='text-mobile-sm text-gray-500 mt-1'>
            Make sure backend is running on port 5000
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 xs:space-y-6'>
      {/* Header */}
      <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3'>
        <h1 className='text-mobile-2xl font-bold text-gray-900'>
          Subjects Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className='btn-primary flex items-center space-x-2 self-start xs:self-auto'
        >
          <Plus className='h-4 w-4 xs:h-5 xs:w-5' />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className='alert alert-error'>
          <div className='flex items-start'>
            <AlertCircle className='h-5 w-5 mt-0.5 flex-shrink-0' />
            <div className='ml-3 min-w-0 flex-1'>
              <div className='font-medium'>Error Loading Subjects</div>
              <div className='mt-1'>{error}</div>
              <div className='text-2xs xs:text-xs mt-2 opacity-75'>
                Make sure backend server is running on http://localhost:5000
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className='alert alert-success'>
          <div className='flex items-start'>
            <CheckCircle className='h-5 w-5 mt-0.5 flex-shrink-0' />
            <div className='ml-3'>{success}</div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className='flex items-center gap-3 xs:gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 xs:h-5 xs:w-5 text-gray-400 transition-colors group-focus-within:text-primary-500' />
          <input
            type='text'
            placeholder='Search subjects...'
            className='input-field pl-10 xs:pl-12'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg'
            >
              ×
            </button>
          )}
        </div>
        <button
          onClick={fetchSubjects}
          className='btn-icon text-gray-500 hover:text-primary-600 hover:bg-primary-50'
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 xs:h-5 xs:w-5 ${loading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* Subjects Grid - Mobile First */}
      <div className='block lg:hidden'>
        <div className='space-y-3 xs:space-y-4'>
          {currentSubjects.map((subject) => (
            <div
              key={subject.id}
              className='card p-4 hover:shadow-lg transition-shadow duration-200'
            >
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-start space-x-3 flex-1 min-w-0'>
                  <div className='flex-shrink-0'>
                    <div className='h-10 w-10 xs:h-12 xs:w-12 rounded-lg bg-primary-100 flex items-center justify-center'>
                      <BookOpen className='h-5 w-5 xs:h-6 xs:w-6 text-primary-600' />
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-mobile-lg font-medium text-gray-900 truncate'>
                      {subject.name}
                    </h3>
                    {subject.code && (
                      <div className='flex items-center mt-1'>
                        <Code className='h-3 w-3 xs:h-4 xs:w-4 mr-1.5 text-gray-400 flex-shrink-0' />
                        <span className='text-mobile-sm text-gray-500 truncate'>
                          {subject.code}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className='flex space-x-1 ml-2'>
                  <button
                    onClick={() => handleEdit(subject)}
                    className='btn-icon text-gray-500 hover:text-primary-600 hover:bg-primary-50'
                  >
                    <Edit className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className='btn-icon text-gray-500 hover:text-red-600 hover:bg-red-50'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>

              <p className='text-mobile-sm text-gray-600 mb-3 line-clamp-2'>
                {subject.description || 'No description available'}
              </p>

              <div className='pt-3 border-t border-gray-100'>
                <div className='text-2xs xs:text-xs text-gray-500 space-y-1'>
                  <div className='flex items-center'>
                    <Calendar className='h-3 w-3 mr-1.5 flex-shrink-0' />
                    <span className='truncate'>
                      Created:{' '}
                      {formatDateTime(subject.created_at || subject.createdAt)}
                    </span>
                  </div>
                  {subject.updated_at &&
                    subject.updated_at !== subject.created_at && (
                      <div className='flex items-center'>
                        <Calendar className='h-3 w-3 mr-1.5 flex-shrink-0' />
                        <span className='truncate'>
                          Updated: {formatDateTime(subject.updated_at)}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subjects Table - Desktop */}
      <div className='hidden lg:block card overflow-hidden'>
        <div className='table-responsive'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Subject
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Description
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Created
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {currentSubjects.map((subject) => (
                <tr
                  key={subject.id}
                  className='hover:bg-gray-50 transition-colors duration-150'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <BookOpen className='h-8 w-8 text-primary-600 mr-3' />
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {subject.name}
                        </div>
                        {subject.code && (
                          <div className='text-xs text-gray-500'>
                            Code: {subject.code}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-900 max-w-xs truncate'>
                      {subject.description || 'No description'}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div className='space-y-1'>
                      <div>
                        Created:{' '}
                        {formatDateTime(
                          subject.created_at || subject.createdAt
                        )}
                      </div>
                      {subject.updated_at &&
                        subject.updated_at !== subject.created_at && (
                          <div className='text-xs text-gray-400'>
                            Updated: {formatDateTime(subject.updated_at)}
                          </div>
                        )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className='flex justify-end space-x-2'>
                      <button
                        onClick={() => handleEdit(subject)}
                        className='text-primary-600 hover:text-primary-900 p-1 rounded hover:bg-primary-50 transition-colors duration-150'
                      >
                        <Edit className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id)}
                        className='text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors duration-150'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Pagination */}
      {filteredSubjects.length > 0 && totalPages > 1 && (
        <div className='bg-white border border-gray-200 rounded-lg p-3 xs:p-4'>
          {/* Mobile pagination controls */}
          <div className='flex items-center justify-between sm:hidden'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='btn-secondary disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronLeft className='h-4 w-4 mr-1' />
              Previous
            </button>
            <span className='text-mobile-sm text-gray-700'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='btn-secondary disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Next
              <ChevronRight className='h-4 w-4 ml-1' />
            </button>
          </div>

          {/* Desktop pagination */}
          <div className='hidden sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-mobile-sm text-gray-700'>
                Showing <span className='font-medium'>{startIndex + 1}</span> to{' '}
                <span className='font-medium'>
                  {Math.min(endIndex, filteredSubjects.length)}
                </span>{' '}
                of{' '}
                <span className='font-medium'>{filteredSubjects.length}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className='isolate inline-flex -space-x-px rounded-md shadow-sm'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronLeft className='h-5 w-5' />
                </button>
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        currentPage === page
                          ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <ChevronRight className='h-5 w-5' />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredSubjects.length === 0 && !loading && (
        <div className='text-center py-8 xs:py-12'>
          <BookOpen className='mx-auto h-12 w-12 xs:h-16 xs:w-16 text-gray-300' />
          <h3 className='mt-3 xs:mt-4 text-mobile-base font-medium text-gray-900'>
            No subjects found
          </h3>
          <p className='mt-1 xs:mt-2 text-mobile-sm text-gray-500'>
            {searchTerm
              ? 'Try adjusting your search criteria.'
              : 'No subjects available.'}
          </p>

          {/* Debug info - only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className='mt-4 xs:mt-6 p-3 xs:p-4 bg-gray-50 rounded-lg text-left text-2xs xs:text-xs text-gray-400 space-y-1 max-w-md mx-auto'>
              <div>Total subjects loaded: {subjects.length}</div>
              <div>Backend endpoint: /subjects</div>
              <div>Search term: "{searchTerm}"</div>
              <div>Filtered subjects: {filteredSubjects.length}</div>
            </div>
          )}

          <button
            onClick={fetchSubjects}
            className='mt-4 xs:mt-6 btn-primary flex items-center space-x-2 mx-auto'
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Try Refresh</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4'>
          <div className='relative w-full max-w-md bg-white rounded-lg shadow-lg animate-slide-up'>
            <div className='p-4 xs:p-6'>
              <div className='flex items-center justify-between mb-4 xs:mb-6'>
                <h3 className='text-mobile-lg font-medium text-gray-900'>
                  {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                </h3>
                <button
                  onClick={resetForm}
                  className='btn-icon text-gray-400 hover:text-gray-600'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <form onSubmit={handleSubmit} className='space-y-4 xs:space-y-5'>
                <div>
                  <label className='label'>Subject Name</label>
                  <input
                    type='text'
                    required
                    className='input-field'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder='Enter subject name'
                  />
                </div>

                <div>
                  <label className='label'>Subject Code</label>
                  <input
                    type='text'
                    required
                    className='input-field'
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder='Enter subject code (e.g., MATH101)'
                  />
                </div>

                <div>
                  <label className='label'>Description</label>
                  <textarea
                    className='input-field'
                    rows='3'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder='Enter subject description'
                  />
                </div>

                <div className='flex flex-col xs:flex-row gap-3 xs:justify-end pt-4 xs:pt-6'>
                  <button
                    type='button'
                    onClick={resetForm}
                    className='btn-secondary order-2 xs:order-1'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn-primary order-1 xs:order-2'
                  >
                    {editingSubject ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
