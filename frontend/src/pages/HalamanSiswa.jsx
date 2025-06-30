import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AtThahirinLogo from '../components/AtThahirinLogo';

const HalamanSiswa = () => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('Indonesia');
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { nisn, password, rememberMe });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Header */}
      <header className='flex justify-between items-center p-4'>
        <div className='text-gray-500'>Halaman Siswa</div>
        <div className='flex items-center space-x-4'>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className='flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
          >
            {theme === 'light' ? (
              <>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Light</span>
              </>
            ) : (
              <>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
                </svg>
                <span>Dark</span>
              </>
            )}
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>

          {/* Language Toggle */}
          <button className='flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z'
                clipRule='evenodd'
              />
            </svg>
            <span>{language}</span>
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className='flex flex-col items-center justify-center px-4 py-8'>
        {/* Logo */}
        <div className='mb-8'>
          <AtThahirinLogo className='w-32 h-32' />
        </div>

        {/* Title */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold mb-2'>
            <span className='text-cyan-500'>SISTEM INFORMASI</span>
          </h1>
          <h1 className='text-4xl font-bold text-primary-600'>
            PENGADUAN ONLINE
          </h1>
        </div>

        {/* Login Form Container */}
        <div
          className={`w-full max-w-md p-8 rounded-2xl shadow-lg ${
            theme === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
          }`}
        >
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* NISN/NIP Field */}
            <div>
              <label className='flex items-center text-sm font-medium mb-2'>
                <svg
                  className='w-4 h-4 mr-2'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                    clipRule='evenodd'
                  />
                </svg>
                NISN/NIP
              </label>
              <input
                type='text'
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder='Masukan NISN/NIP anda'
                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
                } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-20`}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className='flex items-center text-sm font-medium mb-2'>
                <svg
                  className='w-4 h-4 mr-2'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Kata Sandi
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Masukan kata sandi anda'
                  className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-20`}
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                        clipRule='evenodd'
                      />
                      <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
                    </svg>
                  ) : (
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                      <path
                        fillRule='evenodd'
                        d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500'
                />
                <span className='ml-2 text-sm'>Ingatkan saya</span>
              </label>
              <Link
                to='/forgot-password'
                className='text-sm text-cyan-500 hover:text-cyan-600 transition-colors'
              >
                Lupa kata sandi?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 active:scale-95'
            >
              Masuk
            </button>
          </form>
        </div>

        {/* Footer Notice */}
        <div
          className={`mt-8 p-4 rounded-lg text-center text-sm ${
            theme === 'dark'
              ? 'bg-green-900/20 text-green-300 border border-green-800'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          <p className='mb-1'>
            ✓ Semua komunikasi bersifat anonim dan dienkripsi. Pelajari lebih
            lanjut tentang anonimitas
          </p>
        </div>

        {/* Copyright Footer */}
        <div className='mt-8 text-center text-sm text-gray-500'>
          <p>Sistem didukung oleh © 2025 AT - THAHIRIN</p>
        </div>

        {/* Back to Home Link */}
        <div className='mt-4'>
          <Link
            to='/'
            className='text-cyan-500 hover:text-cyan-600 text-sm underline transition-colors'
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HalamanSiswa;
