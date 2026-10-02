import React from 'react';
import { useApp } from '../../context/AppContext';
import { MascotKancil } from '../MascotKancil';
import { Star, Check, Sparkles, ArrowLeft, ShoppingBag } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const AvatarShopView: React.FC = () => {
  const {
    language,
    activeChild,
    accessories,
    buyAccessory,
    equipAccessory,
    setCurrentMode,
  } = useApp();

  const isEn = language === 'en';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('dashboard');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? 'Dashboard' : 'Papan Utama'}</span>
        </button>

        {/* Stars balance */}
        <div className="flex items-center gap-2 bg-purple-50 text-purple-800 px-4 py-1.5 rounded-2xl border border-purple-200 font-bold text-sm">
          <Star className="w-4 h-4 text-purple-600 fill-purple-400" />
          <span>
            {activeChild?.stars || 0} {isEn ? 'Star Coins' : 'Syiling Bintang'}
          </span>
        </div>
      </div>

      {/* Mascot Wardrobe Stage */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-indigo-100 rounded-3xl border-2 border-purple-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-around gap-6 shadow-sm">
        <div className="text-center sm:text-left space-y-2 max-w-sm">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
            {isEn ? 'Mascot Dressing Room' : 'Bilik Persalinan Maskot'}
          </span>
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            {isEn ? 'Dress Up Kancil Pintar!' : 'Gayakan Kancil Pintar Anda!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {isEn
              ? 'Earn stars by answering math questions correctly, then unlock awesome Malaysian accessories!'
              : 'Dapatkan syiling bintang dengan menjawab soalan matematik, kemudian gayakan maskot anda!'}
          </p>
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-xs rounded-3xl border border-purple-200 shadow-md">
          <MascotKancil mood="happy" size="lg" showAccessory={true} />
        </div>
      </div>

      {/* Accessories Catalog */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-lg text-slate-900">
          {isEn ? 'Unlockable Accessories' : 'Koleksi Aksesori Menarik'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {accessories.map((acc) => {
            const isUnlocked = activeChild?.unlockedAccessories.includes(acc.id);
            const isEquipped = activeChild?.activeAccessory === acc.id;
            const canAfford = (activeChild?.stars || 0) >= acc.priceStars;

            return (
              <div
                key={acc.id}
                className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isEquipped
                    ? 'bg-purple-50/80 border-purple-400 shadow-md ring-2 ring-purple-300'
                    : isUnlocked
                    ? 'bg-white border-slate-200 hover:border-purple-200 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 opacity-90'
                }`}
              >
                <div className="text-center py-3">
                  <span className="text-4xl filter drop-shadow-sm block mb-2">{acc.icon}</span>
                  <h4 className="font-display font-bold text-sm text-slate-800">
                    {isEn ? acc.nameEn : acc.nameMs}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">
                    {acc.category}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  {isEquipped ? (
                    <button
                      onClick={() => equipAccessory(null)}
                      className="w-full py-2 bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Equipped (Tap to remove)' : 'Sedang Dipakai'}</span>
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => equipAccessory(acc.id)}
                      className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 rounded-xl text-xs font-bold transition-colors btn-3d"
                    >
                      <span>{isEn ? 'Wear This' : 'Pakai Sekarang'}</span>
                    </button>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => buyAccessory(acc.id)}
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        canAfford
                          ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-[0_2px_0_#b45309] btn-3d'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 text-amber-700 fill-amber-500" />
                      <span>
                        {acc.priceStars} {isEn ? 'Stars' : 'Bintang'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
