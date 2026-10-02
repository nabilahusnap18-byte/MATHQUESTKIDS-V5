export type Language = 'ms' | 'en';

export type SchoolYear = 1 | 2 | 3 | 4 | 5 | 6;

export type LearningLevel = 'beginner' | 'standard' | 'advanced';

export type QuestionType =
  | 'multiple-choice'
  | 'numeric'
  | 'fraction-visual'
  | 'money-match'
  | 'number-line'
  | 'drag-order';

export interface QuestionOption {
  id: string;
  labelMs: string;
  labelEn: string;
  isCorrect: boolean;
}

export interface FractionVisualData {
  totalParts: number;
  targetNumerator: number;
  label: string;
}

export interface MoneyMatchData {
  targetRM: number; // in cents or RM
  availableDenominations: number[]; // [100, 50, 20, 10, 5, 1, 0.5, 0.2]
}

export interface NumberLineData {
  min: number;
  max: number;
  step: number;
  target: number;
}

export interface Question {
  id: string;
  year: SchoolYear;
  topicId: string;
  difficulty: 1 | 2 | 3;
  type: QuestionType;
  promptMs: string;
  promptEn: string;
  contextMs?: string;
  contextEn?: string;
  options?: QuestionOption[];
  correctAnswer: string | number;
  explanationMs: string;
  explanationEn: string;
  hintStepsMs: string[];
  hintStepsEn: string[];
  fractionData?: FractionVisualData;
  moneyData?: MoneyMatchData;
  numberLineData?: NumberLineData;
  dragItems?: { id: string; label: string; correctOrder: number }[];
}

export interface TopicLessonStep {
  titleMs: string;
  titleEn: string;
  contentMs: string;
  contentEn: string;
  visualType?: 'fractions' | 'money' | 'place-value' | 'geometry' | 'time' | 'measurement';
  exampleProblemMs?: string;
  exampleProblemEn?: string;
  workedSolutionMs?: string;
  workedSolutionEn?: string;
}

export interface Topic {
  id: string;
  nameMs: string;
  nameEn: string;
  iconName: string;
  category: string;
  descriptionMs: string;
  descriptionEn: string;
  years: SchoolYear[];
  lesson: {
    titleMs: string;
    titleEn: string;
    steps: TopicLessonStep[];
  };
}

export interface QuestionAttempt {
  questionId: string;
  topicId: string;
  year: SchoolYear;
  isCorrect: boolean;
  selectedAnswer: string | number;
  timestamp: number;
  timeSpentSeconds: number;
}

export interface IncorrectQuestionRecord {
  questionId: string;
  topicId: string;
  year: SchoolYear;
  lastAttemptedAt: number;
  retryCount: number;
  resolved: boolean;
}

export interface QuizSessionRecord {
  id: string;
  year: SchoolYear;
  topicId?: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  durationSeconds: number;
  completedAt: string;
  xpEarned: number;
}

export interface AchievementBadge {
  id: string;
  nameMs: string;
  nameEn: string;
  descriptionMs: string;
  descriptionEn: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'mastery' | 'streak' | 'adventure' | 'tutor';
  progress?: number;
  maxProgress?: number;
}

export interface AvatarAccessory {
  id: string;
  nameMs: string;
  nameEn: string;
  priceStars: number;
  icon: string;
  category: 'hat' | 'glasses' | 'badge' | 'suit';
  unlocked: boolean;
}

export interface ChildProfile {
  id: string;
  nickname: string;
  avatar: string; // 'cat' | 'mousedeer' | 'rabbit' | 'tiger' | 'hornbill'
  activeAccessory?: string;
  unlockedAccessories: string[];
  year: SchoolYear;
  level: LearningLevel;
  xp: number;
  stars: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyGoalQuestions: number;
  todayQuestionsCount: number;
  totalMinutesLearned: number;
  completedStageIds: string[];
  quizHistory: QuizSessionRecord[];
  questionHistory: QuestionAttempt[];
  incorrectQuestions: IncorrectQuestionRecord[];
}

export interface ParentSettings {
  parentPin: string;
  dailyScreenTimeLimitMinutes: number;
  soundEnabled: boolean;
  preferredLanguage: Language;
}

export interface AdventureStage {
  id: string;
  worldIndex: number;
  worldNameMs: string;
  worldNameEn: string;
  stageNumber: number;
  titleMs: string;
  titleEn: string;
  topicId: string;
  year: SchoolYear;
  requiredStars: number;
  starEarned: number; // 0, 1, 2, 3
  isUnlocked: boolean;
  isBossStage?: boolean;
}
