import React from 'react';
import { Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = "sm" }) => {
  const isLg = size === "lg";
  const boxW = isLg ? "w-14" : "w-8";
  const boxH = isLg ? "h-16" : "h-9";
  const iconSize = isLg ? 28 : 16;
  const textSize = isLg ? "text-6xl" : "text-3xl";

  return (
    <a 
      href="https://linktr.ee/ADHDudi" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-end gap-1 select-none cursor-pointer transition-transform hover:scale-105 active:scale-95 no-underline group" 
      dir="ltr"
    >
      <div className="flex gap-1 items-end">
        <div className={`${boxW} ${boxH} bg-[#E46B3F] rounded-t-full rounded-b-lg flex flex-col items-center justify-center relative shadow-sm group-hover:shadow-md transition-shadow`}>
          <Zap size={iconSize} className="text-white fill-white -mt-1" />
          <div className="absolute bottom-1 left-1.5 flex flex-col gap-0.5">
            <div className={`${isLg ? 'w-4 h-1.5' : 'w-2.5 h-1'} bg-[#90BC6E] rounded-sm`} />
            <div className={`${isLg ? 'w-4 h-1.5' : 'w-2.5 h-1'} bg-[#90BC6E] rounded-sm`} />
          </div>
        </div>
        <div className={`${boxW} ${boxH} bg-[#D9618E] rounded-tr-[50%] rounded-br-lg rounded-tl-lg rounded-bl-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
          <Zap size={iconSize} className="text-white fill-white" />
        </div>
        <div className={`${boxW} ${boxH} bg-[#78A9D6] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
          <Zap size={iconSize} className="text-white fill-white" />
        </div>
        <div className={`${boxW} ${boxH} bg-[#324FA2] rounded-tr-[50%] rounded-br-lg rounded-tl-lg rounded-bl-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
          <Zap size={iconSize} className="text-white fill-white" />
        </div>
      </div>
      <span className={`${textSize} font-black text-[#324FA2] leading-none tracking-tighter mb-0.5`}>udi</span>
    </a>
  );
};

export default Logo;