import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolYear, LearningLevel, Question } from '../../types';
import { VERIFIED_QUESTIONS } from '../../data/questions';
import { QuestionRenderer } from '../QuestionRenderer';
import { MascotKancil } from '../MascotKancil';
import { ArrowLeft, Sparkles, Check, UserCheck, Shield } from 'lucide-react';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

export const OnboardingModal: React.FC = () => {
  const {
    language,
    createChildProfile,
    setCurrentMode,
  } = useApp();

  const isEn = language === 'en';

  const [step, setStep] = useState<'profile' | 'diagnostic' | 'complete'>('profile');
  const [nickname, setNickname] = useState('');
  const [year, setYear] = useState<SchoolYear>(3);
  const [level, setLevel] = useState<LearningLevel>('standard');
  const [avatar, setAvatar] = useState<'mousedeer' | 'cat' | 'rabbit' | 'tiger' | 'hornbill'>('mousedeer');

  // Diagnostic questions
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<Question[]>([]);
  const [diagIndex, setDiagIndex] = useState(0);
  const [diagCorrectCount, setDiagCorrectCount] = useState(0);

  const handleStartDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    sounds.playClick();
    // Pick 3 diagnostic questions for the chosen year
    const matched = VERIFIED_QUESTIONS.filter((q) => q.year === year);
    const qs = matched.slice(0, 3);
    setDiagnosticQuestions(qs);
    setDiagIndex(0);
    setDiagCorrectCount(0);
    setStep('diagnostic');
  };

  const handleDiagnosticAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setDiagCorrectCount((prev) => prev + 1);
    }
  };

  const handleNextDiagnostic = () => {
    if (diagIndex < diagnosticQuestions.length - 1) {
      setDiagIndex((prev) => prev + 1);
    } else {
      // Determine recommended level based on diagnostic score
      let recommendedLevel: LearningLevel = 'standard';
      if (diagCorrectCount >= 3) {
        recommendedLevel = 'advanced';
      } else if (diagCorrectCount <= 1) {
        recommendedLevel = 'beginner';
      }
      setLevel(recommendedLevel);

      // Create profile
      createChildProfile({
        nickname: nickname.trim(),
        avatar,
        year,
        level: recommendedLevel,
        dailyGoalQuestions: 10,
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      sounds.playFanfare();
      setStep('complete');
    }
  };

  const handleSkipDiagnostic = () => {
    sounds.playClick();
    createChildProfile({
      nickname: nickname.trim(),
      avatar,
      year,
      level,
      dailyGoalQuestions: 10,
    });
    setStep('complete');
  };

  // Step 1: Profile Details
  if (step === 'profile') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-purple-200 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentMode('dashboard');
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Cancel' : 'Batal'}</span>
          </button>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Shield className="w-3 h-3 text-emerald-600" />
            <span>{isEn ? 'Safe & Private' : 'Selamat & Peribadi'}</span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            {isEn ? 'Create Child Profile' : 'Daftar Profil Murid Cilik'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {isEn
              ? 'Only a friendly nickname is required. We never collect full names.'
              : 'Hanya nama panggilan diperlukan. Kami tidak meminta nama penuh demi privasi anak.'}
          </p>
        </div>

        <form onSubmit={handleStartDiagnostic} className="space-y-4 text-left">
          {/* Nickname input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {isEn ? 'Child Nickname / First Name' : 'Nama Panggilan / Nama Samaran'}
            </label>
            <input
              type="text"
              required
              maxLength={15}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="cth: Adam, Sarah, Danish"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 text-sm font-semibold outline-hidden"
            />
          </div>

          {/* School Year (1-6) */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {isEn ? 'School Year (KSSR)' : 'Tahun Persekolahan (KSSR)'}
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {([1, 2, 3, 4, 5, 6] as SchoolYear[]).map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setYear(y);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    year === y
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  T{y}
                </button>
              ))}
            </div>
          </div>

          {/* Starting Level */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {isEn ? 'Starting Level' : 'Tahap Kemahiran Awal'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'beginner', labelMs: 'Asas', labelEn: 'Beginner' },
                { id: 'standard', labelMs: 'Standard', labelEn: 'Standard' },
                { id: 'advanced', labelMs: 'Maju', labelEn: 'Advanced' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setLevel(lvl.id as LearningLevel);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                    level === lvl.id
                      ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isEn ? lvl.labelEn : lvl.labelMs}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons: Diagnostic or Direct Create */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={!nickname.trim()}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-display font-bold text-sm rounded-2xl shadow-[0_3px_0_#4c1d95] active:translate-y-1 transition-all disabled:opacity-40"
            >
              {isEn ? 'Start Quick Diagnostic (3 Questions)' : 'Ujian Diagnostik Pantas (3 Soalan)'}
            </button>

            <button
              type="button"
              disabled={!nickname.trim()}
              onClick={handleSkipDiagnostic}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors disabled:opacity-40"
            >
              {isEn ? 'Skip Diagnostic & Enter App' : 'Langkau Ujian & Masuk Terus'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Step 2: Diagnostic Assessment
  if (step === 'diagnostic' && diagnosticQuestions.length > 0) {
    const currentQ = diagnosticQuestions[diagIndex];
    return (
      <div className="max-w-2xl mx-auto space-y-4 pb-12">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 block">
              {isEn ? 'Diagnostic Assessment' : 'Ujian Penilaian Awal Diagnostik'}
            </span>
            <p className="text-xs text-slate-600">
              {isEn
                ? `Question ${diagIndex + 1} of 3 for Year ${year}`
                : `Soalan ${diagIndex + 1} daripada 3 untuk Tahun ${year}`}
            </p>
          </div>
          <button
            onClick={handleSkipDiagnostic}
            className="text-xs font-semibold text-purple-700 underline"
          >
            {isEn ? 'Skip to Finish' : 'Langkau'}
          </button>
        </div>

        <QuestionRenderer
          question={currentQ}
          onAnswerSubmitted={handleDiagnosticAnswer}
          onNextQuestion={handleNextDiagnostic}
          isLastQuestion={diagIndex === diagnosticQuestions.length - 1}
        />
      </div>
    );
  }

  // Step 3: Complete & Welcome
  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-purple-200 p-8 shadow-xl text-center space-y-6">
      <MascotKancil mood="celebrating" size="lg" />

      <div className="space-y-1">
        <h2 className="font-display font-extrabold text-2xl text-slate-900">
          {isEn ? `Welcome aboard, ${nickname}!` : `Selamat Datang, ${nickname}!`}
        </h2>
        <p className="text-sm text-slate-600 font-medium">
          {isEn
            ? `Your profile is ready for Year ${year} KSSR Mathematics with personalized difficulty.`
            : `Profil Tahun ${year} anda telah sedia dengan soalan disesuaikan mengikut tahap anda.`}
        </p>
      </div>

      <button
        onClick={() => {
          sounds.playClick();
          setCurrentMode('dashboard');
        }}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-display font-bold text-base shadow-[0_4px_0_#4c1d95] active:translate-y-1 transition-all"
      >
        {isEn ? 'Explore MathQuest Kids Now!' : 'Mula Meneroka Sekarang!'}
      </button>
    </div>
  );
};
