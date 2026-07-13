// ============================================================
// Core data types for French language learning app
// ============================================================

// A single vocabulary word
export interface VocabWord {
  id: string;
  french: string;
  english: string;
  pronunciationHint?: string; // French pronunciation note
  exampleSentence?: string;
  exampleTranslation?: string;
  category: VocabCategory;
  difficulty: 1 | 2 | 3; // 1=easy, 2=medium, 3=hard
  audioUrl?: string; // optional pre-recorded audio
}

export type VocabCategory =
  | 'greetings'
  | 'numbers'
  | 'colors'
  | 'family'
  | 'food'
  | 'drinks'
  | 'daily'
  | 'travel'
  | 'work'
  | 'body'
  | 'clothes'
  | 'weather'
  | 'time'
  | 'animals'
  | 'pronouns'
  | 'verbs-basic';

// SM-2 spaced repetition data per word
export interface WordProgress {
  wordId: string;
  easeFactor: number; // initial 2.5
  interval: number; // days until next review
  repetitions: number; // times reviewed
  nextReview: string; // ISO date string
  lastReview: string; // ISO date string
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
}

// Pronunciation exercise
export interface PronunciationItem {
  id: string;
  french: string;
  english: string;
  difficulty: 1 | 2 | 3;
  focusSounds?: string[]; // e.g. ['é', 'an', 'r']
  tips?: string; // pronunciation tips
}

// Listening exercise
export interface ListeningItem {
  id: string;
  french: string;
  english: string;
  options: string[]; // multiple choice options (english)
  correctIndex: number;
  category: VocabCategory;
  difficulty: 1 | 2 | 3;
}

// Dictation exercise
export interface DictationItem {
  id: string;
  french: string;
  english: string;
  difficulty: 1 | 2 | 3;
  hint?: string; // optional hint
}

// Grammar lesson
export interface GrammarLesson {
  id: string;
  title: string;
  titleZh: string; // Chinese title
  level: 'A0' | 'A1' | 'A2' | 'B1';
  explanation: string; // markdown-like explanation
  examples: GrammarExample[];
  exercises: GrammarExercise[];
}

export interface GrammarExample {
  french: string;
  english: string;
  notes?: string;
}

export interface GrammarExercise {
  type: 'fill-blank' | 'multiple-choice' | 'match';
  question: string;
  options?: string[];
  correctAnswer: string;
  hint?: string;
}

// Game progress
export interface GameProgress {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string; // ISO date
  dailyXP: number;
  dailyGoal: number; // user-set daily XP goal
  gems: number;
  achievements: Achievement[];
  completedLessons: string[]; // lesson IDs
  totalWordsLearned: number;
}

// Achievement
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  unlockedAt?: string; // ISO date when unlocked
  progress: number; // 0-100
  target: number; // target count
  type: 'streak' | 'words' | 'lessons' | 'perfect' | 'custom';
}

// XP required per level (1-25)
export const XP_PER_LEVEL: Record<number, number> = {
  1: 0, 2: 60, 3: 120, 4: 200, 5: 300, 6: 420, 7: 560, 8: 720,
  9: 900, 10: 1100, 11: 1320, 12: 1560, 13: 1820, 14: 2100,
  15: 2400, 16: 2720, 17: 3060, 18: 3420, 19: 3800, 20: 4200,
  21: 4620, 22: 5060, 23: 5520, 24: 6000, 25: 6500,
};

export function getLevelForXP(xp: number): number {
  let level = 1;
  for (const [lvl, required] of Object.entries(XP_PER_LEVEL)) {
    if (xp >= required) level = parseInt(lvl);
    else break;
  }
  return level;
}

export function getXPForNextLevel(currentLevel: number): number {
  return XP_PER_LEVEL[Math.min(currentLevel + 1, 25)] || XP_PER_LEVEL[25];
}

export function getXPProgress(currentLevel: number, totalXP: number): number {
  const currentLevelXP = XP_PER_LEVEL[currentLevel] || 0;
  const nextLevelXP = getXPForNextLevel(currentLevel);
  return ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
}

// Predefined achievements
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'streak-3', title: '3天连续', description: '连续学习3天', icon: '🔥', type: 'streak', progress: 0, target: 3 },
  { id: 'streak-7', title: '一周勇士', description: '连续学习7天', icon: '⚔️', type: 'streak', progress: 0, target: 7 },
  { id: 'streak-30', title: '月度之星', description: '连续学习30天', icon: '🌟', type: 'streak', progress: 0, target: 30 },
  { id: 'words-50', title: '初识法语', description: '学会50个单词', icon: '📖', type: 'words', progress: 0, target: 50 },
  { id: 'words-100', title: '词汇达人', description: '学会100个单词', icon: '📚', type: 'words', progress: 0, target: 100 },
  { id: 'words-500', title: '法语词汇家', description: '学会500个单词', icon: '🎓', type: 'words', progress: 0, target: 500 },
  { id: 'lessons-10', title: '初学者', description: '完成10节课程', icon: '🎯', type: 'lessons', progress: 0, target: 10 },
  { id: 'lessons-50', title: '勤奋学者', description: '完成50节课程', icon: '🏆', type: 'lessons', progress: 0, target: 50 },
  { id: 'perfect-1', title: '完美一课', description: '一节课全对', icon: '💯', type: 'perfect', progress: 0, target: 1 },
  { id: 'perfect-10', title: '十全十美', description: '10节课全对', icon: '👑', type: 'perfect', progress: 0, target: 10 },
];

// Category display names
export const CATEGORY_NAMES: Record<VocabCategory, { zh: string; icon: string }> = {
  greetings: { zh: '问候', icon: '👋' },
  numbers: { zh: '数字', icon: '🔢' },
  colors: { zh: '颜色', icon: '🎨' },
  family: { zh: '家庭', icon: '👨‍👩‍👧‍👦' },
  food: { zh: '食物', icon: '🍽️' },
  drinks: { zh: '饮品', icon: '☕' },
  daily: { zh: '日常', icon: '💬' },
  travel: { zh: '旅行', icon: '✈️' },
  work: { zh: '工作', icon: '💼' },
  body: { zh: '身体', icon: '🧍' },
  clothes: { zh: '服装', icon: '👔' },
  weather: { zh: '天气', icon: '🌤️' },
  time: { zh: '时间', icon: '⏰' },
  animals: { zh: '动物', icon: '🐱' },
  pronouns: { zh: '代词', icon: '👤' },
  'verbs-basic': { zh: '基础动词', icon: '🏃' },
};
