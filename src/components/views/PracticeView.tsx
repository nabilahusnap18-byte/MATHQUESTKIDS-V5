import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { VERIFIED_QUESTIONS } from '../../data/questions';
import { generateDynamicQuestion } from '../../utils/questionGenerator';
import { QuestionRenderer } from '../QuestionRenderer';
import { Question, SchoolYear } from '../../types';
import { ArrowLeft, RefreshCw, Zap, TrendingUp, Award } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const PracticeView: React.FC = () => {
  const {
    language,
    selectedTopicId,
    selectedYear,
    setCurrentMode,
    recordQuestionAttempt,
  } = useApp();

  const isEn = language === 'en';
  const topicId = selectedTopicId || 'whole-numbers';

  // Adaptive difficulty tracker: 1, 2, or 3
  const [currentDifficulty, setCurrentDifficulty] = useState<1 | 2 | 3>(2);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState<number>(0);
  const [sessionTotalCount, setSessionTotalCount] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Pick or generate next question
  const pickNextQuestion = (diff: 1 | 2 | 3 = currentDifficulty) => {
    // 1. Try finding a verified question matching topic, year, and difficulty
    const matched = VERIFIED_QUESTIONS.filter(
      (q) => q.topicId === topicId && q.year === selectedYear && q.difficulty === diff
    );

    if (matched.length > 0 && Math.random() > 0.4) {
      const q = matched[Math.floor(Math.random() * matched.length)];
      setCurrentQuestion(q);
    } else {
      // 2. Generate dynamic deterministic question
      const dynQ = generateDynamicQuestion(topicId, selectedYear, diff);
      setCurrentQuestion(dynQ);
    }
    setStartTime(Date.now());
  };

  useEffect(() => {
    pickNextQuestion(currentDifficulty);
  }, [topicId, selectedYear]);

  const handleAnswerSubmitted = (isCorrect: boolean, selectedAnswer: string | number) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    if (currentQuestion) {
      recordQuestionAttempt({
        questionId: currentQuestion.id,
        topicId: currentQuestion.topicId,
        year: currentQuestion.year,
        isCorrect,
        selectedAnswer,
        timeSpentSeconds: elapsedSeconds,
      });
    }

    setSessionTotalCount((prev) => prev + 1);

    if (isCorrect) {
      setSessionCorrectCount((prev) => prev + 1);
      const nextConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(nextConsecutive);

      // Adaptive difficulty: After 3 consecutive correct, level up difficulty
      if (nextConsecutive >= 3 && currentDifficulty < 3) {
        const nextDiff = (currentDifficulty + 1) as 1 | 2 | 3;
        setCurrentDifficulty(nextDiff);
        setConsecutiveCorrect(0);
      }
    } else {
      setConsecutiveCorrect(0);
      // If struggling on hard, ease back to level 2 or 1
      if (currentDifficulty > 1) {
        setCurrentDifficulty((currentDifficulty - 1) as 1 | 2 | 3);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('dashboard');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? 'End Practice' : 'Tamat Latihan'}</span>
        </button>

        {/* Adaptive Stats Bar */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl border border-purple-200">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
            <span>
              {isEn ? 'Difficulty Level:' : 'Tahap Adaptif:'} {currentDifficulty}/3
            </span>
          </div>

          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {sessionCorrectCount}/{sessionTotalCount} {isEn ? 'Correct' : 'Betul'}
            </span>
          </div>
        </div>
      </div>

      {/* Render Current Question */}
      {currentQuestion ? (
        <QuestionRenderer
          question={currentQuestion}
          onAnswerSubmitted={handleAnswerSubmitted}
          onNextQuestion={() => pickNextQuestion(currentDifficulty)}
        />
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
          <p>{isEn ? 'Loading practice question...' : 'Menyediakan soalan latihan...'}</p>
        </div>
      )}
    </div>
  );
};
