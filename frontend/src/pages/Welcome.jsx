import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  BookOpen,
  Shield,
  ArrowRight,
  LogIn,
  UserPlus,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import AtThahirinLogo from '../components/AtThahirinLogo';

const Welcome = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 pb-safe'>
      {/* Mobile-optimized Header */}
      <header className='bg-white shadow-sm sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col xs:flex-row xs:justify-between xs:items-center gap-4 xs:gap-0 py-4 sm:py-6'>
            {/* Logo section */}
            <div className='flex items-center justify-center xs:justify-start space-x-2 sm:space-x-3'>
              <AtThahirinLogo className='h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0' />
              <div className='text-center xs:text-left'>
                <h1 className='text-sm sm:text-lg font-bold text-green-800 leading-tight'>
                  SMP PLUS AT-THAHIRIN
                </h1>
                <p className='text-xs sm:text-sm text-green-600 leading-tight'>
                  Website Pengaduan Sekolah
                </p>
              </div>
            </div>

            {/* Mobile-friendly buttons */}
            <div className='flex flex-col xs:flex-row gap-2 xs:gap-4'>
              <Link
                to='/login-page'
                className='inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200 transition-colors'
              >
                <LogIn className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2' />
                Login Siswa
              </Link>
              <Link
                to='/login?mode=login'
                className='inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-secondary-600 bg-secondary-100 hover:bg-secondary-200 transition-colors'
              >
                <LogIn className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2' />
                Login Admin
              </Link>
              <Link
                to='/login?mode=register'
                className='inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors'
              >
                <UserPlus className='h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2' />
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with mobile optimization */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16'>
        <div className='text-center space-y-6 sm:space-y-8'>
          {/* Mobile-responsive heading */}
          <h1 className='text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight'>
            Welcome to
            <span className='block text-primary-600 mt-1'>
              School Management
            </span>
            <span className='block text-2xl xs:text-3xl sm:text-4xl md:text-5xl mt-1'>
              Dashboard
            </span>
          </h1>

          {/* Mobile-optimized description */}
          <p className='text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2'>
            A comprehensive platform for managing school operations, classes,
            subjects, and user collaboration. Built with modern technology for
            seamless experience.
          </p>

          {/* Mobile-first CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4'>
            <Link
              to='/halaman-siswa'
              className='w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-base sm:text-lg font-medium rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 transition-colors shadow-lg hover:shadow-xl'
            >
              <LogIn className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
              Halaman Siswa
              <ArrowRight className='h-4 w-4 sm:h-5 sm:w-5 ml-2' />
            </Link>
            <Link
              to='/halaman-guru'
              className='w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-transparent text-base sm:text-lg font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl'
            >
              <LogIn className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
              Halaman Guru
              <ArrowRight className='h-4 w-4 sm:h-5 sm:w-5 ml-2' />
            </Link>
            <Link
              to='/login?mode=login'
              className='w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary-600 text-base sm:text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl'
            >
              <LogIn className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
              Admin Dashboard
              <ArrowRight className='h-4 w-4 sm:h-5 sm:w-5 ml-2' />
            </Link>
            <Link
              to='/login?mode=register'
              className='w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary-600 text-base sm:text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl'
            >
              <UserPlus className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
              Create New Account
            </Link>
          </div>
        </div>

        {/* Mobile-responsive Features Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mt-12 sm:mt-16'>
          <div className='bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4'>
              <Users className='h-5 w-5 sm:h-6 sm:w-6 text-blue-600' />
            </div>
            <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-2'>
              User Management
            </h3>
            <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
              Manage teachers, students, and administrators with role-based
              access control.
            </p>
          </div>

          <div className='bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4'>
              <GraduationCap className='h-5 w-5 sm:h-6 sm:w-6 text-green-600' />
            </div>
            <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-2'>
              Class Management
            </h3>
            <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
              Create, edit, and organize classes with collaboration features.
            </p>
          </div>

          <div className='bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4'>
              <BookOpen className='h-5 w-5 sm:h-6 sm:w-6 text-purple-600' />
            </div>
            <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-2'>
              Subject Management
            </h3>
            <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
              Organize and manage academic subjects and curriculum.
            </p>
          </div>

          <div className='bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow'>
            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4'>
              <Shield className='h-5 w-5 sm:h-6 sm:w-6 text-orange-600' />
            </div>
            <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-2'>
              Secure Access
            </h3>
            <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
              JWT authentication with automatic token refresh and secure data
              handling.
            </p>
          </div>
        </div>

        {/* Mobile-optimized API Testing Info */}
        <div className='bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-12 sm:mt-16'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center'>
            Built for API Testing & Development
          </h2>

          {/* Mobile-friendly stats grid */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl sm:text-3xl font-bold text-primary-600 mb-1 sm:mb-2'>
                21+
              </div>
              <div className='text-sm sm:text-base text-gray-600'>
                API Endpoints
              </div>
            </div>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2'>
                100%
              </div>
              <div className='text-sm sm:text-base text-gray-600'>
                Test Coverage
              </div>
            </div>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2'>
                3
              </div>
              <div className='text-sm sm:text-base text-gray-600'>
                User Roles
              </div>
            </div>
          </div>

          {/* Mobile-friendly tech stack */}
          <div className='mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4'>
            <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
              Perfect for testing backend APIs with a beautiful, responsive
              frontend interface.
            </p>

            {/* Mobile-stacked tech tags */}
            <div className='flex flex-wrap justify-center items-center gap-2 text-xs sm:text-sm text-gray-500'>
              <span className='bg-gray-100 px-2 py-1 rounded'>
                React + Vite
              </span>
              <span className='hidden xs:inline'>•</span>
              <span className='bg-gray-100 px-2 py-1 rounded'>
                Tailwind CSS
              </span>
              <span className='hidden xs:inline'>•</span>
              <span className='bg-gray-100 px-2 py-1 rounded'>JWT Auth</span>
              <span className='hidden xs:inline'>•</span>
              <span className='bg-gray-100 px-2 py-1 rounded'>
                Hapi.js Backend
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile-friendly Footer */}
      <footer className='bg-white border-t border-gray-200 mt-12 sm:mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
          <div className='text-center text-xs sm:text-sm text-gray-600 leading-relaxed'>
            <p>
              &copy; 2025 School Management System. Built for educational and
              testing purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
