import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts, onHideToast }) => {
  return (
    <div className='fixed top-4 right-4 left-4 sm:left-auto z-50 space-y-2 pointer-events-none'>
      {toasts.map((toast) => (
        <div key={toast.id} className='pointer-events-auto'>
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            duration={toast.duration}
            onClose={() => onHideToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
