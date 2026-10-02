import React from 'react';
import { sounds } from '../utils/sound';

interface VisualFractionProps {
  totalParts: number;
  shadedParts: number;
  interactive?: boolean;
  onShadedChange?: (newShaded: number) => void;
  label?: string;
}

export const VisualFraction: React.FC<VisualFractionProps> = ({
  totalParts = 4,
  shadedParts = 1,
  interactive = false,
  onShadedChange,
  label,
}) => {
  const parts = Array.from({ length: totalParts }, (_, i) => i < shadedParts);

  const togglePart = (index: number) => {
    if (!interactive || !onShadedChange) return;
    sounds.playClick();
    if (index < shadedParts) {
      onShadedChange(index);
    } else {
      onShadedChange(index + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-purple-50/70 border-2 border-purple-200 rounded-3xl max-w-sm mx-auto">
      {label && (
        <span className="text-xs font-semibold text-purple-800 mb-2 uppercase tracking-wider">
          {label}
        </span>
      )}

      {/* Visual fraction bar */}
      <div className="w-full flex h-14 rounded-2xl overflow-hidden border-2 border-purple-300 bg-white shadow-inner">
        {parts.map((isShaded, i) => (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => togglePart(i)}
            className={`flex-1 border-r last:border-r-0 border-purple-200 flex items-center justify-center font-display font-bold text-sm transition-colors ${
              isShaded
                ? 'bg-purple-500 text-white'
                : 'bg-white hover:bg-purple-100 text-purple-400'
            } ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {isShaded ? '✓' : ''}
          </button>
        ))}
      </div>

      {/* Numerator and denominator badge */}
      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className="text-purple-700 bg-white px-2.5 py-1 rounded-xl border border-purple-200 shadow-xs">
          {shadedParts} / {totalParts}
        </span>
        {interactive && (
          <span className="text-xs text-slate-500 italic">
            (Ketik petak untuk lorek atau padam)
          </span>
        )}
      </div>
    </div>
  );
};
