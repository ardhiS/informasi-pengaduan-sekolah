import React from 'react';
import { MessageSquare, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const ComplaintsStats = ({ isDarkMode, t, showStats, stats }) => {
  return (
    <div
      className={`transition-all duration-500 ease-in-out overflow-hidden ${
        showStats
          ? 'max-h-96 opacity-100 transform translate-y-0'
          : 'max-h-0 opacity-0 transform -translate-y-4'
      }`}
    >
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mx-2 sm:mx-0 pb-4'>
        <div
          className={`card p-3 sm:p-6 stats-card-hover ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <MessageSquare
                className={`h-6 w-6 sm:h-8 sm:w-8 ${
                  isDarkMode ? 'text-primary-400' : 'text-primary-600'
                }`}
              />
            </div>
            <div className='ml-3 sm:ml-5 w-0 flex-1'>
              <dl>
                <dt
                  className={`text-xs sm:text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } truncate`}
                >
                  {t('totalComplaints', 'Total Pengaduan')}
                </dt>
                <dd
                  className={`text-lg sm:text-2xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {stats.total || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div
          className={`card p-3 sm:p-6 stats-card-hover ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <Clock
                className={`h-6 w-6 sm:h-8 sm:w-8 ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}
              />
            </div>
            <div className='ml-3 sm:ml-5 w-0 flex-1'>
              <dl>
                <dt
                  className={`text-xs sm:text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } truncate`}
                >
                  {t('pending', 'Menunggu')}
                </dt>
                <dd
                  className={`text-lg sm:text-2xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {stats.pending || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div
          className={`card p-3 sm:p-6 stats-card-hover ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <AlertCircle
                className={`h-6 w-6 sm:h-8 sm:w-8 ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-600'
                }`}
              />
            </div>
            <div className='ml-3 sm:ml-5 w-0 flex-1'>
              <dl>
                <dt
                  className={`text-xs sm:text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } truncate`}
                >
                  {t('urgent', 'Mendesak')}
                </dt>
                <dd
                  className={`text-lg sm:text-2xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {stats.urgent || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div
          className={`card p-3 sm:p-6 stats-card-hover ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <CheckCircle
                className={`h-6 w-6 sm:h-8 sm:w-8 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}
              />
            </div>
            <div className='ml-3 sm:ml-5 w-0 flex-1'>
              <dl>
                <dt
                  className={`text-xs sm:text-sm font-medium ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } truncate`}
                >
                  {t('resolved', 'Selesai')}
                </dt>
                <dd
                  className={`text-lg sm:text-2xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {stats.resolved || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsStats;
