import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Sparkles,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Flame,
  Coins,
  Calendar,
  PieChart,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { sounds } from '../../utils/sound';

export const BadgesView: React.FC = () => {
  const { language, badges, setCurrentMode } = useApp();
  const isEn = language === 'en';

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'Award':
        return <Award className="w-6 h-6 text-purple-600" />;
      case 'Coins':
        return <Coins className="w-6 h-6 text-emerald-500" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />;
      case 'Calendar':
        return <Calendar className="w-6 h-6 text-indigo-500" />;
      case 'PieChart':
        return <PieChart className="w-6 h-6 text-pink-500" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-sky-500" />;
      default:
        return <HelpCircle className="w-6 h-6 text-purple-500" />;
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
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

        <div className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
          {unlockedCount} / {badges.length} {isEn ? 'Badges Unlocked' : 'Lencana Dibuka'}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
            {isEn ? 'Achievement Hall of Fame' : 'Galeri Lencana & Kejayaan'}
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl mt-1">
            {isEn ? 'Your Math Quest Trophies' : 'Trofi Wira Matematik Anda'}
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-lg mt-1 font-medium">
            {isEn
              ? 'Complete daily streaks, master multiplication, solve money quests, and explore new levels to collect every badge!'
              : 'Kekalkan latihan setiap hari, kuasai sifir, bijak wang, dan terokai peta kembara untuk kumpul semua lencana!'}
          </p>
        </div>

        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-amber-300">
          <Award className="w-10 h-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => {
          const isUnlocked = badge.unlocked;

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-purple-200 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                      isUnlocked ? 'bg-purple-100' : 'bg-slate-200'
                    }`}
                  >
                    {isUnlocked ? renderIcon(badge.icon) : <Lock className="w-5 h-5 text-slate-400" />}
                  </div>

                  {isUnlocked ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isEn ? 'Unlocked' : 'Dibuka'}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                      {isEn ? 'Locked' : 'Terkunci'}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                  {isEn ? badge.nameEn : badge.nameMs}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isEn ? badge.descriptionEn : badge.descriptionMs}
                </p>
              </div>

              {/* Progress bar if ongoing */}
              {badge.maxProgress && (
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span>{isEn ? 'Progress' : 'Kemajuan'}</span>
                    <span>
                      {badge.progress} / {badge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, ((badge.progress || 0) / badge.maxProgress) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
