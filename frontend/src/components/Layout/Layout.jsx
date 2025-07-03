import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Load sidebar state from localStorage
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem(
      'sidebarCollapsed',
      JSON.stringify(isSidebarCollapsed)
    );
  }, [isSidebarCollapsed]);

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
    <div
      className={`flex h-screen overflow-hidden ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main content */}
      <div className='flex flex-col flex-1 overflow-hidden min-w-0'>
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          sidebarCollapsed={isSidebarCollapsed}
        />

        {/* Page content */}
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto scroll-smooth ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
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
