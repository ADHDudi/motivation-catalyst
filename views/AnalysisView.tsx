import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAnalysisService } from '../services/ServiceContext';
import { MotivationAnalysisResult, Answers, FormData } from '../types';
import { QUESTIONS } from '../constants';
import {
  UserCheck, ShieldCheck, Copy, BrainCircuit, Sparkles,
  CheckCircle2, AlertCircle,
  Clipboard, Share2, BellRing, ArrowRight, Send,
  ChevronDown, Rocket
} from 'lucide-react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import ResultPolarChart from '../components/ResultPolarChart';
import { TranslationData, Results, Language, CategoryKey, UserRole } from '../types';
import { COLORS } from '../constants';
import { isLow, getPriorityCategory } from '../motivationCalculator';
import InlineFeedback from '../components/InlineFeedback';

/* ───────── props ───────── */

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

/* ───────── tab types ───────── */

type TabKey = CategoryKey | 'actions';
const CATEGORY_TABS: CategoryKey[] = ['autonomy', 'competence', 'relatedness'];

/* ───────── skeleton shimmer ───────── */

const SkeletonBlock: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-3 rounded-full bg-slate-200/80"
        style={{ width: `${85 - i * 15}%` }}
      />
    ))}
  </div>
);

/* ───────── ADHD collapsible ───────── */

interface AdhdTipProps {
  tip: string;
  lang: Language;
}

const AdhdTipToggle: React.FC<AdhdTipProps> = ({ tip, lang }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all active:scale-[0.98]"
        style={{
          backgroundColor: open ? 'var(--b2c-mist)' : 'transparent',
          color: 'var(--b2c-azure)',
          border: '1.5px dashed var(--b2c-azure)',
          borderColor: open ? 'var(--b2c-azure)' : 'rgba(31,122,255,0.25)',
        }}
      >
        <BrainCircuit size={14} />
        {lang === 'he' ? 'טיפ מותאם קשב (ADHD)' : 'ADHD Focus Tip'}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ marginInlineStart: 'auto' }}
        />
      </button>
      {open && (
        <div className="mt-3 animate-in slide-in-from-top-2 fade-in duration-200">
          <p
            className="text-sm text-slate-600 font-medium leading-relaxed bg-white p-4 rounded-2xl border shadow-sm relative overflow-hidden"
            style={{ borderColor: 'rgba(31,122,255,0.15)' }}
          >
            <span
              className="absolute top-0 left-0 w-1 h-full rounded-full"
              style={{ backgroundColor: 'var(--b2c-azure)' }}
            />
            {tip}
          </p>
        </div>
      )}
    </div>
  );
};

/* ───────── category tab content ───────── */

interface CategoryTabContentProps {
  categoryKey: CategoryKey;
  score: number;
  roleKey: 'employee' | 'manager';
  t: TranslationData;
  lang: Language;
  aiTip: string | null;
  adhdTip: string | null;
  isLoadingAI: boolean;
  aiError: string | null;
}

const CategoryTabContent: React.FC<CategoryTabContentProps> = ({
  categoryKey, score, roleKey, t, lang,
  aiTip, adhdTip, isLoadingAI, aiError
}) => {
  const data = t.deepAnalysis[categoryKey][roleKey][isLow(score) ? 'low' : 'high'];
  const color = COLORS[categoryKey].hex;
  
  // Only show static fallback if we are NOT loading AI (meaning it failed or timed out)
  const displayTip = aiTip || (!isLoadingAI ? data.aiTips : null);
  
  const isDynamic = !!aiTip;
  const [isExpanded, setIsExpanded] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsExpanded(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4 md:space-y-5">
      {/* Score hero */}
      <div className="flex items-center gap-4 mb-2">
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shrink-0"
          style={{ backgroundColor: color }}
        >
          {score.toFixed(1)}
        </div>
        <div className="flex-1">
          <h3 className="font-black text-base md:text-lg" style={{ color: 'var(--b2c-deep)' }}>
            {t.categories[categoryKey]}
          </h3>
          <p className="text-[11px] md:text-xs font-bold text-slate-400 mt-0.5">
            {isLow(score)
              ? (lang === 'he' ? 'דורש תשומת לב' : 'Needs attention')
              : (lang === 'he' ? 'חזק' : 'Strong')}
          </p>
        </div>
      </div>

      {/* AI insight (merged) - Moved UP on mobile to show actionable tip immediately */}
      <div
        className="p-4 md:p-5 rounded-2xl border relative overflow-hidden shadow-sm"
        style={{
          backgroundColor: 'var(--b2c-mist)',
          borderColor: 'rgba(31,122,255,0.12)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} style={{ color: 'var(--b2c-azure)' }} />
          <span className="font-black text-[11px] md:text-xs uppercase tracking-wider" style={{ color: 'var(--b2c-deep)' }}>
            {lang === 'he' ? 'טיפ AI' : 'AI Tip'}
          </span>
          {isLoadingAI && (
            <span className="text-[10px] font-bold text-slate-400 animate-pulse" style={{ marginInlineStart: 'auto' }}>
              {lang === 'he' ? 'מייצר...' : 'Generating...'}
            </span>
          )}
          {!isLoadingAI && isDynamic && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-black"
              style={{ backgroundColor: 'rgba(31,122,255,0.1)', color: 'var(--b2c-azure)', marginInlineStart: 'auto' }}
            >
              {lang === 'he' ? 'מותאם' : 'Personalized'}
            </span>
          )}
        </div>

        {isLoadingAI && !displayTip ? (
          <SkeletonBlock lines={3} />
        ) : (
          <p className="text-sm text-slate-600 font-bold leading-relaxed">{displayTip}</p>
        )}

        {/* ADHD tip — collapsed toggle */}
        {adhdTip && <AdhdTipToggle tip={adhdTip} lang={lang} />}
      </div>

      {/* Static analysis - Collapsible on Mobile */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-100 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 md:pointer-events-none"
        >
          <div className="text-[10px] uppercase tracking-widest font-black opacity-60" style={{ color: 'var(--b2c-deep)' }}>
            {lang === 'he' ? 'ניתוח ופעולות' : 'Analysis & Actions'}
          </div>
          <ChevronDown 
            size={16} 
            className={`md:hidden text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4 md:px-5 md:pb-5 animate-in slide-in-from-top-2 fade-in duration-200 border-t border-slate-100 md:border-none md:pt-0">
            <p className="text-[13px] md:text-sm font-medium text-slate-600 leading-relaxed mb-4">{data.analysis}</p>
            <ul className="space-y-2">
              {data.actions.map((action, idx) => (
                <li key={idx} className="flex gap-2.5 text-[13px] md:text-xs font-bold text-slate-600 leading-snug">
                  {isLow(score)
                    ? <AlertCircle size={14} className="shrink-0 text-amber-500 mt-0.5" />
                    : <CheckCircle2 size={14} className="shrink-0 text-emerald-500 mt-0.5" />}
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

/* ───────── What's Next card ───────── */

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

/* ═════════════════════════════════════════════════
   MAIN COMPONENT
   ═════════════════════════════════════════════════ */

const AnalysisView: React.FC<AnalysisViewProps> = ({
  t, lang, setLang, userRole, formData, results, onReset,
  copyToClipboard, generateFullReportText, statusMsg, answers
}) => {
  const analysisService = useAnalysisService();
  /* ── AI state ── */
  const [aiInsights, setAiInsights] = useState<MotivationAnalysisResult | null>(null);
  const [lastAiLang, setLastAiLang] = useState<Language | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  /* ── Tab state ── */
  const weakestCategory = useMemo<CategoryKey>(() => {
    if (!results) return 'autonomy';
    return getPriorityCategory(results);
  }, [results]);

  const [activeTab, setActiveTab] = useState<TabKey>(weakestCategory);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  /* ── swipe handling ── */
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const ALL_TABS: TabKey[] = [...CATEGORY_TABS, 'actions'];

  const handleSwipe = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipe = 50;
    if (Math.abs(diff) < minSwipe) return;

    const currentIdx = ALL_TABS.indexOf(activeTab);
    const isRtl = t.dir === 'rtl';
    const forward = isRtl ? diff < 0 : diff > 0;

    if (forward && currentIdx < ALL_TABS.length - 1) {
      setActiveTab(ALL_TABS[currentIdx + 1]);
    } else if (!forward && currentIdx > 0) {
      setActiveTab(ALL_TABS[currentIdx - 1]);
    }
  }, [activeTab, t.dir]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    handleSwipe();
  }, [handleSwipe]);

  /* ── AI fetch ── */
  const lastFetchedSignature = useRef<string | null>(null);

  useEffect(() => {
    // Only proceed if answers are complete
    if (Object.keys(answers).length !== 18) return;

    const fetchAIInsights = async () => {
      const requestSignature = `${lang}-${JSON.stringify(answers)}`;
      
      // If we already successfully fetched this exact signature, skip
      if (aiInsights && lastAiLang === lang && lastFetchedSignature.current === requestSignature) return;

      // If a request for this signature is already in flight, skip
      if (lastFetchedSignature.current === requestSignature) return;

      lastFetchedSignature.current = requestSignature;
      setIsLoadingAI(true);
      setAiError(null);

      try {
        const responses = QUESTIONS.map(q => ({
          id: q.id,
          text: q.text[lang],
          score: answers[q.id] || 3,
          category: q.category
        }));

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI request timed out')), 90000)
        );

        const analysis = await Promise.race([
          analysisService.generateMotivationAnalysis(
            responses,
            formData.employeeName,
            formData.managerName,
            lang
          ),
          timeoutPromise
        ]);

        // Only update state if this is still the most recent request
        if (lastFetchedSignature.current === requestSignature) {
          setAiInsights(analysis);
          setLastAiLang(lang);
        }
      } catch (err) {
        if (lastFetchedSignature.current === requestSignature) {
          console.error('Error generating AI analysis:', err);
          setAiError(err instanceof Error ? err.message : String(err));
          lastFetchedSignature.current = null;
        }
      } finally {
        if (lastFetchedSignature.current === requestSignature) {
          setIsLoadingAI(false);
        }
      }
    };

    fetchAIInsights();
  }, [results, lang, answers, formData]); // Note: removed aiInsights and lastAiLang from dependencies to prevent infinite loops

  /* ── early return ── */
  if (!results) return null;

  const isManager = userRole === 'manager';
  const roleKey: 'employee' | 'manager' = isManager ? 'manager' : 'employee';
  const roleLabel = isManager ? t.roleManagerLabel : t.roleSoloLabel;
  const isHe = lang === 'he';

  /* ── tab labels ── */
  const tabLabels: Record<TabKey, { label: string; icon: React.ElementType; color?: string }> = {
    autonomy: { label: t.categories.autonomy, icon: UserCheck, color: COLORS.autonomy.hex },
    competence: { label: t.categories.competence, icon: ShieldCheck, color: COLORS.competence.hex },
    relatedness: { label: t.categories.relatedness, icon: Sparkles, color: COLORS.relatedness.hex },
    actions: { label: isHe ? 'פעולות' : 'Actions', icon: Rocket },
  };

  /* ── tab indicator position ── */
  const activeIdx = ALL_TABS.indexOf(activeTab);

  return (
    <div
      className={`w-full max-w-6xl mx-auto md:my-auto bg-white/95 backdrop-blur-xl md:rounded-[60px] shadow-2xl shadow-slate-200/50 overflow-hidden text-${t.dir === 'rtl' ? 'right' : 'left'} flex flex-col md:flex-row min-h-[100dvh] md:min-h-[600px] md:h-auto md:max-h-[90vh] animate-fade-in`}
      dir={t.dir}
    >
      {/* ── LEFT PANE (Hero & Chart) ── */}
      <div className="md:w-5/12 p-6 md:p-12 pt-12 md:pt-16 flex flex-col relative z-10 md:bg-slate-50/50 border-b md:border-b-0 md:border-e border-slate-100">
        {/* ── Header ── */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
            className="bg-slate-50 hover:bg-slate-100 p-3 rounded-2xl text-[10px] font-black transition-all active:scale-90"
            style={{ color: 'var(--b2c-azure)' }}
            aria-label="Toggle language"
          >
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
          <Logo size="sm" />
        </div>

        {/* ── Title ── */}
        <h2 className="text-3xl md:text-4xl font-black text-center mb-1" style={{ color: 'var(--b2c-deep)' }}>
          {t.profileTitle}
        </h2>
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
          {roleLabel}
        </p>

        {/* ── Polar Chart (Hero) ── */}
        <div className="mt-2 md:mt-auto md:mb-auto">
          <ResultPolarChart scores={results} t={t} />
        </div>
      </div>

      {/* ── RIGHT PANE (Tabs & Content) ── */}
      <div className="md:w-7/12 flex-1 p-6 md:p-12 md:pt-16 overflow-y-auto flex flex-col relative z-10">
        
        {/* ══════════ TAB BAR ══════════ */}
        <div
          ref={tabBarRef}
          className="relative shrink-0"
        >
          {/* Tab buttons */}
          <div
            className="flex gap-1 bg-slate-100/80 p-1.5 rounded-2xl overflow-x-auto no-scrollbar"
            role="tablist"
          >
            {ALL_TABS.map((tabKey, idx) => {
              const tab = tabLabels[tabKey];
              const isActive = activeTab === tabKey;
              const isWeakest = tabKey === weakestCategory;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tabKey}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tabKey)}
                  className={`
                    relative flex-1 min-w-0 flex items-center justify-center gap-1.5
                    px-3 py-3 rounded-xl text-[11px] font-black uppercase tracking-wide
                    transition-all duration-200 whitespace-nowrap
                    ${isActive
                      ? 'bg-white text-slate-800 shadow-md'
                      : 'text-slate-400 hover:text-slate-600'}
                  `}
                  style={isActive && tab.color ? { color: tab.color } : undefined}
                >
                  <TabIcon size={14} className="shrink-0" />
                  <span className="hidden sm:inline truncate">{tab.label}</span>
                  {/* Weakest indicator pulse */}
                  {isWeakest && !isActive && (
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
                      style={{ backgroundColor: tab.color || 'var(--b2c-azure)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Dot indicator (mobile) */}
          <div className="flex sm:hidden justify-center gap-1.5 mt-3">
            {ALL_TABS.map((tabKey, idx) => (
              <div
                key={tabKey}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  activeTab === tabKey ? 'w-6' : 'w-1.5'
                }`}
                style={{
                  backgroundColor: activeTab === tabKey
                    ? (tabLabels[tabKey].color || 'var(--b2c-azure)')
                    : '#E2E8F0'
                }}
              />
            ))}
          </div>
        </div>

        {/* ══════════ TAB CONTENT ══════════ */}
        <div
          ref={tabContentRef}
          className="mt-6 flex-1 min-h-[300px]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Category Tabs */}
          {CATEGORY_TABS.includes(activeTab as CategoryKey) && (
            <CategoryTabContent
              key={activeTab}
              categoryKey={activeTab as CategoryKey}
              score={results[activeTab as CategoryKey]}
              roleKey={roleKey}
              t={t}
              lang={lang}
              aiTip={aiInsights?.[activeTab as CategoryKey]?.tip ?? null}
              adhdTip={aiInsights?.[activeTab as CategoryKey]?.adhd_tip ?? null}
              isLoadingAI={isLoadingAI}
              aiError={aiError}
            />
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8 pb-8">
              {/* Copy report button */}
              <button
                onClick={() => copyToClipboard(generateFullReportText('self'))}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--b2c-mist)', color: 'var(--b2c-azure)' }}>
                  <Copy size={18} />
                </div>
                <div className={`flex-1 text-${t.dir === 'rtl' ? 'right' : 'left'}`}>
                  <p className="font-black text-sm" style={{ color: 'var(--b2c-deep)' }}>
                    {isManager ? t.copyManager : t.copyEmployee}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">
                    {isHe ? 'העתק את כל הדוח' : 'Copy full report'}
                  </p>
                </div>
              </button>

              {/* What's Next */}
              <div>
                <h3 className="font-black text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--b2c-deep)' }}>
                  <Sparkles size={18} style={{ color: 'var(--b2c-azure)' }} />
                  {t.whatsNextTitle}
                </h3>
                <div className="grid grid-cols-1 gap-3">
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

              {/* Feedback */}
              <InlineFeedback
                source="Analysis Results"
                lang={lang}
                results={results}
                userId={undefined}
                userEmail={formData?.employeeEmail}
                userName={formData?.employeeName}
              />
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="mt-8 md:mt-auto pt-8 border-t-4 border-dashed border-slate-50 flex flex-col items-center gap-6 pb-6 md:pb-0">
          {/* Powered by JustAIIt */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {isHe ? 'מונע על ידי' : 'Powered by'}
            </span>
            <a
              href="https://justaiit.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:scale-105 active:scale-95 block h-10"
              title="Just AI It"
            >
              <img
                src="/justaiit-logo.svg"
                alt="Just AI It"
                className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>

          <button
            onClick={onReset}
            className="font-bold text-sm underline transition-colors"
            style={{ color: 'var(--b2c-azure)' }}
          >
            {t.startOver}
          </button>

          {/* Legal footer */}
          <div className="mt-4 w-full flex flex-wrap gap-4 justify-center items-center text-xs font-bold text-slate-300">
            <Link to="/terms" className="hover:text-[var(--b2c-azure)] transition-colors">
              {isHe ? 'תנאי שימוש' : 'Terms of Use'}
            </Link>
            <Link to="/privacy" className="hover:text-[var(--b2c-azure)] transition-colors">
              {isHe ? 'מדיניות פרטיות' : 'Privacy Policy'}
            </Link>
            <Link to="/accessibility" className="hover:text-[var(--b2c-azure)] transition-colors">
              {isHe ? 'נגישות' : 'Accessibility'}
            </Link>
          </div>
        </div>
      </div>

      {/* Status toast */}
      {statusMsg && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 text-white text-sm font-black rounded-full animate-in fade-in slide-in-from-bottom-2 z-50 shadow-2xl"
          style={{ backgroundImage: 'var(--gradient-b2c)' }}
        >
          {String(statusMsg)}
        </div>
      )}
    </div>
  );
};

export default AnalysisView;
