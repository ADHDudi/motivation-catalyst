import React, { useState } from 'react';
import { UserCheck, ShieldCheck, RefreshCw, Copy, BrainCircuit, Sparkles, CheckCircle2, AlertCircle, ThumbsUp, ThumbsDown, Clipboard, Linkedin, Youtube, Facebook, Send } from 'lucide-react';
import Logo from '../components/Logo';
import ResultPolarChart from '../components/ResultPolarChart';
import AccordionItem from '../components/AccordionItem';
import { TranslationData, Results, Language, CategoryKey } from '../types';
import { COLORS } from '../constants';
import { hexToRgba, getOpacityForScore, getTextColorForScore } from '../utils';
import { saveFeedback } from '../firestoreUtils';

interface AnalysisViewProps {
  t: TranslationData;
  lang: Language;
  setLang: (lang: Language) => void;
  results: Results | null;
  onReset: () => void;
  copyToClipboard: (text: string) => void;
  generateFullReportText: () => string;
  statusMsg: string;
  onSocialClick?: (platform: string) => void;
}

interface CategoryInsightProps {
  categoryKey: CategoryKey;
  score: string;
  type: 'employee' | 'manager';
  t: TranslationData;
  lang: Language;
}

const CategoryInsight: React.FC<CategoryInsightProps> = ({ categoryKey, score, type, t, lang }) => {
  const scoreVal = parseFloat(score);
  const isLow = scoreVal < 3.5;
  const data = t.deepAnalysis[categoryKey][type][isLow ? 'low' : 'high'];

  const opacity = getOpacityForScore(scoreVal);
  const mainColor = COLORS[categoryKey].hex;
  const bgColor = hexToRgba(mainColor, opacity);
  const textColor = getTextColorForScore(scoreVal);
  const title = `${t.categories[categoryKey]} (${score})`;

  return (
    <AccordionItem title={title} style={{ backgroundColor: bgColor }}>
      <div className={`text-sm leading-relaxed mb-3 ${textColor}`}>
        <span className="font-bold opacity-75">{lang === 'he' ? 'ניתוח:' : 'Analysis:'}</span> {data.analysis}
      </div>
      <ul className="space-y-2">
        {data.actions.map((action, idx) => (
          <li key={idx} className={`flex gap-2 text-xs font-medium ${textColor}`}>
            {isLow ? <AlertCircle size={14} className="shrink-0" /> : <CheckCircle2 size={14} className="shrink-0" />}
            {action}
          </li>
        ))}
      </ul>
    </AccordionItem>
  );
};

interface AnalysisSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onCopy: () => void;
  copyLabel: string;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, icon: Icon, children, onCopy, copyLabel }) => {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h4 className="text-lg font-black flex items-center gap-2 text-[#324FA2]">
          <Icon size={20} className="text-[#324FA2]" /> {title}
        </h4>
        <button onClick={onCopy} className="p-2 bg-slate-50 hover:bg-slate-100 text-[#324FA2] rounded-xl transition-colors" title={copyLabel}>
          <Copy size={16} />
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

const AnalysisView: React.FC<AnalysisViewProps> = ({ t, lang, setLang, results, onReset, copyToClipboard, generateFullReportText, statusMsg, onSocialClick }) => {
  const [feedbackState, setFeedbackState] = useState<'idle' | 'commenting' | 'submitted'>('idle');
  const [comment, setComment] = useState('');

  const [rating, setRating] = useState<number>(0);

  const handleThumbClick = (selectedRating: number) => {
    setRating(selectedRating);
    if (feedbackState === 'idle') {
      setFeedbackState('commenting');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!results) return;

    try {
      await saveFeedback({
        rating,
        comment,
        timestamp: null,
        results
      });
      setFeedbackState('submitted');
    } catch (e) {
      console.error("Failed to submit feedback", e);
      setFeedbackState('submitted');
    }
  };

  if (!results) return null;

  return (
    <div className={`w-full max-w-4xl mx-auto bg-white md:rounded-[60px] shadow-2xl overflow-hidden text-${t.dir === 'rtl' ? 'right' : 'left'} pb-12`} dir={t.dir}>
      <div className="p-8 md:p-12 pt-16">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} className="bg-slate-50 text-slate-400 p-3 rounded-2xl text-[10px] font-black transition-all active:scale-90">
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
          <Logo size="sm" />
        </div>
        <h2 className="text-4xl font-black text-[#324FA2] text-center mb-8">{t.profileTitle}</h2>
        <ResultPolarChart scores={results} t={t} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <AnalysisSection title={t.userInsights} icon={UserCheck} onCopy={() => copyToClipboard(generateFullReportText())} copyLabel={t.copyEmployee}>
            {(['autonomy', 'competence', 'relatedness'] as CategoryKey[]).map(c => (
              <CategoryInsight key={c} categoryKey={c} score={results[c]} type="employee" t={t} lang={lang} />
            ))}
          </AnalysisSection>
          <AnalysisSection title={t.managerRecs} icon={ShieldCheck} onCopy={() => copyToClipboard('Manager Recommendations')} copyLabel={t.copyManager}>
            {(['autonomy', 'competence', 'relatedness'] as CategoryKey[]).map(c => (
              <CategoryInsight key={c} categoryKey={c} score={results[c]} type="manager" t={t} lang={lang} />
            ))}
          </AnalysisSection>
        </div>

        {/* AI INSIGHTS FOR EMPLOYEE */}
        <div className="mt-8 bg-gradient-to-br from-[#324FA2]/5 to-[#78A9D6]/10 p-8 rounded-[40px] border-4 border-[#324FA2]/10 relative overflow-hidden">
          <div className="absolute top-[-10px] left-[-10px] opacity-10"><BrainCircuit size={100} className="text-[#324FA2]" /></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-white rounded-2xl shadow-md text-[#324FA2]"><Sparkles size={24} /></div>
            <h3 className="font-black text-2xl text-[#324FA2]">{t.aiInsightsTitle}</h3>
          </div>
          <div className="space-y-6 relative z-10">
            {(['autonomy', 'competence', 'relatedness'] as CategoryKey[]).map(cat => {
              const scoreVal = parseFloat(results[cat]);
              const data = t.deepAnalysis[cat].employee[scoreVal < 3.5 ? 'low' : 'high'];
              return (
                <div key={cat} className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm">
                  <h4 className="font-black text-[#324FA2] mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[cat].hex }}></div>
                    {t.categories[cat]}
                  </h4>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed">{data.aiTips}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FEEDBACK MECHANISM */}
        <div className="mt-8 p-8 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-center relative overflow-hidden transition-all duration-300">
          {feedbackState === 'submitted' ? (
            <div className="animate-in zoom-in-95">
              <div className="p-4 bg-[#90BC6E]/10 rounded-full inline-block mb-3 text-[#90BC6E]"><CheckCircle2 size={32} /></div>
              <p className="font-black text-[#324FA2]">{t.feedbackThanks}</p>
            </div>
          ) : (
            <>
              <h4 className="font-black text-[#324FA2] text-lg mb-6">{t.feedbackTitle}</h4>
              <div className="flex justify-center gap-6 mb-6">
                <button onClick={() => handleThumbClick(5)} className={`p-4 bg-white rounded-full shadow-sm hover:bg-[#90BC6E] hover:text-white transition-all active:scale-95 border border-slate-100 ${rating === 5 ? 'bg-[#90BC6E] text-white ring-4 ring-[#90BC6E]/30' : ''}`}><ThumbsUp size={24} /></button>
                <button onClick={() => handleThumbClick(1)} className={`p-4 bg-white rounded-full shadow-sm hover:bg-[#E46B3F] hover:text-white transition-all active:scale-95 border border-slate-100 ${rating === 1 ? 'bg-[#E46B3F] text-white ring-4 ring-[#E46B3F]/30' : ''}`}><ThumbsDown size={24} /></button>
              </div>

              {feedbackState === 'commenting' && (
                <div className="animate-in slide-in-from-bottom-2 fade-in max-w-sm mx-auto">
                  <textarea
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#324FA2] mb-3 min-h-[80px]"
                    placeholder={t.feedbackComment}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button onClick={handleSubmitFeedback} className="px-6 py-2 bg-[#324FA2] text-white rounded-full text-sm font-bold flex items-center gap-2 mx-auto hover:bg-[#263E82] transition-colors">
                    {t.sendFeedback} <Send size={14} className={t.dir === 'rtl' ? 'rotate-180' : ''} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-12 space-y-5">
          <button onClick={() => copyToClipboard(generateFullReportText())} className="w-full py-6 bg-[#324FA2] text-white rounded-[30px] font-black text-xl flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"><Clipboard size={24} /> {t.copyReport}</button>
        </div>

        <div className="mt-20 pt-10 border-t-4 border-dashed border-slate-50 flex flex-col items-center gap-6">
          <p className="text-sm font-black text-slate-300 uppercase tracking-widest">{t.followMe}</p>
          <div className="flex gap-8" dir="ltr">
            <a href="https://www.linkedin.com/in/davidtsur/" target="_blank" rel="noopener noreferrer" onClick={() => onSocialClick?.('linkedin')} className="p-4 bg-slate-50 text-[#324FA2] rounded-full hover:bg-[#324FA2] hover:text-white transition-all shadow-sm"><Linkedin size={24} /></a>
            <a href="https://www.youtube.com/@ADHDudiDO" target="_blank" rel="noopener noreferrer" onClick={() => onSocialClick?.('youtube')} className="p-4 bg-slate-50 text-[#324FA2] rounded-full hover:bg-[#E46B3F] hover:text-white transition-all shadow-sm"><Youtube size={24} /></a>
            <a href="https://www.facebook.com/ADHDudi.D" target="_blank" rel="noopener noreferrer" onClick={() => onSocialClick?.('facebook')} className="p-4 bg-slate-50 text-[#324FA2] rounded-full hover:bg-[#324FA2] hover:text-white transition-all shadow-sm"><Facebook size={24} /></a>
          </div>

          {/* Start Over Link */}
          <button onClick={onReset} className="mt-4 text-[#78A9D6] font-bold text-sm underline hover:text-[#324FA2] transition-colors">
            {t.startOver}
          </button>
        </div>
      </div>
      {statusMsg && <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-[#324FA2] text-white text-sm font-black rounded-full animate-in fade-in slide-in-from-bottom-2 z-50 shadow-2xl">{String(statusMsg)}</div>}
    </div>
  );
};

export default AnalysisView;