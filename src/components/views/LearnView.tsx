import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KSSR_TOPICS } from '../../data/curriculum';
import { MascotKancil } from '../MascotKancil';
import { VisualFraction } from '../VisualFraction';
import { MoneyInteractive } from '../MoneyInteractive';
import { ArrowLeft, ArrowRight, PlayCircle, BookOpen, Check } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const LearnView: React.FC = () => {
  const {
    language,
    selectedTopicId,
    selectedYear,
    setCurrentMode,
    setSelectedTopicId,
  } = useApp();

  const isEn = language === 'en';

  const currentTopic =
    KSSR_TOPICS.find((t) => t.id === selectedTopicId) || KSSR_TOPICS[0];

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = currentTopic.lesson.steps;
  const currentStep = steps[activeStepIndex] || steps[0];

  const handleNextStep = () => {
    sounds.playClick();
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      // Finished all lesson steps, jump to practice!
      setCurrentMode('practice');
    }
  };

  const handlePrevStep = () => {
    sounds.playClick();
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top navigation back to dashboard */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('dashboard');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 bg-white px-3 py-2 rounded-2xl border border-slate-200 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? 'Back to Dashboard' : 'Kembali ke Papan Utama'}</span>
        </button>

        <div className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-2xl border border-purple-200">
          {isEn ? currentTopic.nameEn : currentTopic.nameMs} • {isEn ? `Year ${selectedYear}` : `Tahun ${selectedYear}`}
        </div>
      </div>

      {/* Main Lesson Card */}
      <div className="bg-white rounded-3xl border-2 border-purple-100 shadow-xl overflow-hidden">
        {/* Lesson Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200 block mb-1">
                {isEn ? 'KSSR Concept Lesson' : 'Pelajaran Konsep KSSR'}
              </span>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl">
                {isEn ? currentTopic.lesson.titleEn : currentTopic.lesson.titleMs}
              </h2>
            </div>
            <MascotKancil mood="thinking" size="sm" />
          </div>

          {/* Step Progress indicators */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playClick();
                  setActiveStepIndex(idx);
                }}
                className={`h-2 flex-1 rounded-full transition-all ${
                  idx === activeStepIndex
                    ? 'bg-amber-400'
                    : idx < activeStepIndex
                    ? 'bg-emerald-400'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-purple-900">
              {isEn ? currentStep.titleEn : currentStep.titleMs}
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-medium">
              {isEn ? currentStep.contentEn : currentStep.contentMs}
            </p>
          </div>

          {/* Interactive visual reinforcement if applicable */}
          {currentStep.visualType === 'fractions' && (
            <div className="py-2">
              <VisualFraction
                totalParts={4}
                shadedParts={3}
                interactive={true}
                label={isEn ? 'Interactive Fraction Bar' : 'Model Pecahan Interaktif (3 daripada 4)'}
              />
            </div>
          )}

          {currentStep.visualType === 'money' && (
            <div className="py-2">
              <MoneyInteractive
                targetAmount={50}
                disabled={false}
              />
            </div>
          )}

          {currentStep.visualType === 'place-value' && (
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 max-w-md mx-auto">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-purple-300">
                  <span className="text-[10px] text-purple-600 font-bold block">RIBU</span>
                  <span className="text-2xl font-bold font-mono text-purple-900">4</span>
                  <span className="text-[10px] text-slate-400 block">4,000</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-purple-300">
                  <span className="text-[10px] text-purple-600 font-bold block">RATUS</span>
                  <span className="text-2xl font-bold font-mono text-purple-900">7</span>
                  <span className="text-[10px] text-slate-400 block">700</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-purple-300">
                  <span className="text-[10px] text-purple-600 font-bold block">PULUH</span>
                  <span className="text-2xl font-bold font-mono text-purple-900">2</span>
                  <span className="text-[10px] text-slate-400 block">20</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-purple-300">
                  <span className="text-[10px] text-purple-600 font-bold block">SA</span>
                  <span className="text-2xl font-bold font-mono text-purple-900">5</span>
                  <span className="text-[10px] text-slate-400 block">5</span>
                </div>
              </div>
            </div>
          )}

          {/* Worked Example Box */}
          {currentStep.exampleProblemMs && (
            <div className="bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-display font-bold text-sm">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>{isEn ? 'Worked Example:' : 'Contoh Soalan & Penyelesaian:'}</span>
              </div>

              <div className="text-sm font-semibold text-slate-800 bg-white p-3 rounded-2xl border border-amber-200">
                {isEn ? currentStep.exampleProblemEn : currentStep.exampleProblemMs}
              </div>

              <div className="text-xs sm:text-sm text-slate-700 pl-2 border-l-4 border-amber-500 font-medium leading-relaxed">
                <strong className="text-amber-900 block mb-0.5">
                  {isEn ? 'Step-by-step Solution:' : 'Langkah Penyelesaian:'}
                </strong>
                {isEn ? currentStep.workedSolutionEn : currentStep.workedSolutionMs}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={activeStepIndex === 0}
            className={`px-4 py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              activeStepIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isEn ? 'Previous Step' : 'Langkah Lepas'}</span>
          </button>

          <button
            onClick={handleNextStep}
            className="px-6 py-3 rounded-2xl font-display font-bold text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-[0_3px_0_#4c1d95] active:translate-y-1 transition-all"
          >
            {activeStepIndex === steps.length - 1 ? (
              <>
                <PlayCircle className="w-4 h-4" />
                <span>{isEn ? 'Start Practice Now!' : 'Selesai! Jom Buat Latihan!'}</span>
              </>
            ) : (
              <>
                <span>{isEn ? 'Next Step' : 'Langkah Seterusnya'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
