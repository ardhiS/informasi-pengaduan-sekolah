import React from 'react';
import { Search } from 'lucide-react';

const ComplaintsFilters = ({
  isDarkMode,
  t,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  selectedApprovalStatus,
  setSelectedApprovalStatus,
  categories,
  statuses,
  priorities,
  user,
}) => {
  return (
    <div className='flex flex-col gap-3 sm:gap-4 mx-2 sm:mx-0'>
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
  );
};

export default ComplaintsFilters;
