import React, { useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../utils/translations';
import { getRoleBadgeColor } from '../utils/roleColors';

const Profile = () => {
  const { user } = useAuth();
  const { isDarkMode, language } = useTheme();
  const { t } = useTranslation(language);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    username: user?.username || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Here you would call the API to update user profile
      // await usersService.update(user.id, formData)
      setSuccess(t('profile.profileUpdatedSuccess'));
      setIsEditing(false);
    } catch (err) {
      setError(t('profile.failedToUpdateProfile'));
    }
  };

  const handleCancel = () => {
    setFormData({
      fullname: user?.fullname || '',
      email: user?.email || '',
      username: user?.username || '',
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className='space-y-4 sm:space-y-6 pb-safe'>
      {/* Mobile-friendly header */}
      <div className='px-2 sm:px-0'>
        <h1
          className={`text-mobile sm:text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {t('profile.title')}
        </h1>
      </div>

      {/* Alerts with mobile optimization */}
      {error && (
        <div className='alert-error mx-2 sm:mx-0'>
          <div className='flex items-start'>
            <AlertCircle className='h-4 w-4 sm:h-5 sm:w-5 text-red-400 mt-0.5 flex-shrink-0' />
            <div className='ml-2 sm:ml-3 text-xs sm:text-sm text-red-800 break-words'>
              {error}
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className='alert-success mx-2 sm:mx-0'>
          <div className='flex items-start'>
            <CheckCircle className='h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 flex-shrink-0' />
            <div className='ml-2 sm:ml-3 text-xs sm:text-sm text-green-800 break-words'>
              {success}
            </div>
          </div>
        </div>
      )}

      {/* Mobile-first responsive grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
        {/* Profile Card - Full width on mobile */}
        <div className='lg:col-span-1 order-1 lg:order-1'>
          <div className='card mx-2 sm:mx-0 p-4 sm:p-6'>
            <div className='flex flex-col items-center text-center'>
              {/* Avatar with mobile scaling */}
              <div className='w-20 h-20 sm:w-24 sm:h-24 bg-primary-100 rounded-full flex items-center justify-center mb-3 sm:mb-4'>
                <User className='w-10 h-10 sm:w-12 sm:h-12 text-primary-600' />
              </div>

              {/* User info with text wrapping */}
              <h3
                className={`text-base sm:text-lg font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                } mb-1 break-words max-w-full`}
              >
                {user?.fullname || t('profile.userName')}
              </h3>
              <p
                className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } mb-2 break-all`}
              >
                @{user?.username || 'username'}
              </p>

              {/* Role badge */}
              <span
                className={`inline-flex items-center px-2 py-1 sm:px-2.5 sm:py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                  user?.role
                )}`}
              >
                <Shield className='h-3 w-3 mr-1 flex-shrink-0' />
                <span className='capitalize'>
                  {t(`roles.${user?.role}`) || user?.role || 'user'}
                </span>
              </span>
            </div>

            {/* Contact info with mobile layout */}
            <div className='mt-4 sm:mt-6 space-y-2 sm:space-y-3'>
              <div
                className={`flex items-start text-xs sm:text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <Mail
                  className={`h-4 w-4 mr-2 sm:mr-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  } mt-0.5 flex-shrink-0`}
                />
                <span className='break-all'>
                  {user?.email || t('profile.noEmail')}
                </span>
              </div>
              <div
                className={`flex items-start text-xs sm:text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <Calendar
                  className={`h-4 w-4 mr-2 sm:mr-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-400'
                  } mt-0.5 flex-shrink-0`}
                />
                <span>
                  {t('profile.memberSince')}{' '}
                  {new Date(
                    user?.created_at || Date.now()
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form - Full width on mobile */}
        <div className='lg:col-span-2 order-2 lg:order-2'>
          <div className='card mx-2 sm:mx-0 p-4 sm:p-6'>
            {/* Header with mobile-friendly edit button */}
            <div className='flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0 mb-4 sm:mb-6'>
              <h3
                className={`text-base sm:text-lg font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t('profile.profileInformation')}
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className='btn-primary w-full xs:w-auto justify-center'
                >
                  <Edit className='h-4 w-4 mr-2' />
                  <span className='text-xs sm:text-sm'>
                    {t('profile.editProfile')}
                  </span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
              {/* Mobile-first form grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                <div>
                  <label className='label text-xs sm:text-sm'>
                    {t('profile.fullName')}
                  </label>
                  <input
                    type='text'
                    className='input-field text-sm'
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder={t('profile.enterFullName')}
                  />
                </div>

                <div>
                  <label className='label text-xs sm:text-sm'>
                    {t('profile.username')}
                  </label>
                  <input
                    type='text'
                    className='input-field text-sm'
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder={t('profile.enterUsername')}
                  />
                </div>

                <div className='sm:col-span-2'>
                  <label className='label text-xs sm:text-sm'>
                    {t('profile.email')}
                  </label>
                  <input
                    type='email'
                    className='input-field text-sm'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder={t('profile.enterEmail')}
                  />
                </div>
              </div>

              {/* Mobile-friendly action buttons */}
              {isEditing && (
                <div className='flex flex-col xs:flex-row gap-3 xs:gap-3 xs:justify-end mt-6'>
                  <button
                    type='button'
                    onClick={handleCancel}
                    className='btn-secondary w-full xs:w-auto justify-center order-2 xs:order-1'
                  >
                    <X className='h-4 w-4 mr-2' />
                    <span className='text-xs sm:text-sm'>
                      {t('common.cancel')}
                    </span>
                  </button>
                  <button
                    type='submit'
                    className='btn-primary w-full xs:w-auto justify-center order-1 xs:order-2'
                  >
                    <Save className='h-4 w-4 mr-2' />
                    <span className='text-xs sm:text-sm'>
                      {t('common.saveChanges')}
                    </span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* API Testing Section with mobile optimization */}
      <div className='card mx-2 sm:mx-0 p-4 sm:p-6'>
        <h3
          className={`text-base sm:text-lg font-medium ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          } mb-3 sm:mb-4`}
        >
          {t('profile.apiTestingInformation')}
        </h3>

        {/* Mobile-stacked grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
          <div className='space-y-2'>
            <h4
              className={`text-xs sm:text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              } mb-2`}
            >
              {t('profile.availableEndpoints')}
            </h4>
            <div
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              } rounded-lg p-3 overflow-hidden`}
            >
              <ul
                className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                } space-y-1`}
              >
                <li className='break-all'>
                  •{' '}
                  <code
                    className={`${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    GET /users
                  </code>{' '}
                  - {t('profile.listAllUsers')}
                </li>
                <li className='break-all'>
                  •{' '}
                  <code
                    className={`${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    GET /users/{'{id}'}
                  </code>{' '}
                  -{t('profile.getUserDetails')}
                </li>
                <li className='break-all'>
                  •{' '}
                  <code
                    className={`${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    PUT /users/{'{id}'}
                  </code>{' '}
                  -{t('profile.updateUser')}
                </li>
                <li className='break-all'>
                  •{' '}
                  <code
                    className={`${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    POST /authentications
                  </code>{' '}
                  - {t('auth.login')}
                </li>
                <li className='break-all'>
                  •{' '}
                  <code
                    className={`${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    DELETE /authentications
                  </code>{' '}
                  - {t('auth.logout')}
                </li>
              </ul>
            </div>
          </div>

          <div className='space-y-2'>
            <h4
              className={`text-xs sm:text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              } mb-2`}
            >
              {t('profile.currentSession')}
            </h4>
            <div
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              } rounded-lg p-3`}
            >
              <div
                className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                } space-y-2`}
              >
                <div className='flex justify-between items-center'>
                  <span>{t('profile.tokenStatus')}:</span>
                  <span
                    className={`${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    } font-medium`}
                  >
                    {t('profile.active')}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>{t('profile.role')}:</span>
                  <span className='font-medium capitalize'>
                    {t(`roles.${user?.role}`) || user?.role || 'user'}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>{t('profile.session')}:</span>
                  <span
                    className={`${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    } font-medium`}
                  >
                    {t('profile.valid')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
