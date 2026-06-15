import React from 'react';
import { AlertCircle, ShieldCheck, Target, Zap, ArrowRight, RotateCcw, X } from 'lucide-react';

const MotivationOSHeroIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="30" width="8" height="10" rx="2.5" fill="#38BDF8" fillOpacity="0.6" />
    <rect x="17" y="20" width="8" height="20" rx="2.5" fill="#38BDF8" fillOpacity="0.8" />
    <rect x="29" y="10" width="8" height="30" rx="2.5" fill="#1F7AFF" />
    <path d="M33 6 L38 11 L35.5 11 L35.5 10 L30.5 10 L30.5 11 L28 11 Z" fill="#1F7AFF" />
    <path d="M9 29 Q23 15 33 8" stroke="#3CDCF0" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
  </svg>
);
import { Link } from 'react-router-dom';
import { TranslationData, FormData, Language } from '../types';

interface WelcomeViewProps {
  t: TranslationData;
  lang: Language;
  setLang: (lang: Language) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onStart: (e?: React.FormEvent | React.MouseEvent) => void;
  onDemo: (type: 'high' | 'mid' | 'at-risk') => void;
  onGoogleLogin: () => void;
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  onEmailSignUp: (email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  authError: string | null;
  authSuccess: string | null;
  hasSavedProgress?: boolean;
  isAuthenticated?: boolean;
  onResume?: () => void;
  onDiscardProgress?: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

const WelcomeView: React.FC<WelcomeViewProps> = ({
  t,
  lang,
  setLang,
  formData,
  setFormData,
  onStart,
  onDemo,
  onGoogleLogin,
  onEmailSignIn,
  onEmailSignUp,
  onForgotPassword,
  authError,
  authSuccess,
  hasSavedProgress,
  isAuthenticated,
  onResume,
  onDiscardProgress,
}) => {
  const [authMode, setAuthMode] = React.useState<AuthMode>('signin');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [localError, setLocalError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const googleBtnText = lang === 'he' ? 'התחבר עם גוגל' : 'Sign in with Google';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    try {
      if (authMode === 'signin') {
        await onEmailSignIn(formData.employeeEmail, password);
      } else if (authMode === 'signup') {
        if (password !== confirmPassword) {
          setLocalError(lang === 'he' ? 'הסיסמאות אינן תואמות' : 'Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setLocalError(lang === 'he' ? 'הסיסמה חייבת להכיל לפחות 6 תווים' : 'Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        await onEmailSignUp(formData.employeeEmail, password);
      } else if (authMode === 'forgot') {
        await onForgotPassword(formData.employeeEmail);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || authError;

  const submitLabel = authMode === 'signin'
    ? (lang === 'he' ? 'התחבר' : 'Sign In')
    : authMode === 'signup'
    ? (lang === 'he' ? 'צור חשבון' : 'Create Account')
    : (lang === 'he' ? 'שלח קישור איפוס' : 'Send Reset Link');

  const modeHeading = authMode === 'signup'
    ? (lang === 'he' ? 'יצירת חשבון חדש' : 'Create an Account')
    : authMode === 'forgot'
    ? (lang === 'he' ? 'איפוס סיסמה' : 'Reset Password')
    : null;

  return (
    <div
      className={`w-full max-w-lg md:max-w-5xl mx-auto bg-white/90 backdrop-blur-md md:rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row min-h-[100dvh] md:min-h-0 md:h-auto md:my-auto text-${t.dir === 'rtl' ? 'right' : 'left'} animate-fade-in`}
      dir={t.dir}
    >
      {/* ── Left Pane (Desktop) / Top Section (Mobile) ── */}
      <div className="md:w-1/2 p-8 pt-10 md:p-12 text-center md:text-start relative bg-slate-50 overflow-hidden text-slate-900 flex flex-col justify-center border-b md:border-b-0 md:border-e border-slate-200">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#90BC6E]/10 rounded-full blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#3CDCF0]/10 rounded-full blur-3xl mix-blend-multiply" />
        
        <div className="flex justify-between items-center mb-8 md:mb-12 relative z-10">
          <div className="hidden md:flex w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-lg border-2 border-[#324FA2]/5">
            <MotivationOSHeroIcon />
          </div>
          <button
            onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
            className="bg-white/60 hover:bg-white text-slate-500 p-3 rounded-2xl text-[10px] font-black transition-all active:scale-90 shadow-sm ml-auto md:ml-0"
          >
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
        </div>

        <div className="md:hidden relative inline-block mb-6 z-10">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl border-4 border-[#324FA2]/5">
            <MotivationOSHeroIcon />
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4 relative z-10" style={{ color: 'var(--b2c-ink)' }}>
          {t.title}
        </h1>
        <div className="inline-block px-4 py-1.5 bg-[#1F7AFF]/10 rounded-full w-max mx-auto md:mx-0 relative z-10 mb-8 md:mb-12">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--b2c-azure)' }}>
            {t.subtitle}
          </p>
        </div>

        {/* Desktop-only value props (reduces mobile clutter) */}
        {authMode === 'signin' && (
          <div className="hidden md:flex flex-col space-y-6 relative z-10">
            <div className="p-5 bg-gradient-to-br from-[#1F7AFF]/5 to-[#3CDCF0]/5 rounded-[24px] border border-[#3CDCF0]/10">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle size={18} className="text-[#3CDCF0]" />
                <h3 className="font-black text-base" style={{ color: 'var(--b2c-ink)' }}>{t.painTitle}</h3>
              </div>
              <p className="text-sm font-bold leading-relaxed" style={{ color: 'var(--b2c-ink)', opacity: 0.85 }}>{t.painText}</p>
            </div>
            
            <div className="p-5 bg-[#38BDF8]/5 rounded-[24px] border border-[#38BDF8]/10">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={18} className="text-[#324FA2]" />
                <h3 className="font-black text-base" style={{ color: 'var(--b2c-ink)' }}>{t.solutionTitle}</h3>
              </div>
              <p className="text-sm font-bold leading-relaxed" style={{ color: 'var(--b2c-ink)', opacity: 0.8 }}>{t.solutionText}</p>
            </div>

            <div className="p-5 bg-[#90BC6E]/5 rounded-[24px] border border-[#90BC6E]/10">
              <h3 className="font-black text-base mb-3 flex items-center gap-2" style={{ color: 'var(--b2c-ink)' }}>
                <Target size={18} className="text-[#90BC6E]" /> {t.valueTitle}
              </h3>
              <ul className="space-y-2">
                {t.valueList.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm font-bold leading-tight" style={{ color: 'var(--b2c-ink)', opacity: 0.85 }}>
                    <Zap size={14} className="text-[#1F7AFF] shrink-0 mt-0.5" />
                    {String(item)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ── Right Pane (Desktop) / Bottom Section (Mobile) ── */}
      <div className="md:w-1/2 flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center bg-white">
        
        {hasSavedProgress && onResume && onDiscardProgress && (
          <div className="mb-8 p-5 rounded-[28px] border border-slate-200 shadow-sm" style={{ backgroundColor: 'var(--b2c-mist)' }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--b2c-deep)' }}>
                <RotateCcw size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-base leading-tight mb-1" style={{ color: 'var(--b2c-deep)' }}>{t.resumeBannerTitle}</h3>
                <p className="text-xs text-slate-500 font-bold leading-snug">{t.resumeBannerText}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onResume}
                className="flex-1 py-3 text-white font-black text-sm rounded-2xl hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                style={{ backgroundImage: 'var(--gradient-b2c)' }}
              >
                {t.resumeContinue}
                <ArrowRight size={16} className={t.dir === 'rtl' ? 'rotate-180' : ''} />
              </button>
              <button
                type="button"
                onClick={onDiscardProgress}
                className="px-4 py-3 bg-white text-slate-400 font-black text-sm rounded-2xl border border-slate-200 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
                aria-label={t.resumeStartFresh}
                title={t.resumeStartFresh}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">
            {modeHeading && (
              <h2 className="text-xl font-black text-center mb-6" style={{ color: 'var(--b2c-ink)' }}>{modeHeading}</h2>
            )}

            {displayError && (
              <div role="alert" className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold">
                {displayError}
              </div>
            )}

            {authSuccess && (
              <div role="status" className="mb-5 px-4 py-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm font-bold">
                {authSuccess}
              </div>
            )}

            {authMode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={onGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white text-[#334155] font-bold text-[15px] tracking-wide py-3.5 min-h-[48px] border border-slate-200 rounded-2xl flex items-center justify-center gap-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 active:scale-[0.98] transition-all duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-[18px] h-[18px]" alt="Google Icon" />
                  {googleBtnText}
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-slate-400 text-[11px] font-black uppercase tracking-wider text-center">
                    {lang === 'he' ? 'או באימייל' : 'OR EMAIL'}
                  </span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>
              </>
            )}

            <div className="space-y-4">
              <input
                type="email"
                placeholder={lang === 'he' ? 'כתובת אימייל' : 'Email address'}
                className="w-full px-5 py-3.5 min-h-[48px] bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-[15px] outline-none transition-all placeholder:text-slate-400 font-medium focus:bg-white focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                value={formData.employeeEmail}
                onChange={e =>
                  setFormData({ ...formData, employeeName: e.target.value.split('@')[0], employeeEmail: e.target.value })
                }
                required
              />

              {authMode !== 'forgot' && (
                <input
                  type="password"
                  placeholder={lang === 'he' ? 'סיסמה' : 'Password'}
                  className="w-full px-5 py-3.5 min-h-[48px] bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-[15px] outline-none transition-all placeholder:text-slate-400 font-medium focus:bg-white focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              )}

              {authMode === 'signup' && (
                <input
                  type="password"
                  placeholder={lang === 'he' ? 'אימות סיסמה' : 'Confirm password'}
                  className="w-full px-5 py-3.5 min-h-[48px] bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-[15px] outline-none transition-all placeholder:text-slate-400 font-medium focus:bg-white focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              )}
            </div>

            {authMode === 'signin' && (
              <div className="flex justify-end pt-3 pb-5">
                <button
                  type="button"
                  onClick={() => { setLocalError(null); setAuthMode('forgot'); }}
                  className="text-slate-400 text-[12px] font-bold hover:text-slate-600 transition-colors"
                >
                  {lang === 'he' ? 'שכחת סיסמה?' : 'Forgot Password?'}
                </button>
              </div>
            )}

            {authMode !== 'signin' && <div className="pt-6" />}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-bold text-[15px] py-3.5 min-h-[48px] rounded-2xl shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] transition-all duration-200 mb-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundImage: 'var(--gradient-b2c)' }}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : submitLabel}
            </button>

            {authMode === 'signin' && (
              <div className="text-center mt-auto md:mt-4">
                <span className="text-slate-500 text-[13px] font-medium">
                  {lang === 'he' ? 'אין לך חשבון? ' : "Don't have an account? "}
                </span>
                <button
                  type="button"
                  onClick={() => { setLocalError(null); setPassword(''); setConfirmPassword(''); setAuthMode('signup'); }}
                  className="text-[13px] font-black transition-colors hover:text-[#38BDF8]"
                  style={{ color: 'var(--b2c-azure)' }}
                >
                  {lang === 'he' ? 'הרשם עכשיו' : 'Sign up now'}
                </button>
              </div>
            )}

            {(authMode === 'signup' || authMode === 'forgot') && (
              <div className="text-center mt-auto md:mt-4">
                <button
                  type="button"
                  onClick={() => { setLocalError(null); setPassword(''); setConfirmPassword(''); setAuthMode('signin'); }}
                  className="text-[13px] font-black transition-colors hover:text-[#38BDF8]"
                  style={{ color: 'var(--b2c-azure)' }}
                >
                  {lang === 'he' ? '← חזור להתחברות' : '← Back to Sign In'}
                </button>
              </div>
            )}
          </form>
        )}

        {formData.employeeName.toLowerCase() === 'dudi' && (
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center max-w-sm mx-auto w-full">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">DEMO MODE</span>
            <div className="flex gap-3">
              {['high', 'mid', 'at-risk'].map(m => (
                <button
                  key={m}
                  onClick={() => onDemo(m as any)}
                  className="px-4 py-2 bg-white rounded-xl text-[10px] font-black text-[#324FA2] border border-slate-200 active:scale-95 uppercase shadow-sm"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {isAuthenticated && !hasSavedProgress && (
          <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center space-y-4">
            <button
              type="button"
              onClick={(e) => onStart(e)}
              className="w-full text-white font-bold text-[15px] py-4 min-h-[48px] rounded-2xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              style={{ backgroundImage: 'var(--gradient-b2c)' }}
            >
              {lang === 'he' ? 'התחל אבחון חדש' : 'Start New Assessment'}
              <ArrowRight size={16} className={t.dir === 'rtl' ? 'rotate-180' : ''} />
            </button>
            <p className="text-sm font-bold text-slate-500 text-center">
              {lang === 'he' ? `מחובר כ- ${formData.employeeEmail}` : `Signed in as ${formData.employeeEmail}`}
            </p>
          </div>
        )}

        {/* Legal footer */}
        <div className="mt-auto pt-8 border-t border-slate-100 flex flex-wrap gap-4 justify-center text-[11px] font-bold text-slate-400">
          <Link to="/terms" className="hover:text-[var(--b2c-azure)] transition-colors">
            {lang === 'he' ? 'תנאי שימוש' : 'Terms of Use'}
          </Link>
          <Link to="/privacy" className="hover:text-[var(--b2c-azure)] transition-colors">
            {lang === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
          </Link>
          <Link to="/accessibility" className="hover:text-[var(--b2c-azure)] transition-colors">
            {lang === 'he' ? 'נגישות' : 'Accessibility'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeView;
