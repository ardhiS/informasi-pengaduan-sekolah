import React from 'react';
import { useTheme } from '../context/ThemeContext';
import AtThahirinLogo from './AtThahirinLogo';
import ThemeLanguageToggle from './ThemeLanguageToggle';

const SimpleLayout = ({ children, title = 'SMP Plus At-Thahirin' }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Simple Header */}
      <header
        className={`${
          isDarkMode
            ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700'
            : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
        } shadow-lg border-b backdrop-blur-sm sticky top-0 z-30`}
      >
        <div className='max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-12 xs:h-14 sm:h-16'>
            {/* Left side - Logo and title */}
            <div className='flex items-center min-w-0 flex-1'>
              <div className='flex-shrink-0 flex items-center min-w-0'>
                <AtThahirinLogo className='w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 flex-shrink-0' />
                <h1
                  className={`ml-2 sm:ml-3 text-lg sm:text-xl font-semibold ${
                    isDarkMode ? 'text-green-300' : 'text-green-800'
                  } truncate`}
                >
                  {title}
                </h1>
              </div>
            </div>

            {/* Right side - Theme toggle and login link */}
            <div className='flex items-center space-x-2 sm:space-x-3'>
              <ThemeLanguageToggle />
              <a
                href='/login'
                className={`btn-primary text-sm px-3 py-1.5 ${
                  isDarkMode
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className='container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-8 max-w-full'>
          <div className='animate-fade-in'>{children}</div>
        </div>
      </main>
    </div>
  );
};

export default SimpleLayout;
