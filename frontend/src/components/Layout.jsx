import React from 'react';

const Layout = ({ children, sidebar, header, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {header && (
        <header className='bg-white shadow'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>{header}</div>
        </header>
      )}

      <div className='flex'>
        {sidebar && (
          <aside className='w-64 bg-white shadow-sm min-h-screen'>
            {sidebar}
          </aside>
        )}

        <main className='flex-1 p-6'>
          <div className='max-w-7xl mx-auto'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
