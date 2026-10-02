import React from 'react';
import { useApp } from '../../context/AppContext';
import { KSSR_TOPICS } from '../../data/curriculum';
import { MascotKancil } from '../MascotKancil';
import {
  BookOpen,
  PlayCircle,
  Award,
  Sparkles,
  Flame,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '../../utils/sound';
import { SchoolYear } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    language,
    activeChild,
    selectedYear,
    setSelectedYear,
    setCurrentMode,
    setSelectedTopicId,
    parentSettings,
    timeSpentTodaySeconds,
  } = useApp();

  const isEn = language === 'en';

  const minutesLearnedToday = Math.floor(timeSpentTodaySeconds / 60);
  const timeLimit = parentSettings.dailyScreenTimeLimitMinutes;
  const isTimeLimitNear = minutesLearnedToday >= timeLimit - 5;

  const handleStartTopicPractice = (topicId: string) => {
    sounds.playClick();
    setSelectedTopicId(topicId);
    setCurrentMode('practice');
  };

  const handleStartTopicLesson = (topicId: string) => {
    sounds.playClick();
    setSelectedTopicId(topicId);
    setCurrentMode('learn');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Daily screen time alert if limit is near or reached */}
      {isTimeLimitNear && (
        <div className="bg-amber-100 border-2 border-amber-300 rounded-3xl p-4 flex items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              {isEn
                ? `Daily screen limit notice: You have learned for ${minutesLearnedToday} of ${timeLimit} minutes today. Remember to rest your eyes!`
                : `Peringatan had masa: Anda telah belajar selama ${minutesLearnedToday} daripada ${timeLimit} minit hari ini. Jangan lupa rehatkan mata ya!`}
            </span>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        {/* Background decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-semibold text-purple-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {isEn
                  ? `KSSR Mathematics • Year ${selectedYear}`
                  : `Matematik Sekolah Rendah KSSR • Tahun ${selectedYear}`}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {isEn
                ? `Selamat Maju Jaya, ${activeChild?.nickname || 'Hero'}!`
                : `Selamat Datang, ${activeChild?.nickname || 'Wira Cilik'}!`}
            </h1>

            <p className="text-purple-100 text-sm sm:text-base max-w-xl font-medium">
              {isEn
                ? 'Ready for today’s math quest? Solve fun puzzles, earn star coins, and unlock cool rewards with Kancil Pintar!'
                : 'Jom mulakan kembara matematik hari ini! Selesaikan soalan seronok, kumpul bintang, dan buka aksesori menarik bersama Kancil Pintar!'}
            </p>

            {/* Quick action buttons inside hero */}
            <div className="pt-2 flex flex-wrap gap-2.5 justify-center md:justify-start">
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentMode('daily');
                }}
                className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-display font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_3px_0_#b45309] active:translate-y-1 transition-all"
              >
                <Flame className="w-4 h-4 text-amber-900 fill-amber-700" />
                <span>{isEn ? 'Daily Challenge' : 'Cabaran Harian (5 Soalan)'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentMode('adventure');
                }}
                className="bg-white/90 hover:bg-white text-purple-900 font-display font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_3px_0_#cbd5e1] active:translate-y-1 transition-all"
              >
                <Award className="w-4 h-4 text-purple-600" />
                <span>{isEn ? 'Adventure Map' : 'Peta Kembara'}</span>
              </button>
            </div>
          </div>

          {/* Hero Mascot Greeting */}
          <div className="shrink-0 flex flex-col items-center">
            <MascotKancil
              mood="happy"
              size="lg"
              speechText={
                isEn
                  ? `Sifir & Ringgit are easy if we practice daily!`
                  : `Matematik itu mudah bila kita faham langkahnya!`
              }
            />
          </div>
        </div>
      </div>

      {/* School Year Level Selector (Tahun 1 - 6) */}
      <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isEn ? 'Select KSSR School Year:' : 'Pilih Tahun Persekolahan KSSR:'}
          </span>
          <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-xl">
            {isEn ? 'Verified questions for Year 3 & 5' : 'Soalan Lengkap Tahun 3 & 5 KSSR'}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {([1, 2, 3, 4, 5, 6] as SchoolYear[]).map((y) => {
            const isSelected = selectedYear === y;
            return (
              <button
                key={y}
                onClick={() => {
                  sounds.playClick();
                  setSelectedYear(y);
                }}
                className={`py-2.5 px-3 rounded-2xl font-display font-bold text-xs sm:text-sm transition-all btn-3d ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-[0_3px_0_#4c1d95]'
                    : 'bg-slate-50 text-slate-700 hover:bg-purple-50 hover:text-purple-700 border border-slate-200'
                }`}
              >
                <span>{isEn ? `Year ${y}` : `Tahun ${y}`}</span>
                {(y === 3 || y === 5) && (
                  <span className="block text-[9px] font-normal opacity-90">★ KSSR</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main KSSR Topic Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-slate-900">
            {isEn
              ? `Topics for Year ${selectedYear}`
              : `Topik Matematik Tahun ${selectedYear}`}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {KSSR_TOPICS.length} {isEn ? 'KSSR Topics' : 'Bidang Pembelajaran'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {KSSR_TOPICS.map((topic) => {
            // Count attempts in this topic
            const attempts = activeChild?.questionHistory.filter(
              (h) => h.topicId === topic.id && h.year === selectedYear
            ) || [];
            const correctAttempts = attempts.filter((h) => h.isCorrect).length;
            const masteryPercent =
              attempts.length > 0
                ? Math.min(100, Math.round((correctAttempts / attempts.length) * 100))
                : 20; // default introductory preview

            return (
              <div
                key={topic.id}
                className="bg-white rounded-3xl border-2 border-slate-100 hover:border-purple-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700">
                      {isEn ? topic.category.toUpperCase() : 'TOPIK KSSR'}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {masteryPercent}%
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                    {isEn ? topic.nameEn : topic.nameMs}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                    {isEn ? topic.descriptionEn : topic.descriptionMs}
                  </p>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${masteryPercent}%` }}
                    />
                  </div>
                </div>

                {/* Card Actions: Belajar (Learn) and Latihan (Practice) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleStartTopicLesson(topic.id)}
                    className="py-2 px-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors flex items-center justify-center gap-1 btn-3d"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Learn' : 'Belajar'}</span>
                  </button>

                  <button
                    onClick={() => handleStartTopicPractice(topic.id)}
                    className="py-2 px-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors flex items-center justify-center gap-1 shadow-[0_2px_0_#4c1d95] btn-3d"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Practice' : 'Latihan'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
