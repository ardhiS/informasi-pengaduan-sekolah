import React, { useState, useEffect } from 'react';
import AtThahirinLogo from '../components/AtThahirinLogo';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    nisn: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference, default to false
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [language, setLanguage] = useState(() => {
    // Check localStorage for saved language preference, default to 'id'
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return saved || 'id';
    }
    return 'id';
  });
  const navigate = useNavigate();

  // Language translations
  const translations = {
    id: {
      studentPage: 'Halaman Siswa',
      light: 'Light',
      dark: 'Dark',
      indonesia: 'Indonesia',
      english: 'English',
      systemInfo: 'SISTEM INFORMASI',
      onlineComplaints: 'PENGADUAN ONLINE',
      nisnNip: 'NISN/NIP',
      nisnPlaceholder: 'Masukan NISN/NIP anda',
      password: 'Kata Sandi',
      passwordPlaceholder: 'Masukan kata sandi anda',
      rememberMe: 'Ingatkan saya',
      forgotPassword: 'Lupa kata sandi?',
      login: 'Masuk',
      loggingIn: 'Masuk...',
      backToHome: '← Kembali ke Beranda',
      notice: '📢 Pemberitahuan:',
      noticeText:
        'Semua komunikasi bersifat anonim dan dienkripsi. Pelajari lebih lanjut tentang',
      anonymity: 'anonimitas',
      footer: 'Sistem didukung oleh © 2025 AT - THAHIRIN',
      forgotPasswordAlert:
        'Fitur lupa kata sandi akan segera tersedia. Silakan hubungi admin sekolah.',
      loginError: 'Login gagal. Silakan periksa NISN/NIP dan kata sandi Anda.',
    },
    en: {
      studentPage: 'Student Page',
      light: 'Light',
      dark: 'Dark',
      indonesia: 'Indonesia',
      english: 'English',
      systemInfo: 'INFORMATION SYSTEM',
      onlineComplaints: 'ONLINE COMPLAINTS',
      nisnNip: 'NISN/NIP',
      nisnPlaceholder: 'Enter your NISN/NIP',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      login: 'Login',
      loggingIn: 'Logging in...',
      backToHome: '← Back to Home',
      notice: '📢 Notice:',
      noticeText:
        'All communications are anonymous and encrypted. Learn more about',
      anonymity: 'anonymity',
      footer: 'System powered by © 2025 AT - THAHIRIN',
      forgotPasswordAlert:
        'Forgot password feature will be available soon. Please contact school admin.',
      loginError: 'Login failed. Please check your NISN/NIP and password.',
    },
  };

  const t = translations[language];

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Apply language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate login process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, navigate to dashboard or appropriate page
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert(t.loginError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert(t.forgotPasswordAlert);
  };

  return (
    <div className='h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex justify-between items-center'>
            <div className='text-gray-700 dark:text-gray-200 text-base font-semibold'>
              {t.studentPage}
            </div>
            <div className='flex items-center space-x-8'>
              {/* Dark/Light Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className='flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                {isDarkMode ? (
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z' />
                  </svg>
                ) : (
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z' />
                  </svg>
                )}
                <span className='text-sm font-medium'>
                  {isDarkMode ? t.dark : t.light}
                </span>
              </button>

              {/* Language Selector */}
              <button
                onClick={toggleLanguage}
                className='flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <div className='w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-sm'>
                  <span className='text-white text-sm font-bold'>
                    {language === 'id' ? '🇮🇩' : '🇺🇸'}
                  </span>
                </div>
                <span className='text-sm font-medium'>
                  {language === 'id' ? t.indonesia : t.english}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-sm w-full space-y-6'>
          {/* Login Card */}
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300'>
            {/* Logo and Title */}
            <div className='text-center mb-8'>
              <div className='flex justify-center mb-6'>
                <AtThahirinLogo className='w-20 h-20' />
              </div>
              <h1 className='text-2xl font-bold text-cyan-500 dark:text-cyan-400 mb-2 tracking-wide'>
                {t.systemInfo}
              </h1>
              <h2 className='text-xl font-bold text-teal-600 dark:text-teal-400 tracking-wide'>
                {t.onlineComplaints}
              </h2>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* NISN/NIP Field */}
              <div>
                <label
                  htmlFor='nisn'
                  className='flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  <svg
                    className='w-4 h-4 mr-2 text-gray-500 dark:text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                  {t.nisnNip}
                </label>
                <input
                  id='nisn'
                  name='nisn'
                  type='text'
                  required
                  value={formData.nisn}
                  onChange={handleChange}
                  className='w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm transition-all'
                  placeholder={t.nisnPlaceholder}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor='password'
                  className='flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
                >
                  <svg
                    className='w-4 h-4 mr-2 text-gray-500 dark:text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                    />
                  </svg>
                  {t.password}
                </label>
                <div className='relative'>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className='w-full px-3 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm transition-all'
                    placeholder={t.passwordPlaceholder}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300'
                  >
                    {showPassword ? (
                      <svg
                        className='w-5 h-5 text-gray-400 dark:text-gray-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                        />
                      </svg>
                    ) : (
                      <svg
                        className='w-5 h-5 text-gray-400 dark:text-gray-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                  >
                    {t.rememberMe}
                  </label>
                </div>

                <button
                  type='button'
                  onClick={handleForgotPassword}
                  className='text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-medium'
                >
                  {t.forgotPassword}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
              >
                {isLoading ? (
                  <div className='flex items-center'>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    {t.loggingIn}
                  </div>
                ) : (
                  t.login
                )}
              </button>
            </form>

            {/* Navigation Links */}
            <div className='mt-6 text-center'>
              <Link
                to='/welcome'
                className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium'
              >
                {t.backToHome}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Notice - Full Width */}
      <div className='w-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-green-200 dark:border-green-800 py-6 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='flex items-start justify-center text-center'>
            <div className='flex-shrink-0 mr-4'>
              <div className='w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center'>
                <svg
                  className='h-5 w-5 text-green-600 dark:text-green-300'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
            <div className='flex-1'>
              <p className='text-base leading-relaxed text-green-800 dark:text-green-200 font-medium'>
                <span className='font-bold text-green-900 dark:text-green-100'>
                  {t.notice}
                </span>
                <br />
                <span className='text-green-700 dark:text-green-300 text-sm leading-relaxed'>
                  {t.noticeText}{' '}
                  <a
                    href='#'
                    className='text-green-600 dark:text-green-400 underline hover:text-green-800 dark:hover:text-green-200 font-semibold transition-colors duration-200'
                  >
                    {t.anonymity}
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='bg-gray-100 dark:bg-gray-800 py-4 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
