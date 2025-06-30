import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  BookOpen,
  GraduationCap,
  UserCircle,
  X,
  Database,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import AtThahirinLogo from '../AtThahirinLogo';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Pengaduan', href: '/complaints', icon: MessageSquare, new: true },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Classes', href: '/classes', icon: GraduationCap },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Profile', href: '/profile', icon: UserCircle },
];

const Sidebar = ({ open, setOpen }) => {
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, setOpen]);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div className='fixed inset-0 flex z-40 md:hidden'>
          <div
            className='fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300'
            onClick={() => setOpen(false)}
          />
          <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white animate-slide-up'>
            {/* Close button */}
            <div className='absolute top-0 right-0 -mr-12 pt-2'>
              <button
                type='button'
                className='btn-icon h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 focus:ring-white/50'
                onClick={() => setOpen(false)}
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            {/* Mobile sidebar content */}
            <div className='pt-5 pb-4 overflow-y-auto h-full'>
              <SidebarContent mobile onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className='hidden md:flex md:flex-shrink-0'>
        <div className='flex flex-col w-64'>
          <div className='flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200 shadow-sm'>
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
};

const SidebarContent = ({ mobile = false, onNavigate }) => {
  const handleNavigationClick = () => {
    if (mobile && onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className='flex flex-col flex-grow'>
      {/* Logo/Brand */}
      <NavLink
        to='/dashboard'
        className='flex items-center flex-shrink-0 px-4 py-3 hover:bg-green-50 transition-all duration-200 ease-in-out transform hover:scale-105 rounded-lg mx-2'
        onClick={handleNavigationClick}
      >
        <AtThahirinLogo className='h-8 w-8 transition-all duration-200 ease-in-out' />
        <div className='ml-3 flex flex-col'>
          <span className='text-sm font-bold text-green-800 leading-tight'>
            SMP AT-THAHIRIN
          </span>
          <span className='text-xs text-green-600 leading-tight'>
            Website Pengaduan
          </span>
        </div>
      </NavLink>

      {/* Navigation */}
      <div className='mt-6 xs:mt-8 flex-grow flex flex-col'>
        <nav className='flex-1 px-2 space-y-1'>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={handleNavigationClick}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 xs:py-2 text-sm xs:text-base font-medium rounded-md transition-all duration-200 ease-in-out touch-manipulation relative ${
                  isActive
                    ? 'bg-primary-100 text-primary-900 border-r-4 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
                }`
              }
            >
              <item.icon
                className='mr-3 flex-shrink-0 h-5 w-5 xs:h-6 xs:w-6 transition-colors duration-200'
                aria-hidden='true'
              />
              <span className='truncate'>{item.name}</span>
              {/* New badge for Pengaduan */}
              {item.new && (
                <span className='ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse'>
                  NEW
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer for mobile */}
        {mobile && (
          <div className='mt-8 px-4 py-4 border-t border-gray-200'>
            <div className='text-xs text-gray-500 text-center'>
              <p>School Management System</p>
              <p className='mt-1'>v1.0.0</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
