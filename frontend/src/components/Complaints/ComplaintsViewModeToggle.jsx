import React from 'react';

const ComplaintsViewModeToggle = ({
  isDarkMode,
  user,
  viewMode,
  setViewMode,
}) => {
  if (!user) return null;

  return (
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
  );
};

export default ComplaintsViewModeToggle;
