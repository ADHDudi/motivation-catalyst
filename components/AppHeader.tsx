import React from 'react';
import { UserFeedback } from '../types';

interface AppHeaderProps {
  userName: string | null;
  userPhotoUrl?: string | null;
  isAdmin: boolean;
  onManageFeedback: () => void;
  lang: 'en' | 'he';
  setLang: (lang: 'en' | 'he') => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ userName, userPhotoUrl, isAdmin, onManageFeedback, lang, setLang }) => {
  return (
    <div className="absolute top-0 left-0 w-full px-6 py-4 flex items-center justify-between z-40 bg-white/50 backdrop-blur-md border-b border-slate-200 shadow-sm" dir="ltr">
      <div className="flex items-center gap-3">
        {userPhotoUrl ? (
          <img src={userPhotoUrl} alt="User Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm">
            <span className="text-slate-500 font-bold text-sm uppercase">
              {userName ? userName.charAt(0) : '?'}
            </span>
          </div>
        )}
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Logged in as</span>
          <span className="font-bold text-slate-800 text-[15px]">{userName || 'User'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <button
            onClick={onManageFeedback}
            className="text-[12px] font-black tracking-widest uppercase text-[#324FA2] hover:text-[#1F7AFF] transition-colors"
          >
            Feedback
          </button>
        )}
        
        <button
          onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
          className="text-[12px] font-black tracking-widest uppercase text-slate-400 hover:text-slate-600 transition-colors ml-2"
        >
          {lang === 'he' ? 'EN' : 'HE'}
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
