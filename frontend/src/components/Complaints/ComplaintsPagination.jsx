import React from 'react';

const ComplaintsPagination = ({
  isDarkMode,
  t,
  filteredComplaints,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  endIndex,
}) => {
  if (filteredComplaints.length <= itemsPerPage) return null;

  return (
    <div
      className={`flex items-center justify-between border-t px-4 py-3 sm:px-6 mx-2 sm:mx-0 rounded-lg ${
        isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
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
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
  );
};

export default ComplaintsPagination;
