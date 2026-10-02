import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/views/DashboardView';
import { LearnView } from './components/views/LearnView';
import { PracticeView } from './components/views/PracticeView';
import { QuizView } from './components/views/QuizView';
import { MathAdventureView } from './components/views/MathAdventureView';
import { DailyChallengeView } from './components/views/DailyChallengeView';
import { RevisionView } from './components/views/RevisionView';
import { BadgesView } from './components/views/BadgesView';
import { AvatarShopView } from './components/views/AvatarShopView';
import { ParentDashboard } from './components/views/ParentDashboard';
import { OnboardingModal } from './components/views/OnboardingModal';
import {
  LayoutDashboard,
  Map,
  HelpCircle,
  ShoppingBag,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { sounds } from './utils/sound';

const MainAppContent: React.FC = () => {
  const { currentMode, setCurrentMode, language } = useApp();
  const isEn = language === 'en';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {currentMode === 'dashboard' && <DashboardView />}
        {currentMode === 'learn' && <LearnView />}
        {currentMode === 'practice' && <PracticeView />}
        {currentMode === 'quiz' && <QuizView />}
        {currentMode === 'adventure' && <MathAdventureView />}
        {currentMode === 'daily' && <DailyChallengeView />}
        {currentMode === 'revision' && <RevisionView />}
        {currentMode === 'badges' && <BadgesView />}
        {currentMode === 'shop' && <AvatarShopView />}
        {currentMode === 'parent' && <ParentDashboard />}
        {currentMode === 'onboarding' && <OnboardingModal />}
      </main>

      {/* Mobile Floating Bottom Bar for high touch accessibility */}
      <nav className="md:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 shadow-lg px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('dashboard');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold transition-colors ${
            currentMode === 'dashboard' ? 'text-purple-700' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>{isEn ? 'Home' : 'Utama'}</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('adventure');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold transition-colors ${
            currentMode === 'adventure' ? 'text-purple-700' : 'text-slate-500'
          }`}
        >
          <Map className="w-5 h-5" />
          <span>{isEn ? 'Adventure' : 'Kembara'}</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('quiz');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold transition-colors ${
            currentMode === 'quiz' ? 'text-purple-700' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>{isEn ? 'Quiz' : 'Kuiz'}</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('revision');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold transition-colors ${
            currentMode === 'revision' ? 'text-purple-700' : 'text-slate-500'
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          <span>{isEn ? 'Revision' : 'Ulang Kaji'}</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setCurrentMode('shop');
          }}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl text-[10px] font-bold transition-colors ${
            currentMode === 'shop' ? 'text-purple-700' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{isEn ? 'Shop' : 'Kedai'}</span>
        </button>
      </nav>

      {/* Clean quiet educational footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 bg-white">
        <p>
          MathQuest Kids • {isEn ? 'KSSR Primary Mathematics Learning Platform' : 'Platform Pembelajaran Matematik Rendah KSSR'}
        </p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
