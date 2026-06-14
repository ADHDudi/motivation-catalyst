import React from 'react';
import { ArrowRight, Compass, Award, Users } from 'lucide-react';
import Logo from './Logo';
import { TranslationData, CategoryKey, Language } from '../types';
import { COLORS } from '../constants';

interface CategoryIntroCardProps {
  category: CategoryKey;
  t: TranslationData;
  lang: Language;
  sectionNumber: 2 | 3;
  onReady: () => void;
}

const CATEGORY_ICONS: Record<CategoryKey, React.ElementType> = {
  autonomy: Compass,
  competence: Award,
  relatedness: Users,
};

const CategoryIntroCard: React.FC<CategoryIntroCardProps> = ({ category, t, lang, sectionNumber, onReady }) => {
  const color = COLORS[category].hex;
  const Icon = CATEGORY_ICONS[category];
  const totalSections = 3;

  return (
    <div
      className={`w-full max-w-lg mx-auto md:my-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[100dvh] md:h-auto text-${t.dir === 'rtl' ? 'right' : 'left'} animate-in zoom-in-95 fade-in duration-300`}
      dir={t.dir}
    >
      <div className="p-8 pt-12 bg-white">
        <div className="flex justify-end items-center mb-8">
          <Logo size="sm" />
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center mb-8">
          {t.categoryIntroLabel}
        </p>
      </div>

      <div className="flex-1 px-8 pb-12 flex flex-col justify-center items-center text-center">
        <div
          className="w-28 h-28 rounded-[32px] flex items-center justify-center mb-6 shadow-xl"
          style={{ backgroundColor: `${color}15`, border: `3px solid ${color}30` }}
        >
          <Icon size={52} style={{ color }} strokeWidth={1.8} />
        </div>

        <h2 className="text-3xl font-black mb-2" style={{ color }}>
          {t.categories[category]}
        </h2>
        <p className="text-sm font-bold text-slate-400 mb-8">
          {t.deepAnalysis[category].title}
        </p>

        <div
          className="w-full p-5 rounded-[24px] mb-10 border-2"
          style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}
        >
          <p className="text-sm font-bold text-slate-600 leading-relaxed">
            {t.categoryIntroDesc[category]}
          </p>
        </div>

        {/* Section progress dots */}
        <div className="flex gap-3 mb-10">
          {Array.from({ length: totalSections }).map((_, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                width: i + 1 === sectionNumber ? 28 : 10,
                backgroundColor: i + 1 <= sectionNumber ? color : '#E2E8F0',
              }}
            />
          ))}
        </div>

        <button
          onClick={onReady}
          className="w-full py-6 rounded-[30px] font-black text-xl text-white flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"
          style={{ backgroundColor: color }}
        >
          {t.categoryIntroBtn}
          <ArrowRight size={24} className={t.dir === 'rtl' ? 'rotate-180' : ''} />
        </button>
      </div>
    </div>
  );
};

export default CategoryIntroCard;
