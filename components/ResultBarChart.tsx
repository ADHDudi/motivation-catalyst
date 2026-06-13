import React from 'react';
import { Compass, Target, Users } from 'lucide-react';
import { COLORS } from '../constants';
import { hexToRgba } from '../utils';
import { TranslationData, Results, CategoryKey } from '../types';

interface ResultBarChartProps {
  scores: Results | null;
  t: TranslationData;
}

const CATEGORY_META: Record<CategoryKey, { icon: React.ElementType; english: string }> = {
  autonomy:    { icon: Compass, english: 'Autonomy' },
  competence:  { icon: Target,  english: 'Competence' },
  relatedness: { icon: Users,   english: 'Relatedness' },
};

const ResultBarChart: React.FC<ResultBarChartProps> = ({ scores, t }) => {
  if (!scores) return null;

  const cats: CategoryKey[] = ['autonomy', 'competence', 'relatedness'];
  const showEnglish = t.dir === 'rtl';
  const midpointLabel = t.dir === 'rtl' ? 'אמצע' : 'midpoint';

  return (
    <div className="my-8 w-full" dir={t.dir}>
      <div className="space-y-5">
        {cats.map(cat => {
          const score = parseFloat(scores[cat]);
          const ratio = Math.max(0, Math.min(1, score / 5));
          const color = COLORS[cat].hex;
          const Icon = CATEGORY_META[cat].icon;
          const label = t.categories[cat];
          const ariaLabel = `${label}: ${score.toFixed(1)} of 5`;

          return (
            <div key={cat} className="w-full">
              {/* Row header: icon + label + score */}
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span
                    className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: hexToRgba(color, 0.12), color }}
                    aria-hidden="true"
                  >
                    <Icon size={16} strokeWidth={2.5} />
                  </span>
                  <h3 className="font-black text-sm m-0" style={{ color: 'var(--b2c-deep)' }}>
                    {label}
                    {showEnglish && (
                      <span className="ms-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {CATEGORY_META[cat].english}
                      </span>
                    )}
                  </h3>
                </div>
                <span
                  className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: hexToRgba(color, 0.1), color }}
                  dir="ltr"
                >
                  {score.toFixed(1)} / 5.0
                </span>
              </div>

              {/* Bar track + fill */}
              <div
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={1}
                aria-valuemax={5}
                aria-label={ariaLabel}
                className="relative h-7 w-full rounded-full bg-slate-100 overflow-hidden"
                dir="ltr"
              >
                {/* Filled portion */}
                <div
                  className="absolute inset-y-0 start-0 rounded-full transition-[width] duration-700 ease-out"
                  style={{
                    width: `${ratio * 100}%`,
                    backgroundColor: color,
                    backgroundImage: `repeating-linear-gradient(45deg, ${hexToRgba('#ffffff', 0.0)} 0 6px, ${hexToRgba('#ffffff', 0.18)} 6px 9px)`,
                  }}
                />

                {/* Scale tick guides (1..5) */}
                {[1, 2, 3, 4].map(n => (
                  <span
                    key={`tick-${cat}-${n}`}
                    className="absolute inset-y-0 w-px bg-white/40 pointer-events-none"
                    style={{ left: `${(n / 5) * 100}%` }}
                    aria-hidden="true"
                  />
                ))}

                {/* Midpoint marker at 2.5 — dashed line drawn via gradient on a thin element */}
                <span
                  className="absolute inset-y-0 w-0 border-s-2 border-dashed border-slate-400/70 pointer-events-none"
                  style={{ left: '50%' }}
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Scale row: 1..5 labels + midpoint annotation */}
      <div className="relative mt-2 h-5 ps-10 pe-1" dir="ltr">
        <div className="relative w-full h-full">
          {[1, 2, 3, 4, 5].map(n => (
            <span
              key={`scale-${n}`}
              className="absolute top-0 -translate-x-1/2 text-[10px] font-black text-slate-400"
              style={{ left: `${(n / 5) * 100}%` }}
            >
              {n}
            </span>
          ))}
          <span
            className="absolute top-2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider text-slate-400"
            style={{ left: '50%' }}
          >
            {midpointLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultBarChart;
