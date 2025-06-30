import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AtThahirinLogo from '../AtThahirinLogo';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  // Function to get role description
  const getRoleDescription = (role) => {
    const roleDescriptions = {
      admin: 'System Administrator',
      teacher: 'Teacher',
      student: 'Student',
      staff: 'Staff Member',
      principal: 'School Principal',
      coordinator: 'Academic Coordinator',
    };
    return roleDescriptions[role] || 'User';
  };

  // Function to get role badge display name (short version for badge)
  const getRoleBadgeName = (role) => {
    const roleNames = {
      admin: 'Admin',
      teacher: 'Teacher',
      student: 'Student',
      staff: 'Staff',
      principal: 'Principal',
      coordinator: 'Coordinator',
    };
    return roleNames[role] || 'User';
  };

  // Function to get role badge color
  const getRoleBadgeColor = (role) => {
    const colors = {
      admin:
        'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-300 shadow-lg hover:shadow-xl',
      teacher:
        'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-300 shadow-lg hover:shadow-xl',
      student:
        'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-300 shadow-lg hover:shadow-xl',
      staff:
        'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-300 shadow-lg hover:shadow-xl',
      principal:
        'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300 shadow-lg hover:shadow-xl',
      coordinator:
        'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-300 shadow-lg hover:shadow-xl',
    };
    return (
      colors[role] ||
      'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-300 shadow-lg hover:shadow-xl'
    );
  };

  return (
    <header className='bg-gradient-to-r from-white to-gray-50 shadow-lg border-b border-gray-200 backdrop-blur-sm sticky top-0 z-30'>
      <div className='max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-14 xs:h-16'>
          {/* Left side - Menu button and title */}
          <div className='flex items-center min-w-0 flex-1'>
            <button
              type='button'
              className='md:hidden btn-icon text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:ring-primary-500 mr-2'
              onClick={onMenuClick}
            >
              <Menu className='h-5 w-5 xs:h-6 xs:w-6' />
            </button>
            <div className='flex-shrink-0 flex items-center min-w-0 space-x-2 sm:space-x-3'>
              <AtThahirinLogo className='w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0' />
              <h1 className='text-sm xs:text-lg sm:text-xl font-semibold text-green-800 truncate'>
                <span className='hidden sm:inline'>
                  Website Pengaduan SMP PLUS AT-THAHIRIN
                </span>
                <span className='sm:hidden'>SMP AT-THAHIRIN</span>
              </h1>
            </div>
          </div>

          {/* Right side - Notifications and user menu */}
          <div className='flex items-center space-x-2 xs:space-x-3 sm:space-x-4'>
            {/* Notifications - Hidden on small screens */}
            <button className='hidden xs:flex btn-icon text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-500 relative'>
              <Bell className='h-5 w-5' />
              <span className='absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-pulse'></span>
            </button>

            {/* User info and menu */}
            {user && (
              <div className='relative'>
                {/* Mobile user menu button */}
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className='flex items-center space-x-2 xs:space-x-3 text-left p-1 xs:p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 touch-manipulation'
                >
                  {/* User Avatar */}
                  <div className='flex-shrink-0'>
                    <div className='h-8 w-8 xs:h-10 xs:w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center'>
                      <User className='h-4 w-4 xs:h-5 xs:w-5 text-white' />
                    </div>
                  </div>

                  {/* User info - Hidden on very small screens */}
                  <div className='hidden xs:flex flex-col min-w-0 max-w-32 sm:max-w-none'>
                    <div className='flex items-center space-x-2'>
                      <span className='text-xs xs:text-sm font-semibold text-gray-900 truncate'>
                        {user.fullname || user.username}
                      </span>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 xs:px-2.5 xs:py-1 rounded-full text-2xs xs:text-xs font-bold border transition-all duration-200 ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {getRoleBadgeName(user.role)}
                      </span>
                    </div>
                    <p className='text-2xs xs:text-xs text-gray-500 truncate mt-0.5 hidden sm:block'>
                      {getRoleDescription(user.role).toLowerCase()} • online
                    </p>
                  </div>

                  {/* Dropdown arrow */}
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className='absolute right-0 mt-2 w-64 xs:w-72 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 animate-slide-down'>
                    {/* User info in dropdown - Visible on small screens */}
                    <div className='px-4 py-3 border-b border-gray-100'>
                      <div className='flex items-center space-x-3'>
                        <div className='h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center'>
                          <User className='h-5 w-5 text-white' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-900 truncate'>
                            {user.fullname || user.username}
                          </p>
                          <p className='text-xs text-gray-500 truncate'>
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
                        className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className='h-4 w-4 mr-3' />
                        Profile
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className='flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50'
                      >
                        <LogOut className='h-4 w-4 mr-3' />
                        Logout
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
