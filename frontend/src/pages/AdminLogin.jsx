import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowLeft,
  Shield,
  Moon,
  Sun,
  Globe,
} from 'lucide-react';
import AtThahirinLogo from '../components/AtThahirinLogo';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'register' ? false : true;

  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    role: 'admin',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dark mode and language state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return saved || 'id';
    }
    return 'id';
  });

  const { login, register, isAuthenticated } = useAuth();

  // Language translations
  const translations = {
    id: {
      adminPortal: 'Portal Administrator',
      welcome: 'Selamat datang, Administrator!',
      loginTitle: 'Masuk Sistem',
      registerTitle: 'Daftar Akun Baru',
      username: 'Username',
      password: 'Kata Sandi',
      fullname: 'Nama Lengkap',
      role: 'Role',
      rememberMe: 'Ingat saya',
      login: 'Masuk',
      register: 'Daftar',
      switching: 'Memproses...',
      noAccount: 'Belum punya akun?',
      hasAccount: 'Sudah punya akun?',
      createAccount: 'Buat akun',
      loginHere: 'Masuk disini',
      backToHome: '← Kembali ke Beranda',
      systemInfo: 'SISTEM INFORMASI',
      onlineComplaints: 'PENGADUAN ONLINE',
      footer: 'Sistem didukung oleh © 2025 AT - THAHIRIN',
    },
    en: {
      adminPortal: 'Administrator Portal',
      welcome: 'Welcome, Administrator!',
      loginTitle: 'Login to System',
      registerTitle: 'Create New Account',
      username: 'Username',
      password: 'Password',
      fullname: 'Full Name',
      role: 'Role',
      rememberMe: 'Remember me',
      login: 'Login',
      register: 'Register',
      switching: 'Processing...',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      createAccount: 'Create account',
      loginHere: 'Login here',
      backToHome: '← Back to Home',
      systemInfo: 'INFORMATION SYSTEM',
      onlineComplaints: 'ONLINE COMPLAINTS',
      footer: 'System powered by © 2025 AT - THAHIRIN',
    },
  };

  const t = translations[language];

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Apply language
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      username: '',
      password: '',
      fullname: '',
      role: 'admin',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        // Panggil login dengan parameter terpisah, bukan object
        const success = await login(
          formData.username,
          formData.password,
          'admin'
        );
        if (success) {
          // Navigate setelah login berhasil
          navigate('/dashboard');
        } else {
          setError('Login gagal. Periksa kredensial Anda.');
        }
      } else {
        await register({
          username: formData.username,
          password: formData.password,
          fullname: formData.fullname,
          role: formData.role,
        });
      }
    } catch (err) {
      setError(
        err.message ||
          `${isLoginMode ? 'Login' : 'Registrasi'} gagal. Silakan coba lagi.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col'>
      {/* Header */}
      <div className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex justify-between items-center'>
            <div className='text-gray-700 dark:text-gray-200 text-base font-semibold'>
              {t.adminPortal}
            </div>
            <div className='flex items-center space-x-4'>
              {/* Back to Home */}
              <Link
                to='/'
                className='flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'
              >
                <ArrowLeft className='w-4 h-4' />
                <span className='text-sm font-medium'>{t.backToHome}</span>
              </Link>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className='p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
              >
                {isDarkMode ? (
                  <Sun className='h-5 w-5 text-yellow-500' />
                ) : (
                  <Moon className='h-5 w-5 text-gray-600' />
                )}
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className='flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
              >
                <Globe className='h-4 w-4 text-gray-600 dark:text-gray-400' />
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {language === 'id' ? 'ID' : 'EN'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-6'>
          {/* Login Card */}
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300'>
            {/* Logo and Title */}
            <div className='text-center mb-8'>
              <div className='flex justify-center mb-6'>
                <AtThahirinLogo className='w-20 h-20' />
              </div>
              <h1 className='text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2 tracking-wide'>
                {t.systemInfo}
              </h1>
              <h2 className='text-xl font-bold text-purple-500 dark:text-purple-300 tracking-wide'>
                {t.onlineComplaints}
              </h2>
              <div className='mt-4 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
                <p className='text-sm font-medium text-purple-700 dark:text-purple-300'>
                  {t.welcome}
                </p>
              </div>
            </div>

            {/* Form Header */}
            <div className='text-center mb-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                {isLoginMode ? t.loginTitle : t.registerTitle}
              </h3>
            </div>

            {/* Error Message */}
            {error && (
              <div className='mb-4 p-4 text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Username */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t.username}
                </label>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className='w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all'
                  placeholder='Masukan username'
                />
              </div>

              {/* Full Name (Register only) */}
              {!isLoginMode && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t.fullname}
                  </label>
                  <input
                    type='text'
                    name='fullname'
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                    className='w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all'
                    placeholder='Masukan nama lengkap'
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t.password}
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className='w-full px-3 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all'
                    placeholder='Masukan kata sandi'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-400 dark:text-gray-500' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400 dark:text-gray-500' />
                    )}
                  </button>
                </div>
              </div>

              {/* Role (Register only) */}
              {!isLoginMode && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    {t.role}
                  </label>
                  <select
                    name='role'
                    value={formData.role}
                    onChange={handleChange}
                    className='w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all'
                  >
                    <option value='admin'>Administrator</option>
                    <option value='guru'>Guru</option>
                  </select>
                </div>
              )}

              {/* Remember Me */}
              {isLoginMode && (
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-2 block text-sm text-gray-700 dark:text-gray-300'
                  >
                    {t.rememberMe}
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
              >
                {loading ? (
                  <div className='flex items-center'>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-4 w-4 text-white'
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
                    {t.switching}
                  </div>
                ) : (
                  <>
                    {isLoginMode ? (
                      <>
                        <LogIn className='h-4 w-4 mr-2' />
                        {t.login}
                      </>
                    ) : (
                      <>
                        <UserPlus className='h-4 w-4 mr-2' />
                        {t.register}
                      </>
                    )}
                  </>
                )}
              </button>
            </form>

            {/* Mode Toggle */}
            <div className='mt-6 text-center'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {isLoginMode ? t.noAccount : t.hasAccount}{' '}
              </span>
              <button
                type='button'
                onClick={toggleMode}
                className='text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-medium transition-colors'
              >
                {isLoginMode ? t.createAccount : t.loginHere}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
