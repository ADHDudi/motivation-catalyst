import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QUESTIONS, TRANSLATIONS, COLORS, APP_ID, WEBHOOK_URL } from './constants';
import WelcomeView from './views/WelcomeView';
import RoleSelectView from './views/RoleSelectView';
import AssessmentView from './views/AssessmentView';
import AnalysisView from './views/AnalysisView';
import CategoryIntroCard from './components/CategoryIntroCard';
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
const LS_RESULTS = 'mc_last_results';

interface SavedResults {
  results: Results;
  answers: Answers;
  userRole: UserRole;
  lang: Language;
  savedAt: string; // ISO date string
}

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
  const [hasSavedResults, setHasSavedResults] = useState<boolean>(() => {
    try { return !!localStorage.getItem(LS_RESULTS); } catch { return false; }
  });

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

  // Sync authenticated user data into formData
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setFormData(prev => ({
          ...prev,
          employeeName: user.displayName || prev.employeeName,
          employeeEmail: user.email || prev.employeeEmail,
        }));
      }
    });
    return () => unsubscribe();
  }, []);

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

  const handleViewLastAnalysis = () => {
    try {
      const raw = localStorage.getItem(LS_RESULTS);
      if (!raw) return;
      const saved: SavedResults = JSON.parse(raw);
      setResults(saved.results);
      setAnswers(saved.answers);
      setUserRole(saved.userRole);
      setLang(saved.lang);
      setStep('analysis');
    } catch {
      // corrupted data — proceed to role-select
      setStep('role-select');
    }
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

    // Save completed results for "view last analysis" feature
    try {
      const toSave: SavedResults = {
        results: calculatedResults,
        answers: data,
        userRole,
        lang,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(LS_RESULTS, JSON.stringify(toSave));
      setHasSavedResults(true);
    } catch { /* noop */ }

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

    syncData('submission', {
      answers: data,
      results: calculatedResults,
      insights: insightsSummary,
      questionVariant: userRole === 'manager' ? 'manager' : 'employee',
    });
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

    const isSelf = variant === 'self';
    const isHe = lang === 'he';
    const name = formData.employeeName || (isHe ? 'משתמש' : 'User');

    // Self → personal actions the user can take (employee branch)
    // Share → guidance for manager/team on how to work with the user (manager branch)
    const dataKey: 'employee' | 'manager' = isSelf ? 'employee' : 'manager';

    const labels = isSelf
      ? {
          header:   isHe ? `הפרופיל שלי — ${name}` : `My Motivation Profile — ${name}`,
          intro:    isHe
            ? `עשיתי אבחון מוטיבציה לפי מודל SDT. אלה התובנות שלי ומה שאני מתכנן לעשות:`
            : `I completed an SDT motivation assessment. Here are my insights and what I plan to do:`,
          insight:  isHe ? 'תובנה' : 'Insight',
          actions:  isHe ? 'מה שאני יכול לעשות' : 'What I can do',
          aiTip:    isHe ? 'טיפ AI אישי' : 'My AI tip',
        }
      : {
          header:   isHe ? `הפרופיל של ${name} — איך לעבוד איתי` : `${name}'s Motivation Profile — How to work with me`,
          intro:    isHe
            ? `היי, עשיתי אבחון מוטיבציה לפי מודל SDT. הנה מה שיעזור לי — מה שאני מבקש מהמנהל/צוות:`
            : `Hi, I completed an SDT motivation assessment. Here's what helps me — what I'm asking from my manager / team:`,
          insight:  isHe ? 'ההקשר' : 'Context',
          actions:  isHe ? 'מה שיעזור לי מהצוות / מנהל' : 'How you can support me',
          aiTip:    isHe ? 'טיפ AI לצוות' : 'AI tip for the team',
        };

    let text = `${labels.header}\n`;
    text += `===============================\n`;
    text += `${labels.intro}\n\n`;

    (['autonomy', 'competence', 'relatedness'] as CategoryKey[]).forEach(cat => {
      const score = results[cat];
      const isLow = parseFloat(score) < 3.5;
      const data = t.deepAnalysis[cat][dataKey][isLow ? 'low' : 'high'];

      text += `💠 ${t.categories[cat].toUpperCase()} (${score}/5.0)\n`;
      text += `-------------------------------\n`;
      text += `   • ${labels.insight}: ${data.analysis}\n`;
      text += `   • ${labels.actions}: ${data.actions.join(' | ')}\n`;
      if (data.aiTips) {
        text += `   • ${labels.aiTip}: ${data.aiTips}\n`;
      }
      text += `\n`;
    });

    text += `\nGenerated via MotivationOS — https://justaiit.web.app/he#app=motivation-catalyst`;
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


  const handleSocialClick = (platform: string) => {
    syncData('interaction', { action: 'social_click', platform });
  };

  const mainApp = (
    <div className="min-h-screen md:py-12 md:px-6 font-sans text-slate-900 selection:bg-[#38BDF8]/30" style={{ backgroundColor: 'var(--b2c-ice)' }}>
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
          onResume={handleResume}
          onDiscardProgress={handleDiscardProgress}
          hasSavedResults={hasSavedResults}
          onViewLastAnalysis={handleViewLastAnalysis}
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
          userRole={userRole}
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
          statusMsg={statusMsg}
          onSocialClick={handleSocialClick}
          answers={answers}
        />
      )}
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
