import React from 'react';
import { t } from '../../utils';

const ComplaintsTable = ({
  isDarkMode,
  handleSelectAll,
  selectAll,
  user,
  currentComplaints,
  selectedItems,
  handleSelectItem,
  getCategoryInfo,
  getImageDisplay,
  getStatusColor,
  getPriorityColor,
  formatDateTime,
  handleView,
  handleEdit,
  handleDelete,
  statuses,
  priorities,
}) => {
  return (
    <div
      className={`hidden lg:block card overflow-hidden ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
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
            {currentComplaints.map((complaint) => (
              <tr
                key={complaint.id}
                className={
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-start space-x-3'>
                    <input
                      type='checkbox'
                      checked={selectedItems.has(complaint.id)}
                      onChange={() => handleSelectItem(complaint.id)}
                      className={`form-checkbox h-4 w-4 mt-1 ${
                        isDarkMode
                          ? 'text-primary-400 bg-gray-700 border-gray-600'
                          : 'text-primary-600 bg-white border-gray-300'
                      }`}
                    />
                    <div className='flex-1 min-w-0'>
                      <div
                        className={`text-sm font-medium ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {complaint.title}
                      </div>
                      <div className='flex items-center mt-1'>
                        <span
                          className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {getCategoryInfo(complaint.category).icon}{' '}
                          {getCategoryInfo(complaint.category).label}
                        </span>
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } line-clamp-2`}
                      >
                        {complaint.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <div className='flex justify-end space-x-2'>
                    <button
                      onClick={() => handleView(complaint)}
                      className='text-indigo-600 hover:text-indigo-900'
                    >
                      Lihat
                    </button>
                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => handleEdit(complaint)}
                          className='text-green-600 hover:text-green-900'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(complaint.id)}
                          className='text-red-600 hover:text-red-900'
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getImageDisplay(complaint)}
                </td>
                {user?.role !== 'siswa' && (
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div
                      className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}
                    >
                      {complaint.reporter_name}
                    </div>
                    <div
                      className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } capitalize`}
                    >
                      {complaint.reporter_type}
                    </div>
                  </td>
                )}
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      isDarkMode
                        ? `bg-${getStatusColor(
                            complaint.status
                          )}-900/30 text-${getStatusColor(
                            complaint.status
                          )}-400`
                        : `bg-${getStatusColor(
                            complaint.status
                          )}-100 text-${getStatusColor(complaint.status)}-800`
                    }`}
                  >
                    {statuses.find((s) => s.value === complaint.status)
                      ?.label || complaint.status}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      isDarkMode
                        ? `bg-${getPriorityColor(
                            complaint.priority
                          )}-900/30 text-${getPriorityColor(
                            complaint.priority
                          )}-400`
                        : `bg-${getPriorityColor(
                            complaint.priority
                          )}-100 text-${getPriorityColor(
                            complaint.priority
                          )}-800`
                    }`}
                  >
                    {priorities.find((p) => p.value === complaint.priority)
                      ?.label || complaint.priority}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {formatDateTime(complaint.reported_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintsTable;
