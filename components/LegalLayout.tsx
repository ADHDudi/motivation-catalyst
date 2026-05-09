import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LegalSection {
  title: string;
  body: React.ReactNode;
  highlight?: boolean;
}

interface LegalLayoutProps {
  titleHe: string;
  titleEn: string;
  lastUpdated: string;
  sectionsHe: LegalSection[];
  sectionsEn: LegalSection[];
}

const LegalLayout: React.FC<LegalLayoutProps> = ({
  titleHe, titleEn, lastUpdated, sectionsHe, sectionsEn,
}) => {
  const [lang, setLang] = useState<'he' | 'en'>('he');
  const isRtl = lang === 'he';
  const sections = lang === 'he' ? sectionsHe : sectionsEn;
  const title = lang === 'he' ? titleHe : titleEn;

  return (
    <div
      className="min-h-screen font-sans"
      style={{ backgroundColor: 'var(--b2c-ice)' }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-bold transition-colors"
            style={{ color: 'var(--b2c-azure)' }}
          >
            {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {lang === 'he' ? 'חזרה לאפליקציה' : 'Back to app'}
          </Link>

          <button
            onClick={() => setLang(lang === 'he' ? 'en' : 'he')}
            className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all hover:bg-slate-200"
          >
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-10 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--b2c-ink)' }}>
            {title}
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            {lastUpdated}
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <div
              key={i}
              className={`bg-white rounded-3xl p-6 shadow-sm ${section.highlight ? 'border-2 border-[#1F7AFF]/30' : 'border border-slate-100'}`}
            >
              {section.highlight && (
                <div
                  className="inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3"
                  style={{ backgroundColor: 'var(--b2c-mist)', color: 'var(--b2c-azure)' }}
                >
                  {lang === 'he' ? 'שימו לב' : 'Important'}
                </div>
              )}
              <h2 className="text-base font-black mb-3" style={{ color: 'var(--b2c-deep)' }}>
                {section.title}
              </h2>
              <div className="text-sm leading-relaxed text-slate-600 space-y-2">
                {section.body}
              </div>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap gap-4 justify-center text-xs font-bold text-slate-400">
          <Link to="/terms" className="hover:text-[var(--b2c-azure)] transition-colors">
            {lang === 'he' ? 'תנאי שימוש' : 'Terms of Use'}
          </Link>
          <Link to="/privacy" className="hover:text-[var(--b2c-azure)] transition-colors">
            {lang === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
          </Link>
          <Link to="/accessibility" className="hover:text-[var(--b2c-azure)] transition-colors">
            {lang === 'he' ? 'הצהרת נגישות' : 'Accessibility'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LegalLayout;
