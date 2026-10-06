import React, { useId } from 'react';

// MotivationOS app glyph — a charged battery with a lightning bolt.
// Colors follow the B2C palette: --b2c-azure (#1F7AFF) → --b2c-sky (#38BDF8).
// Same drawing as assets/icon/icon-mark.svg, the master for the favicon and home-screen icons.
// Pass `label` when the icon stands alone; omit it when text next to it names the app.
const AppIcon: React.FC<{ size: number; label?: string }> = ({ size, label }) => {
  const id = useId();
  const stroke = `${id}-stroke`;
  const fill = `${id}-fill`;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" data-testid="app-icon"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <defs>
        <linearGradient id={stroke} x1="24" y1="4" x2="24" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1F7AFF" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id={fill} x1="24" y1="13" x2="24" y2="41" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1F7AFF" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <rect x="18.5" y="4" width="11" height="5" rx="2" fill={`url(#${stroke})`} />
      <rect x="11.25" y="8.75" width="25.5" height="35" rx="6" stroke={`url(#${stroke})`} strokeWidth="2.5" />
      <rect x="15" y="12.5" width="18" height="27.5" rx="3" fill={`url(#${fill})`} fillOpacity="0.9" />
      <path d="M26.6 16 L18.4 28.4 H23.4 L21.4 36.5 L29.6 24.1 H24.6 Z" fill="white" fillOpacity="0.95" strokeLinejoin="round" />
    </svg>
  );
};

export default AppIcon;
