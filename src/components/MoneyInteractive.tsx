import React, { useState } from 'react';
import { sounds } from '../utils/sound';
import { RotateCcw, Plus, Check } from 'lucide-react';

interface MoneyInteractiveProps {
  targetAmount?: number;
  onAmountConfirmed?: (totalAmount: number) => void;
  disabled?: boolean;
}

const MALAYSIAN_BILLS = [
  { val: 100, label: 'RM100', color: 'bg-purple-600 text-white border-purple-800' },
  { val: 50, label: 'RM50', color: 'bg-teal-600 text-white border-teal-800' },
  { val: 20, label: 'RM20', color: 'bg-orange-500 text-white border-orange-700' },
  { val: 10, label: 'RM10', color: 'bg-red-500 text-white border-red-700' },
  { val: 5, label: 'RM5', color: 'bg-emerald-600 text-white border-emerald-800' },
  { val: 1, label: 'RM1', color: 'bg-blue-600 text-white border-blue-800' },
];

const MALAYSIAN_COINS = [
  { val: 0.5, label: '50 sen', color: 'bg-amber-400 text-amber-950 border-amber-600' },
  { val: 0.2, label: '20 sen', color: 'bg-amber-400 text-amber-950 border-amber-600' },
  { val: 0.1, label: '10 sen', color: 'bg-slate-300 text-slate-800 border-slate-400' },
  { val: 0.05, label: '5 sen', color: 'bg-slate-300 text-slate-800 border-slate-400' },
];

export const MoneyInteractive: React.FC<MoneyInteractiveProps> = ({
  targetAmount,
  onAmountConfirmed,
  disabled = false,
}) => {
  const [selectedItems, setSelectedItems] = useState<{ id: string; val: number; label: string }[]>([]);

  const total = Math.round(selectedItems.reduce((acc, curr) => acc + curr.val, 0) * 100) / 100;

  const addItem = (val: number, label: string) => {
    if (disabled) return;
    sounds.playClick();
    setSelectedItems((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, val, label }]);
  };

  const removeItem = (id: string) => {
    if (disabled) return;
    sounds.playClick();
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    if (disabled) return;
    sounds.playClick();
    setSelectedItems([]);
  };

  return (
    <div className="bg-emerald-50/60 border-2 border-emerald-200 rounded-3xl p-4 max-w-lg mx-auto space-y-4">
      {/* Wallet / Tally Screen */}
      <div className="bg-white rounded-2xl p-3 border border-emerald-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-800 block">Jumlah Wang Dipilih:</span>
          <span className="font-mono text-2xl font-bold text-emerald-700">
            RM {total.toFixed(2)}
          </span>
          {targetAmount !== undefined && (
            <span className="text-xs text-slate-500 block">
              Sasaran: <strong className="text-purple-700">RM {targetAmount.toFixed(2)}</strong>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={clearAll}
          disabled={disabled || selectedItems.length === 0}
          className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold p-2 rounded-xl bg-rose-50 border border-rose-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Padam</span>
        </button>
      </div>

      {/* Selected banknotes list */}
      <div className="min-h-[50px] p-2 bg-emerald-100/50 rounded-2xl flex flex-wrap gap-1.5 items-center">
        {selectedItems.length === 0 ? (
          <span className="text-xs text-slate-400 italic px-2">
            Ketik wang kertas atau syiling di bawah untuk mengira wang...
          </span>
        ) : (
          selectedItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => removeItem(item.id)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-emerald-300 shadow-xs hover:bg-rose-50 hover:border-rose-300 transition-colors flex items-center gap-1"
              title="Ketik untuk padam"
            >
              <span>{item.label}</span>
              <span className="text-rose-400">×</span>
            </button>
          ))
        )}
      </div>

      {/* Banknotes selector */}
      <div>
        <span className="text-xs font-semibold text-slate-600 block mb-1.5">Wang Kertas (RM):</span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {MALAYSIAN_BILLS.map((bill) => (
            <button
              key={bill.val}
              type="button"
              disabled={disabled}
              onClick={() => addItem(bill.val, bill.label)}
              className={`py-2 px-1 rounded-xl text-xs font-bold border-2 transition-transform active:scale-95 shadow-sm flex flex-col items-center justify-center ${bill.color}`}
            >
              <span>{bill.label}</span>
              <Plus className="w-3 h-3 opacity-80 mt-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Coins selector */}
      <div>
        <span className="text-xs font-semibold text-slate-600 block mb-1.5">Duit Syiling (sen):</span>
        <div className="grid grid-cols-4 gap-2">
          {MALAYSIAN_COINS.map((coin) => (
            <button
              key={coin.val}
              type="button"
              disabled={disabled}
              onClick={() => addItem(coin.val, coin.label)}
              className={`py-2 px-1 rounded-full text-xs font-bold border-2 transition-transform active:scale-95 shadow-xs flex flex-col items-center justify-center ${coin.color}`}
            >
              <span>{coin.label}</span>
              <Plus className="w-3 h-3 opacity-80 mt-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Confirm button */}
      {onAmountConfirmed && (
        <button
          type="button"
          disabled={disabled || selectedItems.length === 0}
          onClick={() => onAmountConfirmed(total)}
          className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-[0_3px_0_#065f46] active:translate-y-1 transition-all"
        >
          <Check className="w-4 h-4" />
          <span>Sahkan Kiraan (RM {total.toFixed(2)})</span>
        </button>
      )}
    </div>
  );
};
