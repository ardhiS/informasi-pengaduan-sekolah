import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  Activity,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  PlayCircle,
  Database,
  Eye,
  Plus,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useTranslation } from '../utils/translations';

const Dashboard = () => {
  const { isDarkMode, language } = useTheme();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const {
    state,
    actions,
    users,
    classes,
    subjects,
    complaints,
    isLoading: globalLoading,
    isInitialized,
  } = useData();

  const [error, setError] = useState('');

  useEffect(() => {
    if (isInitialized) {
      setError('');
      console.log('Dashboard: Data context initialized');
    }
  }, [isInitialized]);

  // Manual refresh function
  const refreshDashboard = async () => {
    try {
      setError('');
      await actions.fetchAllData();
      console.log('Dashboard: Data refreshed manually');
    } catch (err) {
      console.error('Dashboard: Failed to refresh data:', err);
      setError('Failed to refresh dashboard data');
    }
  };

  // Function to get user statistics from DataContext
  const getUserStats = () => {
    return {
      total: users.total,
      admin: users.admin,
      guru: users.guru,
      siswa: users.siswa,
    };
  };

  // Function to handle navigation to Users page
  const handleNavigateToUsers = () => {
    navigate('/users');
  };

  // Function to handle navigation to Classes page
  const handleNavigateToClasses = () => {
    navigate('/classes');
  };

  // Function to handle navigation to Subjects page
  const handleNavigateToSubjects = () => {
    navigate('/subjects');
  };

  // Function to handle navigation to Complaints page (for Recent Activities)
  const handleNavigateToComplaints = () => {
    navigate('/complaints');
  };

  const userStats = getUserStats();

  const statCards = [
    {
      name: t('totalUsers', 'Total Users'),
      value: users.total,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50',
      textColor: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      change: `${userStats.admin} Admin, ${userStats.guru} Guru, ${userStats.siswa} Siswa`,
      changeType: 'info',
      clickable: true,
      onClick: handleNavigateToUsers,
    },
    {
      name: t('totalClasses', 'Total Classes'),
      value: classes.total,
      icon: GraduationCap,
      color: 'bg-green-500',
      bgColor: isDarkMode ? 'bg-green-900/30' : 'bg-green-50',
      textColor: isDarkMode ? 'text-green-400' : 'text-green-600',
      change: t('viewClassesDetails', 'View classes and management'),
      changeType: 'info',
      clickable: true,
      onClick: handleNavigateToClasses,
    },
    {
      name: t('totalSubjects', 'Total Subjects'),
      value: subjects.total,
      icon: BookOpen,
      color: 'bg-purple-500',
      bgColor: isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50',
      textColor: isDarkMode ? 'text-purple-400' : 'text-purple-600',
      change: t('viewSubjectsDetails', 'View subjects and curriculum'),
      changeType: 'info',
      clickable: true,
      onClick: handleNavigateToSubjects,
    },
    {
      name: t('totalComplaints', 'Total Complaints'),
      value: complaints.total,
      icon: Activity,
      color: 'bg-orange-500',
      bgColor: isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50',
      textColor: isDarkMode ? 'text-orange-400' : 'text-orange-600',
      change: t('viewComplaintsActivity', 'View complaints and reports'),
      changeType: 'info',
      clickable: true,
      onClick: handleNavigateToComplaints,
    },
  ];

  const apiEndpoints = [
    { name: 'Authentication API', status: 'active' },
    { name: 'Users API', status: 'active' },
    { name: 'Classes API', status: 'active' },
    { name: 'Subjects API', status: 'active' },
  ];

  const quickActions = [
    {
      title: t('testAllEndpoints', 'Test All Endpoints'),
      description: t('runApiTests', 'Run comprehensive API tests'),
      icon: PlayCircle,
      color: isDarkMode
        ? 'bg-primary-900/30 hover:bg-primary-900/50 text-primary-300'
        : 'bg-primary-50 hover:bg-primary-100 text-primary-900',
      descColor: isDarkMode ? 'text-primary-400' : 'text-primary-700',
      onClick: () => navigate('/api-testing'),
    },
    {
      title: t('createSampleData', 'Create Sample Data'),
      description: t(
        'generateTestData',
        'Generate test users, classes, and subjects'
      ),
      icon: Plus,
      color: isDarkMode
        ? 'bg-green-900/30 hover:bg-green-900/50 text-green-300'
        : 'bg-green-50 hover:bg-green-100 text-green-900',
      descColor: isDarkMode ? 'text-green-400' : 'text-green-700',
      onClick: () => window.open('/sample-data', '_blank'),
    },
    {
      title: t('viewApiLogs', 'View API Logs'),
      description: t('monitorRequests', 'Monitor API requests and responses'),
      icon: Eye,
      color: isDarkMode
        ? 'bg-orange-900/30 hover:bg-orange-900/50 text-orange-300'
        : 'bg-orange-50 hover:bg-orange-100 text-orange-900',
      descColor: isDarkMode ? 'text-orange-400' : 'text-orange-700',
    },
  ];

  if (globalLoading && !isInitialized) {
    return (
      <div
        className={`flex items-center justify-center h-64 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        <div className='spinner'></div>
      </div>
    );
  }

  return (
    <div className='space-y-4 xs:space-y-6'>
      {/* Header */}
      <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3'>
        <h1
          className={`text-mobile-2xl font-bold ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          {t('dashboard', 'Dashboard')}
        </h1>
        <button
          onClick={refreshDashboard}
          className='btn-primary flex items-center space-x-2 self-start xs:self-auto'
          disabled={globalLoading}
        >
          <RefreshCw
            className={`h-4 w-4 ${globalLoading ? 'animate-spin' : ''}`}
          />
          <span>{t('refreshData', 'Refresh Data')}</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className={`alert ${
            isDarkMode
              ? 'bg-red-900/20 border-red-700 text-red-300'
              : 'alert-error'
          }`}
        >
          <div className='flex items-start'>
            <AlertCircle className='h-5 w-5 mt-0.5 flex-shrink-0' />
            <div className='ml-3'>
              <div className='font-medium'>{t('error', 'Error')}</div>
              <div className='mt-1'>{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 lg:gap-6'>
        {statCards.map((stat) => (
          <div
            key={stat.name}
            onClick={stat.clickable ? stat.onClick : undefined}
            className={`card p-4 xs:p-6 hover:shadow-lg transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            } ${
              stat.clickable
                ? 'cursor-pointer hover:scale-[1.02] transform'
                : ''
            }`}
          >
            <div className='flex items-center'>
              <div className={`${stat.color} rounded-lg p-2 xs:p-3`}>
                <stat.icon className='h-5 w-5 xs:h-6 xs:w-6 text-white' />
              </div>
              <div className='ml-3 xs:ml-5 w-0 flex-1'>
                <dl>
                  <dt
                    className={`text-xs xs:text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } truncate`}
                  >
                    {stat.name}
                  </dt>
                  <dd className='flex flex-col mt-1'>
                    <div
                      className={`text-xl xs:text-2xl font-semibold ${
                        isDarkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div
                      className={`mt-1 text-2xs xs:text-xs font-medium ${
                        stat.changeType === 'positive'
                          ? isDarkMode
                            ? 'text-green-400'
                            : 'text-green-600'
                          : stat.changeType === 'info'
                          ? isDarkMode
                            ? 'text-blue-400'
                            : 'text-blue-600'
                          : isDarkMode
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                    >
                      {stat.changeType === 'positive' && (
                        <TrendingUp className='h-3 w-3 xs:h-4 xs:w-4 inline mr-1' />
                      )}
                      <span>{stat.change}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            {stat.clickable && (
              <div
                className={`mt-3 pt-3 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div
                  className={`text-xs font-medium ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  } flex items-center`}
                >
                  <Eye className='h-3 w-3 mr-1' />
                  {t('viewDetails', 'View Details')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* API Testing Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6'>
        <div
          className={`card p-4 xs:p-6 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h3
            className={`text-mobile-lg font-medium ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            } mb-3 xs:mb-4 flex items-center`}
          >
            <Database
              className={`h-5 w-5 mr-2 ${
                isDarkMode ? 'text-primary-400' : 'text-primary-600'
              }`}
            />
            {t('apiEndpointsTesting', 'API Endpoints Testing')}
          </h3>
          <div className='space-y-2 xs:space-y-3'>
            {apiEndpoints.map((endpoint, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 xs:p-3 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-50 hover:bg-gray-100'
                } rounded-lg transition-colors duration-200`}
              >
                <span
                  className={`text-mobile-sm font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}
                >
                  {endpoint.name}
                </span>
                <span
                  className={`inline-flex items-center px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-full text-2xs xs:text-xs font-medium ${
                    isDarkMode
                      ? 'bg-green-900/30 text-green-300'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  <CheckCircle className='h-3 w-3 mr-1' />
                  {t('active', 'Active')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`card p-4 xs:p-6 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <h3
            className={`text-mobile-lg font-medium ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            } mb-3 xs:mb-4 flex items-center`}
          >
            <PlayCircle
              className={`h-5 w-5 mr-2 ${
                isDarkMode ? 'text-primary-400' : 'text-primary-600'
              }`}
            />
            {t('quickActions', 'Quick Actions')}
          </h3>
          <div className='space-y-2 xs:space-y-3'>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`w-full text-left p-3 xs:p-4 rounded-lg transition-all duration-200 touch-manipulation ${action.color}`}
              >
                <div className='flex items-start space-x-3'>
                  <action.icon className='h-5 w-5 mt-0.5 flex-shrink-0' />
                  <div className='min-w-0 flex-1'>
                    <div className='font-medium text-mobile-sm'>
                      {action.title}
                    </div>
                    <div
                      className={`text-2xs xs:text-sm mt-1 ${action.descColor}`}
                    >
                      {action.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Users Data Preview */}
      <div
        className={`card p-4 xs:p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <div className='flex items-center justify-between mb-4'>
          <h3
            className={`text-mobile-lg font-medium ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            } flex items-center`}
          >
            <Users
              className={`h-5 w-5 mr-2 ${
                isDarkMode ? 'text-primary-400' : 'text-primary-600'
              }`}
            />
            {t('realtimeUsersData', 'Real-time Users Data')}
          </h3>
          <button
            onClick={handleNavigateToUsers}
            className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-primary-900/30 hover:bg-primary-900/50 text-primary-300 border border-primary-700'
                : 'bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200'
            }`}
          >
            {t('viewAll', 'View All')}
          </button>
        </div>

        {globalLoading && !isInitialized ? (
          <div className='text-center py-8'>
            <RefreshCw
              className={`h-8 w-8 animate-spin mx-auto mb-3 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`}
            />
            <div
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {t('loadingUsersData', 'Loading users data...')}
            </div>
          </div>
        ) : users.data && users.data.length > 0 ? (
          <>
            {/* Users Statistics Summary */}
            <div className='grid grid-cols-2 xs:grid-cols-4 gap-3 mb-4'>
              <div
                className={`text-center p-3 rounded-lg ${
                  isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                }`}
              >
                <div
                  className={`text-xl font-bold ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}
                >
                  {userStats.total}
                </div>
                <div
                  className={`text-xs ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}
                >
                  {t('totalUsers', 'Total Users')}
                </div>
              </div>
              <div
                className={`text-center p-3 rounded-lg ${
                  isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'
                }`}
              >
                <div
                  className={`text-xl font-bold ${
                    isDarkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}
                >
                  {userStats.admin}
                </div>
                <div
                  className={`text-xs ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}
                >
                  Admin
                </div>
              </div>
              <div
                className={`text-center p-3 rounded-lg ${
                  isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                }`}
              >
                <div
                  className={`text-xl font-bold ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}
                >
                  {userStats.guru}
                </div>
                <div
                  className={`text-xs ${
                    isDarkMode ? 'text-green-300' : 'text-green-700'
                  }`}
                >
                  Guru
                </div>
              </div>
              <div
                className={`text-center p-3 rounded-lg ${
                  isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'
                }`}
              >
                <div
                  className={`text-xl font-bold ${
                    isDarkMode ? 'text-orange-400' : 'text-orange-600'
                  }`}
                >
                  {userStats.siswa}
                </div>
                <div
                  className={`text-xs ${
                    isDarkMode ? 'text-orange-300' : 'text-orange-700'
                  }`}
                >
                  Siswa
                </div>
              </div>
            </div>

            {/* Users Preview Table */}
            <div className='overflow-x-auto'>
              <table
                className={`min-w-full divide-y ${
                  isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                }`}
              >
                <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {t('name', 'Name')}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {t('email', 'Email')}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {t('role', 'Role')}
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-500'
                      }`}
                    >
                      {t('status', 'Status')}
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                  }`}
                >
                  {(users.data || []).slice(0, 5).map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      } transition-colors`}
                    >
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}
                      >
                        {user.fullName || user.name || 'N/A'}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {user.email || 'N/A'}
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? isDarkMode
                                ? 'bg-purple-900/30 text-purple-300'
                                : 'bg-purple-100 text-purple-800'
                              : user.role === 'guru'
                              ? isDarkMode
                                ? 'bg-green-900/30 text-green-300'
                                : 'bg-green-100 text-green-800'
                              : isDarkMode
                              ? 'bg-blue-900/30 text-blue-300'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role || 'N/A'}
                        </span>
                      </td>
                      <td className='px-4 py-3 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isDarkMode
                              ? 'bg-green-900/30 text-green-300'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          <CheckCircle className='h-3 w-3 mr-1' />
                          {t('active', 'Active')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(users.data || []).length > 5 && (
              <div
                className={`mt-4 text-center p-3 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <button
                  onClick={handleNavigateToUsers}
                  className={`text-sm font-medium hover:underline ${
                    isDarkMode ? 'text-primary-400' : 'text-primary-600'
                  }`}
                >
                  {t('viewAllUsers', 'View all')} {(users.data || []).length}{' '}
                  {t('users', 'users')} →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className='text-center py-8'>
            <Users
              className={`h-12 w-12 xs:h-16 xs:w-16 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-300'
              } mx-auto mb-3 xs:mb-4`}
            />
            <div
              className={`text-mobile-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {t('noUsersFound', 'No users data found')}
            </div>
          </div>
        )}
      </div>

      {/* Quick Access Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6'>
        {/* Classes Preview */}
        <div
          className={`card p-4 xs:p-6 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className='flex items-center justify-between mb-4'>
            <h3
              className={`text-mobile-lg font-medium ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              } flex items-center`}
            >
              <GraduationCap
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}
              />
              {t('classesOverview', 'Classes Overview')}
            </h3>
            <button
              onClick={handleNavigateToClasses}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-green-900/30 hover:bg-green-900/50 text-green-300 border border-green-700'
                  : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
              }`}
            >
              {t('viewAll', 'View All')}
            </button>
          </div>

          <div className='text-center py-6'>
            <div
              className={`text-3xl font-bold mb-2 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}
            >
              {classes.total}
            </div>
            <div
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {t('totalClassesManaged', 'Total classes being managed')}
            </div>
            <button
              onClick={handleNavigateToClasses}
              className={`mt-4 inline-flex items-center text-sm font-medium ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              } hover:underline`}
            >
              <Eye className='h-4 w-4 mr-1' />
              {t('manageClasses', 'Manage Classes')}
            </button>
          </div>
        </div>

        {/* Subjects Preview */}
        <div
          className={`card p-4 xs:p-6 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className='flex items-center justify-between mb-4'>
            <h3
              className={`text-mobile-lg font-medium ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              } flex items-center`}
            >
              <BookOpen
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}
              />
              {t('subjectsOverview', 'Subjects Overview')}
            </h3>
            <button
              onClick={handleNavigateToSubjects}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 border border-purple-700'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
              }`}
            >
              {t('viewAll', 'View All')}
            </button>
          </div>

          <div className='text-center py-6'>
            <div
              className={`text-3xl font-bold mb-2 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`}
            >
              {subjects.total}
            </div>
            <div
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {t('totalSubjectsAvailable', 'Total subjects available')}
            </div>
            <button
              onClick={handleNavigateToSubjects}
              className={`mt-4 inline-flex items-center text-sm font-medium ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              } hover:underline`}
            >
              <Eye className='h-4 w-4 mr-1' />
              {t('manageSubjects', 'Manage Subjects')}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className={`card p-4 xs:p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        <h3
          className={`text-mobile-lg font-medium ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          } mb-3 xs:mb-4 flex items-center`}
        >
          <Activity
            className={`h-5 w-5 mr-2 ${
              isDarkMode ? 'text-primary-400' : 'text-primary-600'
            }`}
          />
          {t('apiTestingHistory', 'API Testing History')}
        </h3>
        <div className='text-center py-8 xs:py-12'>
          <Activity
            className={`h-12 w-12 xs:h-16 xs:w-16 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            } mx-auto mb-3 xs:mb-4`}
          />
          <div
            className={`text-mobile-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {t(
              'apiHistoryPlaceholder',
              'API testing history will appear here as you interact with different endpoints...'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
