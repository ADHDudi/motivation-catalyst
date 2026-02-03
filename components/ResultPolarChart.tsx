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
  
  // Increased size to accommodate longer labels without truncation
  const size = 400; 
  const center = size / 2;
  const maxRadius = 100; 
  
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
    <div className="flex justify-center my-6 w-full overflow-visible">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] overflow-visible">
        {/* Background Guide Circle */}
        <circle cx={center} cy={center} r={maxRadius} fill="#F8FAFC" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* Category Wedges */}
        {cats.map(cat => {
            const scoreValue = parseFloat(scores[cat.key]);
            const radius = (scoreValue / 5) * maxRadius;
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
                    
                    {/* Score Labels inside Wedges */}
                    {(() => {
                        const mid = getCoords((cat.start + cat.end) / 2, radius * 0.7);
                        if (scoreValue < 0.5) return null; // Only show if there's space
                        return (
                          <text 
                            x={mid.x} 
                            y={mid.y} 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            fill="white" 
                            className="font-black text-sm drop-shadow-md pointer-events-none"
                          >
                            {scoreValue}
                          </text>
                        );
                    })()}

                    {/* Outer Category Labels (Hebrew + English) */}
                    {(() => {
                        // Increased label offset slightly and ensured enough viewbox space
                        const midLabel = getCoords((cat.start + cat.end) / 2, maxRadius + 45);
                        const hebrewText = t.categories[cat.key];
                        const englishText = cat.english.toUpperCase();
                        
                        return (
                          <text 
                            x={midLabel.x} 
                            y={midLabel.y} 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                            fill={cat.color} 
                            className="font-black text-[15px] shadow-sm select-none"
                          >
                            {hebrewText} <tspan className="text-[12px] opacity-70" dy="0">({englishText})</tspan>
                          </text>
                        );
                    })()}
                </g>
            )
        })}
      </svg>
    </div>
  );
};

export default ResultPolarChart;