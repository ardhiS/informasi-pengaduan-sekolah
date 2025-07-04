import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AtThahirinLogo from '../components/AtThahirinLogo';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('id');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect role from URL path
  const getRole = () => {
    const path = location.pathname;
    if (path.includes('/siswa')) return 'siswa';
    if (path.includes('/guru')) return 'guru';
    if (path.includes('/admin')) return 'admin';
    return 'siswa'; // Default
  };

  const role = getRole();

  // Translations
  const translations = {
    id: {
      title: 'Portal Login',
      welcome: {
        siswa: 'Selamat datang, Siswa!',
        guru: 'Selamat datang, Guru!',
        admin: 'Selamat datang, Administrator!',
      },
      portal: {
        siswa: 'Portal Siswa',
        guru: 'Portal Guru',
        admin: 'Portal Administrator',
      },
      username: 'Nama Pengguna',
      password: 'Kata Sandi',
      login: 'Masuk',
      backHome: 'Kembali ke Beranda',
      loggingIn: 'Sedang masuk...',
    },
    en: {
      title: 'Login Portal',
      welcome: {
        siswa: 'Welcome, Student!',
        guru: 'Welcome, Teacher!',
        admin: 'Welcome, Administrator!',
      },
      portal: {
        siswa: 'Student Portal',
        guru: 'Teacher Portal',
        admin: 'Administrator Portal',
      },
      username: 'Username',
      password: 'Password',
      login: 'Login',
      backHome: 'Back to Home',
      loggingIn: 'Logging in...',
    },
  };

  const t = translations[language];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError(
        language === 'id' ? 'Harap isi semua field' : 'Please fill all fields'
      );
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        // Navigate to dashboard for unified experience
        navigate('/dashboard');
      } else {
        setError(
          language === 'id'
            ? 'Login gagal. Periksa kredensial Anda.'
            : 'Login failed. Please check your credentials.'
        );
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        language === 'id'
          ? 'Terjadi kesalahan saat login'
          : 'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  // Role-specific styling
  const getRoleColors = () => {
    switch (role) {
      case 'siswa':
        return {
          primary: 'bg-blue-600 hover:bg-blue-700',
          accent: 'text-blue-600',
          border: 'border-blue-200',
        };
      case 'guru':
        return {
          primary: 'bg-green-600 hover:bg-green-700',
          accent: 'text-green-600',
          border: 'border-green-200',
        };
      case 'admin':
        return {
          primary: 'bg-purple-600 hover:bg-purple-700',
          accent: 'text-purple-600',
          border: 'border-purple-200',
        };
      default:
        return {
          primary: 'bg-blue-600 hover:bg-blue-700',
          accent: 'text-blue-600',
          border: 'border-blue-200',
        };
    }
  };

  const colors = getRoleColors();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      } transition-colors duration-300 flex flex-col`}
    >
      {/* Header */}
      <div
        className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex justify-between items-center'>
            <div
              className={`${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              } text-base font-semibold`}
            >
              {t.portal[role]}
            </div>
            <div className='flex items-center space-x-4'>
              {/* Back to Home */}
              <Link
                to='/'
                className={`flex items-center space-x-2 ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-gray-100'
                    : 'text-gray-600 hover:text-gray-800'
                } transition-colors duration-200 px-3 py-2 rounded-lg ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 19l-7-7m0 0l7-7m-7 7h18'
                  />
                </svg>
                <span className='text-sm font-medium'>{t.backHome}</span>
              </Link>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                {language === 'id' ? 'EN' : 'ID'}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                {isDarkMode ? (
                  <svg
                    className='w-4 h-4 text-yellow-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-4 h-4 text-gray-700'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-lg w-full space-y-8'>
          {/* Logo and Title */}
          <div className='text-center'>
            <div className='flex justify-center mb-6'>
              <AtThahirinLogo className='w-20 h-20' />
            </div>
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t.portal[role]}
            </h2>
            <p
              className={`mt-2 text-lg ${colors.accent} ${
                isDarkMode ? 'opacity-90' : ''
              }`}
            >
              {t.welcome[role]}
            </p>
          </div>

          {/* Login Form */}
          <div
            className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } py-8 px-6 shadow-xl rounded-lg ${colors.border} border`}
          >
            <form onSubmit={handleLogin} className='space-y-6'>
              {error && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
                  <span className='block sm:inline'>{error}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor='username'
                  className={`block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-2`}
                >
                  {t.username}
                </label>
                <input
                  id='username'
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                  } transition-colors`}
                  placeholder={t.username}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className={`block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-2`}
                >
                  {t.password}
                </label>
                <input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                  } transition-colors`}
                  placeholder={t.password}
                  disabled={isLoading}
                />
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${colors.primary} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                {isLoading ? t.loggingIn : t.login}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className='text-center'>
            <p
              className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              © 2025 SMA At-Thahirin. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
