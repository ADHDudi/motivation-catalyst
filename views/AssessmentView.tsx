import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Logo from '../components/Logo';
import { QUESTIONS, COLORS, RATING_COLORS } from '../constants';
import { hexToRgba } from '../utils';
import { TranslationData, Answers, Language } from '../types';

interface AssessmentViewProps {
  t: TranslationData;
  lang: Language;
  currentQuestionIndex: number;
  answers: Answers;
  onAnswer: (questionId: number, value: number) => void;
  onBack: () => void;
}

const AssessmentView: React.FC<AssessmentViewProps> = ({ t, lang, currentQuestionIndex, answers, onAnswer, onBack }) => {
  const q = QUESTIONS[currentQuestionIndex];
  if (!q) return null;
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className={`w-full max-w-lg mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[100dvh] md:h-auto text-${t.dir === 'rtl' ? 'right' : 'left'} relative`} dir={t.dir}>
      <div className="p-8 pt-12 bg-white">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="p-2 text-slate-300 hover:text-slate-600 active:scale-90"><ChevronLeft size={24} className={t.dir === 'rtl' ? 'rotate-180' : ''} /></button>
          <Logo size="sm" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-black text-slate-300 uppercase">{t.questionProgress} {currentQuestionIndex + 1} / {QUESTIONS.length}</h2>
          <span className="text-[10px] font-black px-4 py-1 rounded-full uppercase" style={{ backgroundColor: hexToRgba(COLORS[q.category].hex, 0.1), color: COLORS[q.category].hex }}>{t.categories[q.category]}</span>
        </div>
        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <div className="h-full bg-[#78A9D6] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex-1 p-10 flex flex-col justify-center bg-[#F8FAFC]/50">
        <p className="text-3xl font-black text-[#324FA2] leading-tight mb-12">{q.text[lang]}</p>
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((v) => (
            <button 
              key={v} 
              onClick={() => onAnswer(q.id, v)} 
              className={`aspect-square rounded-3xl border-2 font-black text-2xl transition-all active:scale-90 flex items-center justify-center ${answers[q.id] === v ? RATING_COLORS[v].selected + ' scale-110' : RATING_COLORS[v].unselected}`}
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