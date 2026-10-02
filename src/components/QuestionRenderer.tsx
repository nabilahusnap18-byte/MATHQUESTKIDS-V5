import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { NumericKeypad } from './NumericKeypad';
import { VisualFraction } from './VisualFraction';
import { MoneyInteractive } from './MoneyInteractive';
import { AITutorModal } from './AITutorModal';
import { Check, X, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

interface QuestionRendererProps {
  question: Question;
  onAnswerSubmitted: (isCorrect: boolean, selectedAnswer: string | number) => void;
  onNextQuestion: () => void;
  isLastQuestion?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswerSubmitted,
  onNextQuestion,
  isLastQuestion = false,
}) => {
  const { language } = useApp();
  const isEn = language === 'en';

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [numericInput, setNumericInput] = useState<string>('');
  const [shadedFraction, setShadedFraction] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showTutorModal, setShowTutorModal] = useState<boolean>(false);

  const checkAnswer = (answerToTest: string | number) => {
    if (submitted) return;

    let correct = false;
    if (question.type === 'multiple-choice' || question.type === 'number-line') {
      const opt = question.options?.find((o) => o.id === answerToTest);
      correct = opt ? opt.isCorrect : false;
    } else if (question.type === 'numeric') {
      const cleanInput = parseFloat(String(answerToTest).trim());
      const cleanExpected = parseFloat(String(question.correctAnswer).trim());
      correct = Math.abs(cleanInput - cleanExpected) < 0.001;
    } else if (question.type === 'fraction-visual') {
      const opt = question.options?.find((o) => o.id === answerToTest);
      correct = opt ? opt.isCorrect : false;
    } else if (question.type === 'money-match') {
      const cleanInput = parseFloat(String(answerToTest));
      const cleanExpected = parseFloat(String(question.correctAnswer));
      correct = Math.abs(cleanInput - cleanExpected) < 0.01;
    }

    setIsCorrect(correct);
    setSubmitted(true);
    onAnswerSubmitted(correct, answerToTest);

    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8b5cf6', '#10b981', '#fbbf24', '#38bdf8'],
      });
    }
  };

  const handleNext = () => {
    sounds.playClick();
    setSelectedOptionId(null);
    setNumericInput('');
    setShadedFraction(0);
    setSubmitted(false);
    setIsCorrect(false);
    onNextQuestion();
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-xl overflow-hidden max-w-2xl mx-auto">
      {/* Top Header Bar */}
      <div className="bg-slate-50 border-b border-slate-100 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2.5 py-1 rounded-xl">
            {isEn ? `Tahun ${question.year} • Difficulty ${question.difficulty}` : `Tahun ${question.year} • Tahap ${question.difficulty}`}
          </span>
        </div>

        {/* AI Tutor Button */}
        <button
          onClick={() => {
            sounds.playClick();
            setShowTutorModal(true);
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-colors btn-3d"
        >
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>{isEn ? 'Ask AI Tutor Kancil' : 'Tanya Tutor Kancil'}</span>
        </button>
      </div>

      {/* Main Question Body */}
      <div className="p-6 space-y-6">
        {/* Context badge if Malaysian word problem */}
        {(question.contextMs || question.contextEn) && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
            {isEn ? question.contextEn : question.contextMs}
          </div>
        )}

        {/* Question Prompt */}
        <h3 className="font-display font-semibold text-lg sm:text-xl text-slate-900 leading-snug">
          {isEn ? question.promptEn : question.promptMs}
        </h3>

        {/* Interactive Visual Canvas if fraction or money */}
        {question.type === 'fraction-visual' && question.fractionData && (
          <div className="py-2">
            <VisualFraction
              totalParts={question.fractionData.totalParts}
              shadedParts={question.fractionData.targetNumerator}
              interactive={false}
              label={isEn ? 'Visual Model' : 'Model Pecahan Berlorek'}
            />
          </div>
        )}

        {/* Multiple Choice Options */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {question.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let style = 'bg-white border-2 border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-purple-50/50';

              if (submitted) {
                if (opt.isCorrect) {
                  style = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold';
                } else if (isSelected && !opt.isCorrect) {
                  style = 'bg-rose-50 border-2 border-rose-400 text-rose-950';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-purple-100 border-2 border-purple-500 text-purple-950 font-bold';
              }

              return (
                <button
                  key={opt.id}
                  disabled={submitted}
                  onClick={() => {
                    if (submitted) return;
                    sounds.playClick();
                    setSelectedOptionId(opt.id);
                    checkAnswer(opt.id);
                  }}
                  className={`p-4 rounded-2xl font-display text-base sm:text-lg text-left transition-all btn-3d shadow-xs flex items-center justify-between ${style}`}
                >
                  <span>{isEn ? opt.labelEn : opt.labelMs}</span>
                  {submitted && opt.isCorrect && <Check className="w-5 h-5 text-emerald-600" />}
                  {submitted && isSelected && !opt.isCorrect && <X className="w-5 h-5 text-rose-500" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Numeric Keypad Input */}
        {question.type === 'numeric' && (
          <div className="pt-2">
            <NumericKeypad
              value={numericInput}
              disabled={submitted}
              onChange={setNumericInput}
              onSubmit={() => checkAnswer(numericInput)}
            />
          </div>
        )}

        {/* Money Interactive */}
        {question.type === 'money-match' && (
          <MoneyInteractive
            targetAmount={typeof question.correctAnswer === 'number' ? question.correctAnswer : undefined}
            disabled={submitted}
            onAmountConfirmed={(amt) => checkAnswer(amt)}
          />
        )}

        {/* Number line question options */}
        {question.type === 'number-line' && question.options && (
          <div className="space-y-4 pt-2">
            {question.numberLineData && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block mb-2 font-medium">
                  {isEn ? 'Line bounds:' : 'Garis Nombor:'} {question.numberLineData.min} —{' '}
                  {question.numberLineData.max}
                </span>
                <div className="relative h-6 flex items-center">
                  <div className="w-full h-1.5 bg-slate-300 rounded-full" />
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-600 rounded-full shadow-md" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  disabled={submitted}
                  onClick={() => checkAnswer(opt.id)}
                  className="p-3.5 bg-white border-2 border-slate-200 hover:border-purple-400 rounded-2xl font-display font-semibold text-center text-slate-800 btn-3d"
                >
                  {isEn ? opt.labelEn : opt.labelMs}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Answer Feedback Banner */}
      {submitted && (
        <div
          className={`p-5 border-t-2 ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <Check className="w-6 h-6 text-emerald-600 shrink-0" />
                    <h4 className="font-display font-bold text-lg text-emerald-800">
                      {isEn ? 'Excellent! Correct Answer!' : 'Hebat! Jawapan Tepat!'}
                    </h4>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
                    <h4 className="font-display font-bold text-lg text-amber-800">
                      {isEn ? 'Nice Try! Keep Learning!' : 'Usaha Yang Bagus! Teruskan Belajar!'}
                    </h4>
                  </>
                )}
              </div>

              {/* Step by step explanation */}
              <p className="text-xs sm:text-sm text-slate-700 pl-8 leading-relaxed font-medium">
                {isEn ? question.explanationEn : question.explanationMs}
              </p>
            </div>

            <button
              onClick={handleNext}
              className={`px-5 py-3 rounded-2xl font-display font-bold text-white flex items-center gap-2 shrink-0 btn-3d ${
                isCorrect ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              <span>{isLastQuestion ? (isEn ? 'Finish' : 'Tamat') : isEn ? 'Next' : 'Seterusnya'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AI Tutor Dialog */}
      <AITutorModal
        question={question}
        studentAnswer={selectedOptionId || numericInput || shadedFraction}
        isOpen={showTutorModal}
        onClose={() => setShowTutorModal(false)}
      />
    </div>
  );
};
