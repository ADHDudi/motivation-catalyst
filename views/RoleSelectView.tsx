import React, { useState } from 'react';
import { UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';
import { TranslationData, FormData, Language, UserRole } from '../types';

interface RoleSelectViewProps {
  t: TranslationData;
  lang: Language;
  setLang: (lang: Language) => void;
  userRole: UserRole;
  formData: FormData;
  onRoleSelect: (role: UserRole) => void;
}

const RoleSelectView: React.FC<RoleSelectViewProps> = ({ t, lang, setLang, userRole, formData, onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(userRole);

  const greeting = t.roleSelectGreeting.replace('{name}', formData.employeeName);

  const isContinue = userRole === selectedRole;

  let ctaLabel: string;
  if (selectedRole === 'solo') {
    ctaLabel = isContinue ? t.continueSolo : t.startAsSolo;
  } else {
    ctaLabel = isContinue ? t.continueManager : t.startAsManager;
  }

  const cards: { role: UserRole; label: string; subLabel: string; desc: string; Icon: React.ElementType; iconBg: string; iconText: string }[] = [
    {
      role: 'solo',
      label: t.soloLabel,
      subLabel: t.soloSubLabel,
      desc: t.soloDesc,
      Icon: UserCheck,
      iconBg: 'bg-[#78A9D6]/10',
      iconText: 'text-[#78A9D6]',
    },
    {
      role: 'manager',
      label: t.managerLabel,
      subLabel: t.managerSubLabel,
      desc: t.managerDesc,
      Icon: ShieldCheck,
      iconBg: 'bg-[#E46B3F]/10',
      iconText: 'text-[#E46B3F]',
    },
  ];

  return (
    <div
      className={`w-full max-w-lg mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[100dvh] md:min-h-0 text-${t.dir === 'rtl' ? 'right' : 'left'}`}
      dir={t.dir}
    >
      {/* Top bar */}
      <div className="flex justify-between items-center px-8 pt-10 pb-4">
        <button
          onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
          className="bg-slate-50 text-slate-400 p-3 rounded-2xl text-[10px] font-black transition-all active:scale-90"
        >
          {lang === 'he' ? 'EN' : 'עב'}
        </button>
        <Logo size="sm" />
      </div>

      {/* Greeting */}
      <div className="px-8 pt-4 pb-6 text-center">
        <h1 className="text-3xl font-black text-[#324FA2] leading-tight mb-2">{greeting}</h1>
        <p className="text-slate-500 font-bold text-base">{t.roleSelectTitle}</p>
      </div>

      {/* Role cards */}
      <div className="flex-1 px-8 pb-4 flex flex-col gap-4">
        {cards.map(({ role, label, subLabel, desc, Icon, iconBg, iconText }) => {
          const isSelected = selectedRole === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={
                isSelected
                  ? 'bg-[#324FA2]/5 border-2 border-[#324FA2] rounded-3xl p-6 flex items-center gap-4 cursor-pointer w-full text-start transition-all'
                  : 'bg-white border-2 border-slate-100 rounded-3xl p-6 flex items-center gap-4 cursor-pointer hover:border-[#324FA2]/30 transition-all w-full text-start'
              }
            >
              <div
                className={`p-3 rounded-2xl shrink-0 ${isSelected ? 'bg-[#324FA2] text-white' : `${iconBg} ${iconText}`}`}
              >
                <Icon size={28} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl font-black text-[#324FA2]">{label}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subLabel}</span>
                </div>
                <p className="text-sm text-slate-500 font-bold leading-snug mt-1">{desc}</p>
              </div>
            </button>
          );
        })}

        {/* CTA button */}
        <button
          type="button"
          onClick={() => onRoleSelect(selectedRole)}
          className="w-full py-5 bg-[#324FA2] text-white font-black text-lg rounded-[30px] flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all mt-6"
        >
          {ctaLabel}
          <ArrowRight size={22} className={t.dir === 'rtl' ? 'rotate-180' : ''} />
        </button>
      </div>

      {/* Bottom spacer for mobile safe area */}
      <div className="pb-8" />
    </div>
  );
};

export default RoleSelectView;
