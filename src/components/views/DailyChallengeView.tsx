import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VERIFIED_QUESTIONS } from '../../data/questions';
import { generateDynamicQuestion } from '../../utils/questionGenerator';
import { QuestionRenderer } from '../QuestionRenderer';
import { MascotKancil } from '../MascotKancil';
import { Question } from '../../types';
import { Flame, Calendar, Sparkles, ArrowLeft, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/sound';

export const DailyChallengeView: React.FC = () => {
  const {
    language,
    activeChild,
    selectedYear,
    setCurrentMode,
    recordQuestionAttempt,
  } = useApp();

  const isEn = language === 'en';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    // 5 daily questions spanning different topics
    const pool = VERIFIED_QUESTIONS.filter((q) => q.year === selectedYear);
    const selected = pool.slice(0, 5);
    while (selected.length < 5) {
      selected.push(generateDynamicQuestion('money', selectedYear, 2));
    }
    setQuestions(selected);
  }, [selectedYear]);

  const handleAnswer = (isCorrect: boolean, selectedAnswer: string | number) => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
    const currentQ = questions[currentIndex];
    if (currentQ) {
      recordQuestionAttempt({
        questionId: currentQ.id,
        topicId: currentQ.topicId,
        year: currentQ.year,
        isCorrect,
        selectedAnswer,
        timeSpentSeconds: 15,
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      sounds.playStreak();
    }
  };

  if (isCompleted) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-amber-200 p-8 shadow-xl text-center space-y-6">
        <MascotKancil mood="celebrating" size="lg" />

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{activeChild?.streakDays} Hari Berturut-turut!</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            {isEn ? 'Daily Challenge Completed!' : 'Cabaran Harian Berjaya!'}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {isEn
              ? `You scored ${correctCount}/5! Your daily practice streak is preserved.`
              : `Hebat! Anda menjawab ${correctCount}/5 soalan dengan tepat. Rekod harian anda kekal aktif!`}
          </p>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-around">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">XP HARIAN</span>
            <span className="font-display font-bold text-xl text-amber-700">+50 XP</span>
          </div>
          <div className="w-px h-8 bg-amber-200" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">BINTANG BONUS</span>
            <span className="font-display font-bold text-xl text-purple-700">+3 ⭐</span>
          </div>
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

        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200 font-bold text-xs">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>
            {isEn ? 'Daily Quest:' : 'Cabaran Harian:'} {currentIndex + 1} / 5
          </span>
        </div>
      </div>

      {/* Progress pill */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-amber-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
        />
      </div>

      {questions[currentIndex] && (
        <QuestionRenderer
          question={questions[currentIndex]}
          onAnswerSubmitted={handleAnswer}
          onNextQuestion={handleNext}
          isLastQuestion={currentIndex === 4}
        />
      )}
    </div>
  );
};
