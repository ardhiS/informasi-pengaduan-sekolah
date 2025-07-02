import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { classesService, subjectsService } from '../services/dataService';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';

// Helper function to format date
const formatDateTime = (dateString) => {
  if (!dateString) return 'No date available';
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} - ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const Classes = () => {
  const { isDarkMode, language } = useTheme();
  const { t } = useTranslation(language);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('=== FETCH DATA START ===');
      console.log('Making requests to:');
      console.log('- Classes: http://localhost:5000/classes/all');
      console.log('- Subjects: http://localhost:5000/subjects/all');

      // Test direct fetch to see raw response
      try {
        const testResponse = await fetch('http://localhost:5000/classes/all');
        const testData = await testResponse.json();
        console.log('Direct fetch test - Classes response:', testData);
      } catch (testErr) {
        console.error('Direct fetch test failed:', testErr);
      }

      const [classesResponse, subjectsResponse] = await Promise.all([
        classesService.getAll(),
        subjectsService.getAll(),
      ]);

      console.log('=== RAW RESPONSES ===');
      console.log('Classes response (full):', classesResponse);
      console.log('Subjects response (full):', subjectsResponse);
      console.log('typeof classesResponse:', typeof classesResponse);
      console.log('typeof subjectsResponse:', typeof subjectsResponse);

      // Check all possible data locations
      console.log('=== CHECKING DATA LOCATIONS ===');
      console.log('classesResponse.data:', classesResponse?.data);
      console.log(
        'classesResponse.data.classes:',
        classesResponse?.data?.classes
      );
      console.log('classesResponse.classes:', classesResponse?.classes);
      console.log(
        'classesResponse (as array):',
        Array.isArray(classesResponse) ? classesResponse : 'Not an array'
      );

      console.log('subjectsResponse.data:', subjectsResponse?.data);
      console.log(
        'subjectsResponse.data.subjects:',
        subjectsResponse?.data?.subjects
      );
      console.log('subjectsResponse.subjects:', subjectsResponse?.subjects);

      // Try multiple extraction methods
      let classesArray = [];
      let subjectsArray = [];

      // Method 1: Standard structure
      if (classesResponse?.data?.classes) {
        classesArray = classesResponse.data.classes;
        console.log('Using classesResponse.data.classes');
      }
      // Method 2: Direct classes property
      else if (classesResponse?.classes) {
        classesArray = classesResponse.classes;
        console.log('Using classesResponse.classes');
      }
      // Method 3: Response is the array itself
      else if (Array.isArray(classesResponse)) {
        classesArray = classesResponse;
        console.log('Using classesResponse as array');
      }
      // Method 4: Check if data property is the array
      else if (Array.isArray(classesResponse?.data)) {
        classesArray = classesResponse.data;
        console.log('Using classesResponse.data as array');
      }

      // Same for subjects
      if (subjectsResponse?.data?.subjects) {
        subjectsArray = subjectsResponse.data.subjects;
        console.log('Using subjectsResponse.data.subjects');
      } else if (subjectsResponse?.subjects) {
        subjectsArray = subjectsResponse.subjects;
        console.log('Using subjectsResponse.subjects');
      } else if (Array.isArray(subjectsResponse)) {
        subjectsArray = subjectsResponse;
        console.log('Using subjectsResponse as array');
      } else if (Array.isArray(subjectsResponse?.data)) {
        subjectsArray = subjectsResponse.data;
        console.log('Using subjectsResponse.data as array');
      }

      console.log('=== FINAL ARRAYS ===');
      console.log('Final classes array:', classesArray);
      console.log('Final classes array length:', classesArray.length);
      console.log('Final subjects array:', subjectsArray);
      console.log('Final subjects array length:', subjectsArray.length);

      setClasses(classesArray);
      setSubjects(subjectsArray);

      console.log('=== FETCH DATA END ===');
    } catch (err) {
      console.error('=== ERROR DETAILS ===');
      console.error('Error:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      setError('Failed to load data. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');

      if (editingClass) {
        await classesService.update(editingClass.id, formData);
        setSuccess('Class updated successfully!');
      } else {
        await classesService.create(formData);
        setSuccess('Class created successfully!');
      }

      fetchData();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description,
      subject_id: classItem.subject_id,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await classesService.delete(id);
      setSuccess('Class deleted successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', subject_id: '' });
    setEditingClass(null);
    setShowModal(false);
  };

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClasses = filteredClasses.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-48 sm:h-64 space-y-4'>
        <div className='spinner'></div>
        <div className='text-gray-600 text-center'>
          <div className='text-xs sm:text-sm md:text-base font-medium'>
            Loading classes from backend...
          </div>
          <div className='text-2xs sm:text-xs md:text-sm text-gray-500 mt-1'>
            Make sure backend is running on port 5000
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4'>
        <div className='flex-1 min-w-0'>
          <h1
            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } truncate`}
          >
            {t('classes.title')}
          </h1>
        </div>
        <div className='flex-shrink-0'>
          <button
            onClick={() => setShowModal(true)}
            className='btn-primary flex items-center space-x-2 text-xs sm:text-sm md:text-base whitespace-nowrap w-full sm:w-auto justify-center'
          >
            <Plus className='h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5' />
            <span>{t('classes.addClass')}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className='alert alert-error'>
          <div className='flex items-start'>
            <AlertCircle className='h-5 w-5 mt-0.5 flex-shrink-0' />
            <div className='ml-3 min-w-0 flex-1'>
              <div className='font-medium'>
                {t('classes.errorLoadingClasses')}
              </div>
              <div className='mt-1'>{error}</div>
              <div className='text-2xs sm:text-xs md:text-sm mt-2 opacity-75'>
                {t('classes.backendServerNote')}
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

      {/* Search and Filter */}
      <div className='flex flex-col sm:flex-row gap-3 md:gap-4'>
        <div className='relative flex-1 min-w-0'>
          <Search
            className={`absolute left-2 sm:left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            } transition-colors group-focus-within:text-primary-500`}
          />
          <input
            type='text'
            placeholder={t('classes.searchClasses')}
            className='input-field pl-8 sm:pl-10 md:pl-12 text-xs sm:text-sm md:text-base w-full'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-400 hover:text-gray-600'
              } text-lg`}
            >
              ×
            </button>
          )}
        </div>
        <div className='flex items-center space-x-2 sm:space-x-3 flex-shrink-0'>
          <button className='btn-secondary flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm md:text-base whitespace-nowrap flex-1 sm:flex-initial justify-center'>
            <Filter className='h-3 w-3 sm:h-4 sm:w-4' />
            <span className='hidden sm:inline'>{t('common.filter')}</span>
            <span className='sm:hidden'>Filter</span>
          </button>
          <button
            onClick={fetchData}
            className={`btn-icon ${
              isDarkMode
                ? 'text-gray-400 hover:text-primary-400 hover:bg-primary-900/20'
                : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
            }`}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 ${
                loading ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Classes List */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
        {currentClasses.map((classItem) => {
          const subject = subjects.find((s) => s.id === classItem.subject_id);
          return (
            <div
              key={classItem.id}
              className={`${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              } border rounded-lg p-3 sm:p-4 md:p-6 hover:shadow-lg transition-all duration-200`}
            >
              <div className='flex items-start justify-between mb-2 sm:mb-3'>
                <h3
                  className={`text-sm sm:text-base md:text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  } truncate flex-1 mr-2`}
                >
                  {classItem.name}
                </h3>
                <div className='flex space-x-1 flex-shrink-0'>
                  <button
                    onClick={() => handleEdit(classItem)}
                    className={`p-1 sm:p-1.5 md:p-2 rounded-md transition-colors ${
                      isDarkMode
                        ? 'text-gray-400 hover:text-primary-400 hover:bg-primary-900/20'
                        : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Edit className='h-3 w-3 sm:h-4 sm:w-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(classItem.id)}
                    className={`p-1 sm:p-1.5 md:p-2 rounded-md transition-colors ${
                      isDarkMode
                        ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'
                        : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className='h-3 w-3 sm:h-4 sm:w-4' />
                  </button>
                </div>
              </div>

              <p
                className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                } mb-3 sm:mb-4 line-clamp-2`}
              >
                {classItem.description}
              </p>

              <div
                className={`flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm mb-3 sm:mb-4`}
              >
                <div
                  className={`flex items-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  <BookOpen className='h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0' />
                  <span className='truncate'>
                    {subject?.name || t('classes.noSubject')}
                  </span>
                </div>
                <div
                  className={`flex items-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  <Users className='h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0' />
                  <span>{t('classes.students', '0 Students')}</span>
                </div>
              </div>

              <div
                className={`pt-2 sm:pt-3 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div
                  className={`text-2xs sm:text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } space-y-1`}
                >
                  <div className='flex items-center'>
                    <Calendar className='h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 sm:mr-1.5 flex-shrink-0' />
                    <span className='truncate text-2xs sm:text-xs'>
                      {t('classes.created')}:{' '}
                      {formatDateTime(
                        classItem.created_at || classItem.createdAt
                      )}
                    </span>
                  </div>
                  {classItem.updated_at &&
                    classItem.updated_at !== classItem.created_at && (
                      <div className='flex items-center'>
                        <Calendar className='h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 sm:mr-1.5 flex-shrink-0' />
                        <span className='truncate text-2xs sm:text-xs'>
                          {t('classes.updated')}:{' '}
                          {formatDateTime(classItem.updated_at)}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {filteredClasses.length > 0 && totalPages > 1 && (
        <div
          className={`${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          } rounded-lg p-4 border mt-6`}
        >
          {/* Mobile pagination controls */}
          <div className='flex items-center justify-between sm:hidden'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md transition-colors ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className='h-3 w-3 sm:h-4 sm:w-4 mr-1' />
              <span className='hidden sm:inline'>Previous</span>
              <span className='sm:hidden'>Prev</span>
            </button>
            <span
              className={`text-xs sm:text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md transition-colors ${
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className='hidden sm:inline'>Next</span>
              <span className='sm:hidden'>Next</span>
              <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4 ml-1' />
            </button>
          </div>

          {/* Desktop pagination */}
          <div className='hidden sm:flex sm:items-center sm:justify-between'>
            <div>
              <p
                className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Showing <span className='font-medium'>{startIndex + 1}</span> to{' '}
                <span className='font-medium'>
                  {Math.min(endIndex, filteredClasses.length)}
                </span>{' '}
                of <span className='font-medium'>{filteredClasses.length}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className='flex space-x-1'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : isDarkMode
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  <ChevronLeft className='h-4 w-4 sm:h-5 sm:w-5' />
                </button>
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                        currentPage === page
                          ? isDarkMode
                            ? 'bg-primary-600 text-white'
                            : 'bg-primary-600 text-white'
                          : isDarkMode
                          ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : isDarkMode
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  <ChevronRight className='h-4 w-4 sm:h-5 sm:w-5' />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredClasses.length === 0 && !loading && (
        <div className='text-center py-6 sm:py-8 md:py-12'>
          <GraduationCap
            className={`mx-auto h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`}
          />
          <h3
            className={`mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-medium ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            }`}
          >
            No classes found
          </h3>
          <p
            className={`mt-2 text-xs sm:text-sm md:text-base ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {searchTerm
              ? 'Try adjusting your search criteria.'
              : 'No classes available.'}
          </p>

          {/* Debug info - only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <div
              className={`mt-6 p-4 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              } rounded-lg text-left text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              } space-y-1 max-w-md mx-auto`}
            >
              <div>Total classes loaded: {classes.length}</div>
              <div>Backend endpoint: /classes/all</div>
              <div>Search term: "{searchTerm}"</div>
              <div>Filtered classes length: {filteredClasses.length}</div>
              <div>Subjects count: {subjects.length}</div>
              <div>Current page: {currentPage}</div>
            </div>
          )}

          <button
            onClick={fetchData}
            className='mt-3 sm:mt-4 md:mt-6 btn-primary flex items-center space-x-2 mx-auto text-xs sm:text-sm md:text-base'
            disabled={loading}
          >
            <RefreshCw
              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                loading ? 'animate-spin' : ''
              }`}
            />
            <span>Try Refresh</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-3 sm:p-4'>
          <div className='relative w-full max-w-xs sm:max-w-md bg-white rounded-lg shadow-lg animate-slide-up'>
            <div className='p-3 sm:p-4 md:p-6'>
              <div className='flex items-center justify-between mb-3 sm:mb-4 md:mb-6'>
                <h3 className='text-base sm:text-lg md:text-xl font-medium text-gray-900'>
                  {editingClass ? 'Edit Class' : 'Add New Class'}
                </h3>
                <button
                  onClick={resetForm}
                  className='btn-icon text-gray-400 hover:text-gray-600'
                >
                  <X className='h-4 w-4 sm:h-5 sm:w-5' />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className='space-y-3 sm:space-y-4 md:space-y-5'
              >
                <div>
                  <label className='label'>Class Name</label>
                  <input
                    type='text'
                    required
                    className='input-field'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder='Enter class name'
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
                    placeholder='Enter class description'
                  />
                </div>

                <div>
                  <label className='label'>Subject</label>
                  <select
                    required
                    className='select-field'
                    value={formData.subject_id}
                    onChange={(e) =>
                      setFormData({ ...formData, subject_id: e.target.value })
                    }
                  >
                    <option value=''>Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end pt-3 sm:pt-4 md:pt-6'>
                  <button
                    type='button'
                    onClick={resetForm}
                    className='btn-secondary order-2 sm:order-1 text-xs sm:text-sm md:text-base'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='btn-primary order-1 sm:order-2 text-xs sm:text-sm md:text-base'
                  >
                    {editingClass ? 'Update' : 'Create'}
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

export default Classes;
