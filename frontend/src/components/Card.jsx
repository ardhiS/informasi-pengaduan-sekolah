import React from 'react';

const Card = ({
  title,
  subtitle,
  children,
  actions,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {(title || subtitle || actions) && (
        <div
          className={`px-4 py-5 border-b border-gray-200 sm:px-6 ${headerClassName}`}
        >
          <div className='flex items-center justify-between'>
            <div>
              {title && (
                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className='flex space-x-2'>{actions}</div>}
          </div>
        </div>
      )}
      <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default Card;
