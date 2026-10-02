import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Star,
  Zap,
  Volume2,
  VolumeX,
  Globe,
  Shield,
  UserCheck,
} from 'lucide-react';
import { sounds } from '../utils/sound';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    activeChild,
    profiles,
    selectChildProfile,
    currentMode,
    setCurrentMode,
    parentSettings,
    updateParentSettings,
    setIsParentVerified,
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isEn = language === 'en';

  const toggleSound = () => {
    const next = !parentSettings.soundEnabled;
    updateParentSettings({ soundEnabled: next });
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  const toggleLanguage = () => {
    sounds.playClick();
    setLanguage(language === 'ms' ? 'en' : 'ms');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('dashboard');
          }}
          className="text-xl sm:text-2xl font-display font-bold tracking-tight text-purple-700 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span>MathQuest Kids</span>
        </button>

        {/* Zone 2: Clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentMode('dashboard');
            }}
            className={`transition-colors hover:text-purple-700 whitespace-nowrap ${
              currentMode === 'dashboard' ? 'text-purple-700 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            {isEn ? 'Dashboard' : 'Papan Utama'}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentMode('adventure');
            }}
            className={`transition-colors hover:text-purple-700 whitespace-nowrap ${
              currentMode === 'adventure' ? 'text-purple-700 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            {isEn ? 'Adventure' : 'Kembara'}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentMode('quiz');
            }}
            className={`transition-colors hover:text-purple-700 whitespace-nowrap ${
              currentMode === 'quiz' ? 'text-purple-700 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            {isEn ? 'Quiz Challenge' : 'Kuiz Ujian'}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentMode('daily');
            }}
            className={`transition-colors hover:text-purple-700 whitespace-nowrap ${
              currentMode === 'daily' ? 'text-purple-700 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            {isEn ? 'Daily Challenge' : 'Cabaran Harian'}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentMode('revision');
            }}
            className={`transition-colors hover:text-purple-700 whitespace-nowrap ${
              currentMode === 'revision' ? 'text-purple-700 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            {isEn ? 'Smart Revision' : 'Ulang Kaji'}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentMode('shop');
            }}
            className={`transition-colors hover:text-purple-700 whitespace-nowrap ${
              currentMode === 'shop' ? 'text-purple-700 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            {isEn ? 'Avatar Shop' : 'Kedai Topi'}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions (Status badges & Controls) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Flame */}
          {activeChild && (
            <div
              className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-bold"
              title={`${activeChild.streakDays} hari berturut-turut`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{activeChild.streakDays}</span>
            </div>
          )}

          {/* Star Coins */}
          {activeChild && (
            <div
              className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-xl text-xs font-bold"
              title={`${activeChild.stars} Bintang`}
            >
              <Star className="w-3.5 h-3.5 text-purple-500 fill-purple-400" />
              <span>{activeChild.stars}</span>
            </div>
          )}

          {/* XP Pill */}
          {activeChild && (
            <div
              className="hidden lg:flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl text-xs font-bold"
              title={`${activeChild.xp} XP`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-400" />
              <span>{activeChild.xp} XP</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle sound"
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            {parentSettings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-purple-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Bilingual Toggle (MS / EN) */}
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1"
            title="Tukar Bahasa / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-purple-600" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Profile Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 p-1 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-2xl transition-colors"
              title="Pilih Profil Anak"
            >
              <div className="w-7 h-7 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                {activeChild?.nickname.charAt(0) || 'K'}
              </div>
              <span className="text-xs font-bold text-purple-900 pr-1 hidden sm:inline">
                {activeChild?.nickname} (T{activeChild?.year})
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-purple-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase">
                  {isEn ? 'Select Child Profile' : 'Pilih Profil Murid'}
                </div>

                <div className="space-y-1 mb-2">
                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        selectChildProfile(p.id);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-colors ${
                        p.id === activeChild?.id
                          ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-200 text-purple-800 flex items-center justify-center text-xs font-bold">
                          {p.nickname[0]}
                        </div>
                        <div>
                          <div>{p.nickname}</div>
                          <div className="text-[10px] text-slate-400">
                            {isEn ? `Year ${p.year}` : `Tahun ${p.year}`} • {p.stars} ⭐
                          </div>
                        </div>
                      </div>
                      {p.id === activeChild?.id && (
                        <UserCheck className="w-4 h-4 text-purple-600" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-1.5 space-y-1">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setShowProfileMenu(false);
                      setCurrentMode('onboarding');
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-xl text-left"
                  >
                    {isEn ? '+ Add New Child Profile' : '+ Tambah Profil Anak'}
                  </button>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setShowProfileMenu(false);
                      setIsParentVerified(false);
                      setCurrentMode('parent');
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isEn ? 'Parent Dashboard' : 'Papan Ibu Bapa'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
