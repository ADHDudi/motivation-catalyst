import React, { useState, useEffect } from 'react';
import { QUESTIONS, TRANSLATIONS, COLORS, APP_ID, WEBHOOK_URL } from './constants';
import WelcomeView from './views/WelcomeView';
import AssessmentView from './views/AssessmentView';
import AnalysisView from './views/AnalysisView';
import { Language, FormData, Answers, Results, CategoryKey } from './types';
import { signInWithGoogle, onAuthStateChange, signInWithEmail, signUpWithEmail, sendPasswordReset } from './authUtils';

const App = () => {
  const [lang, setLang] = useState<Language>('he');
  const [step, setStep] = useState<'welcome' | 'assessment' | 'analysis'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({ employeeName: '', employeeEmail: '', managerName: '', managerEmail: '' });
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<Results | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

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

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setFormData(prev => ({
          ...prev,
          employeeName: user.displayName || prev.employeeName,
          employeeEmail: user.email || prev.employeeEmail,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const advanceToAssessment = (user: any) => {
    if (!user) {
      setAuthError(lang === 'he' ? 'אימות נכשל. נסה שוב' : 'Authentication failed. Please try again');
      return;
    }
    setFormData(prev => ({
      ...prev,
      employeeName: user.displayName || prev.employeeName,
      employeeEmail: user.email || prev.employeeEmail,
    }));
    setStep('assessment');
    setCurrentQuestionIndex(0);
  };

  const handleEmailSignIn = async (email: string, password: string) => {
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const user = await signInWithEmail(email, password);
      advanceToAssessment(user);
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
      advanceToAssessment(user);
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

  // --- Data Sync Logic ---

  const syncData = async (type: 'submission' | 'interaction', payload: any) => {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes('REPLACE_WITH')) {
      console.warn('Webhook URL not configured');
      return;
    }

    const data = {
      appId: APP_ID,
      timestamp: new Date().toISOString(),
      eventType: type,
      language: lang,
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
    setFormData({ employeeName: '', employeeEmail: '', managerName: '', managerEmail: '' });
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!formData.employeeName) return;
    setStep('assessment');
    setCurrentQuestionIndex(0);
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

    // Prepare full insights data for the sheet
    const insightsSummary = (['autonomy', 'competence', 'relatedness'] as CategoryKey[]).reduce((acc, cat) => {
      const score = parseFloat(calculatedResults[cat]);
      const insight = t.deepAnalysis[cat].employee[score < 3.5 ? 'low' : 'high'];
      acc[cat] = {
        score,
        analysis: insight.analysis,
        actions: insight.actions
      };
      return acc;
    }, {} as any);

    // POST full results to the sheet
    syncData('submission', {
      answers: data,
      results: calculatedResults,
      insights: insightsSummary
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

  const generateFullReportText = () => {
    if (!results) return "";
    let text = `${t.profileTitle} - ${formData.employeeName}\n`;
    text += `===============================\n\n`;

    const labels = {
      analysis: lang === 'he' ? 'ניתוח' : 'Analysis',
      actions: lang === 'he' ? 'פעולות מומלצות' : 'Recommended Actions',
      aiTips: lang === 'he' ? 'טיפ AI אסטרטגי' : 'Strategic AI Tip',
      managerTitle: lang === 'he' ? 'המלצות למנהל' : 'Manager Recommendations',
      selfTitle: lang === 'he' ? 'תובנות אישיות' : 'Personal Insights'
    };

    (['autonomy', 'competence', 'relatedness'] as CategoryKey[]).forEach(cat => {
      const score = results[cat];
      const scoreNum = parseFloat(score);
      const isLow = scoreNum < 3.5;

      const empData = t.deepAnalysis[cat].employee[isLow ? 'low' : 'high'];
      const mgrData = t.deepAnalysis[cat].manager[isLow ? 'low' : 'high'];

      text += `💠 ${t.categories[cat].toUpperCase()} (${score}/5.0)\n`;
      text += `-------------------------------\n`;

      // Personal Section
      text += `👤 ${labels.selfTitle}:\n`;
      text += `   • ${labels.analysis}: ${empData.analysis}\n`;
      text += `   • ${labels.actions}: ${empData.actions.join(', ')}\n\n`;

      // Manager Section
      text += `📋 ${labels.managerTitle}:\n`;
      text += `   • ${labels.analysis}: ${mgrData.analysis}\n`;
      text += `   • ${labels.actions}: ${mgrData.actions.join(', ')}\n\n`;

      // AI Section
      if (empData.aiTips) {
        text += `✨ ${labels.aiTips}:\n`;
        text += `   ${empData.aiTips}\n\n`;
      }

      text += `\n`;
    });

    text += `\nGenerated via Motivation Catalyst`;
    return text;
  };

  const handleAnswer = (questionId: number, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(i => i - 1);
    } else {
      setStep('welcome');
    }
  };

  const handleSocialClick = (platform: string) => {
    syncData('interaction', { action: 'social_click', platform });
  };

  return (
    <div className="min-h-screen md:py-12 md:px-6 font-sans text-slate-900 selection:bg-[#78A9D6]/30" style={{ backgroundColor: 'var(--b2c-ice)' }}>
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
        />
      )}
      {step === 'assessment' && (
        <AssessmentView
          t={t}
          lang={lang}
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
          results={results}
          onReset={handleReset}
          copyToClipboard={copyToClipboard}
          generateFullReportText={generateFullReportText}
          statusMsg={statusMsg}
          onSocialClick={handleSocialClick}
          answers={answers}
          formData={formData}
        />
      )}
    </div>
  );
};

export default App;