import React from 'react';
import { MessageSquare } from 'lucide-react';

const ComplaintsEmptyState = ({
  isDarkMode,
  t,
  filteredComplaints,
  loading,
  searchTerm,
  setShowModal,
}) => {
  if (filteredComplaints.length > 0 || loading) return null;

  return (
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
      <button onClick={() => setShowModal(true)} className='mt-4 btn-primary'>
        {t('createFirstComplaint', 'Buat Pengaduan Pertama')}
      </button>
    </div>
  );
};

export default ComplaintsEmptyState;
