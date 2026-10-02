import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ChildProfile,
  ParentSettings,
  Language,
  SchoolYear,
  QuestionAttempt,
  QuizSessionRecord,
  AchievementBadge,
  AvatarAccessory,
  AdventureStage,
} from '../types';
import { INITIAL_BADGES, AVATAR_ACCESSORIES, ADVENTURE_STAGES } from '../data/curriculum';
import { sounds } from '../utils/sound';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeChild: ChildProfile | null;
  profiles: ChildProfile[];
  parentSettings: ParentSettings;
  badges: AchievementBadge[];
  accessories: AvatarAccessory[];
  adventureStages: AdventureStage[];
  currentMode:
    | 'dashboard'
    | 'adventure'
    | 'learn'
    | 'practice'
    | 'quiz'
    | 'daily'
    | 'revision'
    | 'badges'
    | 'shop'
    | 'parent'
    | 'onboarding';
  setCurrentMode: (mode: AppContextType['currentMode']) => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (topicId: string | null) => void;
  selectedYear: SchoolYear;
  setSelectedYear: (year: SchoolYear) => void;
  selectChildProfile: (profileId: string) => void;
  createChildProfile: (profile: Omit<ChildProfile, 'id' | 'xp' | 'stars' | 'streakDays' | 'lastActiveDate' | 'todayQuestionsCount' | 'totalMinutesLearned' | 'completedStageIds' | 'quizHistory' | 'questionHistory' | 'incorrectQuestions' | 'unlockedAccessories'>) => void;
  updateChildProfile: (profile: ChildProfile) => void;
  deleteChildProfile: (profileId: string) => void;
  updateParentSettings: (settings: Partial<ParentSettings>) => void;
  recordQuestionAttempt: (attempt: Omit<QuestionAttempt, 'timestamp'>) => { xpGained: number; starsGained: number; streakBonus: boolean };
  recordQuizSession: (session: Omit<QuizSessionRecord, 'id' | 'completedAt'>) => void;
  resolveIncorrectQuestion: (questionId: string) => void;
  buyAccessory: (accessoryId: string) => boolean;
  equipAccessory: (accessoryId: string | null) => void;
  updateStageStars: (stageId: string, stars: number) => void;
  resetAllData: () => void;
  exportDataAsJson: () => string;
  isParentVerified: boolean;
  setIsParentVerified: (verified: boolean) => void;
  timeSpentTodaySeconds: number;
}

const STORAGE_KEY_PROFILES = 'mathquest_kids_profiles_v1';
const STORAGE_KEY_SETTINGS = 'mathquest_kids_settings_v1';
const STORAGE_KEY_BADGES = 'mathquest_kids_badges_v1';
const STORAGE_KEY_ACCESSORIES = 'mathquest_kids_accessories_v1';
const STORAGE_KEY_STAGES = 'mathquest_kids_stages_v1';

const INITIAL_PROFILES: ChildProfile[] = [
  {
    id: 'child-aiman-y3',
    nickname: 'Aiman',
    avatar: 'mousedeer',
    activeAccessory: 'songkok-emas',
    unlockedAccessories: ['songkok-emas', 'bunga-raya'],
    year: 3,
    level: 'standard',
    xp: 180,
    stars: 18,
    streakDays: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    dailyGoalQuestions: 10,
    todayQuestionsCount: 4,
    totalMinutesLearned: 45,
    completedStageIds: ['stage-1', 'stage-2', 'stage-3'],
    quizHistory: [
      {
        id: 'quiz-1',
        year: 3,
        totalQuestions: 10,
        correctCount: 9,
        scorePercent: 90,
        durationSeconds: 180,
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        xpEarned: 50,
      },
    ],
    questionHistory: [
      {
        questionId: 'y3-wn-01',
        topicId: 'whole-numbers',
        year: 3,
        isCorrect: true,
        selectedAnswer: '3,425',
        timestamp: Date.now() - 3600000,
        timeSpentSeconds: 12,
      },
      {
        questionId: 'y3-mon-01',
        topicId: 'money',
        year: 3,
        isCorrect: true,
        selectedAnswer: 40,
        timestamp: Date.now() - 3400000,
        timeSpentSeconds: 18,
      },
      {
        questionId: 'y3-frac-02',
        topicId: 'fractions-decimals-percentages',
        year: 3,
        isCorrect: false,
        selectedAnswer: 7,
        timestamp: Date.now() - 3200000,
        timeSpentSeconds: 25,
      },
    ],
    incorrectQuestions: [
      {
        questionId: 'y3-frac-02',
        topicId: 'fractions-decimals-percentages',
        year: 3,
        lastAttemptedAt: Date.now() - 3200000,
        retryCount: 1,
        resolved: false,
      },
    ],
  },
  {
    id: 'child-nurul-y5',
    nickname: 'Nurul',
    avatar: 'cat',
    activeAccessory: 'bunga-raya',
    unlockedAccessories: ['bunga-raya'],
    year: 5,
    level: 'advanced',
    xp: 420,
    stars: 35,
    streakDays: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    dailyGoalQuestions: 15,
    todayQuestionsCount: 7,
    totalMinutesLearned: 85,
    completedStageIds: ['stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5'],
    quizHistory: [
      {
        id: 'quiz-2',
        year: 5,
        totalQuestions: 15,
        correctCount: 14,
        scorePercent: 93,
        durationSeconds: 240,
        completedAt: new Date(Date.now() - 43200000).toISOString(),
        xpEarned: 80,
      },
    ],
    questionHistory: [
      {
        questionId: 'y5-wn-02',
        topicId: 'whole-numbers',
        year: 5,
        isCorrect: true,
        selectedAnswer: 140,
        timestamp: Date.now() - 7200000,
        timeSpentSeconds: 20,
      },
      {
        questionId: 'y5-frac-01',
        topicId: 'fractions-decimals-percentages',
        year: 5,
        isCorrect: true,
        selectedAnswer: '3/4',
        timestamp: Date.now() - 7000000,
        timeSpentSeconds: 15,
      },
      {
        questionId: 'y5-time-02',
        topicId: 'time',
        year: 5,
        isCorrect: false,
        selectedAnswer: 120,
        timestamp: Date.now() - 6800000,
        timeSpentSeconds: 30,
      },
    ],
    incorrectQuestions: [
      {
        questionId: 'y5-time-02',
        topicId: 'time',
        year: 5,
        lastAttemptedAt: Date.now() - 6800000,
        retryCount: 1,
        resolved: false,
      },
    ],
  },
];

const INITIAL_PARENT_SETTINGS: ParentSettings = {
  parentPin: '1234',
  dailyScreenTimeLimitMinutes: 45,
  soundEnabled: true,
  preferredLanguage: 'ms',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [activeChildId, setActiveChildId] = useState<string>(() => {
    return profiles[0]?.id || 'child-aiman-y3';
  });

  const [parentSettings, setParentSettings] = useState<ParentSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_PARENT_SETTINGS;
    } catch {
      return INITIAL_PARENT_SETTINGS;
    }
  });

  const [language, setLanguageState] = useState<Language>(parentSettings.preferredLanguage || 'ms');
  const [badges, setBadges] = useState<AchievementBadge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BADGES);
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [accessories, setAccessories] = useState<AvatarAccessory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACCESSORIES);
      return saved ? JSON.parse(saved) : AVATAR_ACCESSORIES;
    } catch {
      return AVATAR_ACCESSORIES;
    }
  });

  const [adventureStages, setAdventureStages] = useState<AdventureStage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STAGES);
      return saved ? JSON.parse(saved) : ADVENTURE_STAGES;
    } catch {
      return ADVENTURE_STAGES;
    }
  });

  const [currentMode, setCurrentMode] = useState<AppContextType['currentMode']>('dashboard');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isParentVerified, setIsParentVerified] = useState<boolean>(false);
  const [timeSpentTodaySeconds, setTimeSpentTodaySeconds] = useState<number>(0);

  const activeChild = profiles.find((p) => p.id === activeChildId) || profiles[0] || null;
  const [selectedYear, setSelectedYear] = useState<SchoolYear>(activeChild?.year || 3);

  // Sync sounds state
  useEffect(() => {
    sounds.enabled = parentSettings.soundEnabled;
  }, [parentSettings.soundEnabled]);

  // Synchronize year when active child changes
  useEffect(() => {
    if (activeChild) {
      setSelectedYear(activeChild.year);
    }
  }, [activeChild?.id]);

  // Session timer ticker (tracked in seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpentTodaySeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.warn('Failed saving profiles', e);
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(parentSettings));
    } catch (e) {
      console.warn('Failed saving settings', e);
    }
  }, [parentSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(badges));
    } catch (e) {
      console.warn('Failed saving badges', e);
    }
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACCESSORIES, JSON.stringify(accessories));
    } catch (e) {
      console.warn('Failed saving accessories', e);
    }
  }, [accessories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STAGES, JSON.stringify(adventureStages));
    } catch (e) {
      console.warn('Failed saving stages', e);
    }
  }, [adventureStages]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setParentSettings((prev) => ({ ...prev, preferredLanguage: lang }));
  };

  const selectChildProfile = (profileId: string) => {
    setActiveChildId(profileId);
    const child = profiles.find((p) => p.id === profileId);
    if (child) {
      setSelectedYear(child.year);
    }
    sounds.playClick();
  };

  const createChildProfile = (newProfileData: Omit<ChildProfile, 'id' | 'xp' | 'stars' | 'streakDays' | 'lastActiveDate' | 'todayQuestionsCount' | 'totalMinutesLearned' | 'completedStageIds' | 'quizHistory' | 'questionHistory' | 'incorrectQuestions' | 'unlockedAccessories'>) => {
    const newId = `child-${Date.now()}`;
    const newProfile: ChildProfile = {
      ...newProfileData,
      id: newId,
      xp: 20,
      stars: 5,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      todayQuestionsCount: 0,
      totalMinutesLearned: 0,
      completedStageIds: ['stage-1'],
      quizHistory: [],
      questionHistory: [],
      incorrectQuestions: [],
      unlockedAccessories: ['songkok-emas'],
    };

    setProfiles((prev) => [...prev, newProfile]);
    setActiveChildId(newId);
    setSelectedYear(newProfile.year);
    sounds.playFanfare();
  };

  const updateChildProfile = (updated: ChildProfile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteChildProfile = (profileId: string) => {
    setProfiles((prev) => {
      const filtered = prev.filter((p) => p.id !== profileId);
      if (activeChildId === profileId && filtered.length > 0) {
        setActiveChildId(filtered[0].id);
      }
      return filtered;
    });
  };

  const updateParentSettings = (settings: Partial<ParentSettings>) => {
    setParentSettings((prev) => ({ ...prev, ...settings }));
  };

  const recordQuestionAttempt = (attempt: Omit<QuestionAttempt, 'timestamp'>) => {
    if (!activeChild) return { xpGained: 0, starsGained: 0, streakBonus: false };

    const fullAttempt: QuestionAttempt = {
      ...attempt,
      timestamp: Date.now(),
    };

    const xpGained = attempt.isCorrect ? 15 : 3; // small effort XP even on mistake!
    const starsGained = attempt.isCorrect ? 1 : 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const isNewDay = activeChild.lastActiveDate !== todayStr;
    const newStreakDays = isNewDay ? activeChild.streakDays + 1 : activeChild.streakDays;

    let updatedIncorrect = [...activeChild.incorrectQuestions];
    if (!attempt.isCorrect) {
      const existing = updatedIncorrect.find((item) => item.questionId === attempt.questionId);
      if (existing) {
        existing.lastAttemptedAt = Date.now();
        existing.retryCount += 1;
      } else {
        updatedIncorrect.push({
          questionId: attempt.questionId,
          topicId: attempt.topicId,
          year: attempt.year,
          lastAttemptedAt: Date.now(),
          retryCount: 1,
          resolved: false,
        });
      }
    } else {
      // If it was previously incorrect and answered correctly, mark as resolved
      updatedIncorrect = updatedIncorrect.map((item) =>
        item.questionId === attempt.questionId ? { ...item, resolved: true } : item
      );
    }

    const updatedChild: ChildProfile = {
      ...activeChild,
      xp: activeChild.xp + xpGained,
      stars: activeChild.stars + starsGained,
      streakDays: newStreakDays,
      lastActiveDate: todayStr,
      todayQuestionsCount: activeChild.todayQuestionsCount + 1,
      totalMinutesLearned: activeChild.totalMinutesLearned + Math.ceil(attempt.timeSpentSeconds / 60),
      questionHistory: [fullAttempt, ...activeChild.questionHistory.slice(0, 99)],
      incorrectQuestions: updatedIncorrect,
    };

    updateChildProfile(updatedChild);

    if (attempt.isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    return { xpGained, starsGained, streakBonus: isNewDay };
  };

  const recordQuizSession = (session: Omit<QuizSessionRecord, 'id' | 'completedAt'>) => {
    if (!activeChild) return;

    const fullSession: QuizSessionRecord = {
      ...session,
      id: `quiz-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };

    const updatedChild: ChildProfile = {
      ...activeChild,
      xp: activeChild.xp + session.xpEarned,
      stars: activeChild.stars + Math.floor(session.correctCount / 2),
      quizHistory: [fullSession, ...activeChild.quizHistory],
    };

    updateChildProfile(updatedChild);
    sounds.playFanfare();
  };

  const resolveIncorrectQuestion = (questionId: string) => {
    if (!activeChild) return;
    const updatedIncorrect = activeChild.incorrectQuestions.map((q) =>
      q.questionId === questionId ? { ...q, resolved: true } : q
    );
    updateChildProfile({ ...activeChild, incorrectQuestions: updatedIncorrect });
  };

  const buyAccessory = (accessoryId: string): boolean => {
    if (!activeChild) return false;
    const item = accessories.find((a) => a.id === accessoryId);
    if (!item || activeChild.stars < item.priceStars) return false;

    if (activeChild.unlockedAccessories.includes(accessoryId)) return true;

    const updatedChild: ChildProfile = {
      ...activeChild,
      stars: activeChild.stars - item.priceStars,
      unlockedAccessories: [...activeChild.unlockedAccessories, accessoryId],
      activeAccessory: accessoryId,
    };

    updateChildProfile(updatedChild);
    sounds.playStreak();
    return true;
  };

  const equipAccessory = (accessoryId: string | null) => {
    if (!activeChild) return;
    updateChildProfile({
      ...activeChild,
      activeAccessory: accessoryId || undefined,
    });
    sounds.playClick();
  };

  const updateStageStars = (stageId: string, stars: number) => {
    setAdventureStages((prev) =>
      prev.map((s) => (s.id === stageId ? { ...s, starEarned: Math.max(s.starEarned, stars) } : s))
    );
    if (activeChild && !activeChild.completedStageIds.includes(stageId)) {
      updateChildProfile({
        ...activeChild,
        completedStageIds: [...activeChild.completedStageIds, stageId],
      });
    }
  };

  const resetAllData = () => {
    setProfiles(INITIAL_PROFILES);
    setParentSettings(INITIAL_PARENT_SETTINGS);
    setBadges(INITIAL_BADGES);
    setAccessories(AVATAR_ACCESSORIES);
    setAdventureStages(ADVENTURE_STAGES);
    setActiveChildId(INITIAL_PROFILES[0].id);
    localStorage.clear();
    sounds.playClick();
  };

  const exportDataAsJson = (): string => {
    const payload = {
      exportedAt: new Date().toISOString(),
      profiles,
      parentSettings,
      badges,
      adventureStages,
    };
    return JSON.stringify(payload, null, 2);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeChild,
        profiles,
        parentSettings,
        badges,
        accessories,
        adventureStages,
        currentMode,
        setCurrentMode,
        selectedTopicId,
        setSelectedTopicId,
        selectedYear,
        setSelectedYear,
        selectChildProfile,
        createChildProfile,
        updateChildProfile,
        deleteChildProfile,
        updateParentSettings,
        recordQuestionAttempt,
        recordQuizSession,
        resolveIncorrectQuestion,
        buyAccessory,
        equipAccessory,
        updateStageStars,
        resetAllData,
        exportDataAsJson,
        isParentVerified,
        setIsParentVerified,
        timeSpentTodaySeconds,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
