import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { MascotKancil } from './MascotKancil';
import { X, Sparkles, Lightbulb, CheckCircle2, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/sound';

interface AITutorModalProps {
  question: Question;
  studentAnswer?: string | number;
  isOpen: boolean;
  onClose: () => void;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  question,
  studentAnswer,
  isOpen,
  onClose,
}) => {
  const { language, activeChild } = useApp();
  const [hintLevel, setHintLevel] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [tutorReply, setTutorReply] = useState<string | null>(null);
  const [tutorEncouragement, setTutorEncouragement] = useState<string | null>(null);
  const [tutorSource, setTutorSource] = useState<'gemini' | 'fallback'>('gemini');

  const isEn = language === 'en';

  if (!isOpen) return null;

  const requestHint = async (level: number) => {
    setHintLevel(level);
    setLoading(true);
    sounds.playClick();

    try {
      // If deployed statically on GitHub Pages or if API is unreachable, handle gracefully
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: isEn ? question.promptEn : question.promptMs,
          questionContext: isEn ? question.contextEn : question.contextMs,
          topic: question.topicId,
          year: question.year,
          hintLevel: level,
          language,
          studentAnswer: studentAnswer !== undefined ? String(studentAnswer) : '',
          childName: activeChild?.nickname || 'Adik Pintar',
        }),
      }).catch(() => null);

      if (res && res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        if (data.tutorMessage) {
          setTutorReply(data.tutorMessage);
          setTutorEncouragement(data.encouragement);
          setTutorSource(data.source || 'gemini');
          setLoading(false);
          return;
        }
      }

      // Safe pedagogical fallback for static GitHub Pages or offline environments
      const fallbackList = isEn ? question.hintStepsEn : question.hintStepsMs;
      const hintIndex = Math.min(level - 1, fallbackList.length - 1);
      setTutorReply(fallbackList[hintIndex]);
      setTutorEncouragement(
        isEn ? 'Kancil believes in you! You can do it!' : 'Kancil yakin kamu pasti berjaya!'
      );
      setTutorSource('fallback');
    } catch {
      const fallbackList = isEn ? question.hintStepsEn : question.hintStepsMs;
      const hintIndex = Math.min(level - 1, fallbackList.length - 1);
      setTutorReply(fallbackList[hintIndex]);
      setTutorEncouragement(
        isEn ? 'Kancil believes in you! You can do it!' : 'Kancil yakin kamu pasti berjaya!'
      );
      setTutorSource('fallback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-purple-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="font-display font-bold text-lg">
              {isEn ? 'AI Tutor Kancil Pintar' : 'Tutor AI Kancil Pintar'}
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Question Summary */}
          <div className="bg-purple-50 rounded-2xl p-3 border border-purple-100 text-xs sm:text-sm text-slate-700">
            <span className="font-semibold text-purple-700 block mb-1">
              {isEn ? 'Current Problem:' : 'Soalan Semasa:'}
            </span>
            <p className="font-medium">{isEn ? question.promptEn : question.promptMs}</p>
          </div>

          {/* Mascot Guidance Speech */}
          <div className="flex items-start gap-4">
            <MascotKancil mood={loading ? 'thinking' : 'encouraging'} size="md" />

            <div className="flex-1 bg-amber-50/70 border border-amber-200 rounded-2xl p-3 shadow-xs min-h-[90px] flex flex-col justify-center">
              {loading ? (
                <div className="flex items-center gap-2 text-amber-700 text-sm py-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>
                    {isEn
                      ? 'Kancil is thinking of a friendly hint...'
                      : 'Kancil sedang sediakan petua pintar...'}
                  </span>
                </div>
              ) : tutorReply ? (
                <div>
                  <p className="text-slate-800 text-sm leading-relaxed mb-2 font-medium">
                    {tutorReply}
                  </p>
                  {tutorEncouragement && (
                    <p className="text-xs text-purple-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {tutorEncouragement}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-slate-600 text-sm">
                  {isEn
                    ? `Hi ${activeChild?.nickname || 'friend'}! Don't worry if this math question looks tricky. Choose a hint level below to guide your thinking step-by-step!`
                    : `Hai ${activeChild?.nickname || 'kawan'}! Jangan risau jika soalan ini mencabar. Pilih tahap petua di bawah, Kancil akan bantu selangkah demi selangkah!`}
                </p>
              )}
            </div>
          </div>

          {/* Progressive Hint Buttons */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {isEn ? 'Choose Guidance Level:' : 'Pilih Tahap Bantuan Petua:'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => requestHint(1)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all btn-3d ${
                  hintLevel === 1 && tutorReply
                    ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>{isEn ? '1. Clue' : '1. Petunjuk'}</span>
              </button>

              <button
                onClick={() => requestHint(2)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all btn-3d ${
                  hintLevel === 2 && tutorReply
                    ? 'bg-indigo-100 border-indigo-400 text-indigo-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>{isEn ? '2. Strategy' : '2. Strategi'}</span>
              </button>

              <button
                onClick={() => requestHint(3)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all btn-3d ${
                  hintLevel === 3 && tutorReply
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{isEn ? '3. Step by Step' : '3. Langkah Kerja'}</span>
              </button>
            </div>
          </div>

          {/* Socratic Anti-Spoiler Notice */}
          <div className="text-[11px] text-slate-400 text-center italic">
            {isEn
              ? '💡 Socratic rule: Kancil guides your thinking and never gives away the answer directly!'
              : '💡 Prinsip Didik Hibur: Kancil membimbing anda berfikir dan tidak memberikan jawapan terus!'}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {tutorSource === 'gemini'
              ? isEn
                ? 'Powered by Gemini AI'
                : 'Dikuasakan oleh Gemini AI'
              : isEn
                ? 'KSSR Standard Fallback'
                : 'Panduan Kurikulum KSSR'}
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors btn-3d"
          >
            {isEn ? 'I Understand, Let Me Try!' : 'Faham! Saya Cuba Sekarang!'}
          </button>
        </div>
      </div>
    </div>
  );
};
