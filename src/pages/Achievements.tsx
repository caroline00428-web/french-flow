import { useGameStore } from '../store/useGameStore';
import { Lock } from 'lucide-react';

export default function Achievements() {
  const progress = useGameStore(s => s.progress);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">成就</h1>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg mb-1">🏆</div>
          <div className="font-bold text-sm">
            {progress.achievements.filter(a => a.unlockedAt).length}
          </div>
          <div className="text-[10px] text-[var(--color-text-secondary)]">已解锁</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg mb-1">🔥</div>
          <div className="font-bold text-sm">{progress.longestStreak}</div>
          <div className="text-[10px] text-[var(--color-text-secondary)]">最长连续</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg mb-1">💎</div>
          <div className="font-bold text-sm">{progress.gems}</div>
          <div className="text-[10px] text-[var(--color-text-secondary)]">宝石</div>
        </div>
      </div>

      {/* Achievement list */}
      <div className="space-y-2">
        {progress.achievements.map(achievement => {
          const unlocked = !!achievement.unlockedAt;
          const progressPercent = Math.min(achievement.progress, 100);

          return (
            <div
              key={achievement.id}
              className={`bg-white rounded-xl p-4 shadow-sm border ${
                unlocked ? 'border-amber-200' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  unlocked ? 'bg-amber-50' : 'bg-gray-100'
                }`}>
                  {unlocked ? achievement.icon : <Lock size={16} className="text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-sm ${unlocked ? '' : 'text-gray-400'}`}>
                      {achievement.title}
                    </h3>
                    {unlocked && (
                      <span className="text-xs text-amber-500">
                        {new Date(achievement.unlockedAt!).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                    {achievement.description}
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        unlocked ? 'bg-amber-400' : 'bg-[var(--color-primary)]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 text-right">
                    {achievement.progress}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
