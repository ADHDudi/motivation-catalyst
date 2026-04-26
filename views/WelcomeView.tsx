import React from 'react';
import { Beaker, AlertCircle, ShieldCheck, Target, Zap, ArrowRight, LogIn } from 'lucide-react';
import Logo from '../components/Logo';
import { TranslationData, FormData, Language } from '../types';

interface WelcomeViewProps {
  t: TranslationData;
  lang: Language;
  setLang: (lang: Language) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onStart: (e: React.FormEvent) => void;
  onDemo: (type: 'high' | 'mid' | 'at-risk') => void;
  onGoogleLogin: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ t, lang, setLang, formData, setFormData, onStart, onDemo, onGoogleLogin }) => {
  const googleBtnText = lang === 'he' ? 'התחבר עם גוגל' : 'Sign in with Google';
  return (
    <div className={`w-full max-w-lg mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[100dvh] md:min-h-0 text-${t.dir === 'rtl' ? 'right' : 'left'}`} dir={t.dir}>
      <div className={`p-8 pt-12 text-center relative bg-white overflow-hidden text-slate-900`}>
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#90BC6E]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#D9618E]/5 rounded-full blur-3xl" />
        <div className="flex justify-between items-center mb-10 relative z-10">
          <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} className="bg-slate-50 text-slate-400 p-3 rounded-2xl text-[10px] font-black transition-all active:scale-90">
             {lang === 'he' ? 'EN' : 'עב'}
          </button>
          <Logo size="sm" />
        </div>
        <div className="relative inline-block mb-6 z-10">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl border-4 border-[#324FA2]/5">
            <Beaker size={48} className="text-[#78A9D6]" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#90BC6E] rounded-full border-4 border-white shadow-lg" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#324FA2] leading-tight mb-2">{t.title}</h1>
        <div className="inline-block px-4 py-1 bg-[#E46B3F]/10 rounded-full"><p className="text-[#E46B3F] text-xs font-black uppercase tracking-widest">{t.subtitle}</p></div>
      </div>

      <div className="flex-1 px-8 pb-12 relative z-10 overflow-y-auto">
        <div className="mb-8 p-6 bg-gradient-to-br from-[#E46B3F]/5 to-[#D9618E]/5 rounded-[30px] border-2 border-[#D9618E]/10 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <AlertCircle size={20} className="text-[#D9618E]" />
                <h3 className="font-black text-lg text-[#324FA2]">{t.painTitle}</h3>
            </div>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">{t.painText}</p>
        </div>

        <div className="mb-8 p-6 bg-[#78A9D6]/5 rounded-[30px] border-2 border-[#78A9D6]/20 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={20} className="text-[#324FA2]" />
                <h3 className="font-black text-lg text-[#324FA2]">{t.solutionTitle}</h3>
            </div>
            <p className="text-sm text-slate-600 font-bold opacity-80 leading-relaxed">{t.solutionText}</p>
        </div>

        <div className="mb-10 p-6 bg-[#90BC6E]/5 rounded-[30px] border-2 border-[#90BC6E]/10 shadow-sm">
            <h3 className="font-black text-lg text-[#324FA2] mb-4 flex items-center gap-3"><Target size={20} className="text-[#90BC6E]" /> {t.valueTitle}</h3>
            <ul className="space-y-3">
                {t.valueList.map((item, i) => <li key={i} className="flex gap-3 text-sm text-slate-600 font-bold leading-tight"><Zap size={14} className="text-[#E46B3F] shrink-0 mt-1" />{String(item)}</li>)}
            </ul>
        </div>

        <form onSubmit={onStart} className="w-[95%] mx-auto block space-y-0 relative z-10">
          <button 
            type="button" 
            onClick={onGoogleLogin} 
            className="w-full bg-white text-[#334155] font-bold text-[15px] tracking-wide py-3.5 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-300 transition-all mb-8"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-[18px] h-[18px]" alt="Google Icon" />
            {googleBtnText}
          </button>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-slate-200/60"></div>
            <span className="text-[#94A3B8] text-[11px] font-black uppercase tracking-wider text-center">{lang === 'he' ? 'או' : 'OR'}</span>
            <div className="flex-1 h-px bg-slate-200/60"></div>
          </div>

          <div className="space-y-4">
            <input 
              type="email" 
              placeholder={lang === 'he' ? 'כתובת אימייל' : 'Email address'}
              className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 outline-none transition-all placeholder:text-[#94A3B8] placeholder:font-medium font-medium focus:border-slate-400 focus:ring-1 focus:ring-slate-400" 
              value={formData.employeeEmail} 
              onChange={e => setFormData({...formData, employeeName: e.target.value.split('@')[0], employeeEmail: e.target.value})} 
              required
            />
            <input 
              type="password" 
              placeholder={lang === 'he' ? 'סיסמה' : 'Password'}
              className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 outline-none transition-all placeholder:text-[#94A3B8] placeholder:font-medium font-medium focus:border-slate-400 focus:ring-1 focus:ring-slate-400" 
              onChange={() => {}}
            />
          </div>

          <div className="flex justify-end pt-4 pb-6">
            <button type="button" className="text-[#94A3B8] text-[13px] font-bold hover:text-slate-500 transition-colors">
              {lang === 'he' ? 'שכחת סיסמה?' : 'Forgot Password?'}
            </button>
          </div>

          <button type="submit" className="w-full bg-[#111827] text-white font-bold text-[15px] py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] hover:bg-black hover:shadow-lg transition-all mb-8">
            {lang === 'he' ? 'התחבר' : 'Sign In'}
          </button>

          <div className="text-center">
            <span className="text-[#94A3B8] text-[14px] font-medium">{lang === 'he' ? 'אין לך חשבון? ' : "Don't have an account? "}</span>
            <button type="button" className="text-[#8B5CF6] text-[14px] font-bold hover:text-[#7C3AED] transition-colors ml-1">{lang === 'he' ? 'הרשם' : 'Sign up'}</button>
          </div>
        </form>

        {formData.employeeName.toLowerCase() === 'dudi' && (
          <div className="mt-12 p-6 bg-slate-50 rounded-[30px] border-4 border-dashed border-slate-200 flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">DEMO MODE</span>
            <div className="flex gap-4">
               {['high', 'mid', 'at-risk'].map(m => (
                 <button key={m} onClick={() => onDemo(m as any)} className="px-4 py-2 bg-white rounded-full text-[10px] font-black text-[#324FA2] border border-slate-100 active:scale-95 uppercase">{m}</button>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeView;