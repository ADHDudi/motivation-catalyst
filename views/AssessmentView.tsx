import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Logo from '../components/Logo';
import { QUESTIONS, COLORS, RATING_COLORS } from '../constants';
import { hexToRgba } from '../utils';
import { TranslationData, Answers, Language } from '../types';

interface AssessmentViewProps {
  t: TranslationData;
  lang: Language;
  setLang: (lang: Language) => void;
  currentQuestionIndex: number;
  answers: Answers;
  onAnswer: (questionId: number, value: number) => void;
  onBack: () => void;
}

const AssessmentView: React.FC<AssessmentViewProps> = ({ t, lang, setLang, currentQuestionIndex, answers, onAnswer, onBack }) => {
  const q = QUESTIONS[currentQuestionIndex];
  if (!q) return null;
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const ratingLabels: Record<number, string> = {
    1: t.rating1Label,
    2: t.rating2Label,
    3: t.rating3Label,
    4: t.rating4Label,
    5: t.rating5Label,
  };

  return (
    <div className={`w-full max-w-lg mx-auto bg-white/90 backdrop-blur-md rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col h-[100dvh] md:h-[85vh] md:my-8 text-${t.dir === 'rtl' ? 'right' : 'left'} relative animate-fade-in`} dir={t.dir}>
      <div className="p-8 pt-12 bg-transparent">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="p-2 text-slate-300 hover:text-slate-600 active:scale-90 transition-transform" aria-label="Back">
            <ChevronLeft size={24} className={t.dir === 'rtl' ? 'rotate-180' : ''} />
          </button>
          <Logo size="sm" />
          <button
            onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
            className="bg-slate-50 text-slate-400 p-3 rounded-2xl text-[10px] font-black transition-all active:scale-90"
            aria-label="Toggle language"
          >
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.questionProgress} {currentQuestionIndex + 1} / {QUESTIONS.length}</h2>
          <span className="text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest" style={{ backgroundColor: hexToRgba(COLORS[q.category].hex, 0.1), color: COLORS[q.category].hex }}>{t.categories[q.category]}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full transition-all duration-500 ease-out" style={{ backgroundColor: 'var(--b2c-azure)', width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center bg-[#F8FAFC]/30">
        <p className="text-2xl sm:text-3xl font-black leading-tight mb-8 sm:mb-12" style={{ color: 'var(--b2c-ink)' }}>{q.text[lang]}</p>

        {/* Mobile (<sm): stacked wide pills with labels for comfortable thumb targets */}
        <div className="flex flex-col gap-3 sm:hidden">
          {[1, 2, 3, 4, 5].map((v) => {
            const selected = answers[q.id] === v;
            return (
              <button
                key={v}
                onClick={() => onAnswer(q.id, v)}
                aria-pressed={selected}
                className={`w-full min-h-[56px] rounded-2xl border-2 font-black text-base transition-all duration-200 active:scale-95 flex items-center px-5 gap-4 ${
                  selected ? RATING_COLORS[v].selected + ' shadow-md' : RATING_COLORS[v].unselected
                }`}
              >
                <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black transition-colors ${selected ? 'bg-white/25 text-white' : 'text-slate-500'}`}>
                  {v}
                </span>
                <span className="flex-1 text-start">{ratingLabels[v]}</span>
              </button>
            );
          })}
        </div>

        {/* Tablet/Desktop (sm+): horizontal 5-column grid */}
        <div className="hidden sm:grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => onAnswer(q.id, v)}
              aria-pressed={answers[q.id] === v}
              aria-label={`${v} - ${ratingLabels[v]}`}
              className={`aspect-square rounded-3xl border-2 font-black text-2xl transition-all active:scale-90 flex items-center justify-center ${
                answers[q.id] === v
                  ? RATING_COLORS[v].selected + ' scale-110'
                  : RATING_COLORS[v].unselected
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex justify-between px-2 mt-8 uppercase font-black">
          <span className="text-sm md:text-base text-rose-500">{t.disagree}</span>
          <span className="text-sm md:text-base text-emerald-500">{t.agree}</span>
        </div>
      </div>
    </div>
  );
};

export default AssessmentView;
