import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VERIFIED_QUESTIONS } from '../../data/questions';
import { QuestionRenderer } from '../QuestionRenderer';
import { MascotKancil } from '../MascotKancil';
import { Question } from '../../types';
import { ArrowLeft, RefreshCw, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const RevisionView: React.FC = () => {
  const {
    language,
    activeChild,
    setCurrentMode,
    resolveIncorrectQuestion,
  } = useApp();

  const isEn = language === 'en';

  const unresolvedRecords =
    activeChild?.incorrectQuestions.filter((q) => !q.resolved) || [];

  // Match with questions bank
  const incorrectQuestions: Question[] = unresolvedRecords
    .map((rec) => VERIFIED_QUESTIONS.find((q) => q.id === rec.questionId))
    .filter((q): q is Question => q !== undefined);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sessionResolvedCount, setSessionResolvedCount] = useState<number>(0);

  const currentQ = incorrectQuestions[currentIndex];

  const handleAnswerSubmitted = (isCorrect: boolean) => {
    if (isCorrect && currentQ) {
      resolveIncorrectQuestion(currentQ.id);
      setSessionResolvedCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < incorrectQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // If no mistakes to revise
  if (incorrectQuestions.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-purple-200 p-8 shadow-xl text-center space-y-6">
        <MascotKancil mood="celebrating" size="lg" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isEn ? '100% Cleared!' : 'Semua Selesai!'}</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            {isEn ? 'No Revision Items Pending!' : 'Tiada Soalan Untuk Diulang Kaji!'}
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            {isEn
              ? 'Awesome job! You have conquered all your past questions. Try practicing new topics or challenge the quiz!'
              : 'Hebat sekali! Anda telah menguasai semua soalan lepas. Cuba latih tubi topik baharu atau cabar diri dalam kuiz!'}
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('dashboard');
          }}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-display font-bold text-sm shadow-[0_3px_0_#4c1d95] active:translate-y-1 transition-all"
        >
          {isEn ? 'Back to Dashboard' : 'Kembali ke Papan Utama'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-12">
      {/* Header */}
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
          {isEn ? 'Smart Revision:' : 'Ulang Kaji Pintar:'} {currentIndex + 1} / {incorrectQuestions.length}
        </div>
      </div>

      <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3.5 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
        <p className="text-xs sm:text-sm text-purple-900 font-medium">
          {isEn
            ? 'Revision Mode revisits previously tricky questions so you can master them with confidence.'
            : 'Mod Ulang Kaji membantu anda menguasai semula soalan yang pernah tersilap sebelum ini dengan tenang.'}
        </p>
      </div>

      {currentQ && (
        <QuestionRenderer
          question={currentQ}
          onAnswerSubmitted={handleAnswerSubmitted}
          onNextQuestion={handleNext}
          isLastQuestion={currentIndex === incorrectQuestions.length - 1}
        />
      )}
    </div>
  );
};
