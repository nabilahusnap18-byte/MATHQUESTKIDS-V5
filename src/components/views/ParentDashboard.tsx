import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KSSR_TOPICS } from '../../data/curriculum';
import {
  Shield,
  Clock,
  Award,
  BarChart3,
  Calendar,
  Lock,
  Unlock,
  AlertTriangle,
  Download,
  Trash2,
  Plus,
  CheckCircle2,
  X,
  ArrowLeft,
  Settings,
} from 'lucide-react';
import { sounds } from '../../utils/sound';

export const ParentDashboard: React.FC = () => {
  const {
    language,
    profiles,
    activeChild,
    selectChildProfile,
    parentSettings,
    updateParentSettings,
    deleteChildProfile,
    resetAllData,
    exportDataAsJson,
    isParentVerified,
    setIsParentVerified,
    setCurrentMode,
  } = useApp();

  const isEn = language === 'en';

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [mathCaptchaAnswer, setMathCaptchaAnswer] = useState('');
  const [mathProblem] = useState(() => {
    const a = Math.floor(Math.random() * 5) + 6; // 6-10
    const b = Math.floor(Math.random() * 5) + 4; // 4-8
    return { a, b, ans: a * b };
  });

  const [selectedChildId, setSelectedChildId] = useState<string>(activeChild?.id || profiles[0]?.id || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [exportedJsonString, setExportedJsonString] = useState<string | null>(null);

  const targetChild = profiles.find((p) => p.id === selectedChildId) || activeChild || profiles[0];

  const verifyPinOrCaptcha = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      enteredPin === parentSettings.parentPin ||
      parseInt(mathCaptchaAnswer.trim()) === mathProblem.ans
    ) {
      sounds.playClick();
      setIsParentVerified(true);
      setPinError(false);
    } else {
      sounds.playWrong();
      setPinError(true);
    }
  };

  // If not verified yet, show Parent Gateway Screen
  if (!isParentVerified) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-purple-200 p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto text-purple-700">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            {isEn ? 'Parent Portal Verification' : 'Kawasan Ibu Bapa Sahaja'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {isEn
              ? 'Enter parent PIN or solve the math verification to access parental controls & reports.'
              : 'Masukkan PIN ibu bapa atau selesaikan soalan matematik untuk melihat laporan & kawalan.'}
          </p>
        </div>

        <form onSubmit={verifyPinOrCaptcha} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              {isEn ? 'Parent PIN (Default: 1234)' : 'PIN Ibu Bapa (Lalai: 1234)'}
            </label>
            <input
              type="password"
              maxLength={6}
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="1234"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 font-mono text-center text-lg tracking-widest outline-hidden"
            />
          </div>

          <div className="text-center text-xs text-slate-400 font-semibold uppercase">
            {isEn ? '— or solve verification —' : '— atau selesaikan soalan —'}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              {isEn
                ? `Parent Math Check: What is ${mathProblem.a} × ${mathProblem.b}?`
                : `Semakan Matematik: Berapakah ${mathProblem.a} × ${mathProblem.b}?`}
            </label>
            <input
              type="number"
              value={mathCaptchaAnswer}
              onChange={(e) => setMathCaptchaAnswer(e.target.value)}
              placeholder="Jawapan"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-purple-500 font-mono text-center text-base outline-hidden"
            />
          </div>

          {pinError && (
            <p className="text-xs font-semibold text-rose-600 text-center">
              {isEn
                ? 'PIN or math answer is incorrect. Please try again.'
                : 'PIN atau jawapan tidak tepat. Sila cuba lagi.'}
            </p>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setCurrentMode('dashboard');
              }}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              {isEn ? 'Back to App' : 'Kembali'}
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all btn-3d"
            >
              {isEn ? 'Access Dashboard' : 'Buka Papan'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Analytics for selected child
  const totalQuestions = targetChild.questionHistory.length;
  const correctQuestions = targetChild.questionHistory.filter((q) => q.isCorrect).length;
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  // Topic mastery calculations
  const topicMastery = KSSR_TOPICS.map((topic) => {
    const attempts = targetChild.questionHistory.filter((q) => q.topicId === topic.id);
    const correct = attempts.filter((q) => q.isCorrect).length;
    const rate = attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0;
    return {
      topic,
      attempts: attempts.length,
      correct,
      rate,
      isWeak: attempts.length >= 3 && rate < 60,
    };
  });

  const weakTopics = topicMastery.filter((t) => t.isWeak || t.attempts === 0);

  const handleExport = () => {
    sounds.playClick();
    const json = exportDataAsJson();
    setExportedJsonString(json);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('dashboard');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? 'Exit to Student Mode' : 'Kembali ke Mod Murid'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isEn ? 'Parent Portal (Verified)' : 'Portal Ibu Bapa (Disahkan)'}</span>
          </div>
        </div>
      </div>

      {/* Child Switcher Pills */}
      <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 uppercase mr-1 shrink-0">
            {isEn ? 'Child Profile:' : 'Pilih Anak:'}
          </span>
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                sounds.playClick();
                setSelectedChildId(p.id);
                selectChildProfile(p.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedChildId === p.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {p.nickname} (Tahun {p.year})
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('onboarding');
          }}
          className="text-xs font-bold text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isEn ? 'Add Child Profile' : 'Tambah Profil Anak'}</span>
        </button>
      </div>

      {/* Primary Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block mb-1">SOALAN DIJAWAB</span>
          <span className="font-display font-extrabold text-2xl text-purple-900">
            {totalQuestions}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            {correctQuestions} soalan tepat
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block mb-1">KETEPATAN (ACCURACY)</span>
          <span className="font-display font-extrabold text-2xl text-emerald-600">
            {accuracyPercent}%
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Purata semasa</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block mb-1">MASA BELAJAR</span>
          <span className="font-display font-extrabold text-2xl text-indigo-700">
            {targetChild.totalMinutesLearned} m
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Jumlah minit</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold block mb-1">REKOD STREAK</span>
          <span className="font-display font-extrabold text-2xl text-amber-500">
            {targetChild.streakDays} Hari
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Kerap belajar</span>
        </div>
      </div>

      {/* Weak Topics & Revision Recommendations */}
      <div className="bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-display font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>
            {isEn ? 'Targeted Revision Recommendations' : 'Cadangan Ulang Kaji Fokus (Topik Lemah)'}
          </span>
        </div>

        {weakTopics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {weakTopics.slice(0, 4).map((item) => (
              <div
                key={item.topic.id}
                className="bg-white p-3 rounded-2xl border border-amber-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 block">
                    {isEn ? item.topic.nameEn : item.topic.nameMs}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {item.attempts === 0
                      ? isEn
                        ? 'Not attempted yet'
                        : 'Belum diterokai'
                      : isEn
                      ? `Accuracy: ${item.rate}% (${item.correct}/${item.attempts})`
                      : `Ketepatan: ${item.rate}% (${item.correct}/${item.attempts})`}
                  </span>
                </div>
                <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-[10px]">
                  FOKUS
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-800 font-medium">
            {isEn
              ? 'Great progress! The child is performing above 60% accuracy across all practiced topics.'
              : 'Kemajuan hebat! Anak anda mengekalkan ketepatan melebihi 60% untuk semua topik yang dilatih.'}
          </p>
        )}
      </div>

      {/* Topic Mastery Progress Breakdown */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900">
          {isEn ? 'Curriculum Topic Mastery (KSSR)' : 'Penguasaan Topik Kurikulum KSSR'}
        </h3>

        <div className="space-y-3">
          {topicMastery.map((item) => (
            <div key={item.topic.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  {isEn ? item.topic.nameEn : item.topic.nameMs}
                </span>
                <span className="font-mono font-semibold text-slate-600">
                  {item.rate}% ({item.correct}/{item.attempts} betul)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.rate >= 75
                      ? 'bg-emerald-500'
                      : item.rate >= 50
                      ? 'bg-purple-500'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.max(item.rate, 5)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parental Controls: Daily Screen Time Limit */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-purple-900 font-display font-bold text-base">
          <Clock className="w-5 h-5 text-purple-600" />
          <span>{isEn ? 'Daily Learning Screen Time Limit' : 'Had Masa Pembelajaran Harian'}</span>
        </div>

        <p className="text-xs text-slate-500">
          {isEn
            ? 'Set maximum recommended learning minutes per day to promote balanced screen habits.'
            : 'Tetapkan had minit belajar harian untuk menjaga kesihatan mata dan masa seimbang anak.'}
        </p>

        <div className="grid grid-cols-4 gap-2 pt-2">
          {[15, 30, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                sounds.playClick();
                updateParentSettings({ dailyScreenTimeLimitMinutes: mins });
              }}
              className={`py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm transition-all btn-3d ${
                parentSettings.dailyScreenTimeLimitMinutes === mins
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {mins} {isEn ? 'Mins' : 'Minit'}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy & Profile Management */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900">
          {isEn ? 'Child Data Privacy & Profile Controls' : 'Privasi Data & Pengurusan Profil'}
        </h3>
        <p className="text-xs text-slate-500">
          {isEn
            ? 'In compliance with children’s privacy standards, no real full names or tracking cookies are collected. You may export or permanently delete child records at any time.'
            : 'Selaras dengan piawaian keselamatan kanak-kanak, tiada nama penuh atau penjejak luaran disimpan. Anda boleh memuat turun salinan atau memadam data anak bila-bila masa.'}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-purple-600" />
            <span>{isEn ? 'Export Progress (JSON)' : 'Muat Turun Laporan (JSON)'}</span>
          </button>

          {profiles.length > 1 && (
            <button
              onClick={() => setShowDeleteConfirm(targetChild.id)}
              className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isEn ? `Delete ${targetChild.nickname}'s Profile` : `Padam Profil ${targetChild.nickname}`}</span>
            </button>
          )}

          <button
            onClick={() => {
              if (confirm(isEn ? 'Reset all demo data to initial factory defaults?' : 'Padam semua data dan pulihkan kepada asal?')) {
                resetAllData();
              }
            }}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-semibold"
          >
            {isEn ? 'Reset All Data to Demo Defaults' : 'Set Semula Semua Data'}
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-rose-800">
              {isEn
                ? `Are you sure you want to permanently delete profile "${targetChild.nickname}"? All learning history will be erased.`
                : `Adakah anda pasti mahu memadam profil "${targetChild.nickname}"? Semua rekod pembelajaran akan dipadamkan.`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  deleteChildProfile(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                  sounds.playClick();
                }}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                {isEn ? 'Yes, Delete Permanently' : 'Ya, Padam Profil'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
              >
                {isEn ? 'Cancel' : 'Batal'}
              </button>
            </div>
          </div>
        )}

        {/* Export JSON preview */}
        {exportedJsonString && (
          <div className="mt-4 p-3 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono max-h-48 overflow-auto">
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-700">
              <span className="text-[10px] text-purple-300 uppercase">Laporan Eksport Data</span>
              <button
                onClick={() => setExportedJsonString(null)}
                className="text-slate-400 hover:text-white"
              >
                Tutup
              </button>
            </div>
            <pre>{exportedJsonString}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
