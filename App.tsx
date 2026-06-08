import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QUESTIONS, TRANSLATIONS, COLORS, APP_ID, WEBHOOK_URL } from './constants';
import WelcomeView from './views/WelcomeView';
import RoleSelectView from './views/RoleSelectView';
import AssessmentView from './views/AssessmentView';
import AnalysisView from './views/AnalysisView';
import CategoryIntroCard from './components/CategoryIntroCard';
import AppHeader from './components/AppHeader';
import AdminFeedbackPanel from './components/AdminFeedbackPanel';
import { Language, FormData, Answers, Results, CategoryKey, UserRole } from './types';
import { signInWithGoogle, onAuthStateChange, signInWithEmail, signUpWithEmail, sendPasswordReset } from './authUtils';

const TermsView = lazy(() => import('./views/legal/TermsView'));
const PrivacyView = lazy(() => import('./views/legal/PrivacyView'));
const AccessibilityView = lazy(() => import('./views/legal/AccessibilityView'));

type Step = 'welcome' | 'role-select' | 'assessment' | 'analysis';

interface SavedProgress {
  formData: FormData;
  userRole: UserRole;
  lang: Language;
  answers: Answers;
  currentQuestionIndex: number;
}

const LS_ROLE = 'mc_role';
const LS_LANG = 'mc_lang';
const LS_PROGRESS = 'mc_progress';

const readSavedRole = (): UserRole => {
  try {
    const v = localStorage.getItem(LS_ROLE);
    return v === 'manager' ? 'manager' : 'solo';
  } catch { return 'solo'; }
};

const readSavedLang = (): Language => {
  try {
    const v = localStorage.getItem(LS_LANG);
    return v === 'en' ? 'en' : 'he';
  } catch { return 'he'; }
};

const readSavedProgress = (): SavedProgress | null => {
  try {
    const raw = localStorage.getItem(LS_PROGRESS);
    if (!raw) return null;
    const p = JSON.parse(raw) as SavedProgress;
    if (!p || typeof p !== 'object' || !p.answers || Object.keys(p.answers).length === 0) return null;
    return p;
  } catch { return null; }
};

const clearSavedProgress = () => {
  try { localStorage.removeItem(LS_PROGRESS); } catch { /* noop */ }
};

const App = () => {
  const [lang, setLang] = useState<Language>(readSavedLang);
  const [step, setStep] = useState<Step>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({ employeeName: '', employeeEmail: '', managerName: '', managerEmail: '' });
  const [userRole, setUserRoleState] = useState<UserRole>(readSavedRole);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<Results | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [categoryIntro, setCategoryIntro] = useState<CategoryKey | null>(null);
  const [pendingNextIndex, setPendingNextIndex] = useState<number>(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [hasSavedProgress, setHasSavedProgress] = useState<boolean>(() => readSavedProgress() !== null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  // Persist lang to localStorage
  useEffect(() => {
    try { localStorage.setItem(LS_LANG, lang); } catch { /* noop */ }
  }, [lang]);

  const setUserRole = (r: UserRole) => {
    setUserRoleState(r);
    try { localStorage.setItem(LS_ROLE, r); } catch { /* noop */ }
  };

  // Persist in-flight progress on every answer change (only while taking the assessment)
  useEffect(() => {
    if (step !== 'assessment') return;
    if (Object.keys(answers).length === 0) return;
    const payload: SavedProgress = { formData, userRole, lang, answers, currentQuestionIndex };
    try { localStorage.setItem(LS_PROGRESS, JSON.stringify(payload)); } catch { /* noop */ }
    setHasSavedProgress(true);
  }, [answers, currentQuestionIndex, step, formData, userRole, lang]);

  // Sync authenticated user data into formData and advance step if returning from redirect
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setFormData(prev => ({
          ...prev,
          employeeName: user.displayName || prev.employeeName,
          employeeEmail: user.email || prev.employeeEmail,
        }));
        // If we're on the welcome screen and auth state changes to signed-in, check for progress
        setStep(prevStep => {
          if (prevStep === 'welcome') {
             // Let them stay on welcome if they have progress, so they can click "Resume"
             // Otherwise go to role-select
             return hasSavedProgress ? 'welcome' : 'role-select';
          }
          return prevStep;
        });
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setStep('welcome'); // Force unauthenticated users to welcome screen
      }
    });
    return () => unsubscribe();
  }, [hasSavedProgress]);

  // --- Auth helpers ---

  const advanceToRoleSelect = (user: any) => {
    if (!user) {
      setAuthError(lang === 'he' ? 'אימות נכשל. נסה שוב' : 'Authentication failed. Please try again');
      return;
    }
    setFormData(prev => ({
      ...prev,
      employeeName: user.displayName || prev.employeeName,
      employeeEmail: user.email || prev.employeeEmail,
    }));
    setStep('role-select');
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const user = await signInWithGoogle();
      advanceToRoleSelect(user);
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // user dismissed — no error needed
      } else if (code === 'auth/network-request-failed') {
        setAuthError(lang === 'he' ? 'בעיית חיבור לרשת. בדוק את החיבור שלך' : 'Network error. Check your connection');
      } else {
        setAuthError(lang === 'he' ? 'כניסה עם Google נכשלה. נסה שוב' : 'Google sign in failed. Please try again');
      }
    }
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const user = await signInWithEmail(email, password);
      advanceToRoleSelect(user);
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setAuthError(lang === 'he' ? 'אימייל או סיסמה שגויים' : 'Invalid email or password');
      } else if (code === 'auth/too-many-requests') {
        setAuthError(lang === 'he' ? 'יותר מדי ניסיונות. נסה שוב מאוחר יותר' : 'Too many attempts. Try again later');
      } else if (code === 'auth/invalid-email') {
        setAuthError(lang === 'he' ? 'כתובת אימייל לא תקינה' : 'Invalid email address');
      } else if (code === 'auth/network-request-failed') {
        setAuthError(lang === 'he' ? 'בעיית חיבור לרשת. בדוק את החיבור שלך' : 'Network error. Check your connection');
      } else {
        setAuthError(lang === 'he' ? 'שגיאת התחברות. נסה שוב' : 'Sign in failed. Please try again');
      }
    }
  };

  const handleEmailSignUp = async (email: string, password: string) => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const user = await signUpWithEmail(email, password);
      advanceToRoleSelect(user);
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/email-already-in-use') {
        setAuthError(lang === 'he' ? 'כתובת האימייל כבר רשומה במערכת' : 'Email already in use. Try signing in instead');
      } else if (code === 'auth/weak-password') {
        setAuthError(lang === 'he' ? 'הסיסמה חלשה מדי (מינימום 6 תווים)' : 'Password is too weak (min 6 characters)');
      } else if (code === 'auth/invalid-email') {
        setAuthError(lang === 'he' ? 'כתובת אימייל לא תקינה' : 'Invalid email address');
      } else if (code === 'auth/network-request-failed') {
        setAuthError(lang === 'he' ? 'בעיית חיבור לרשת. בדוק את החיבור שלך' : 'Network error. Check your connection');
      } else {
        setAuthError(lang === 'he' ? 'הרשמה נכשלה. נסה שוב' : 'Sign up failed. Please try again');
      }
    }
  };

  const handleForgotPassword = async (email: string) => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      await sendPasswordReset(email);
      setAuthSuccess(lang === 'he' ? 'קישור לאיפוס סיסמה נשלח לאימייל שלך' : 'Password reset link sent — check your inbox');
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/user-not-found') {
        setAuthError(lang === 'he' ? 'לא נמצא חשבון עם כתובת האימייל הזו' : 'No account found with this email');
      } else if (code === 'auth/network-request-failed') {
        setAuthError(lang === 'he' ? 'בעיית חיבור לרשת. בדוק את החיבור שלך' : 'Network error. Check your connection');
      } else {
        setAuthError(lang === 'he' ? 'שליחה נכשלה. בדוק את האימייל ונסה שוב' : 'Failed to send. Check the email and try again');
      }
    }
  };

  // --- Data Sync ---

  const syncData = async (type: 'submission' | 'interaction', payload: any) => {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes('REPLACE_WITH') || WEBHOOK_URL.includes('REPLACE_ME')) {
      console.warn('Webhook URL not configured');
      return;
    }
    const data = {
      appId: APP_ID,
      timestamp: new Date().toISOString(),
      eventType: type,
      language: lang,
      userRole,
      user: formData,
      ...payload
    };
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error('Data sync failed', e);
    }
  };

  // --- Logic Helpers ---

  const handleReset = () => {
    setStep('welcome');
    setAnswers({});
    setResults(null);
    setCurrentQuestionIndex(0);
    setCategoryIntro(null);
    setPendingNextIndex(0);
    setFormData({ employeeName: '', employeeEmail: '', managerName: '', managerEmail: '' });
    clearSavedProgress();
    setHasSavedProgress(false);
    // Preserve userRole and lang — those are the user's preferences, not assessment data.
  };

  const handleCategoryReady = () => {
    setCategoryIntro(null);
    setCurrentQuestionIndex(pendingNextIndex);
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!formData.employeeName) return;
    setStep('role-select');
  };

  const handleRoleConfirm = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCategoryIntro('autonomy');
    setStep('assessment');
  };

  const handleResume = () => {
    if (!isAuthenticated) return;
    const p = readSavedProgress();
    if (!p) return;
    setFormData(p.formData);
    setUserRole(p.userRole);
    setLang(p.lang);
    setAnswers(p.answers);
    setCurrentQuestionIndex(p.currentQuestionIndex);
    setStep('assessment');
  };

  const handleDiscardProgress = () => {
    clearSavedProgress();
    setHasSavedProgress(false);
  };

  const calculateResults = (inputAnswers: Answers | null = null) => {
    const data = inputAnswers || answers;
    const cats: Record<CategoryKey, number> = { autonomy: 0, competence: 0, relatedness: 0 };
    const counts: Record<CategoryKey, number> = { autonomy: 0, competence: 0, relatedness: 0 };

    QUESTIONS.forEach(q => {
      const val = data[q.id] || 3;
      cats[q.category] += (q.weight === 1 ? val : 6 - val);
      counts[q.category]++;
    });

    const final: Partial<Results> = {};
    Object.keys(COLORS).forEach(k => {
      const key = k as CategoryKey;
      final[key] = (cats[key] / counts[key]).toFixed(1);
    });

    const calculatedResults = final as Results;
    setResults(calculatedResults);
    setStep('analysis');

    // Assessment complete — clear in-flight progress
    clearSavedProgress();
    setHasSavedProgress(false);

    // Prepare full insights data for the sheet (role-aware)
    const roleKey: 'employee' | 'manager' = userRole === 'manager' ? 'manager' : 'employee';
    const insightsSummary = (['autonomy', 'competence', 'relatedness'] as CategoryKey[]).reduce((acc, cat) => {
      const score = parseFloat(calculatedResults[cat]);
      const insight = t.deepAnalysis[cat][roleKey][score < 3.5 ? 'low' : 'high'];
      acc[cat] = { score, analysis: insight.analysis, actions: insight.actions };
      return acc;
    }, {} as any);

    syncData('submission', { answers: data, results: calculatedResults, insights: insightsSummary });
  };

  const handleDemo = (type: 'high' | 'mid' | 'at-risk') => {
    setFormData({ employeeName: 'Demo User', employeeEmail: 'demo@example.com', managerName: '', managerEmail: '' });
    const demo: Answers = {};
    QUESTIONS.forEach(q => {
      if (type === 'high') demo[q.id] = q.weight === 1 ? 5 : 1;
      else if (type === 'at-risk') demo[q.id] = q.weight === 1 ? 1 : 5;
      else demo[q.id] = 3;
    });
    setAnswers(demo);
    calculateResults(demo);
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = String(text);
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setStatusMsg(t.copied);
    setTimeout(() => setStatusMsg(''), 3000);
    syncData('interaction', { action: 'copy_report', length: text.length });
  };

  const generateFullReportText = (variant: 'self' | 'share' = 'self') => {
    if (!results) return '';
    let text = '';
    if (variant === 'share') {
      text += `${t.shareIntroLine}\n\n`;
    }
    text += `${t.profileTitle} - ${formData.employeeName}\n`;
    text += `===============================\n\n`;

    const labels = {
      analysis: lang === 'he' ? 'ניתוח' : 'Analysis',
      actions: lang === 'he' ? 'פעולות מומלצות' : 'Recommended Actions',
      aiTips: lang === 'he' ? 'טיפ AI אסטרטגי' : 'Strategic AI Tip',
    };

    const roleKey: 'employee' | 'manager' = userRole === 'manager' ? 'manager' : 'employee';

    (['autonomy', 'competence', 'relatedness'] as CategoryKey[]).forEach(cat => {
      const score = results[cat];
      const scoreNum = parseFloat(score);
      const isLow = scoreNum < 3.5;
      const data = t.deepAnalysis[cat][roleKey][isLow ? 'low' : 'high'];

      text += `💠 ${t.categories[cat].toUpperCase()} (${score}/5.0)\n`;
      text += `-------------------------------\n`;
      text += `   • ${labels.analysis}: ${data.analysis}\n`;
      text += `   • ${labels.actions}: ${data.actions.join(', ')}\n`;
      if (data.aiTips) {
        text += `   • ${labels.aiTips}: ${data.aiTips}\n`;
      }
      text += `\n`;
    });

    const appUrl = 'https://motivation-catalyst-david.web.app';
    const cta = lang === 'he'
      ? `\n\n---\nגלו מה מניע אתכם בעבודה. עשו את האבחון חינם:\n${appUrl}`
      : `\n\n---\nDiscover what drives you at work. Take the free assessment:\n${appUrl}`;
    
    text += cta;
    return text;
  };

  const handleAnswer = (questionId: number, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      const currentCat = QUESTIONS[currentQuestionIndex].category;
      const nextCat = QUESTIONS[nextIndex].category;
      if (nextCat !== currentCat) {
        setPendingNextIndex(nextIndex);
        setCategoryIntro(nextCat);
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
    } else {
      calculateResults(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(i => i - 1);
    } else {
      setStep('role-select');
    }
  };

  const handleRetakeReminder = () => {
    const email = formData.employeeEmail;
    if (!email) return;
    const subject = encodeURIComponent(t.whatsNextRetakeSubject);
    const body = encodeURIComponent(t.whatsNextRetakeBody);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    syncData('interaction', { action: 'retake_reminder' });
  };

  const handleSocialClick = (platform: string) => {
    syncData('interaction', { action: 'social_click', platform });
  };

  const isAdmin = currentUser?.email?.toLowerCase() === 'tsur.david@gmail.com';

  const mainApp = (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center md:py-12 md:px-6 font-sans text-slate-900 selection:bg-[#38BDF8]/30 relative" style={{ backgroundColor: 'var(--b2c-ice)' }}>
      {isAuthenticated && (
        <AppHeader
          userName={currentUser?.displayName || formData.employeeName}
          userPhotoUrl={currentUser?.photoURL}
          isAdmin={isAdmin}
          onManageFeedback={() => setIsAdminPanelOpen(true)}
          lang={lang}
          setLang={setLang}
        />
      )}

      {step === 'welcome' && (
        <WelcomeView
          t={t}
          lang={lang}
          setLang={setLang}
          formData={formData}
          setFormData={setFormData}
          onStart={handleStart}
          onDemo={handleDemo}
          onGoogleLogin={handleGoogleLogin}
          onEmailSignIn={handleEmailSignIn}
          onEmailSignUp={handleEmailSignUp}
          onForgotPassword={handleForgotPassword}
          authError={authError}
          authSuccess={authSuccess}
          hasSavedProgress={hasSavedProgress}
          isAuthenticated={isAuthenticated}
          onResume={handleResume}
          onDiscardProgress={handleDiscardProgress}
        />
      )}
      {step === 'role-select' && (
        <RoleSelectView
          t={t}
          lang={lang}
          setLang={setLang}
          formData={formData}
          userRole={userRole}
          setUserRole={setUserRole}
          onConfirm={handleRoleConfirm}
          onBack={() => setStep('welcome')}
        />
      )}
      {step === 'assessment' && categoryIntro && (
        <CategoryIntroCard
          category={categoryIntro}
          t={t}
          lang={lang}
          sectionNumber={categoryIntro === 'competence' ? 2 : 3}
          onReady={handleCategoryReady}
        />
      )}
      {step === 'assessment' && !categoryIntro && (
        <AssessmentView
          t={t}
          lang={lang}
          setLang={setLang}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      )}
      {step === 'analysis' && results && (
        <AnalysisView
          t={t}
          lang={lang}
          setLang={setLang}
          userRole={userRole}
          formData={formData}
          results={results}
          onReset={handleReset}
          copyToClipboard={copyToClipboard}
          generateFullReportText={generateFullReportText}
          onRetakeReminder={handleRetakeReminder}
          statusMsg={statusMsg}
          onSocialClick={handleSocialClick}
          answers={answers}
        />
      )}

      <AdminFeedbackPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </div>
  );

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--b2c-ice)' }} />}>
      <Routes>
        <Route path="/" element={mainApp} />
        <Route path="/terms" element={<TermsView />} />
        <Route path="/privacy" element={<PrivacyView />} />
        <Route path="/accessibility" element={<AccessibilityView />} />
      </Routes>
    </Suspense>
  );
};

export default App;
