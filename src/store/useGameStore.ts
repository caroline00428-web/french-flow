import { create } from 'zustand';
import type { GameProgress, WordProgress } from '../types';
import { getLevelForXP } from '../types';
import {
  db,
  loadGameProgress,
  saveGameProgress,
  calculateStreak,
} from './db';

interface GameStore {
  // State
  progress: GameProgress;
  isLoaded: boolean;

  // Actions
  initialize: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  addGems: (amount: number) => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  learnWord: (wordId: string) => Promise<void>;
  checkStreak: () => Promise<void>;
  updateDailyGoal: (goal: number) => Promise<void>;
  updateAchievementProgress: (type: string, value: number) => Promise<void>;
  getWordProgress: (wordId: string) => Promise<WordProgress | undefined>;
  updateWordProgress: (progress: WordProgress) => Promise<void>;
  getDueWords: (wordIds: string[]) => Promise<string[]>;
  resetProgress: () => Promise<void>;
  // Resume position
  savePosition: (key: string, value: string) => void;
  getPosition: (key: string) => string | null;
}

export const useGameStore = create<GameStore>((set, get) => ({
  progress: {
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: '',
    dailyXP: 0,
    dailyGoal: 50,
    gems: 0,
    achievements: [],
    completedLessons: [],
    totalWordsLearned: 0,
  },
  isLoaded: false,

  initialize: async () => {
    const progress = await loadGameProgress();
    // Recalculate level from XP
    progress.level = getLevelForXP(progress.totalXP);
    // Reset daily XP if it's a new day
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastStudyDate !== today) {
      progress.dailyXP = 0;
    }
    set({ progress, isLoaded: true });
  },

  addXP: async (amount: number) => {
    const { progress } = get();
    const newTotalXP = progress.totalXP + amount;
    const newDailyXP = progress.dailyXP + amount;
    const newLevel = getLevelForXP(newTotalXP);

    const updated: GameProgress = {
      ...progress,
      totalXP: newTotalXP,
      dailyXP: newDailyXP,
      level: newLevel,
    };
    await saveGameProgress(updated);
    set({ progress: updated });
  },

  addGems: async (amount: number) => {
    const { progress } = get();
    const updated: GameProgress = {
      ...progress,
      gems: progress.gems + amount,
    };
    await saveGameProgress(updated);
    set({ progress: updated });
  },

  completeLesson: async (lessonId: string) => {
    const { progress } = get();
    if (progress.completedLessons.includes(lessonId)) return;
    const updated: GameProgress = {
      ...progress,
      completedLessons: [...progress.completedLessons, lessonId],
    };
    await saveGameProgress(updated);
    set({ progress: updated });
  },

  learnWord: async (_wordId: string) => {
    const { progress } = get();
    const updated: GameProgress = {
      ...progress,
      totalWordsLearned: progress.totalWordsLearned + 1,
    };
    await saveGameProgress(updated);
    set({ progress: updated });
    await get().updateAchievementProgress('words', updated.totalWordsLearned);
  },

  checkStreak: async () => {
    const { progress } = get();
    const { newStreak, newLongestStreak, newLastStudyDate, streakUpdated } =
      calculateStreak(progress.currentStreak, progress.lastStudyDate);

    if (!streakUpdated) return;

    const longest = Math.max(newLongestStreak, progress.longestStreak);
    const updated: GameProgress = {
      ...progress,
      currentStreak: newStreak,
      longestStreak: longest,
      lastStudyDate: newLastStudyDate,
    };
    await saveGameProgress(updated);
    set({ progress: updated });
    await get().updateAchievementProgress('streak', newStreak);
  },

  updateDailyGoal: async (goal: number) => {
    const { progress } = get();
    const updated: GameProgress = { ...progress, dailyGoal: goal };
    await saveGameProgress(updated);
    set({ progress: updated });
  },

  updateAchievementProgress: async (type: string, value: number) => {
    const { progress } = get();
    let changed = false;
    const updatedAchievements = progress.achievements.map(a => {
      if (a.type === type && !a.unlockedAt) {
        const newProgress = Math.min(Math.round((value / a.target) * 100), 100);
        if (newProgress !== a.progress) {
          changed = true;
          const updated = { ...a, progress: newProgress };
          if (newProgress >= 100) {
            updated.unlockedAt = new Date().toISOString();
          }
          return updated;
        }
      }
      return a;
    });

    if (changed) {
      const updated: GameProgress = { ...progress, achievements: updatedAchievements };
      await saveGameProgress(updated);
      set({ progress: updated });
    }
  },

  getWordProgress: async (wordId: string) => {
    return db.wordProgress.get(wordId);
  },

  updateWordProgress: async (wp: WordProgress) => {
    await db.wordProgress.put(wp);
  },

  getDueWords: async (wordIds: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    const allProgress = await db.wordProgress.bulkGet(wordIds);
    return wordIds.filter((_id, i) => {
      const wp = allProgress[i];
      if (!wp) return true; // new word, never reviewed
      if (wp.status === 'mastered') return false;
      return wp.nextReview <= today;
    });
  },

  resetProgress: async () => {
    await db.delete();
    set({ progress: getDefaultProgress(), isLoaded: false });
    await get().initialize();
  },

  savePosition: (key: string, value: string) => {
    try { localStorage.setItem(`ff_pos_${key}`, value); } catch {}
  },
  getPosition: (key: string): string | null => {
    try { return localStorage.getItem(`ff_pos_${key}`); } catch { return null; }
  },
}));

function getDefaultProgress(): GameProgress {
  return {
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: '',
    dailyXP: 0,
    dailyGoal: 50,
    gems: 0,
    achievements: [],
    completedLessons: [],
    totalWordsLearned: 0,
  };
}
