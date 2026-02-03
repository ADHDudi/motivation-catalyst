export const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex) return 'rgba(0,0,0,0)';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getOpacityForScore = (score: number): number => 0.9 - ((score - 1) / 4) * 0.7;

export const getTextColorForScore = (score: number): string => score < 2.5 ? 'text-white' : 'text-slate-900';