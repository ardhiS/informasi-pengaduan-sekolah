import React from 'react';
import {
  BarChart3,
  ChevronUp,
  ChevronDown,
  Plus,
  AlertCircle,
} from 'lucide-react';

const ComplaintsHeader = ({
  isDarkMode,
  t,
  isReadOnlyMode,
  showStats,
  setShowStats,
  setShowModal,
}) => {
  return (
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
  );
};

export default ComplaintsHeader;
