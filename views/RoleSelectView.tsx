import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';
import { TranslationData, FormData, Language, UserRole } from '../types';

interface RoleSelectViewProps {
  t: TranslationData;
  lang: Language;
  setLang: (lang: Language) => void;
  formData: FormData;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const RoleSelectView: React.FC<RoleSelectViewProps> = ({
  t,
  lang,
  setLang,
  formData,
  userRole,
  setUserRole,
  onConfirm,
  onBack,
}) => {
  const greeting = t.roleSelectGreeting.replace('{name}', formData.employeeName || '👋');
  const BackIcon = t.dir === 'rtl' ? ArrowRight : ArrowLeft;
  const FwdIcon = t.dir === 'rtl' ? ArrowLeft : ArrowRight;

  const roles: { key: UserRole; label: string; desc: string }[] = [
    { key: 'solo', label: t.roleSolo, desc: t.roleSoloDesc },
    { key: 'manager', label: t.roleManager, desc: t.roleManagerDesc },
  ];

  return (
    <div
      className={`w-full max-w-lg mx-auto bg-white/90 backdrop-blur-md rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col min-h-[100dvh] md:min-h-[85vh] md:my-8 text-${t.dir === 'rtl' ? 'right' : 'left'} animate-fade-in`}
      dir={t.dir}
    >
      {/* Header */}
      <div className="p-8 pt-12 bg-white">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className="p-2 text-slate-300 hover:text-slate-600 active:scale-90"
            aria-label="Back"
          >
            <BackIcon size={24} />
          </button>
          <Logo size="sm" />
          <button
            onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
            className="bg-slate-50 text-slate-400 p-3 rounded-2xl text-[10px] font-black transition-all active:scale-90"
            aria-label="Toggle language"
          >
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
        </div>

        <h2 className="text-2xl font-black leading-tight mb-2" style={{ color: 'var(--b2c-deep)' }}>
          {greeting}
        </h2>
        <p className="text-sm font-bold text-slate-400 leading-relaxed">{t.roleSelectIntro}</p>
      </div>

      {/* Role cards */}
      <div className="flex-1 px-8 pb-12 flex flex-col gap-4 justify-center">
        {roles.map(role => {
          const isSelected = userRole === role.key;
          return (
            <button
              key={role.key}
              type="button"
              onClick={() => setUserRole(role.key)}
              aria-pressed={isSelected}
              className={`w-full text-start p-6 rounded-[28px] border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                isSelected
                  ? 'border-[#38BDF8] bg-[#38BDF8]/5 shadow-sm'
                  : 'border-slate-100 hover:border-slate-200 active:scale-95'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-lg font-black leading-tight mb-1"
                    style={{ color: isSelected ? 'var(--b2c-deep)' : 'var(--b2c-ink)' }}
                  >
                    {role.label}
                  </p>
                  <p className="text-sm font-bold text-slate-400 leading-snug">{role.desc}</p>
                </div>
                <div
                  className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-[var(--b2c-azure)]' : 'border-slate-200'
                  }`}
                  style={isSelected ? { backgroundColor: 'var(--b2c-azure)' } : {}}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                </div>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onConfirm}
          className="w-full text-white font-bold text-[15px] py-4 min-h-[48px] rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          style={{ backgroundImage: 'var(--gradient-b2c)' }}
        >
          {t.roleSelectCta}
          <FwdIcon size={18} />
        </button>
      </div>
    </div>
  );
};

export default RoleSelectView;
