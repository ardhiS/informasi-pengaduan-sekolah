import React, { useState } from 'react';
import { Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';

const ThemeLanguageToggle = () => {
  const { isDarkMode, language, toggleDarkMode, toggleLanguage } = useTheme();
  const { t } = useTranslation(language);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className='relative'>
      {/* Toggle Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className='flex items-center space-x-1 xs:space-x-2 p-1 xs:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors'
        aria-label='Theme and Language Settings'
      >
        <div className='flex items-center space-x-1'>
          {isDarkMode ? (
            <Moon className='h-3 w-3 xs:h-4 xs:w-4 text-gray-600 dark:text-gray-300' />
          ) : (
            <Sun className='h-3 w-3 xs:h-4 xs:w-4 text-gray-600 dark:text-gray-300' />
          )}
          <Globe className='h-3 w-3 xs:h-4 xs:w-4 text-gray-600 dark:text-gray-300' />
        </div>
        <ChevronDown
          className={`h-2 w-2 xs:h-3 xs:w-3 text-gray-400 transition-transform duration-200 ${
            showMenu ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className='fixed inset-0 z-40'
            onClick={() => setShowMenu(false)}
          />
          <div className='absolute right-0 mt-1 xs:mt-2 w-44 xs:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-slide-down'>
            <div className='py-1 xs:py-2'>
              {/* Theme Toggle */}
              <div className='px-3 py-1'>
                <span className='text-2xs xs:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  {t('theme', 'Theme')}
                </span>
              </div>
              <button
                onClick={() => {
                  toggleDarkMode();
                  setShowMenu(false);
                }}
                className='flex items-center w-full px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              >
                {isDarkMode ? (
                  <>
                    <Sun className='h-3 w-3 xs:h-4 xs:w-4 mr-2 xs:mr-3' />
                    {t('lightMode', 'Light Mode')}
                  </>
                ) : (
                  <>
                    <Moon className='h-3 w-3 xs:h-4 xs:w-4 mr-2 xs:mr-3' />
                    {t('darkMode', 'Dark Mode')}
                  </>
                )}
              </button>

              {/* Divider */}
              <div className='border-t border-gray-100 dark:border-gray-700 my-1 xs:my-2' />

              {/* Language Toggle */}
              <div className='px-3 py-1'>
                <span className='text-2xs xs:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                  {t('language', 'Language')}
                </span>
              </div>
              <button
                onClick={() => {
                  toggleLanguage();
                  setShowMenu(false);
                }}
                className='flex items-center w-full px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              >
                <Globe className='h-3 w-3 xs:h-4 xs:w-4 mr-2 xs:mr-3' />
                <div className='flex items-center justify-between w-full'>
                  <span>
                    {language === 'id'
                      ? t('english', 'English')
                      : t('indonesian', 'Indonesia')}
                  </span>
                  <span className='text-2xs xs:text-xs text-gray-400 dark:text-gray-500'>
                    {language === 'id' ? 'EN' : 'ID'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeLanguageToggle;
