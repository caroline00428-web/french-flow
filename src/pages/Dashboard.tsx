import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { wordBankDB } from '../services/wordBank';
import { doCheckIn, hasCheckedInToday, getCheckInWeek } from '../services/checkinService';
import { BookOpen, BookText, Search, Mic, Gift, Film } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const progress = useGameStore(s => s.progress);
  const checkStreak = useGameStore(s => s.checkStreak);

  const [wordCount, setWordCount] = useState(0);
  const [masteredCount, setMasteredCount] = useState(0);
  const [reviewDue, setReviewDue] = useState(0);
  const checkedIn = hasCheckedInToday();
  const checkInWeek = getCheckInWeek();

  useEffect(() => { checkStreak(); }, [checkStreak]);

  useEffect(() => {
    (async () => {
      const all = await wordBankDB.savedWords.toArray();
      setWordCount(all.length);
      setMasteredCount(all.filter(w => w.mastered).length);
      const today = new Date().toISOString().split('T')[0];
      setReviewDue(all.filter(w => !w.mastered && w.lastReviewed < today).length);
    })();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const studiedToday = progress.lastStudyDate === today;

  return (
    <div className="space-y-4">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            {studiedToday ? 'Bonjour! 👋' : 'Bonne journée! 🌤️'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {studiedToday
              ? `连续学习 ${progress.currentStreak} 天 🔥`
              : '今天开始学法语吧 ✨'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[var(--color-primary)]">{wordCount}</div>
          <div className="text-[10px] text-gray-400">我的词汇</div>
        </div>
      </div>

      {/* Word progress — the real metric */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center" onClick={() => navigate('/wordbank')}>
          <div className="text-lg mb-0.5">📚</div>
          <div className="font-bold text-sm">{wordCount}</div>
          <div className="text-[10px] text-gray-400">总词汇</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg mb-0.5">✅</div>
          <div className="font-bold text-sm">{masteredCount}</div>
          <div className="text-[10px] text-gray-400">已掌握</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center" onClick={() => navigate('/vocabulary?mode=review')}>
          <div className="text-lg mb-0.5">🔄</div>
          <div className="font-bold text-sm text-[var(--color-accent)]">{reviewDue}</div>
          <div className="text-[10px] text-gray-400">待复习</div>
        </div>
      </div>

      {/* Quick search — core tool */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Search size={18} className="text-gray-300 shrink-0" />
          <span className="flex-1 text-sm text-gray-400">查法语单词...</span>
          <span className="text-xs text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full font-medium">查词</span>
        </div>
      </div>

      {/* Daily check-in */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-amber-500" />
            <span className="font-semibold text-sm">每日签到</span>
            <span className="text-[10px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">
              第{checkInWeek.filter(d => d.isChecked).length}天
            </span>
          </div>
          {!checkedIn ? (
            <button onClick={() => doCheckIn()} className="px-3 py-1 bg-amber-500 text-white font-bold rounded-full text-xs">
              签到
            </button>
          ) : (
            <span className="text-xs text-green-600 font-medium">✅</span>
          )}
        </div>
        <div className="flex gap-1.5 justify-between">
          {checkInWeek.map((d, i) => (
            <div key={i} className={`flex-1 rounded-lg p-1.5 text-center ${
              d.isChecked ? 'bg-amber-500 text-white' : d.isToday ? 'bg-white border border-amber-400' : 'bg-white/40'
            }`}>
              <div className="text-sm">{d.reward.icon}</div>
              <div className="text-[9px] font-bold">{d.isChecked ? '✓' : d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Study actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => navigate('/vocabulary')} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-indigo-300 transition-colors group">
          <BookOpen size={22} className="text-indigo-500 mb-2" />
          <div className="font-semibold text-sm">词汇复习</div>
          <div className="text-xs text-gray-400 mt-0.5">{reviewDue > 0 ? `${reviewDue}个词待复习` : '全部掌握!'}</div>
        </button>
        <button onClick={() => navigate('/scripts')} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-amber-300 transition-colors group">
          <BookText size={22} className="text-amber-500 mb-2" />
          <div className="font-semibold text-sm">法语阅读</div>
          <div className="text-xs text-gray-400 mt-0.5">绘本·剧本·诗歌</div>
        </button>
        <button onClick={() => navigate('/pronunciation')} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-red-300 transition-colors group">
          <Mic size={22} className="text-red-400 mb-2" />
          <div className="font-semibold text-sm">发音训练</div>
          <div className="text-xs text-gray-400 mt-0.5">录音·跟读·对比</div>
        </button>
        <button onClick={() => navigate('/grammar')} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-purple-300 transition-colors group">
          <Film size={22} className="text-purple-400 mb-2" />
          <div className="font-semibold text-sm">语法故事</div>
          <div className="text-xs text-gray-400 mt-0.5">小猫Léo讲语法</div>
        </button>
      </div>
    </div>
  );
}
