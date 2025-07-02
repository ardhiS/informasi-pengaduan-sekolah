import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  Shield,
  AlertCircle,
  RefreshCw,
  Users as UsersIcon,
  UserCheck,
  Crown,
  GraduationCap,
} from 'lucide-react';
import { usersService } from '../services/dataService';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';
import { getRoleBadgeColor, getRoleSecondaryColor } from '../utils/roleColors';

const Users = () => {
  const { isDarkMode, language } = useTheme();
  const { t } = useTranslation(language);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching users from backend...');

      const response = await usersService.getAll();
      console.log('Users response:', response);

      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(`Failed to load users: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return Crown;
      case 'teacher':
      case 'guru':
        return GraduationCap;
      case 'student':
      case 'siswa':
        return User;
      case 'staff':
        return UserCheck;
      case 'principal':
        return Crown;
      case 'coordinator':
        return UsersIcon;
      default:
        return User;
    }
  };

  const formatRole = (role) => {
    const roleMap = {
      admin: 'Admin',
      teacher: 'Teacher',
      student: 'Student',
      staff: 'Staff',
      principal: 'Principal',
      coordinator: 'Coordinator',
      guru: 'Teacher',
      siswa: 'Student',
    };
    return roleMap[role] || role;
  };

  // Get stats
  const totalUsers = users.length;
  const teacherCount = users.filter((u) =>
    ['teacher', 'guru'].includes(u.role)
  ).length;
  const studentCount = users.filter((u) =>
    ['student', 'siswa'].includes(u.role)
  ).length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-64 space-y-4'>
        <div className='spinner'></div>
        <div className='text-gray-600 text-center'>
          <div className='text-mobile-base font-medium'>
            Loading users from backend...
          </div>
          <div className='text-mobile-sm text-gray-500 mt-1'>
            Make sure backend is running on port 5000
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 xs:space-y-6'>
      {/* Header */}
      <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3'>
        <h1
          className={`text-mobile-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('users.title')}
        </h1>
        <button
          onClick={fetchUsers}
          className='btn-primary flex items-center space-x-2 self-start xs:self-auto'
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{t('users.refreshUsers')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4'>
        <div className='card p-3 xs:p-4'>
          <div
            className={`text-xl xs:text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {totalUsers}
          </div>
          <div
            className={`text-2xs xs:text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {t('users.totalUsers')}
          </div>
        </div>
        <div className='card p-3 xs:p-4'>
          <div
            className={`text-xl xs:text-2xl font-bold ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}
          >
            {teacherCount}
          </div>
          <div
            className={`text-2xs xs:text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {t('users.teachers')}
          </div>
        </div>
        <div className='card p-3 xs:p-4'>
          <div
            className={`text-xl xs:text-2xl font-bold ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}
          >
            {studentCount}
          </div>
          <div
            className={`text-2xs xs:text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {t('users.students')}
          </div>
        </div>
        <div className='card p-3 xs:p-4'>
          <div
            className={`text-xl xs:text-2xl font-bold ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}
          >
            {adminCount}
          </div>
          <div
            className={`text-2xs xs:text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {t('users.admins')}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className='alert alert-error'>
          <div className='flex items-start'>
            <AlertCircle className='h-5 w-5 mt-0.5 flex-shrink-0' />
            <div className='ml-3 min-w-0 flex-1'>
              <div className='font-medium'>{t('users.errorLoadingUsers')}</div>
              <div className='mt-1'>{error}</div>
              <div className='text-2xs xs:text-xs mt-2 opacity-75'>
                {t('users.backendServerNote')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className='flex flex-col sm:flex-row gap-3 xs:gap-4'>
        <div className='relative flex-1'>
          <Search
            className={`absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 xs:h-5 xs:w-5 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            } transition-colors group-focus-within:text-primary-500`}
          />
          <input
            type='text'
            placeholder={t('users.searchUsers')}
            className='input-field pl-10 xs:pl-12'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-400 hover:text-gray-600'
              } text-lg`}
            >
              ×
            </button>
          )}
        </div>
        <div className='flex items-center space-x-2 xs:space-x-3'>
          <Filter
            className={`h-4 w-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}
          />
          <select
            className='select-field min-w-0 w-32 xs:w-40'
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value=''>{t('users.allRoles')}</option>
            <option value='admin'>{t('roles.admin')}</option>
            <option value='teacher'>{t('roles.teacher')}</option>
            <option value='student'>{t('roles.student')}</option>
            <option value='staff'>{t('roles.staff')}</option>
            <option value='principal'>{t('roles.principal')}</option>
            <option value='coordinator'>{t('roles.coordinator')}</option>
            <option value='guru'>{t('roles.guru')}</option>
            <option value='siswa'>{t('roles.siswa')}</option>
          </select>
        </div>
      </div>

      {/* Users Grid - Mobile First */}
      <div className='block lg:hidden'>
        <div className='space-y-3 xs:space-y-4'>
          {filteredUsers.map((user) => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <div
                key={user.id}
                className='card p-4 hover:shadow-lg transition-shadow duration-200'
              >
                <div className='flex items-start space-x-3'>
                  <div className='flex-shrink-0'>
                    <div className='h-10 w-10 xs:h-12 xs:w-12 rounded-full bg-primary-100 flex items-center justify-center'>
                      <User className='h-5 w-5 xs:h-6 xs:w-6 text-primary-600' />
                    </div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-2'>
                      <h3
                        className={`text-mobile-base font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        } truncate`}
                      >
                        {user.fullname}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs xs:text-xs font-medium ${getRoleSecondaryColor(
                          user.role
                        )}`}
                      >
                        <RoleIcon className='h-3 w-3 mr-1' />
                        {formatRole(user.role)}
                      </span>
                    </div>
                    <p
                      className={`text-mobile-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } mb-2`}
                    >
                      @{user.username}
                    </p>

                    <div className='space-y-1'>
                      {user.email && (
                        <div
                          className={`flex items-center text-mobile-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}
                        >
                          <Mail className='h-3 w-3 xs:h-4 xs:w-4 mr-2 flex-shrink-0' />
                          <span className='truncate'>{user.email}</span>
                        </div>
                      )}
                      <div
                        className={`flex items-center text-mobile-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <Calendar className='h-3 w-3 xs:h-4 xs:w-4 mr-2 flex-shrink-0' />
                        <span>
                          {t('users.joined')}{' '}
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`mt-3 pt-3 border-t ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-100'
                      }`}
                    >
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium ${
                          isDarkMode
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 ${
                            isDarkMode ? 'bg-green-400' : 'bg-green-400'
                          } rounded-full mr-1`}
                        ></div>
                        {t('users.active')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className='hidden lg:block card overflow-hidden'>
        <div className='table-responsive'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  {t('users.user')}
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  {t('users.role')}
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  {t('users.email')}
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  {t('users.created')}
                </th>
                <th
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  {t('users.status')}
                </th>
              </tr>
            </thead>
            <tbody
              className={`${
                isDarkMode
                  ? 'bg-gray-900 divide-gray-700'
                  : 'bg-white divide-gray-200'
              } divide-y`}
            >
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <tr
                    key={user.id}
                    className={`${
                      isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    } transition-colors duration-150`}
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <div className='h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center'>
                            <User className='h-6 w-6 text-primary-600' />
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div
                            className={`text-sm font-medium ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {user.fullname}
                          </div>
                          <div
                            className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleSecondaryColor(
                          user.role
                        )}`}
                      >
                        <RoleIcon className='h-3 w-3 mr-1' />
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className={`flex items-center text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}
                      >
                        <Mail
                          className={`h-4 w-4 mr-2 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        />
                        {user.email || t('users.noEmail')}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className={`flex items-center text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <Calendar className='h-4 w-4 mr-2' />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isDarkMode
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 ${
                            isDarkMode ? 'bg-green-400' : 'bg-green-400'
                          } rounded-full mr-1`}
                        ></div>
                        {t('users.active')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !loading && (
        <div className='text-center py-8 xs:py-12'>
          <UsersIcon
            className={`mx-auto h-12 w-12 xs:h-16 xs:w-16 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`}
          />
          <h3
            className={`mt-3 xs:mt-4 text-mobile-base font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('users.noUsersFound')}
          </h3>
          <p
            className={`mt-1 xs:mt-2 text-mobile-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {searchTerm || roleFilter
              ? t('users.adjustSearchCriteria')
              : t('users.noUsersAvailable')}
          </p>

          {/* Debug info - only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <div
              className={`mt-4 xs:mt-6 p-3 xs:p-4 ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              } rounded-lg text-left text-2xs xs:text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              } space-y-1 max-w-md mx-auto`}
            >
              <div>Total users loaded: {users.length}</div>
              <div>Backend endpoint: /users</div>
              <div>Search term: "{searchTerm}"</div>
              <div>Role filter: "{roleFilter}"</div>
              <div>Filtered users: {filteredUsers.length}</div>
            </div>
          )}

          <button
            onClick={fetchUsers}
            className='mt-4 xs:mt-6 btn-primary flex items-center space-x-2 mx-auto'
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{t('users.tryRefresh')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;
