import React from 'react';

const ComplaintsTable = ({
  currentComplaints,
  categories,
  priorities,
  statuses,
  selectedItems,
  selectAll,
  onSelectAll,
  onSelectItem,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onStatusUpdate,
  isDarkMode,
  t,
  user,
}) => {
  // Helper functions
  const getCategoryInfo = (category) => {
    const categoryObj = categories.find((c) => c.value === category);
    return categoryObj || { icon: '📋', label: 'Umum', value: 'umum' };
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
    try {
      const date = new Date(dateString);
      return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  };

  const getImageDisplay = (images) => {
    if (!images || images.length === 0) return '-';
    return `${images.length} gambar`;
  };

  return (
    <>
      {/* Desktop Table View */}
      <div
        className={`hidden lg:block overflow-hidden shadow rounded-lg ${
          isDarkMode
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className='overflow-x-auto'>
          <table
            className={`min-w-full divide-y ${
              isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
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
                      onChange={onSelectAll}
                      className={`h-4 w-4 rounded ${
                        isDarkMode
                          ? 'text-blue-400 bg-gray-700 border-gray-600'
                          : 'text-blue-600 bg-white border-gray-300'
                      }`}
                    />
                    <span className='ml-2'>{t('complaint', 'Pengaduan')}</span>
                  </div>
                </th>
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
                  {t('date', 'Tanggal')}
                </th>
                <th
                  className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {t('actions', 'Aksi')}
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode
                  ? 'bg-gray-800 divide-gray-700'
                  : 'bg-white divide-gray-200'
              }`}
            >
              {currentComplaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className={`hover:${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } transition-colors duration-150`}
                >
                  <td className='px-6 py-4'>
                    <div className='flex items-start space-x-3'>
                      <input
                        type='checkbox'
                        checked={selectedItems.has(complaint.id)}
                        onChange={() => onSelectItem(complaint.id)}
                        className={`h-4 w-4 mt-1 rounded ${
                          isDarkMode
                            ? 'text-blue-400 bg-gray-700 border-gray-600'
                            : 'text-blue-600 bg-white border-gray-300'
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
                        <div className='flex items-center mt-1 space-x-2'>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              isDarkMode
                                ? 'bg-blue-900/50 text-blue-300'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {getCategoryInfo(complaint.category).icon}
                            <span className='ml-1'>
                              {getCategoryInfo(complaint.category).label}
                            </span>
                          </span>
                          {complaint.images && complaint.images.length > 0 && (
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                isDarkMode
                                  ? 'bg-green-900/50 text-green-300'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              📷 {complaint.images.length}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 truncate ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {complaint.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border-2 ${
                        isDarkMode
                          ? `bg-${getStatusColor(
                              complaint.status
                            )}-900/20 text-${getStatusColor(
                              complaint.status
                            )}-300 border-${getStatusColor(
                              complaint.status
                            )}-600`
                          : `bg-${getStatusColor(
                              complaint.status
                            )}-50 text-${getStatusColor(
                              complaint.status
                            )}-700 border-${getStatusColor(
                              complaint.status
                            )}-200`
                      }`}
                    >
                      {statuses.find((s) => s.value === complaint.status)
                        ?.label || complaint.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border-2 ${
                        isDarkMode
                          ? `bg-${getPriorityColor(
                              complaint.priority
                            )}-900/20 text-${getPriorityColor(
                              complaint.priority
                            )}-300 border-${getPriorityColor(
                              complaint.priority
                            )}-600`
                          : `bg-${getPriorityColor(
                              complaint.priority
                            )}-50 text-${getPriorityColor(
                              complaint.priority
                            )}-700 border-${getPriorityColor(
                              complaint.priority
                            )}-200`
                      }`}
                    >
                      {priorities.find((p) => p.value === complaint.priority)
                        ?.label || complaint.priority}
                    </span>
                  </td>
                  {user?.role !== 'siswa' && (
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}
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
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {formatDateTime(complaint.reported_at)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className='flex justify-end space-x-2'>
                      <button
                        onClick={() => onView(complaint)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          isDarkMode
                            ? 'bg-blue-900/20 text-blue-300 border border-blue-600 hover:bg-blue-900/40'
                            : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                        } transition-colors`}
                      >
                        {t('view', 'Lihat')}
                      </button>

                      {user?.role === 'admin' && (
                        <>
                          <button
                            onClick={() => onEdit(complaint)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              isDarkMode
                                ? 'bg-green-900/20 text-green-300 border border-green-600 hover:bg-green-900/40'
                                : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                            } transition-colors`}
                          >
                            {t('edit', 'Edit')}
                          </button>

                          {complaint.status === 'pending_approval' && (
                            <>
                              <button
                                onClick={() => onApprove(complaint.id)}
                                className={`px-3 py-1 rounded text-xs font-medium ${
                                  isDarkMode
                                    ? 'bg-emerald-900/20 text-emerald-300 border border-emerald-600 hover:bg-emerald-900/40'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                } transition-colors`}
                              >
                                {t('approve', 'Setujui')}
                              </button>
                              <button
                                onClick={() => onReject(complaint.id)}
                                className={`px-3 py-1 rounded text-xs font-medium ${
                                  isDarkMode
                                    ? 'bg-red-900/20 text-red-300 border border-red-600 hover:bg-red-900/40'
                                    : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                } transition-colors`}
                              >
                                {t('reject', 'Tolak')}
                              </button>
                            </>
                          )}

                          {complaint.status === 'approved' && (
                            <select
                              onChange={(e) =>
                                onStatusUpdate(complaint.id, e.target.value)
                              }
                              value={complaint.status}
                              className={`px-2 py-1 rounded text-xs border ${
                                isDarkMode
                                  ? 'bg-gray-700 text-gray-300 border-gray-600'
                                  : 'bg-white text-gray-700 border-gray-300'
                              }`}
                            >
                              <option value='approved'>Approved</option>
                              <option value='in_progress'>In Progress</option>
                              <option value='resolved'>Resolved</option>
                              <option value='closed'>Closed</option>
                            </select>
                          )}

                          <button
                            onClick={() => onDelete(complaint.id)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              isDarkMode
                                ? 'bg-red-900/20 text-red-300 border border-red-600 hover:bg-red-900/40'
                                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                            } transition-colors`}
                          >
                            {t('delete', 'Hapus')}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className='lg:hidden space-y-4'>
        {currentComplaints.map((complaint) => (
          <div
            key={complaint.id}
            className={`rounded-lg shadow-sm border p-4 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className='flex items-start justify-between'>
              <div className='flex items-start space-x-3 flex-1'>
                <input
                  type='checkbox'
                  checked={selectedItems.has(complaint.id)}
                  onChange={() => onSelectItem(complaint.id)}
                  className={`h-4 w-4 mt-1 rounded ${
                    isDarkMode
                      ? 'text-blue-400 bg-gray-700 border-gray-600'
                      : 'text-blue-600 bg-white border-gray-300'
                  }`}
                />
                <div className='flex-1 min-w-0'>
                  <h3
                    className={`text-sm font-medium ${
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
                    {complaint.description}
                  </p>
                  <div className='flex items-center mt-2 space-x-2'>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isDarkMode
                          ? 'bg-blue-900/50 text-blue-300'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {getCategoryInfo(complaint.category).icon}
                      <span className='ml-1'>
                        {getCategoryInfo(complaint.category).label}
                      </span>
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border-2 ${
                        isDarkMode
                          ? `bg-${getStatusColor(
                              complaint.status
                            )}-900/20 text-${getStatusColor(
                              complaint.status
                            )}-300 border-${getStatusColor(
                              complaint.status
                            )}-600`
                          : `bg-${getStatusColor(
                              complaint.status
                            )}-50 text-${getStatusColor(
                              complaint.status
                            )}-700 border-${getStatusColor(
                              complaint.status
                            )}-200`
                      }`}
                    >
                      {statuses.find((s) => s.value === complaint.status)
                        ?.label || complaint.status}
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border-2 ${
                        isDarkMode
                          ? `bg-${getPriorityColor(
                              complaint.priority
                            )}-900/20 text-${getPriorityColor(
                              complaint.priority
                            )}-300 border-${getPriorityColor(
                              complaint.priority
                            )}-600`
                          : `bg-${getPriorityColor(
                              complaint.priority
                            )}-50 text-${getPriorityColor(
                              complaint.priority
                            )}-700 border-${getPriorityColor(
                              complaint.priority
                            )}-200`
                      }`}
                    >
                      {priorities.find((p) => p.value === complaint.priority)
                        ?.label || complaint.priority}
                    </span>
                  </div>
                  {user?.role !== 'siswa' && (
                    <div
                      className={`text-xs mt-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      <span className='font-medium'>
                        {complaint.reporter_name}
                      </span>
                      <span className='mx-1'>•</span>
                      <span className='capitalize'>
                        {complaint.reporter_type}
                      </span>
                    </div>
                  )}
                  <div
                    className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {formatDateTime(complaint.reported_at)}
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700'>
              <button
                onClick={() => onView(complaint)}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  isDarkMode
                    ? 'bg-blue-900/20 text-blue-300 border border-blue-600 hover:bg-blue-900/40'
                    : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                } transition-colors`}
              >
                {t('view', 'Lihat')}
              </button>

              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => onEdit(complaint)}
                    className={`px-3 py-2 rounded text-sm font-medium ${
                      isDarkMode
                        ? 'bg-green-900/20 text-green-300 border border-green-600 hover:bg-green-900/40'
                        : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    } transition-colors`}
                  >
                    {t('edit', 'Edit')}
                  </button>

                  {complaint.status === 'pending_approval' && (
                    <>
                      <button
                        onClick={() => onApprove(complaint.id)}
                        className={`px-3 py-2 rounded text-sm font-medium ${
                          isDarkMode
                            ? 'bg-emerald-900/20 text-emerald-300 border border-emerald-600 hover:bg-emerald-900/40'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        } transition-colors`}
                      >
                        {t('approve', 'Setujui')}
                      </button>
                      <button
                        onClick={() => onReject(complaint.id)}
                        className={`px-3 py-2 rounded text-sm font-medium ${
                          isDarkMode
                            ? 'bg-red-900/20 text-red-300 border border-red-600 hover:bg-red-900/40'
                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        } transition-colors`}
                      >
                        {t('reject', 'Tolak')}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => onDelete(complaint.id)}
                    className={`px-3 py-2 rounded text-sm font-medium ${
                      isDarkMode
                        ? 'bg-red-900/20 text-red-300 border border-red-600 hover:bg-red-900/40'
                        : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                    } transition-colors`}
                  >
                    {t('delete', 'Hapus')}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ComplaintsTable;
