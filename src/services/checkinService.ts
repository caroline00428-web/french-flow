// ============================================================
// Daily Check-in System — 7-day cycle with escalating rewards
// Designed for WeChat Mini Program retention
// ============================================================

export interface CheckInDay {
  day: number;
  reward: { type: 'gems' | 'xp' | 'ad_free' | 'streak_shield'; amount: number; icon: string };
  isToday: boolean;
  isChecked: boolean;
  isPast: boolean;
}

const WEEKLY_REWARDS = [
  { type: 'gems' as const, amount: 5, icon: '💎' },
  { type: 'xp' as const, amount: 30, icon: '⚡' },
  { type: 'gems' as const, amount: 10, icon: '💎' },
  { type: 'ad_free' as const, amount: 30, icon: '🚫📢' },
  { type: 'gems' as const, amount: 15, icon: '💎' },
  { type: 'xp' as const, amount: 50, icon: '⚡' },
  { type: 'gems' as const, amount: 30, icon: '💎💎' }, // Day 7 big reward
];

// Get check-in data from localStorage
export function getCheckInData(): { checkIns: string[]; lastCheckIn: string; currentStreak: number } {
  try {
    const raw = localStorage.getItem('ff_checkin');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { checkIns: [], lastCheckIn: '', currentStreak: 0 };
}

function saveCheckInData(data: { checkIns: string[]; lastCheckIn: string; currentStreak: number }): void {
  localStorage.setItem('ff_checkin', JSON.stringify(data));
}

// Check if today is already checked in
export function hasCheckedInToday(): boolean {
  const today = new Date().toISOString().split('T')[0];
  return getCheckInData().checkIns.includes(today);
}

// Get streak within the 7-day cycle
export function getWeeklyStreak(): number {
  const { checkIns } = getCheckInData();
  let streak = 0;
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    if (checkIns.includes(dateStr)) streak++;
    else if (i < 6) break; // break on first miss, but allow today to be not yet checked
  }
  return streak;
}

// Generate the 7-day check-in display data
export function getCheckInWeek(): CheckInDay[] {
  const { checkIns } = getCheckInData();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday start

  const days: CheckInDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart.getTime() + i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      day: i + 1,
      reward: WEEKLY_REWARDS[i],
      isToday: dateStr === today.toISOString().split('T')[0],
      isChecked: checkIns.includes(dateStr),
      isPast: d < today,
    });
  }
  return days;
}

// Perform daily check-in. Returns the reward earned.
export function doCheckIn(): { type: string; amount: number; icon: string } | null {
  if (hasCheckedInToday()) return null;

  const today = new Date().toISOString().split('T')[0];
  const data = getCheckInData();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Calculate streak
  if (data.lastCheckIn === yesterday) {
    data.currentStreak = Math.min(data.currentStreak + 1, 7);
  } else if (data.lastCheckIn !== today) {
    data.currentStreak = 1; // reset
  }

  data.checkIns.push(today);
  data.lastCheckIn = today;

  // Keep only last 7 days
  if (data.checkIns.length > 7) {
    data.checkIns = data.checkIns.slice(-7);
  }

  saveCheckInData(data);

  // Return reward based on current streak position
  const dayIndex = data.currentStreak - 1; // 0-based
  return WEEKLY_REWARDS[Math.min(dayIndex, 6)];
}

// Get extra streak rewards for consecutive days (beyond 7-day cycle)
export function getStreakBonusXP(currentStreak: number): number {
  if (currentStreak >= 30) return 50;
  if (currentStreak >= 14) return 30;
  if (currentStreak >= 7) return 15;
  return 0;
}
