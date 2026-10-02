import React from 'react';
import { Delete, Check } from 'lucide-react';
import { sounds } from '../utils/sound';

interface NumericKeypadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  allowDecimal?: boolean;
  disabled?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  value,
  onChange,
  onSubmit,
  allowDecimal = true,
  disabled = false,
}) => {
  const handleDigit = (digit: string) => {
    if (disabled) return;
    if (value.length >= 8) return; // reasonable max length
    sounds.playClick();
    onChange(value + digit);
  };

  const handleBackspace = () => {
    if (disabled) return;
    sounds.playClick();
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    sounds.playClick();
    onChange('');
  };

  const handleDot = () => {
    if (disabled || !allowDecimal || value.includes('.')) return;
    sounds.playClick();
    onChange(value ? value + '.' : '0.');
  };

  return (
    <div className="max-w-xs mx-auto w-full select-none pt-2">
      {/* Display box */}
      <div className="bg-white border-2 border-purple-200 rounded-2xl p-3 text-center mb-3 shadow-inner min-h-[58px] flex items-center justify-center">
        <span className="font-mono text-3xl font-bold tracking-widest text-slate-800">
          {value || <span className="text-slate-300">_</span>}
        </span>
      </div>

      {/* Tactile Keypad Grid */}
      <div className="grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => handleDigit(digit)}
            className="h-12 sm:h-14 bg-white border-2 border-slate-200 rounded-2xl font-display text-xl sm:text-2xl font-bold text-slate-800 hover:bg-purple-50 hover:border-purple-300 active:translate-y-1 shadow-[0_3px_0_#e2e8f0] transition-all"
          >
            {digit}
          </button>
        ))}

        {/* Bottom row: Decimal or Clear, 0, Backspace */}
        {allowDecimal ? (
          <button
            type="button"
            disabled={disabled}
            onClick={handleDot}
            className="h-12 sm:h-14 bg-slate-100 border-2 border-slate-200 rounded-2xl font-bold text-xl text-slate-700 hover:bg-slate-200 active:translate-y-1 shadow-[0_3px_0_#cbd5e1] transition-all"
          >
            .
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={handleClear}
            className="h-12 sm:h-14 bg-rose-50 border-2 border-rose-200 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-100 active:translate-y-1 shadow-[0_3px_0_#fecdd3] transition-all"
          >
            C
          </button>
        )}

        <button
          type="button"
          disabled={disabled}
          onClick={() => handleDigit('0')}
          className="h-12 sm:h-14 bg-white border-2 border-slate-200 rounded-2xl font-display text-xl sm:text-2xl font-bold text-slate-800 hover:bg-purple-50 hover:border-purple-300 active:translate-y-1 shadow-[0_3px_0_#e2e8f0] transition-all"
        >
          0
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={handleBackspace}
          className="h-12 sm:h-14 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center text-amber-700 hover:bg-amber-100 active:translate-y-1 shadow-[0_3px_0_#fde68a] transition-all"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      {/* Big Submit Button */}
      <button
        type="button"
        disabled={disabled || !value}
        onClick={() => {
          if (!value || disabled) return;
          onSubmit();
        }}
        className={`w-full mt-3 py-3.5 px-4 rounded-2xl font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2 text-white transition-all shadow-[0_4px_0_#059669] ${
          !value || disabled
            ? 'bg-slate-300 cursor-not-allowed shadow-[0_4px_0_#94a3b8]'
            : 'bg-emerald-500 hover:bg-emerald-600 active:translate-y-1'
        }`}
      >
        <Check className="w-5 h-5" />
        <span>Hantar Jawapan</span>
      </button>
    </div>
  );
};
