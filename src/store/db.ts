import Dexie, { type Table } from 'dexie';
import type { WordProgress, GameProgress } from '../types';
import { ACHIEVEMENTS } from '../types';

// ============================================================
// IndexedDB database for persistent storage
// ============================================================

class FrenchLearningDB extends Dexie {
  wordProgress!: Table<WordProgress, string>; // wordId as primary key
  gameProgress!: Table<{ id: string } & GameProgress, string>; // 'current' as key

  constructor() {
    super('FrenchLearningDB');
    this.version(1).stores({
      wordProgress: 'wordId, status, nextReview',
      gameProgress: 'id',
    });
  }
}

export const db = new FrenchLearningDB();

// ============================================================
// Default game progress
// ============================================================

export function getDefaultGameProgress(): GameProgress {
  return {
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: '',
    dailyXP: 0,
    dailyGoal: 50,
    gems: 0,
    achievements: ACHIEVEMENTS.map(a => ({ ...a })),
    completedLessons: [],
    totalWordsLearned: 0,
  };
}

// ============================================================
// Game progress helpers
// ============================================================

export async function loadGameProgress(): Promise<GameProgress> {
  const stored = await db.gameProgress.get('current');
  if (!stored) {
    const defaults = getDefaultGameProgress();
    await db.gameProgress.put({ id: 'current', ...defaults });
    return defaults;
  }
  const { id, ...progress } = stored;
  return progress as GameProgress;
}

export async function saveGameProgress(progress: GameProgress): Promise<void> {
  await db.gameProgress.put({ id: 'current', ...progress });
}

// Calculate streak based on last study date
export function calculateStreak(currentStreak: number, lastStudyDate: string): {
  newStreak: number;
  newLongestStreak: number;
  newLastStudyDate: string;
  streakUpdated: boolean;
} {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newStreak = currentStreak;
  let streakUpdated = false;

  if (lastStudyDate === today) {
    // Already studied today, keep streak
    return { newStreak, newLongestStreak: newStreak, newLastStudyDate: today, streakUpdated: false };
  }

  if (lastStudyDate === yesterday) {
    // Studied yesterday, increment streak
    newStreak = currentStreak + 1;
    streakUpdated = true;
  } else if (lastStudyDate && lastStudyDate !== today) {
    // Streak broken — more than 1 day gap
    newStreak = 1;
    streakUpdated = true;
  } else {
    // First time studying
    newStreak = 1;
    streakUpdated = true;
  }

  return { newStreak, newLongestStreak: newStreak, newLastStudyDate: today, streakUpdated };
}

// XP reward constants
export const XP_REWARDS = {
  vocabCorrect: 5,
  pronunciationGood: 10,
  listeningCorrect: 8,
  dictationCorrect: 10,
  grammarCorrect: 6,
  perfectLesson: 15, // bonus
  dailyGoalMet: 20, // bonus
  streakBonus: 5, // extra per streak day
} as const;
