import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { hasApiKey } from '../services/gemini';
import { Zap, BookOpen, Settings, Trophy, Star, TrendingUp } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const progress = useGameStore(s => s.progress);
  const hasAI = hasApiKey();

  return (
    <div className="space-y-4">
      {/* User card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[var(--color-primary)] to-green-400 rounded-full flex items-center justify-center text-2xl">
            🇫🇷
          </div>
          <div>
            <h2 className="font-bold text-lg">法语学习者</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Lv.{progress.level} · {progress.totalXP} XP · 🔥{progress.currentStreak}天
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg">📚</div>
          <div className="font-bold text-sm">{progress.totalWordsLearned}</div>
          <div className="text-[10px] text-gray-400">已学词汇</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg">💎</div>
          <div className="font-bold text-sm">{progress.gems}</div>
          <div className="text-[10px] text-gray-400">宝石</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg">✅</div>
          <div className="font-bold text-sm">{progress.completedLessons.length}</div>
          <div className="text-[10px] text-gray-400">完成课程</div>
        </div>
      </div>

      {/* Menu items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <MenuItem icon={<BookOpen size={18} className="text-blue-500" />} label="学习课程" onClick={() => navigate('/learn')} />
        <MenuItem icon={<Trophy size={18} className="text-amber-500" />} label="成就徽章" onClick={() => navigate('/achievements')} />
        <MenuItem icon={<Star size={18} className="text-purple-500" />} label="朗读练习" onClick={() => navigate('/reading')} />
        <MenuItem icon={<Zap size={18} className="text-orange-500" />} label="语法故事" onClick={() => navigate('/grammar')} />
        <MenuItem icon={<TrendingUp size={18} className="text-green-500" />} label="情景对话" onClick={() => navigate('/story')} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <MenuItem
          icon={<Settings size={18} className="text-gray-500" />}
          label="设置"
          subtitle={hasAI ? 'AI 已连接 ✅' : 'AI 未配置'}
          onClick={() => navigate('/settings')}
        />
      </div>

      <p className="text-center text-[10px] text-gray-400">
        FrenchFlow · 随身法语助手 v2.0 · 用广告支持我们免费运营 ❤️
      </p>
    </div>
  );
}

function MenuItem({ icon, label, subtitle, onClick }: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
    >
      {icon}
      <div className="flex-1 text-left">
        <span className="text-sm font-medium">{label}</span>
        {subtitle && <span className="text-[10px] text-gray-400 ml-2">{subtitle}</span>}
      </div>
      <span className="text-gray-300">›</span>
    </button>
  );
}
