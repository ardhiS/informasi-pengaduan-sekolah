import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Toast = ({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const { isDarkMode } = useTheme();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      // Start progress animation
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          clearInterval(progressInterval);
        }
      }, 50);

      // Auto close timer
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseClasses = [
      'relative',
      'max-w-sm',
      'w-full',
      'mx-auto',
      'transform',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'rounded-lg',
      'shadow-xl',
      'border',
      'backdrop-blur-sm',
      'overflow-hidden',
    ];

    if (isVisible) {
      baseClasses.push('translate-x-0', 'opacity-100', 'scale-100');
    } else {
      baseClasses.push('translate-x-full', 'opacity-0', 'scale-95');
    }

    if (type === 'success') {
      if (isDarkMode) {
        baseClasses.push(
          'bg-green-900/95',
          'border-green-600',
          'text-green-100'
        );
      } else {
        baseClasses.push('bg-green-50', 'border-green-300', 'text-green-800');
      }
    } else if (type === 'error') {
      if (isDarkMode) {
        baseClasses.push('bg-red-900/95', 'border-red-600', 'text-red-100');
      } else {
        baseClasses.push('bg-red-50', 'border-red-300', 'text-red-800');
      }
    }

    return baseClasses.join(' ');
  };

  const getIcon = () => {
    if (type === 'success') {
      return (
        <CheckCircle
          className={`h-5 w-5 ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}
        />
      );
    } else if (type === 'error') {
      return (
        <AlertCircle
          className={`h-5 w-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
        />
      );
    }
    return null;
  };

  const getProgressBarColor = () => {
    if (type === 'success') {
      return isDarkMode ? 'bg-green-500' : 'bg-green-600';
    } else {
      return isDarkMode ? 'bg-red-500' : 'bg-red-600';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className='flex items-start p-4'>
        <div className='flex-shrink-0'>{getIcon()}</div>
        <div className='ml-3 flex-1'>
          <p
            className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}
          >
            {message}
          </p>
        </div>
        <div className='ml-3 flex-shrink-0'>
          <button
            onClick={onClose}
            className={`rounded-md inline-flex p-1.5 transition-colors duration-200 ${
              isDarkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className={`h-1 w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
      >
        <div
          className={`h-full transition-all duration-75 ease-linear ${getProgressBarColor()}`}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Toast;
