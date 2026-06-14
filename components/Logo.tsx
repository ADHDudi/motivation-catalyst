import React from 'react';

interface LogoProps {
  size?: 'sm' | 'lg';
}

const MotivationOSIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="8" height="10" rx="2.5" fill="rgba(255,255,255,0.5)" />
    <rect x="17" y="20" width="8" height="20" rx="2.5" fill="rgba(255,255,255,0.75)" />
    <rect x="29" y="10" width="8" height="30" rx="2.5" fill="white" />
    <path d="M33 6 L38 11 L35.5 11 L35.5 10 L30.5 10 L30.5 11 L28 11 Z" fill="white" />
    <path d="M9 29 Q23 15 33 8" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
  </svg>
);

const Logo: React.FC<LogoProps> = ({ size = 'sm' }) => {
  const isLg = size === 'lg';
  const iconSize = isLg ? 56 : 36;
  const boxSize = isLg ? 'w-16 h-16' : 'w-10 h-10';
  const boxRadius = isLg ? 'rounded-2xl' : 'rounded-xl';
  const nameSize = isLg ? 'text-2xl' : 'text-base';
  const tagSize = isLg ? 'text-[9px]' : 'text-[7px]';

  return (
    <a
      href="/"
      className="inline-flex items-center gap-2.5 select-none cursor-pointer transition-transform hover:scale-105 active:scale-95 no-underline"
      dir="ltr"
      title="MotivationOS — Workplace Insights"
    >
      {/* Icon square */}
      <div
        className={`${boxSize} ${boxRadius} flex items-center justify-center flex-shrink-0`}
        style={{ background: 'linear-gradient(135deg, #8C50F0 0%, #1F7AFF 100%)' }}
      >
        <MotivationOSIcon size={iconSize * 0.72} />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={`${nameSize} font-black tracking-tight`}
          style={{ color: 'var(--b2c-ink)' }}
        >
          MotivationOS
        </span>
        <span
          className={`${tagSize} font-black uppercase tracking-widest mt-0.5`}
          style={{ color: 'var(--b2c-azure)' }}
        >
          Workplace Insights
        </span>
      </div>
    </a>
  );
};

export default Logo;
