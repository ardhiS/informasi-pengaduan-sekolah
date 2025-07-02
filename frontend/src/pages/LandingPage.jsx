import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Shield,
  Users,
  ArrowRight,
  Moon,
  Sun,
  Globe,
} from 'lucide-react';
import AtThahirinLogo from '../components/AtThahirinLogo';

const LandingPage = () => {
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

  // Language translations
  const translations = {
    id: {
      welcome: 'Selamat Datang',
      subtitle: 'Sistem Informasi Pengaduan Online',
      schoolName: 'SMP PLUS AT-THAHIRIN',
      description:
        'Platform pengaduan online yang aman dan terpercaya untuk menyampaikan aspirasi dan keluhan Anda.',
      studentPortal: 'Portal Siswa',
      studentDesc: 'Akses khusus untuk siswa',
      teacherPortal: 'Portal Guru',
      teacherDesc: 'Akses khusus untuk guru',
      adminPortal: 'Portal Admin',
      adminDesc: 'Akses manajemen sistem',
      features: 'Fitur Utama',
      secureAnonymous: 'Aman & Anonim',
      secureDesc: 'Pengaduan Anda dijamin kerahasiaan dan keamanannya',
      easyAccess: 'Mudah Diakses',
      easyDesc: 'Interface yang sederhana dan mudah digunakan',
      quickResponse: 'Respon Cepat',
      quickDesc: 'Tim kami siap merespons pengaduan Anda dengan cepat',
      footer: '© 2025 SMP Plus At-Thahirin. Semua hak dilindungi.',
      getStarted: 'Mulai Sekarang',
    },
    en: {
      welcome: 'Welcome',
      subtitle: 'Online Complaint Information System',
      schoolName: 'SMP PLUS AT-THAHIRIN',
      description:
        'A safe and trusted online complaint platform to convey your aspirations and complaints.',
      studentPortal: 'Student Portal',
      studentDesc: 'Exclusive access for students',
      teacherPortal: 'Teacher Portal',
      teacherDesc: 'Exclusive access for teachers',
      adminPortal: 'Admin Portal',
      adminDesc: 'System management access',
      features: 'Main Features',
      secureAnonymous: 'Safe & Anonymous',
      secureDesc: 'Your complaints are guaranteed confidentiality and security',
      easyAccess: 'Easy Access',
      easyDesc: 'Simple and easy-to-use interface',
      quickResponse: 'Quick Response',
      quickDesc: 'Our team is ready to respond to your complaints quickly',
      footer: '© 2025 SMP Plus At-Thahirin. All rights reserved.',
      getStarted: 'Get Started',
    },
  };

  const t = translations[language];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
      {/* Clean Header */}
      <header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            {/* Logo */}
            <div className='flex items-center space-x-3'>
              <AtThahirinLogo className='h-10 w-10' />
              <div>
                <h1 className='text-lg font-bold text-gray-900 dark:text-white'>
                  {t.schoolName}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Theme & Language Toggle */}
            <div className='flex items-center space-x-4'>
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
      </header>

      {/* Hero Section - Clean & Focused */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='text-center space-y-8'>
          {/* Hero Title */}
          <div className='space-y-4'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white'>
              {t.welcome}
            </h1>
            <p className='text-xl sm:text-2xl text-cyan-600 dark:text-cyan-400 font-medium'>
              {t.subtitle}
            </p>
            <p className='text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
              {t.description}
            </p>
          </div>

          {/* Main Action Cards - Simplified */}
          <div className='grid md:grid-cols-3 gap-6 mt-16'>
            {/* Student Portal */}
            <Link
              to='/login-page'
              className='group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-500'
            >
              <div className='text-center space-y-4'>
                <div className='mx-auto w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/50 transition-colors'>
                  <Users className='h-8 w-8 text-cyan-600 dark:text-cyan-400' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  {t.studentPortal}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {t.studentDesc}
                </p>
                <div className='flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform'>
                  <span className='text-sm font-medium'>{t.getStarted}</span>
                  <ArrowRight className='h-4 w-4 ml-1' />
                </div>
              </div>
            </Link>

            {/* Teacher Portal */}
            <Link
              to='/login/guru'
              className='group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500'
            >
              <div className='text-center space-y-4'>
                <div className='mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors'>
                  <MessageSquare className='h-8 w-8 text-green-600 dark:text-green-400' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  {t.teacherPortal}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {t.teacherDesc}
                </p>
                <div className='flex items-center justify-center text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform'>
                  <span className='text-sm font-medium'>{t.getStarted}</span>
                  <ArrowRight className='h-4 w-4 ml-1' />
                </div>
              </div>
            </Link>

            {/* Admin Portal */}
            <Link
              to='/login/admin'
              className='group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
            >
              <div className='text-center space-y-4'>
                <div className='mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors'>
                  <Shield className='h-8 w-8 text-purple-600 dark:text-purple-400' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  {t.adminPortal}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {t.adminDesc}
                </p>
                <div className='flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform'>
                  <span className='text-sm font-medium'>{t.getStarted}</span>
                  <ArrowRight className='h-4 w-4 ml-1' />
                </div>
              </div>
            </Link>
          </div>

          {/* Features Section - Clean */}
          <div className='mt-24'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-12'>
              {t.features}
            </h2>
            <div className='grid md:grid-cols-3 gap-8'>
              <div className='text-center space-y-4'>
                <div className='mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
                  <Shield className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {t.secureAnonymous}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {t.secureDesc}
                </p>
              </div>

              <div className='text-center space-y-4'>
                <div className='mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center'>
                  <Users className='h-6 w-6 text-green-600 dark:text-green-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {t.easyAccess}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>{t.easyDesc}</p>
              </div>

              <div className='text-center space-y-4'>
                <div className='mx-auto w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center'>
                  <MessageSquare className='h-6 w-6 text-orange-600 dark:text-orange-400' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {t.quickResponse}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {t.quickDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center'>
            <p className='text-gray-600 dark:text-gray-400'>{t.footer}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
