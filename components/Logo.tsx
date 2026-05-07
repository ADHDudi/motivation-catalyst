import React from 'react';

interface LogoProps {
  size?: 'sm' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = "sm" }) => {
  const isLg = size === "lg";
  const textSize = isLg ? "text-5xl" : "text-2xl";
  const paddings = isLg ? "px-6 py-4" : "px-4 py-2";

  return (
    <a
      href="https://justaiit.web.app/"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-0 select-none cursor-pointer transition-transform hover:scale-105 active:scale-95 no-underline group rounded-lg ${paddings}`}
      style={{
        background: 'linear-gradient(135deg, #a014f0 0%, #8c50f0 28%, #5078ff 58%, #3cdcf0 100%)',
        boxShadow: '0 8px 24px rgba(140, 80, 240, 0.2)'
      }}
      dir="ltr"
      title="Just AI It — Workplace Motivation Assessment"
    >
      <span className={`${textSize} font-black text-white leading-none tracking-tighter`}>
        Just AI It
      </span>
    </a>
  );
};

export default Logo;