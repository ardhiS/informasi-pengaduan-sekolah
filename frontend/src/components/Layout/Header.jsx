import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../utils/translations';
import { getRoleBadgeColor } from '../../utils/roleColors';
import AtThahirinLogo from '../AtThahirinLogo';
import ThemeLanguageToggle from '../ThemeLanguageToggle';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, language } = useTheme();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    // Redirect to landing page after logout
    navigate('/');
  };

  // Function to get role description
  const getRoleDescription = (role) => {
    const roleDescriptions = {
      admin: t('admin', 'System Administrator'),
      guru: t('guru', 'Teacher'),
      siswa: t('siswa', 'Student'),
      teacher: t('teacher', 'Teacher'),
      student: t('student', 'Student'),
      staff: t('staff', 'Staff Member'),
      principal: t('principal', 'School Principal'),
      coordinator: t('coordinator', 'Academic Coordinator'),
    };
    return roleDescriptions[role] || t('user', 'User');
  };

  // Function to get role badge display name (short version for badge)
  const getRoleBadgeName = (role) => {
    const roleNames = {
      admin: t('admin', 'Admin'),
      guru: t('guru', 'Guru'),
      siswa: t('siswa', 'Siswa'),
      teacher: t('teacher', 'Teacher'),
      student: t('student', 'Student'),
      staff: t('staff', 'Staff'),
      principal: t('principal', 'Principal'),
      coordinator: t('coordinator', 'Coordinator'),
    };
    return roleNames[role] || t('user', 'User');
  };

  // Debug: Log user role and color
  console.log('🎨 Header Debug - User role:', user?.role);
  console.log(
    '🎨 Header Debug - Badge color class:',
    getRoleBadgeColor(user?.role)
  );

  return (
    <header
      className={`${
        isDarkMode
          ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700'
          : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
      } shadow-lg border-b backdrop-blur-sm sticky top-0 z-30`}
    >
      <div className='max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-12 xs:h-14 sm:h-16'>
          {/* Left side - Menu button and logo/title */}
          <div className='flex items-center min-w-0 flex-1'>
            <button
              type='button'
              className={`md:hidden btn-icon ${
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                  : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
              } focus:ring-primary-500 mr-2 xs:mr-3`}
              onClick={onMenuClick}
            >
              <Menu className='h-5 w-5' />
            </button>
            <div className='flex-shrink-0 flex items-center min-w-0'>
              <AtThahirinLogo className='w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 flex-shrink-0' />
              {/* Hide title on mobile, show only on larger screens */}
              <h1
                className={`hidden sm:block ml-2 sm:ml-3 text-lg sm:text-xl font-semibold ${
                  isDarkMode ? 'text-green-300' : 'text-green-800'
                } truncate`}
              >
                {t('complaintSystem', 'Website Pengaduan SMP PLUS AT-THAHIRIN')}
              </h1>
            </div>
          </div>

          {/* Right side - Theme toggle, notifications and user menu */}
          <div className='flex items-center space-x-1 xs:space-x-2 sm:space-x-3'>
            {/* Theme and Language Toggle */}
            <ThemeLanguageToggle />

            {/* Notifications - Hidden on small screens */}
            <button
              className={`hidden sm:flex btn-icon ${
                isDarkMode
                  ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-800'
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              } focus:ring-blue-500 relative`}
            >
              <Bell className='h-5 w-5' />
              <span className='absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse'></span>
            </button>

            {/* User info and menu */}
            {user && (
              <div className='relative'>
                {/* Mobile user menu button */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-1 xs:space-x-2 text-left p-1 rounded-lg ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 touch-manipulation`}
                >
                  {/* User Avatar */}
                  <div className='flex-shrink-0'>
                    <div className='h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center'>
                      <User className='h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-white' />
                    </div>
                  </div>

                  {/* User info - More selective hiding on mobile */}
                  <div className='hidden xs:flex flex-col min-w-0 max-w-24 sm:max-w-32 lg:max-w-none'>
                    <div className='flex items-center space-x-1 xs:space-x-2'>
                      <span
                        className={`text-xs xs:text-sm font-semibold ${
                          isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        } truncate`}
                      >
                        {user.fullname || user.username}
                      </span>
                      <span
                        className={`hidden sm:inline-flex items-center px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-full text-2xs xs:text-xs font-bold border transition-all duration-200 ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {getRoleBadgeName(user.role)}
                      </span>
                    </div>
                    <p
                      className={`text-2xs xs:text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } truncate mt-0.5 hidden lg:block`}
                    >
                      {getRoleDescription(user.role).toLowerCase()} •{' '}
                      {t('online', 'online')}
                    </p>
                  </div>

                  {/* Dropdown arrow */}
                  <ChevronDown
                    className={`h-3 w-3 xs:h-4 xs:w-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    } transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-64 xs:w-72 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                    } rounded-md shadow-lg py-1 z-50 border animate-slide-down`}
                  >
                    {/* User info in dropdown - Visible on small screens */}
                    <div
                      className={`px-4 py-3 border-b ${
                        isDarkMode ? 'border-gray-700' : 'border-gray-100'
                      }`}
                    >
                      <div className='flex items-center space-x-3'>
                        <div className='h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center'>
                          <User className='h-5 w-5 text-white' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p
                            className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-100' : 'text-gray-900'
                            } truncate`}
                          >
                            {user.fullname || user.username}
                          </p>
                          <p
                            className={`text-xs ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            } truncate`}
                          >
                            {getRoleDescription(user.role)}
                          </p>
                          <div className='mt-1'>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                                user.role
                              )}`}
                            >
                              {getRoleBadgeName(user.role)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className='py-1'>
                      <NavLink
                        to='/profile'
                        className={`flex items-center px-4 py-2 text-sm ${
                          isDarkMode
                            ? 'text-gray-200 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className='h-4 w-4 mr-3' />
                        {t('profile', 'Profile')}
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-4 py-2 text-sm text-red-700 ${
                          isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                        }`}
                      >
                        <LogOut className='h-4 w-4 mr-3' />
                        {t('logout', 'Logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {showUserMenu && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
