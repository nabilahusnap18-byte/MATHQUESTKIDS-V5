import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdventureStage, Question } from '../../types';
import { VERIFIED_QUESTIONS } from '../../data/questions';
import { generateDynamicQuestion } from '../../utils/questionGenerator';
import { QuestionRenderer } from '../QuestionRenderer';
import mathAdventureMapImg from '../../assets/images/math_adventure_map_1790906598136.jpg';
import {
  Star,
  Lock,
  Sparkles,
  ArrowLeft,
  Swords,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '../../utils/sound';
import confetti from 'canvas-confetti';

export const MathAdventureView: React.FC = () => {
  const {
    language,
    adventureStages,
    updateStageStars,
    setCurrentMode,
    activeChild,
    recordQuestionAttempt,
  } = useApp();

  const isEn = language === 'en';

  const [activeStage, setActiveStage] = useState<AdventureStage | null>(null);
  const [stageQuestions, setStageQuestions] = useState<Question[]>([]);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [stageCorrectCount, setStageCorrectCount] = useState<number>(0);
  const [stageComplete, setStageComplete] = useState<boolean>(false);

  const totalEarnedStars = adventureStages.reduce((sum, s) => sum + s.starEarned, 0);

  const startStage = (stage: AdventureStage) => {
    if (!stage.isUnlocked && totalEarnedStars < stage.requiredStars) return;

    sounds.playClick();
    setActiveStage(stage);

    // Pick 3 questions for this stage
    const matched = VERIFIED_QUESTIONS.filter((q) => q.topicId === stage.topicId);
    let qs: Question[] = [];
    if (matched.length >= 3) {
      qs = [...matched].sort(() => Math.random() - 0.5).slice(0, 3);
    } else {
      qs = [
        generateDynamicQuestion(stage.topicId, stage.year, 1),
        generateDynamicQuestion(stage.topicId, stage.year, 2),
        generateDynamicQuestion(stage.topicId, stage.year, 3),
      ];
    }

    setStageQuestions(qs);
    setStageIndex(0);
    setStageCorrectCount(0);
    setStageComplete(false);
  };

  const handleStageAnswerSubmitted = (isCorrect: boolean, selectedAnswer: string | number) => {
    if (isCorrect) {
      setStageCorrectCount((prev) => prev + 1);
    }

    const currentQ = stageQuestions[stageIndex];
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

  const handleNextStageQuestion = () => {
    if (stageIndex < stageQuestions.length - 1) {
      setStageIndex((prev) => prev + 1);
    } else {
      // Stage finished
      const starsEarned = stageCorrectCount >= 3 ? 3 : stageCorrectCount >= 2 ? 2 : 1;
      if (activeStage) {
        updateStageStars(activeStage.id, starsEarned);
      }
      setStageComplete(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      sounds.playFanfare();
    }
  };

  // If currently playing a stage
  if (activeStage && !stageComplete && stageQuestions.length > 0) {
    const currentQ = stageQuestions[stageIndex];
    return (
      <div className="max-w-2xl mx-auto space-y-4 pb-12">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveStage(null);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Exit Stage' : 'Keluar Peringkat'}</span>
          </button>

          <div className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
            {isEn ? activeStage.titleEn : activeStage.titleMs} • {stageIndex + 1}/3
          </div>
        </div>

        <QuestionRenderer
          question={currentQ}
          onAnswerSubmitted={handleStageAnswerSubmitted}
          onNextQuestion={handleNextStageQuestion}
          isLastQuestion={stageIndex === stageQuestions.length - 1}
        />
      </div>
    );
  }

  // If stage completed summary
  if (activeStage && stageComplete) {
    const starsEarned = stageCorrectCount >= 3 ? 3 : stageCorrectCount >= 2 ? 2 : 1;

    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-purple-200 p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-500 shadow-md">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            {isEn ? 'Stage Cleared!' : 'Peringkat Berjaya Ditawan!'}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {isEn ? activeStage.titleEn : activeStage.titleMs}
          </p>
        </div>

        {/* 3-Star Rating Display */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((starNum) => (
            <Star
              key={starNum}
              className={`w-10 h-10 ${
                starNum <= starsEarned
                  ? 'text-amber-400 fill-amber-400 drop-shadow-md animate-bounce'
                  : 'text-slate-200'
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-slate-700 font-semibold">
          {isEn
            ? `You scored ${stageCorrectCount} out of 3 questions!`
            : `Anda menjawab ${stageCorrectCount} daripada 3 soalan dengan tepat!`}
        </p>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveStage(null);
          }}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-display font-bold text-sm shadow-[0_3px_0_#4c1d95] active:translate-y-1 transition-all"
        >
          {isEn ? 'Continue Adventure' : 'Teruskan Kembara'}
        </button>
      </div>
    );
  }

  // Progression Map View
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
          <span>{isEn ? 'Dashboard' : 'Papan Utama'}</span>
        </button>

        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-3.5 py-1.5 rounded-2xl border border-amber-200 font-bold text-xs sm:text-sm">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>
            {totalEarnedStars} {isEn ? 'Stars Collected' : 'Bintang Terkumpul'}
          </span>
        </div>
      </div>

      {/* Illustrated Adventure Banner */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-purple-200 shadow-lg h-44 sm:h-56 bg-gradient-to-r from-emerald-100 to-sky-100">
        <img
          src={mathAdventureMapImg}
          alt="Adventure World Map"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent flex flex-col justify-end p-6 text-white">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
            {isEn ? 'KSSR Progression Path' : 'Laluan Kembara Matematik KSSR'}
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
            {isEn ? 'Malaysian Math Quest Journey' : 'Kembara Wira Matematik Malaysia'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-lg mt-1">
            {isEn
              ? 'Conquer each landmark, earn 3 stars, and defeat the boss math challenge!'
              : 'Takluk setiap mercu tanda, kutip 3 bintang, dan tumpaskan bos cabaran matematik!'}
          </p>
        </div>
      </div>

      {/* Progression Path Stages List */}
      <div className="space-y-4">
        {adventureStages.map((stage, idx) => {
          const isUnlocked = stage.isUnlocked || totalEarnedStars >= stage.requiredStars;
          const isNextStage =
            isUnlocked && stage.starEarned === 0 && (idx === 0 || adventureStages[idx - 1].starEarned > 0);

          return (
            <div
              key={stage.id}
              onClick={() => isUnlocked && startStage(stage)}
              className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex items-center justify-between gap-4 ${
                !isUnlocked
                  ? 'bg-slate-100/80 border-slate-200 opacity-60 cursor-not-allowed'
                  : isNextStage
                  ? 'bg-gradient-to-r from-purple-50 to-amber-50 border-purple-400 shadow-md ring-2 ring-purple-300 cursor-pointer hover:scale-[1.01]'
                  : 'bg-white border-slate-200 hover:border-purple-300 shadow-xs cursor-pointer hover:bg-purple-50/30'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* Stage number circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-extrabold text-base shadow-sm shrink-0 ${
                    !isUnlocked
                      ? 'bg-slate-200 text-slate-400'
                      : stage.isBossStage
                      ? 'bg-rose-500 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {!isUnlocked ? (
                    <Lock className="w-5 h-5 text-slate-400" />
                  ) : stage.isBossStage ? (
                    <Swords className="w-5 h-5" />
                  ) : (
                    <span>{stage.stageNumber}</span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      {isEn ? stage.worldNameEn : stage.worldNameMs}
                    </span>
                    {stage.isBossStage && (
                      <span className="text-[10px] font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                        CABARAN BOS
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">
                    {isEn ? stage.titleEn : stage.titleMs}
                  </h3>

                  <div className="text-xs text-slate-500 font-medium">
                    {isEn ? `Year ${stage.year} Curriculum` : `Matematik Tahun ${stage.year}`}
                  </div>
                </div>
              </div>

              {/* Star Rating & Action */}
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                {isUnlocked ? (
                  <>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((starNum) => (
                        <Star
                          key={starNum}
                          className={`w-4 h-4 ${
                            starNum <= stage.starEarned
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl">
                      {stage.starEarned > 0
                        ? isEn
                          ? 'Replay'
                          : 'Main Semula'
                        : isEn
                        ? 'Play'
                        : 'Mula'}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Perlu {stage.requiredStars} ⭐</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
