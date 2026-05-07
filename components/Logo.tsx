import React from 'react';

interface LogoProps {
  size?: 'sm' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = "sm" }) => {
  const isLg = size === "lg";
  const logoHeight = isLg ? "h-16" : "h-10";
  const logoWidth = isLg ? "w-auto" : "w-auto";

  return (
    <a
      href="https://justaiit.web.app/"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-0 select-none cursor-pointer transition-transform hover:scale-110 active:scale-95 no-underline group ${logoHeight} ${logoWidth}`}
      dir="ltr"
      title="Just AI It — Workplace Motivation Assessment"
    >
      <img
        src="/justaiit-logo.svg"
        alt="Just AI It Logo"
        className={`${logoHeight} ${logoWidth} object-contain`}
      />
    </a>
  );
};

export default Logo;