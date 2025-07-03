import React from 'react';
import {
  X,
  User,
  UserCheck,
  Mail,
  Phone,
  Tag,
  Calendar,
  CheckCircle,
  Edit,
} from 'lucide-react';

const ComplaintsDetailModal = ({
  showDetailModal,
  selectedComplaint,
  setShowDetailModal,
  isDarkMode,
  user,
  getCategoryInfo,
  getStatusColor,
  getPriorityColor,
  statuses,
  priorities,
  formatDateTime,
  handleEdit,
}) => {
  if (!showDetailModal || !selectedComplaint) return null;

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4'>
      <div
        className={`relative rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className='p-4 sm:p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3
              className={`text-lg font-medium ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}
            >
              Detail Pengaduan
            </h3>
            <button
              onClick={() => setShowDetailModal(false)}
              className={
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-400 hover:text-gray-600'
              }
            >
              <X className='h-6 w-6' />
            </button>
          </div>

          <div className='space-y-6'>
            {/* Header Info */}
            <div
              className={`rounded-lg p-4 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                <div>
                  <h4
                    className={`text-lg font-semibold ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}
                  >
                    {selectedComplaint.title}
                  </h4>
                  <div className='flex items-center space-x-2 mt-2'>
                    <span
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {getCategoryInfo(selectedComplaint.category).icon}{' '}
                      {getCategoryInfo(selectedComplaint.category).label}
                    </span>
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row gap-2'>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode
                        ? `bg-${getStatusColor(
                            selectedComplaint.status
                          )}-900/30 text-${getStatusColor(
                            selectedComplaint.status
                          )}-400 border border-${getStatusColor(
                            selectedComplaint.status
                          )}-700`
                        : `bg-${getStatusColor(
                            selectedComplaint.status
                          )}-100 text-${getStatusColor(
                            selectedComplaint.status
                          )}-800`
                    }`}
                  >
                    {statuses.find((s) => s.value === selectedComplaint.status)
                      ?.label || selectedComplaint.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode
                        ? `bg-${getPriorityColor(
                            selectedComplaint.priority
                          )}-900/30 text-${getPriorityColor(
                            selectedComplaint.priority
                          )}-400 border border-${getPriorityColor(
                            selectedComplaint.priority
                          )}-700`
                        : `bg-${getPriorityColor(
                            selectedComplaint.priority
                          )}-100 text-${getPriorityColor(
                            selectedComplaint.priority
                          )}-800`
                    }`}
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
              <h5
                className={`text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Deskripsi:
              </h5>
              <p
                className={`text-sm rounded p-3 whitespace-pre-wrap ${
                  isDarkMode
                    ? 'text-gray-300 bg-gray-700'
                    : 'text-gray-700 bg-gray-50'
                }`}
              >
                {selectedComplaint.description}
              </p>
            </div>

            {/* Reporter Info - Hidden for students */}
            {user?.role !== 'siswa' && (
              <div>
                <h5
                  className={`text-sm font-medium mb-3 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Informasi Pelapor:
                </h5>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                  <div className='flex items-center space-x-2'>
                    <User
                      className={`h-4 w-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                    >
                      Nama:
                    </span>
                    <span
                      className={`font-medium ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    >
                      {selectedComplaint.reporter_name}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <UserCheck
                      className={`h-4 w-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                    >
                      Tipe:
                    </span>
                    <span
                      className={`font-medium capitalize ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    >
                      {selectedComplaint.reporter_type}
                    </span>
                  </div>
                  {selectedComplaint.reporter_email && (
                    <div className='flex items-center space-x-2'>
                      <Mail
                        className={`h-4 w-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`}
                      />
                      <span
                        className={
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }
                      >
                        Email:
                      </span>
                      <span
                        className={`font-medium ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}
                      >
                        {selectedComplaint.reporter_email}
                      </span>
                    </div>
                  )}
                  {selectedComplaint.reporter_phone && (
                    <div className='flex items-center space-x-2'>
                      <Phone
                        className={`h-4 w-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`}
                      />
                      <span
                        className={
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }
                      >
                        Telepon:
                      </span>
                      <span
                        className={`font-medium ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}
                      >
                        {selectedComplaint.reporter_phone}
                      </span>
                    </div>
                  )}
                  {selectedComplaint.reporter_class && (
                    <div className='flex items-center space-x-2'>
                      <Tag
                        className={`h-4 w-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`}
                      />
                      <span
                        className={
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }
                      >
                        Kelas:
                      </span>
                      <span
                        className={`font-medium ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}
                      >
                        {selectedComplaint.reporter_class}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h5
                className={`text-sm font-medium mb-3 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                Timeline:
              </h5>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <Calendar
                    className={`h-4 w-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Dilaporkan:
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}
                  >
                    {formatDateTime(selectedComplaint.reported_at)}
                  </span>
                </div>
                {selectedComplaint.resolved_at && (
                  <div className='flex items-center space-x-3'>
                    <CheckCircle className='h-4 w-4 text-green-500' />
                    <span
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Diselesaikan:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    >
                      {formatDateTime(selectedComplaint.resolved_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Notes */}
            {selectedComplaint.admin_notes && (
              <div>
                <h5
                  className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Catatan Admin:
                </h5>
                <p
                  className={`text-sm rounded p-3 whitespace-pre-wrap ${
                    isDarkMode
                      ? 'text-gray-300 bg-blue-900/30 border border-blue-700'
                      : 'text-gray-700 bg-blue-50'
                  }`}
                >
                  {selectedComplaint.admin_notes}
                </p>
              </div>
            )}

            {/* Resolution */}
            {selectedComplaint.resolution && (
              <div>
                <h5
                  className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  Solusi:
                </h5>
                <p
                  className={`text-sm rounded p-3 whitespace-pre-wrap ${
                    isDarkMode
                      ? 'text-gray-300 bg-green-900/30 border border-green-700'
                      : 'text-gray-700 bg-green-50'
                  }`}
                >
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
              {user?.role === 'admin' && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsDetailModal;
