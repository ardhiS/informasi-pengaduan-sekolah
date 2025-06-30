import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content */}
      <div className='flex flex-col flex-1 overflow-hidden min-w-0'>
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 scroll-smooth'>
          {/* Mobile-optimized container */}
          <div className='container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 lg:py-8 max-w-full'>
            <div className='animate-fade-in'>{children || <Outlet />}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
