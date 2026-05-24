import React, { useState, useEffect } from 'react';
import { generateMotivationAnalysis } from '../services/geminiService';
import { MotivationAnalysisResult, Answers, FormData } from '../types';
import { QUESTIONS } from '../constants';
import {
  UserCheck, ShieldCheck, Copy, BrainCircuit, Sparkles,
  CheckCircle2, AlertCircle, ThumbsUp, ThumbsDown,
  Clipboard, Share2, ArrowRight, Send
} from 'lucide-react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import ResultPolarChart from '../components/ResultPolarChart';
import AccordionItem from '../components/AccordionItem';
import { TranslationData, Results, Language, CategoryKey, UserRole } from '../types';
import { COLORS } from '../constants';
import { hexToRgba, getOpacityForScore, getTextColorForScore } from '../utils';
import { saveFeedback } from '../firestoreUtils';

interface AnalysisViewProps {
  t: TranslationData;
  lang: Language;
  setLang: (lang: Language) => void;
  userRole: UserRole;
  formData: FormData;
  results: Results | null;
  onReset: () => void;
  copyToClipboard: (text: string) => void;
  generateFullReportText: (variant?: 'self' | 'share') => string;
  statusMsg: string;
  onSocialClick?: (platform: string) => void;
  answers: Answers;
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
    <AccordionItem title={title} style={{ backgroundColor: bgColor }} defaultOpen>
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

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, icon: Icon, children, onCopy, copyLabel }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
      <h4 className="text-lg font-black flex items-center gap-2" style={{ color: 'var(--b2c-deep)' }}>
        <Icon size={20} style={{ color: 'var(--b2c-deep)' }} /> {title}
      </h4>
      <button onClick={onCopy} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors" title={copyLabel} style={{ color: 'var(--b2c-azure)' }} aria-label={copyLabel}>
        <Copy size={16} />
      </button>
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

interface WhatsNextCardProps {
  title: string;
  desc: string;
  icon: React.ElementType;
  accent: string;
  onClick: () => void;
  dir: 'rtl' | 'ltr';
}

const WhatsNextCard: React.FC<WhatsNextCardProps> = ({ title, desc, icon: Icon, accent, onClick, dir }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group w-full text-${dir === 'rtl' ? 'right' : 'left'} bg-white p-5 rounded-3xl border-2 border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col gap-3`}
  >
    <div className="flex items-center justify-between gap-3">
      <div
        className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: `${accent}1A`, color: accent }}
      >
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <ArrowRight size={16} className={`text-slate-300 group-hover:text-slate-500 transition-colors ${dir === 'rtl' ? 'rotate-180' : ''}`} />
    </div>
    <div>
      <h5 className="font-black text-base leading-tight mb-1" style={{ color: 'var(--b2c-deep)' }}>{title}</h5>
      <p className="text-xs text-slate-500 font-bold leading-snug">{desc}</p>
    </div>
  </button>
);

const AnalysisView: React.FC<AnalysisViewProps> = ({
  t, lang, setLang, userRole, formData, results, onReset,
  copyToClipboard, generateFullReportText, statusMsg, answers
}) => {
  const [feedbackState, setFeedbackState] = useState<'idle' | 'commenting' | 'submitted'>('idle');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(0);

  const [aiInsights, setAiInsights] = useState<MotivationAnalysisResult | null>(null);
  const [lastAiLang, setLastAiLang] = useState<Language | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAIInsights = async () => {
      if (!results) return;
      if (aiInsights && lastAiLang === lang) return;

      setIsLoadingAI(true);
      setAiError(null);
      try {
        const responses = QUESTIONS.map(q => ({
          id: q.id,
          text: q.text[lang],
          score: answers[q.id] || 3,
          category: q.category
        }));

        const analysis = await generateMotivationAnalysis(
          responses,
          formData.employeeName,
          formData.managerName,
          lang
        );

        setAiInsights(analysis);
        setLastAiLang(lang);
      } catch (e) {
        console.warn('Failed to generate AI insights', e);
        setAiError(e instanceof Error ? e.message : String(e));
      } finally {
        setIsLoadingAI(false);
      }
    };

    fetchAIInsights();
  }, [results, lang, answers, formData, aiInsights]);

  const handleThumbClick = (selectedRating: number) => {
    setRating(selectedRating);
    if (feedbackState === 'idle') setFeedbackState('commenting');
  };

  const handleSubmitFeedback = async () => {
    if (!results) return;
    try {
      await saveFeedback({ rating, comment, timestamp: null, results });
    } catch (e) {
      console.error('Failed to submit feedback', e);
    } finally {
      setFeedbackState('submitted');
    }
  };

  if (!results) return null;

  const isManager = userRole === 'manager';
  const roleKey: 'employee' | 'manager' = isManager ? 'manager' : 'employee';
  const sectionTitle = isManager ? t.managerRecs : t.userInsights;
  const sectionIcon = isManager ? ShieldCheck : UserCheck;
  const copyLabel = isManager ? t.copyManager : t.copyEmployee;
  const roleLabel = isManager ? t.roleManagerLabel : t.roleSoloLabel;

  return (
    <div className={`w-full max-w-4xl mx-auto bg-white md:rounded-[60px] shadow-2xl overflow-hidden text-${t.dir === 'rtl' ? 'right' : 'left'} pb-12`} dir={t.dir}>
      <div className="p-8 md:p-12 pt-16">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => setLang(lang === 'he' ? 'en' : 'he')} className="bg-slate-50 p-3 rounded-2xl text-[10px] font-black transition-all active:scale-90" style={{ color: 'var(--b2c-azure)' }} aria-label="Toggle language">
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
          <Logo size="sm" />
        </div>

        <h2 className="text-4xl font-black text-center mb-2" style={{ color: 'var(--b2c-deep)' }}>{t.profileTitle}</h2>
        <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{roleLabel}</p>

        <ResultPolarChart scores={results} t={t} />

        {/* Single, role-branched insights panel */}
        <div className="mt-10">
          <AnalysisSection
            title={sectionTitle}
            icon={sectionIcon}
            onCopy={() => copyToClipboard(generateFullReportText('self'))}
            copyLabel={copyLabel}
          >
            {(['autonomy', 'competence', 'relatedness'] as CategoryKey[]).map(c => (
              <CategoryInsight key={c} categoryKey={c} score={results[c]} type={roleKey} t={t} lang={lang} />
            ))}
          </AnalysisSection>
        </div>

        {/* AI INSIGHTS — role-aware */}
        <div className="mt-8 p-8 rounded-[40px] border-4 relative overflow-hidden" style={{ backgroundColor: 'var(--b2c-mist)', borderColor: 'var(--b2c-azure)', borderOpacity: 0.2 }}>
          <div className="absolute top-[-10px] left-[-10px] opacity-10" style={{ color: 'var(--b2c-deep)' }}><BrainCircuit size={100} /></div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="p-3 bg-white rounded-2xl shadow-md" style={{ color: 'var(--b2c-azure)' }}><Sparkles size={24} /></div>
            <h3 className="font-black text-2xl" style={{ color: 'var(--b2c-deep)' }}>{t.aiInsightsTitle}</h3>
          </div>
          <div className="space-y-6 relative z-10">
            {(['autonomy', 'competence', 'relatedness'] as CategoryKey[]).map(cat => {
              const scoreVal = parseFloat(results[cat]);
              const staticData = t.deepAnalysis[cat][roleKey][scoreVal < 3.5 ? 'low' : 'high'];

              const aiTip = aiInsights ? aiInsights[cat].tip : null;
              const adhdTip = aiInsights?.[cat]?.adhd_tip ?? null;
              const displayTip = aiTip || staticData.aiTips;
              const isDynamic = !!aiTip;

              if (!displayTip) return null;

              return (
                <div key={cat} className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm transition-all hover:shadow-md">
                  <h4 className="font-black mb-2 flex items-center gap-2" style={{ color: 'var(--b2c-deep)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[cat].hex }}></div>
                    {t.categories[cat]}
                    {isLoadingAI && <span className="text-xs font-normal text-slate-400 animate-pulse">{lang === 'he' ? '(מייצר...)' : '(Generating...)'}</span>}
                    {aiError && <span className="text-[10px] text-[var(--b2c-azure)] bg-[var(--b2c-mist)] px-2 py-0.5 rounded-full border border-[var(--b2c-azure)]/20 flex items-center gap-1" title={aiError}><AlertCircle size={10} /> {lang === 'he' ? 'סטטי' : 'Static'}</span>}
                    {isDynamic && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--b2c-mist)', color: 'var(--b2c-deep)' }}>{lang === 'he' ? 'מותאם AI' : 'AI Personalized'}</span>}
                  </h4>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed">{displayTip}</p>

                  {adhdTip && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <h5 className="font-extrabold text-xs uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: 'var(--b2c-azure)' }}>
                        <BrainCircuit size={14} />
                        {lang === 'he' ? 'טיפ מותאם קשב (ADHD)' : 'ADHD Focus Tip'}
                      </h5>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed bg-white p-3 rounded-xl border shadow-sm relative overflow-hidden" style={{ borderColor: 'var(--b2c-azure)', borderOpacity: 0.2 }}>
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: 'var(--b2c-azure)' }}></div>
                        {adhdTip}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* WHAT'S NEXT — 3-step strip */}
        <div className="mt-10">
          <h3 className="font-black text-xl mb-5 flex items-center gap-3" style={{ color: 'var(--b2c-deep)' }}>
            <Sparkles size={20} style={{ color: 'var(--b2c-orange, #1F7AFF)' }} />
            {t.whatsNextTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <WhatsNextCard
              title={t.whatsNextCopyTitle}
              desc={t.whatsNextCopyDesc}
              icon={Clipboard}
              accent="var(--b2c-deep)"
              onClick={() => copyToClipboard(generateFullReportText('self'))}
              dir={t.dir}
            />
            <WhatsNextCard
              title={t.whatsNextShareTitle}
              desc={t.whatsNextShareDesc}
              icon={Share2}
              accent="var(--b2c-azure)"
              onClick={() => copyToClipboard(generateFullReportText('share'))}
              dir={t.dir}
            />
          </div>
        </div>

        {/* FEEDBACK MECHANISM */}
        <div className="mt-10 p-8 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-center relative overflow-hidden transition-all duration-300">
          {feedbackState === 'submitted' ? (
            <div className="animate-in zoom-in-95">
              <div className="p-4 bg-[#90BC6E]/10 rounded-full inline-block mb-3 text-[#90BC6E]"><CheckCircle2 size={32} /></div>
              <p className="font-black" style={{ color: 'var(--b2c-deep)' }}>{t.feedbackThanks}</p>
            </div>
          ) : (
            <>
              <h4 className="font-black text-lg mb-6" style={{ color: 'var(--b2c-deep)' }}>{t.feedbackTitle}</h4>
              <div className="flex justify-center gap-6 mb-6">
                <button onClick={() => handleThumbClick(5)} className={`p-4 bg-white rounded-full shadow-sm hover:bg-[#90BC6E] hover:text-white transition-all active:scale-95 border border-slate-100 ${rating === 5 ? 'bg-[#90BC6E] text-white ring-4 ring-[#90BC6E]/30' : ''}`} aria-label="Helpful"><ThumbsUp size={24} /></button>
                <button onClick={() => handleThumbClick(1)} className={`p-4 bg-white rounded-full shadow-sm hover:text-white transition-all active:scale-95 border border-slate-100 ${rating === 1 ? 'text-white ring-4 ring-[var(--b2c-azure)]/30' : ''}`} style={rating === 1 ? { backgroundColor: 'var(--b2c-azure)' } : {}} aria-label="Not helpful"><ThumbsDown size={24} /></button>
              </div>

              {feedbackState === 'commenting' && (
                <div className="animate-in slide-in-from-bottom-2 fade-in max-w-sm mx-auto">
                  <textarea
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none mb-3 min-h-[80px] transition-colors"
                    style={{ '--tw-border-opacity': '1' } as React.CSSProperties & { '--tw-border-opacity': string }}
                    placeholder={t.feedbackComment}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button onClick={handleSubmitFeedback} className="px-6 py-2 text-white rounded-full text-sm font-bold flex items-center gap-2 mx-auto transition-colors" style={{ backgroundImage: 'var(--gradient-b2c)' }}>
                    {t.sendFeedback} <Send size={14} className={t.dir === 'rtl' ? 'rotate-180' : ''} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-20 pt-10 border-t-4 border-dashed border-slate-50 flex flex-col items-center gap-8">
          {/* Powered by JustAIIt */}
          <a href="https://justaiit.web.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95 no-underline shadow-lg" style={{ background: 'linear-gradient(135deg, #a014f0 0%, #8c50f0 28%, #5078ff 58%, #3cdcf0 100%)' }}>
            <span className="text-xs font-black text-white uppercase tracking-widest">{lang === 'he' ? 'מונע על ידי' : 'Powered by'}</span>
            <span className="text-sm font-black text-white tracking-tighter">Just AI It</span>
          </a>

          <button onClick={onReset} className="font-bold text-sm underline transition-colors" style={{ color: 'var(--b2c-azure)' }}>
            {t.startOver}
          </button>

          {/* Legal footer */}
          <div className="mt-8 w-full flex flex-wrap gap-4 justify-center items-center text-xs font-bold text-slate-300">
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
      {statusMsg && <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 text-white text-sm font-black rounded-full animate-in fade-in slide-in-from-bottom-2 z-50 shadow-2xl" style={{ backgroundImage: 'var(--gradient-b2c)' }}>{String(statusMsg)}</div>}
    </div>
  );
};

export default AnalysisView;
