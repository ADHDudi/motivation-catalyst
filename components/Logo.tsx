import React from 'react';
import AppIcon from './AppIcon';

interface LogoProps {
  size?: 'sm' | 'lg';
}

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
        className={`${boxSize} ${boxRadius} bg-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#1F7AFF]/10 border border-[#1F7AFF]/10`}
      >
        <AppIcon size={iconSize * 0.8} />
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
