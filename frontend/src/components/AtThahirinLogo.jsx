import React from 'react';

const AtThahirinLogo = ({ className = 'w-8 h-8', showText = false }) => {
  return (
    <div className={`flex items-center ${showText ? 'space-x-2' : ''}`}>
      <svg
        className={className}
        viewBox='0 0 100 100'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        {/* Background Circle */}
        <circle
          cx='50'
          cy='50'
          r='48'
          fill='url(#bgGradient)'
          stroke='#e5e7eb'
          strokeWidth='2'
        />

        {/* Green Border Elements */}
        <circle
          cx='50'
          cy='50'
          r='44'
          fill='none'
          stroke='#22c55e'
          strokeWidth='2'
        />

        {/* Mosque Dome */}
        <path
          d='M30 45 Q50 25 70 45 L70 60 Q70 65 65 65 L35 65 Q30 65 30 60 Z'
          fill='#16a34a'
          stroke='#15803d'
          strokeWidth='1'
        />

        {/* Minaret */}
        <path
          d='M48 15 L52 15 L52 35 L48 35 Z'
          fill='#16a34a'
          stroke='#15803d'
          strokeWidth='0.5'
        />

        {/* Dome Top */}
        <path
          d='M47 15 Q50 10 53 15'
          fill='#dc2626'
          stroke='#b91c1c'
          strokeWidth='0.5'
        />

        {/* Yellow Banner */}
        <ellipse cx='50' cy='75' rx='35' ry='8' fill='#eab308' />

        {/* Book/Quran */}
        <path
          d='M40 50 L60 50 Q62 50 62 52 L62 58 Q62 60 60 60 L40 60 Q38 60 38 58 L38 52 Q38 50 40 50 Z'
          fill='#dc2626'
          stroke='#b91c1c'
          strokeWidth='0.5'
        />

        {/* Book Pages */}
        <rect x='42' y='52' width='16' height='6' fill='white' rx='1' />

        {/* Yellow Dots Border */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x = 50 + 40 * Math.cos(angle);
          const y = 50 + 40 * Math.sin(angle);
          return <circle key={i} cx={x} cy={y} r='2' fill='#fbbf24' />;
        })}

        {/* Gradients */}
        <defs>
          <linearGradient id='bgGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#bfdbfe' />
            <stop offset='100%' stopColor='#60a5fa' />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className='flex flex-col'>
          <span className='text-sm font-bold text-green-700'>
            SMP AT-THAHIRIN
          </span>
          <span className='text-xs text-green-600'>
            Yayasan Nur At-Thahirin
          </span>
        </div>
      )}
    </div>
  );
};

export default AtThahirinLogo;
