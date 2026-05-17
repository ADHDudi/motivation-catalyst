import React from 'react';
import { COLORS } from '../constants';
import { hexToRgba } from '../utils';
import { TranslationData, Results } from '../types';

interface ResultPolarChartProps {
  scores: Results | null;
  t: TranslationData;
}

const ResultPolarChart: React.FC<ResultPolarChartProps> = ({ scores, t }) => {
  if (!scores) return null;

  // SVG geometry
  const size = 400;
  const center = size / 2;
  const maxRadius = 100;
  const MIN_VISIBLE_RATIO = 0.18; // floor so very low scores still render a visible wedge

  const getCoords = (angle: number, radius: number) => ({
    x: center + radius * Math.cos((angle - 90) * Math.PI / 180),
    y: center + radius * Math.sin((angle - 90) * Math.PI / 180)
  });

  const cats = [
    { key: 'autonomy' as const, start: 0, end: 120, color: COLORS.autonomy.hex, english: 'Autonomy' },
    { key: 'competence' as const, start: 120, end: 240, color: COLORS.competence.hex, english: 'Competence' },
    { key: 'relatedness' as const, start: 240, end: 360, color: COLORS.relatedness.hex, english: 'Relatedness' }
  ];

  return (
    <div className="flex flex-col items-center my-6 w-full">
      <div className="flex justify-center w-full overflow-visible">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] overflow-visible">
          {/* Background guide circle (max ring) */}
          <circle cx={center} cy={center} r={maxRadius} fill="#F8FAFC" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />

          {/* Concentric guide rings at 1..4 for a visual sense of scale */}
          {[1, 2, 3, 4].map(n => (
            <circle
              key={`ring-${n}`}
              cx={center}
              cy={center}
              r={(n / 5) * maxRadius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="0.5"
              opacity="0.4"
            />
          ))}

          {/* Category wedges */}
          {cats.map(cat => {
            const scoreValue = parseFloat(scores[cat.key]);
            const trueRatio = scoreValue / 5;
            const ratio = Math.max(trueRatio, MIN_VISIBLE_RATIO); // floor for visibility
            const radius = ratio * maxRadius;
            const trueRadius = trueRatio * maxRadius;
            const start = getCoords(cat.start, radius);
            const end = getCoords(cat.end, radius);
            const largeArc = cat.end - cat.start > 180 ? 1 : 0;

            return (
              <g key={cat.key}>
                <path
                  d={`M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`}
                  fill={hexToRgba(cat.color, 0.4)}
                  stroke="white"
                  strokeWidth="2"
                />

                {/* Inline score label inside the wedge */}
                {(() => {
                  const mid = getCoords((cat.start + cat.end) / 2, Math.max(radius * 0.7, 24));
                  return (
                    <text
                      x={mid.x}
                      y={mid.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      className="font-black text-sm drop-shadow-md pointer-events-none"
                    >
                      {scoreValue.toFixed(1)}
                    </text>
                  );
                })()}

                {/* Axis-vertex score badge — always at fixed outer radius for legibility */}
                {(() => {
                  const badgePos = getCoords((cat.start + cat.end) / 2, maxRadius + 22);
                  return (
                    <g pointerEvents="none">
                      <circle cx={badgePos.x} cy={badgePos.y} r={14} fill="white" stroke={cat.color} strokeWidth="2" />
                      <text
                        x={badgePos.x}
                        y={badgePos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={cat.color}
                        className="font-black text-[10px]"
                      >
                        {scoreValue.toFixed(1)}
                      </text>
                    </g>
                  );
                })()}

                {/* Outer category labels — localized name only (English in parentheses for RTL) */}
                {(() => {
                  const midLabel = getCoords((cat.start + cat.end) / 2, maxRadius + 55);
                  const catName = t.categories[cat.key];
                  const showEnglish = t.dir === 'rtl';
                  return (
                    <text
                      x={midLabel.x}
                      y={midLabel.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={cat.color}
                      className="font-black text-[15px] shadow-sm select-none"
                    >
                      {catName}{showEnglish && <tspan className="text-[12px] opacity-70" dy="0"> ({cat.english.toUpperCase()})</tspan>}
                    </text>
                  );
                })()}

                {/* Small decorative dot at TRUE score position when wedge was floored — keeps truth visible */}
                {trueRatio > 0 && trueRatio < MIN_VISIBLE_RATIO && (() => {
                  const dotPos = getCoords((cat.start + cat.end) / 2, trueRadius);
                  return (
                    <circle cx={dotPos.x} cy={dotPos.y} r={3} fill={cat.color} opacity="0.6" />
                  );
                })()}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile numeric summary row — at-a-glance scores below the chart */}
      <div className="flex md:hidden gap-2 mt-2 w-full max-w-sm flex-wrap justify-center" dir="ltr">
        {cats.map(cat => {
          const v = parseFloat(scores[cat.key]).toFixed(1);
          return (
            <div
              key={`pill-${cat.key}`}
              className="px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-2"
              style={{ backgroundColor: hexToRgba(cat.color, 0.1), color: cat.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="uppercase tracking-wide">{t.categories[cat.key]}</span>
              <span className="bg-white px-1.5 py-0.5 rounded-full">{v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultPolarChart;
