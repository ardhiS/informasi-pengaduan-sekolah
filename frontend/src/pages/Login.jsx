import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowLeft,
  Shield,
  GraduationCap,
  User,
} from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? false : true;

  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    role: 'siswa',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, isAuthenticated } = useAuth();

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
      role: 'siswa',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let result;
    if (isLoginMode) {
      result = await login(formData.username, formData.password);
    } else {
      result = await register({
        username: formData.username,
        password: formData.password,
        fullname: formData.fullname,
        role: formData.role,
      });

      if (result.success) {
        // Auto login after successful registration
        result = await login(formData.username, formData.password);
      }
    }

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'guru':
        return GraduationCap;
      case 'siswa':
        return User;
      default:
        return User;
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-6 xs:py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-6 xs:space-y-8'>
        {/* Back to Welcome Button */}
        <div className='text-center'>
          <a
            href='/'
            className='inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors touch-manipulation'
          >
            <ArrowLeft className='h-4 w-4 mr-1' />
            Back to Welcome
          </a>
        </div>

        {/* Header */}
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 xs:h-16 xs:w-16 flex items-center justify-center rounded-full bg-primary-100 mb-4 xs:mb-6'>
            {isLoginMode ? (
              <LogIn className='h-6 w-6 xs:h-8 xs:w-8 text-primary-600' />
            ) : (
              <UserPlus className='h-6 w-6 xs:h-8 xs:w-8 text-primary-600' />
            )}
          </div>
          <h2 className='text-mobile-2xl font-extrabold text-gray-900'>
            {isLoginMode ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className='mt-2 text-mobile-sm text-gray-600'>
            School Management Dashboard
          </p>
        </div>

        {/* Main Card */}
        <div className='bg-white rounded-xl shadow-lg p-4 xs:p-6 lg:p-8 space-y-6'>
          {/* Toggle Buttons */}
          <div className='flex bg-gray-100 rounded-lg p-1'>
            <button
              type='button'
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 py-2.5 xs:py-3 px-4 rounded-md text-mobile-sm font-medium transition-all duration-200 touch-manipulation ${
                isLoginMode
                  ? 'bg-white text-primary-600 shadow-sm transform scale-105'
                  : 'text-gray-500 hover:text-gray-700 active:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              type='button'
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 py-2.5 xs:py-3 px-4 rounded-md text-mobile-sm font-medium transition-all duration-200 touch-manipulation ${
                !isLoginMode
                  ? 'bg-white text-primary-600 shadow-sm transform scale-105'
                  : 'text-gray-500 hover:text-gray-700 active:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          <form className='space-y-4 xs:space-y-6' onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <div className='alert alert-error animate-slide-down'>
                <div className='text-mobile-sm'>{error}</div>
              </div>
            )}

            <div className='space-y-4 xs:space-y-5'>
              {/* Full Name (only for register) */}
              {!isLoginMode && (
                <div className='animate-slide-down'>
                  <label htmlFor='fullname' className='label'>
                    Full Name
                  </label>
                  <input
                    id='fullname'
                    name='fullname'
                    type='text'
                    required={!isLoginMode}
                    className='input-field'
                    placeholder='Enter your full name'
                    value={formData.fullname}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Username */}
              <div>
                <label htmlFor='username' className='label'>
                  Username
                </label>
                <input
                  id='username'
                  name='username'
                  type='text'
                  required
                  className='input-field'
                  placeholder='Enter your username'
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor='password' className='label'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    required
                    className='input-field pr-12'
                    placeholder='Enter your password'
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center touch-manipulation'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                    )}
                  </button>
                </div>
              </div>

              {/* Role (only for register) */}
              {!isLoginMode && (
                <div className='animate-slide-down'>
                  <label htmlFor='role' className='label'>
                    Role
                  </label>
                  <div className='relative'>
                    <select
                      id='role'
                      name='role'
                      required={!isLoginMode}
                      className='select-field appearance-none'
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value='siswa'>Siswa (Student)</option>
                      <option value='guru'>Guru (Teacher)</option>
                      <option value='admin'>Admin</option>
                    </select>
                    <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none'>
                      {React.createElement(getRoleIcon(formData.role), {
                        className: 'h-5 w-5 text-gray-400',
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className='pt-2'>
              <button
                type='submit'
                disabled={loading}
                className='btn-primary w-full flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform active:scale-95'
              >
                {loading ? (
                  <div className='spinner'></div>
                ) : (
                  <>
                    {isLoginMode ? (
                      <LogIn className='h-4 w-4 xs:h-5 xs:w-5' />
                    ) : (
                      <UserPlus className='h-4 w-4 xs:h-5 xs:w-5' />
                    )}
                    <span>{isLoginMode ? 'Sign in' : 'Create Account'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Mode Switch Text */}
            <div className='text-center pt-2'>
              <p className='text-mobile-sm text-gray-600'>
                {isLoginMode
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <button
                  type='button'
                  onClick={toggleMode}
                  className='font-medium text-primary-600 hover:text-primary-500 touch-manipulation'
                >
                  {isLoginMode ? 'Register here' : 'Login here'}
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className='bg-white rounded-lg p-4 xs:p-6 shadow-sm'>
          {isLoginMode ? (
            <div className='text-center'>
              <h3 className='text-mobile-base font-medium text-gray-900 mb-3'>
                Test Credentials
              </h3>
              <div className='space-y-2 text-mobile-sm text-gray-600'>
                <div className='bg-gray-50 rounded-lg p-3'>
                  <p>
                    <strong>Admin:</strong> admin01 / admin123
                  </p>
                  <p>
                    <strong>Teacher:</strong> teacher02 / teacher123
                  </p>
                  <p>
                    <strong>Student:</strong> student01 / student123
                  </p>
                </div>
                <p className='text-2xs text-gray-500 mt-2'>
                  Use these credentials to test different user roles
                </p>
              </div>
            </div>
          ) : (
            <div className='text-center'>
              <h3 className='text-mobile-base font-medium text-gray-900 mb-3'>
                Registration Info
              </h3>
              <div className='space-y-2 text-mobile-sm text-gray-600'>
                <p>Create your account to access the dashboard</p>
                <div className='flex flex-col xs:flex-row gap-2 xs:gap-4 mt-3 text-2xs'>
                  <div className='flex items-center space-x-1'>
                    <User className='h-3 w-3' />
                    <span>Siswa</span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <GraduationCap className='h-3 w-3' />
                    <span>Guru</span>
                  </div>
                  <div className='flex items-center space-x-1'>
                    <Shield className='h-3 w-3' />
                    <span>Admin</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
