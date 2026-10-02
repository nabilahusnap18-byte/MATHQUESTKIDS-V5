import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VERIFIED_QUESTIONS } from '../../data/questions';
import { generateDynamicQuestion } from '../../utils/questionGenerator';
import { QuestionRenderer } from '../QuestionRenderer';
import { MascotKancil } from '../MascotKancil';
import { Question } from '../../types';
import {
  Timer,
  Clock,
  Award,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/sound';

export const QuizView: React.FC = () => {
  const {
    language,
    selectedYear,
    selectedTopicId,
    setCurrentMode,
    recordQuizSession,
    recordQuestionAttempt,
  } = useApp();

  const isEn = language === 'en';

  const [quizState, setQuizState] = useState<'config' | 'in-progress' | 'summary'>('config');
  const [totalQuestionsConfig, setTotalQuestionsConfig] = useState<10 | 20 | 30>(10);
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(600); // 10 mins

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [resultsReview, setResultsReview] = useState<
    { question: Question; userAns: string | number; isCorrect: boolean }[]
  >([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);

  // Timer countdown
  useEffect(() => {
    if (quizState !== 'in-progress' || !isTimed) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState, isTimed]);

  const startQuiz = () => {
    sounds.playClick();

    // Collect questions matching selected year
    const pool = VERIFIED_QUESTIONS.filter((q) => q.year === selectedYear);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // If pool has fewer than requested, fill with generated questions
    const finalQuestions: Question[] = shuffled.slice(0, totalQuestionsConfig);
    while (finalQuestions.length < totalQuestionsConfig) {
      const topicIds = [
        'whole-numbers',
        'fractions-decimals-percentages',
        'money',
        'time',
        'measurement',
        'space-geometry',
      ];
      const randomTopic = topicIds[Math.floor(Math.random() * topicIds.length)];
      finalQuestions.push(generateDynamicQuestion(randomTopic, selectedYear, 2));
    }

    setQuestions(finalQuestions);
    setCurrentIndex(0);
    setCorrectAnswersCount(0);
    setResultsReview([]);
    setTimeRemainingSeconds(totalQuestionsConfig * 60); // 1 minute per question
    setQuizStartTime(Date.now());
    setQuizState('in-progress');
  };

  const handleAnswerSubmitted = (isCorrect: boolean, selectedAnswer: string | number) => {
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
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

      setResultsReview((prev) => [
        ...prev,
        { question: currentQ, userAns: selectedAnswer, isCorrect },
      ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const elapsed = Math.round((Date.now() - quizStartTime) / 1000);
    const scorePercent = Math.round((correctAnswersCount / totalQuestionsConfig) * 100);
    const xpEarned = correctAnswersCount * 10 + 20; // 10 XP per correct + 20 completion bonus

    recordQuizSession({
      year: selectedYear,
      totalQuestions: totalQuestionsConfig,
      correctCount: correctAnswersCount,
      scorePercent,
      durationSeconds: elapsed,
      xpEarned,
    });

    setQuizState('summary');

    if (scorePercent >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      sounds.playFanfare();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Configuration Screen
  if (quizState === 'config') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentMode('dashboard');
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Back to Dashboard' : 'Kembali ke Papan Utama'}</span>
          </button>

          <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
            {isEn ? `KSSR Quiz • Year ${selectedYear}` : `Kuiz KSSR • Tahun ${selectedYear}`}
          </span>
        </div>

        <div className="bg-white rounded-3xl border-2 border-purple-100 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              {isEn ? 'KSSR Math Quiz Challenge' : 'Cabaran Kuiz Matematik KSSR'}
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              {isEn
                ? 'Test your math mastery with comprehensive questions and earn bonus star coins!'
                : 'Uji penguasaan matematik anda dengan soalan menyeluruh dan menangi syiling bintang bonus!'}
            </p>
          </div>

          {/* Number of Questions selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              {isEn ? 'Number of Questions:' : 'Bilangan Soalan:'}
            </span>
            <div className="grid grid-cols-3 gap-3">
              {([10, 20, 30] as const).map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    sounds.playClick();
                    setTotalQuestionsConfig(num);
                  }}
                  className={`py-3 rounded-2xl font-display font-bold text-base transition-all btn-3d ${
                    totalQuestionsConfig === num
                      ? 'bg-purple-600 text-white shadow-[0_3px_0_#4c1d95]'
                      : 'bg-slate-50 text-slate-700 hover:bg-purple-50 border border-slate-200'
                  }`}
                >
                  {num} {isEn ? 'Questions' : 'Soalan'}
                </button>
              ))}
            </div>
          </div>

          {/* Timed option switch */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              {isEn ? 'Time Limit:' : 'Had Masa:'}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsTimed(true);
                }}
                className={`py-3 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all btn-3d ${
                  isTimed
                    ? 'bg-indigo-600 text-white shadow-[0_3px_0_#312e81]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Timer className="w-4 h-4" />
                <span>{isEn ? `Timed (${totalQuestionsConfig} Mins)` : `Bermasa (${totalQuestionsConfig} Minit)`}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsTimed(false);
                }}
                className={`py-3 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all btn-3d ${
                  !isTimed
                    ? 'bg-indigo-600 text-white shadow-[0_3px_0_#312e81]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{isEn ? 'Untimed (Relaxed)' : 'Santai (Tiada Had)'}</span>
              </button>
            </div>
          </div>

          {/* Start Quiz CTA */}
          <button
            onClick={startQuiz}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-display font-bold text-lg shadow-[0_4px_0_#059669] active:translate-y-1 transition-all"
          >
            {isEn ? 'Start Quiz Challenge Now!' : 'Mula Kuiz Sekarang!'}
          </button>
        </div>
      </div>
    );
  }

  // 2. In Progress Screen
  if (quizState === 'in-progress' && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-4 pb-12">
        {/* Progress Bar & Timer */}
        <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
              <span>
                {isEn ? 'Question' : 'Soalan'} {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-purple-700">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {isTimed && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border ${
                timeRemainingSeconds < 60
                  ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Timer className="w-4 h-4 text-purple-600" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>
          )}
        </div>

        {/* Current Question */}
        <QuestionRenderer
          question={currentQ}
          onAnswerSubmitted={handleAnswerSubmitted}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentIndex === questions.length - 1}
        />
      </div>
    );
  }

  // 3. Quiz Summary Screen
  const scorePercent = Math.round((correctAnswersCount / totalQuestionsConfig) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-3xl border-2 border-purple-100 p-6 sm:p-8 shadow-xl text-center space-y-6">
        <MascotKancil
          mood={scorePercent >= 60 ? 'celebrating' : 'encouraging'}
          size="lg"
        />

        <div className="space-y-1">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            {scorePercent >= 80
              ? isEn
                ? 'Outstanding Mastery!'
                : 'Tahniah! Cemerlang!'
              : scorePercent >= 50
              ? isEn
                ? 'Good Job! Keep Practicing!'
                : 'Bagus! Teruskan Usaha!'
              : isEn
                ? 'Great Effort! Review & Try Again!'
                : 'Usaha Yang Bagus! Jom Ulang Kaji!'}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {isEn
              ? `You answered ${correctAnswersCount} out of ${totalQuestionsConfig} questions correctly.`
              : `Anda berjaya menjawab ${correctAnswersCount} daripada ${totalQuestionsConfig} soalan dengan tepat.`}
          </p>
        </div>

        {/* Score Card */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-200">
          <div className="bg-white p-3 rounded-xl border border-purple-200">
            <span className="text-[11px] text-slate-400 font-semibold block">MARKAH</span>
            <span className="font-display font-extrabold text-2xl text-purple-700">
              {scorePercent}%
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-purple-200">
            <span className="text-[11px] text-slate-400 font-semibold block">XP DIPEROLEH</span>
            <span className="font-display font-extrabold text-2xl text-emerald-600">
              +{correctAnswersCount * 10 + 20}
            </span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-purple-200">
            <span className="text-[11px] text-slate-400 font-semibold block">BINTANG</span>
            <span className="font-display font-extrabold text-2xl text-amber-500">
              +{Math.floor(correctAnswersCount / 2)} ⭐
            </span>
          </div>
        </div>

        {/* Review list of mistakes */}
        {resultsReview.some((r) => !r.isCorrect) && (
          <div className="text-left space-y-3 pt-4 border-t border-slate-100">
            <h3 className="font-display font-bold text-sm text-slate-800">
              {isEn ? 'Review Incorrect Questions:' : 'Semakan Soalan Yang Perlu Diperbaiki:'}
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {resultsReview
                .filter((r) => !r.isCorrect)
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs space-y-1"
                  >
                    <p className="font-semibold text-slate-800">
                      {isEn ? item.question.promptEn : item.question.promptMs}
                    </p>
                    <p className="text-rose-700">
                      {isEn ? 'Your answer:' : 'Jawapan anda:'} {String(item.userAns)}
                    </p>
                    <p className="text-emerald-700 font-medium">
                      {isEn ? 'Correct:' : 'Jawapan betul:'}{' '}
                      {isEn ? item.question.explanationEn : item.question.explanationMs}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <button
            onClick={() => {
              sounds.playClick();
              setQuizState('config');
            }}
            className="py-3 px-4 rounded-2xl font-display font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isEn ? 'Retake Quiz' : 'Ulang Kuiz'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentMode('dashboard');
            }}
            className="py-3 px-4 rounded-2xl font-display font-bold text-sm bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1.5 shadow-[0_3px_0_#4c1d95] active:translate-y-1 transition-all"
          >
            <span>{isEn ? 'Back to Dashboard' : 'Papan Utama'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
