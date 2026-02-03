import React, { useState, useEffect } from 'react';
import { QUESTIONS, TRANSLATIONS, COLORS, APP_ID, WEBHOOK_URL } from './constants';
import WelcomeView from './views/WelcomeView';
import AssessmentView from './views/AssessmentView';
import AnalysisView from './views/AnalysisView';
import { Language, FormData, Answers, Results, CategoryKey } from './types';

const App = () => {
  const [lang, setLang] = useState<Language>('he');
  const [step, setStep] = useState<'welcome' | 'assessment' | 'analysis'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({ employeeName: '', employeeEmail: '', managerName: '', managerEmail: '' });
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<Results | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const t = TRANSLATIONS[lang];

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
    <div className="min-h-screen bg-[#F1F5F9] md:py-12 md:px-6 font-sans text-slate-900 selection:bg-[#78A9D6]/30">
      {step === 'welcome' && (
        <WelcomeView 
          t={t} 
          lang={lang} 
          setLang={setLang} 
          formData={formData} 
          setFormData={setFormData} 
          onStart={handleStart} 
          onDemo={handleDemo} 
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
        />
      )}
    </div>
  );
};

export default App;