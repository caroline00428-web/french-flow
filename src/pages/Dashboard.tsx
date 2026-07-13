import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { getXPForNextLevel, getXPProgress } from '../types';
import { useEffect, useState } from 'react';
import { Flame, Zap, Star, Target, TrendingUp, Mic, BookOpen, MessageCircle, Gem, BookText, Gift } from 'lucide-react';
import { doCheckIn, hasCheckedInToday, getCheckInWeek } from '../services/checkinService';
import { showRewardedAd } from '../services/adService';

// What each level unlocks
const LEVEL_REWARDS: Record<number, string> = {
  2: '解锁听力练习',
  3: '解锁情景对话 🎭',
  5: '解锁语法故事 📖',
  8: '解锁职场法语 💼',
  10: '解锁听写练习 ✍️',
  15: '解锁 A2 进阶内容',
  20: '解锁所有课程 🏆',
};

// Weekly study heatmap component
function WeeklyHeatmap() {
  const progress = useGameStore(s => s.progress);
  const days: { label: string; date: string; studied: boolean; isToday: boolean }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];
    days.push({
      label: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
      date: dateStr,
      studied: progress.lastStudyDate === dateStr, // simplified: check if lastStudy matches
      isToday: dateStr === todayStr,
    });
  }

  const studiedCount = days.filter(d => d.studied).length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm">本周学习</span>
        <span className="text-xs text-[var(--color-text-secondary)]">
          {studiedCount}/7 天
        </span>
      </div>
      <div className="flex gap-1.5 justify-between">
        {days.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-[var(--color-text-secondary)]">{d.label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
              d.isToday
                ? 'ring-2 ring-[var(--color-primary)] ring-offset-1 bg-[var(--color-primary)] text-white'
                : d.studied
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-300'
            }`}>
              {d.studied ? '🔥' : '·'}
            </div>
          </div>
        ))}
      </div>
      {studiedCount === 0 && (
        <p className="text-xs text-[var(--color-text-secondary)] text-center mt-2">
          今天开始学习，点亮你的第一把火！
        </p>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const progress = useGameStore(s => s.progress);
  const checkStreak = useGameStore(s => s.checkStreak);
  const addXP = useGameStore(s => s.addXP);
  const addGems = useGameStore(s => s.addGems);

  useEffect(() => {
    checkStreak();
  }, [checkStreak]);

  const xpProgress = getXPProgress(progress.level, progress.totalXP);
  const nextLevelXP = getXPForNextLevel(progress.level);
  const dailyPercent = Math.min(Math.round((progress.dailyXP / progress.dailyGoal) * 100), 100);
  const today = new Date().toISOString().split('T')[0];
  const studiedToday = progress.lastStudyDate === today;
  const nextReward = LEVEL_REWARDS[progress.level + 1];
  const streakBonus = Math.min(progress.currentStreak, 10);
  const checkedIn = hasCheckedInToday();
  const checkInWeek = getCheckInWeek();

  const [checkInReward, setCheckInReward] = useState<any>(null);
  const handleCheckIn = () => {
    const reward = doCheckIn();
    if (reward) setCheckInReward(reward);
  };

  useEffect(() => {
    if (checkInReward) {
      if (checkInReward.type === 'gems') addGems(checkInReward.amount);
      if (checkInReward.type === 'xp') addXP(checkInReward.amount);
      if (checkInReward.type === 'ad_free') addGems(5);
    }
  }, [checkInReward]);

  const handleWatchAdForGems = async () => {
    const result = await showRewardedAd('adunit-reward-dashboard', { type: 'gems', amount: 10 });
    if (result.watched) addGems(10);
  };

  return (
    <div className="space-y-5">
      {/* Welcome + Streak */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            {studiedToday ? '欢迎回来! 👋' : '今天开始学习吧! 🚀'}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-1">
            {studiedToday
              ? `已连续 ${progress.currentStreak} 天 · XP 加成 x${1 + streakBonus * 0.1}`
              : '每天进步一点点'}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-bold text-sm ${
          progress.currentStreak > 0
            ? 'bg-amber-50 text-amber-500'
            : 'bg-gray-100 text-gray-400'
        }`}>
          <Flame size={18} fill={progress.currentStreak > 0 ? '#F59E0B' : 'none'} />
          <span>{progress.currentStreak}</span>
        </div>
      </div>

      {/* XP + Level Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-xp)]/10 rounded-full flex items-center justify-center">
              <Zap size={16} className="text-[var(--color-xp)]" fill="#F59E0B" />
            </div>
            <span className="font-semibold text-sm">Lv. {progress.level}</span>
            {streakBonus > 0 && (
              <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-medium">
                🔥 x{(1 + streakBonus * 0.1).toFixed(1)} XP
              </span>
            )}
          </div>
          <span className="text-xs text-[var(--color-text-secondary)]">
            {progress.totalXP} / {nextLevelXP} XP
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-xp)] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
        {nextReward && (
          <p className="text-xs text-purple-500 mt-2 flex items-center gap-1">
            <Star size={12} /> 下一级解锁: {nextReward}
          </p>
        )}
      </div>

      {/* Daily Goal */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-[var(--color-primary)]" />
            <span className="font-semibold text-sm">今日目标</span>
          </div>
          <span className="text-xs text-[var(--color-text-secondary)]">
            {progress.dailyXP} / {progress.dailyGoal} XP
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              dailyPercent >= 100 ? 'bg-[var(--color-correct)]' : 'bg-[var(--color-primary)]'
            }`}
            style={{ width: `${dailyPercent}%` }}
          />
        </div>
        {dailyPercent >= 100 && (
          <p className="text-[var(--color-correct)] text-sm mt-2 font-medium text-center animate-bounce">
            🎉 今日目标达成！太棒了！
          </p>
        )}
      </div>

      {/* Weekly heatmap */}
      <WeeklyHeatmap />

      {/* Daily Check-in Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-amber-500" />
            <span className="font-semibold text-sm">每日签到</span>
            <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">
              第{checkInWeek.filter(d => d.isChecked).length}天
            </span>
          </div>
          {!checkedIn ? (
            <button
              onClick={handleCheckIn}
              className="px-4 py-1.5 bg-amber-500 text-white font-bold rounded-full text-xs hover:bg-amber-600 transition-colors animate-[bounce-in_0.5s]"
            >
              签到领奖 🎁
            </button>
          ) : (
            <span className="text-xs text-green-600 font-medium">✅ 已签到</span>
          )}
        </div>

        {/* 7-day check-in grid */}
        <div className="flex gap-1.5 justify-between">
          {checkInWeek.map((d, i) => (
            <div
              key={i}
              className={`flex-1 rounded-xl p-2 text-center transition-all ${
                d.isChecked
                  ? 'bg-amber-500 text-white'
                  : d.isToday
                    ? 'bg-white border-2 border-amber-400'
                    : 'bg-white/50'
              }`}
            >
              <div className="text-lg mb-0.5">{d.reward.icon}</div>
              <div className="text-[10px] font-bold">{d.reward.amount}</div>
              <div className="text-[9px] opacity-70">Day {d.day}</div>
            </div>
          ))}
        </div>

        {checkInReward && (
          <div className="mt-3 bg-white rounded-xl p-3 text-center animate-[bounce-in_0.4s]">
            <p className="text-sm font-bold text-amber-600">
              🎉 签到成功！获得 {checkInReward.icon} x{checkInReward.amount}
            </p>
          </div>
        )}
      </div>

      {/* Ad reward — watch ad for gems */}
      <button
        onClick={handleWatchAdForGems}
        className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100 flex items-center justify-between hover:from-blue-100 hover:to-purple-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎬</div>
          <div className="text-left">
            <div className="font-semibold text-sm text-blue-700">看广告得宝石</div>
            <div className="text-xs text-blue-500">观看30秒视频 · 获得 10 💎</div>
          </div>
        </div>
        <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-medium">领取</span>
      </button>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-3">
          快速练习
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/vocabulary')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-indigo-300 transition-colors group">
            <BookOpen size={24} className="text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm">词汇复习</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">闪卡 + 间隔重复</div>
          </button>
          <button onClick={() => navigate('/pronunciation')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-red-300 transition-colors group">
            <Mic size={24} className="text-red-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm">发音训练</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">录音 + 跳过 + 键盘</div>
          </button>
          <button onClick={() => navigate('/story')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-pink-300 transition-colors group">
            <MessageCircle size={24} className="text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm">情景对话</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">真实场景学法语</div>
          </button>
          <button onClick={() => navigate('/grammar')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-purple-300 transition-colors group">
            <Star size={24} className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm">语法故事</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">小猫Léo教你语法</div>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <button onClick={() => navigate('/reading')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-indigo-300 transition-colors group">
            <BookText size={24} className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm">朗读练习</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">短文朗读+跟读</div>
          </button>
          <button onClick={() => navigate('/story')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-pink-300 transition-colors group">
            <MessageCircle size={24} className="text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm">情景对话</div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">真实场景练口语</div>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center relative">
          <div className="text-lg mb-1">💎</div>
          <div className="font-bold text-sm">{progress.gems}</div>
          <div className="text-[10px] text-[var(--color-text-secondary)]">宝石</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg mb-1">📚</div>
          <div className="font-bold text-sm">{progress.totalWordsLearned}</div>
          <div className="text-[10px] text-[var(--color-text-secondary)]">单词</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg mb-1">🏆</div>
          <div className="font-bold text-sm">{progress.longestStreak}</div>
          <div className="text-[10px] text-[var(--color-text-secondary)]">最长连续</div>
        </div>
      </div>

      {/* Gem Shop Teaser */}
      {progress.gems >= 10 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Gem size={18} className="text-blue-500" />
            <span className="font-semibold text-sm text-blue-700">宝石商店</span>
          </div>
          <p className="text-xs text-blue-600">
            你有 {progress.gems} 💎！收集宝石来解锁特殊课程和主题。连续打卡和满分课程获得更多宝石！
          </p>
        </div>
      )}

      {/* Continue */}
      <button
        onClick={() => navigate('/learn')}
        className="w-full bg-[var(--color-primary)] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-[var(--color-primary)]/25 hover:bg-[var(--color-primary-dark)] transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <TrendingUp size={20} />
        {studiedToday ? '继续学习' : '开始今日学习!'}
      </button>
    </div>
  );
}
