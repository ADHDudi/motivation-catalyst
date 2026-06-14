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
  const size = 420;
  const center = size / 2;
  const maxRadius = 160;
  const innerRadius = 55;
  const ringWidth = (maxRadius - innerRadius) / 5; // 5 levels

  const getCoords = (angle: number, radius: number) => ({
    x: center + radius * Math.cos((angle - 90) * Math.PI / 180),
    y: center + radius * Math.sin((angle - 90) * Math.PI / 180)
  });

  const getArcPath = (startAngle: number, endAngle: number, rInner: number, rOuter: number) => {
    const startOuter = getCoords(startAngle, rOuter);
    const endOuter = getCoords(endAngle, rOuter);
    const startInner = getCoords(startAngle, rInner);
    const endInner = getCoords(endAngle, rInner);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `
      M ${startOuter.x} ${startOuter.y}
      A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}
      L ${endInner.x} ${endInner.y}
      A ${rInner} ${rInner} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}
      Z
    `;
  };

  const cats = [
    { key: 'autonomy' as const, start: 0, end: 120, color: COLORS.autonomy.hex, english: 'Autonomy' },
    { key: 'competence' as const, start: 120, end: 240, color: COLORS.competence.hex, english: 'Competence' },
    { key: 'relatedness' as const, start: 240, end: 360, color: COLORS.relatedness.hex, english: 'Relatedness' }
  ];

  return (
    <div className="flex flex-col items-center my-8 w-full animate-in zoom-in-95 duration-500">
      <div className="flex justify-center w-full overflow-visible relative">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[420px] overflow-visible drop-shadow-xl">
          
          {/* Background and Foreground Wedges */}
          {cats.map(cat => {
            const scoreValue = scores[cat.key];
            // Draw 5 discrete background blocks
            const blocks = [];
            for (let level = 1; level <= 5; level++) {
              const rInner = innerRadius + (level - 1) * ringWidth;
              const rOuter = innerRadius + level * ringWidth;
              const isFilled = scoreValue >= level;
              const isPartial = !isFilled && scoreValue > level - 1;
              
              let fill = hexToRgba(cat.color, 0.1); // Empty state
              if (isFilled) fill = cat.color; // Full state

              // Full background block
              blocks.push(
                <path
                  key={`${cat.key}-bg-${level}`}
                  d={getArcPath(cat.start, cat.end, rInner, rOuter)}
                  fill={fill}
                />
              );

              // If partial, overlay a partially filled wedge
              if (isPartial) {
                const partialRadius = rInner + (scoreValue - Math.floor(scoreValue)) * ringWidth;
                blocks.push(
                  <path
                    key={`${cat.key}-fg-${level}`}
                    d={getArcPath(cat.start, cat.end, rInner, partialRadius)}
                    fill={cat.color}
                  />
                );
              }
            }
            return <g key={cat.key}>{blocks}</g>;
          })}

          {/* White Grid Overlay (creates the separated segments look) */}
          <g stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Concentric rings */}
            {[0, 1, 2, 3, 4, 5].map(level => (
              <circle
                key={`grid-ring-${level}`}
                cx={center}
                cy={center}
                r={innerRadius + level * ringWidth}
              />
            ))}
            {/* Radial dividers */}
            {cats.map(cat => {
              const outer = getCoords(cat.start, maxRadius);
              const inner = getCoords(cat.start, innerRadius);
              return (
                <line
                  key={`grid-line-${cat.key}`}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                />
              );
            })}
          </g>

          {/* Outer Category Labels */}
          {cats.map(cat => {
            const midLabel = getCoords((cat.start + cat.end) / 2, maxRadius + 30);
            const scoreValue = scores[cat.key];
            const catName = t.categories[cat.key];
            const showEnglish = t.dir === 'rtl';

            // Calculate rotation for text so it curves around or is at least angled
            const angle = (cat.start + cat.end) / 2;
            let textRotation = angle;
            // Keep text upright
            if (textRotation > 90 && textRotation < 270) {
              textRotation += 180;
            }

            return (
              <g key={`label-${cat.key}`} transform={`translate(${midLabel.x}, ${midLabel.y})`}>
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={cat.color}
                  className="font-black text-[16px] tracking-wide"
                >
                  {catName}
                </text>
                {showEnglish && (
                  <text
                    y="16"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={cat.color}
                    className="font-black text-[11px] opacity-70 tracking-widest uppercase"
                  >
                    {cat.english}
                  </text>
                )}
                {/* Score badge next to/below label */}
                <g transform={`translate(0, ${showEnglish ? 36 : 24})`}>
                  <rect x="-20" y="-12" width="40" height="24" rx="12" fill={cat.color} />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    className="font-black text-[12px]"
                  >
                    {scoreValue.toFixed(1)}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Center Hole Styling (matches the image's empty/photo center) */}
          <circle cx={center} cy={center} r={innerRadius - 4} fill="white" />
          <circle cx={center} cy={center} r={innerRadius - 8} fill="#F8FAFC" />
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-black text-slate-300 text-xs tracking-widest uppercase"
          >
            {t.profileTitle || 'Score'}
          </text>
        </svg>
      </div>

      {/* Mobile numeric summary row — at-a-glance scores below the chart */}
      <div className="flex md:hidden gap-3 mt-8 w-full max-w-sm flex-wrap justify-center" dir="ltr">
        {cats.map(cat => {
          const v = scores[cat.key].toFixed(1);
          return (
            <div
              key={`pill-${cat.key}`}
              className="px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm border border-slate-100 bg-white"
            >
              <span className="w-2.5 h-2.5 rounded-full shadow-inner" style={{ backgroundColor: cat.color }} />
              <span className="uppercase tracking-wider text-slate-600">{t.categories[cat.key]}</span>
              <span className="bg-slate-50 px-2 py-1 rounded-lg text-slate-800 border border-slate-100">{v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultPolarChart;
