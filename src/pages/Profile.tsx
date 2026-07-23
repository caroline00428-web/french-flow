import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { hasApiKey } from '../services/gemini';
import {
  getActiveProfile, setActiveProfile, createProfile,
  deleteProfile, getAllProfileList, migrateFromLegacy,
  clearChatHistory,
  type UserProfile,
} from '../services/accountService';
import { BookOpen, Settings, Star, TrendingUp, Mic, MessageSquare, LogOut, UserPlus, Trash2 } from 'lucide-react';

const AVATARS = ['😎', '🐱', '🦊', '🐼', '🐨', '🦁', '🐰', '🐸', '🦄', '🐙'];

export default function Profile() {
  const navigate = useNavigate();
  const progress = useGameStore(s => s.progress);
  const hasAI = hasApiKey();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]);
  const [showSwitch, setShowSwitch] = useState(false);

  const refresh = () => {
    migrateFromLegacy();
    setProfile(getActiveProfile());
    setAllProfiles(getAllProfileList());
  };

  useEffect(() => { refresh(); }, []);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const p = createProfile(newName.trim(), newAvatar);
    setProfile(p);
    setNewName('');
    setShowCreate(false);
    refresh();
  };

  const handleSwitch = (id: string) => {
    const p = setActiveProfile(id);
    setProfile(p);
    setShowSwitch(false);
    refresh();
    // Reload to apply new settings
    window.location.reload();
  };

  const handleDelete = (id: string) => {
    if (!confirm('确定删除这个账号？聊天记录也会被清除。')) return;
    deleteProfile(id);
    refresh();
  };

  const handleClearChat = (id: string) => {
    if (!confirm('确定清除该账号的所有 AI 聊天记录？')) return;
    clearChatHistory(id);
    alert('聊天记录已清除');
  };

  if (!profile) {
    // No profile yet — show create screen
    return (
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-center">欢迎 👋</h1>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center space-y-4">
          <div className="text-5xl">🇫🇷</div>
          <p className="text-sm text-gray-500">创建一个账号来保存你的学习进度和设置</p>

          {showCreate ? (
            <>
              {/* Avatar picker */}
              <div>
                <p className="text-xs text-gray-400 mb-2">选一个头像</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {AVATARS.map(a => (
                    <button
                      key={a}
                      onClick={() => setNewAvatar(a)}
                      className={`text-2xl p-2 rounded-xl transition-all ${newAvatar === a ? 'bg-purple-100 ring-2 ring-purple-400 scale-110' : 'hover:bg-gray-100'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                placeholder="输入你的昵称..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-center focus:outline-none focus:border-purple-400"
                autoFocus
              />
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold text-sm disabled:opacity-40"
              >
                开始学习！
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="w-full py-3 bg-purple-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              创建我的账号
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-2xl">
            {profile.avatar}
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg">{profile.nickname}</h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Lv.{progress.level} · {progress.totalXP} XP · 🔥{progress.currentStreak}天
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {profile.apiKey ? 'AI 已配置 ✅' : 'AI 未配置 ⚠️'}
            </p>
          </div>
          <button
            onClick={() => setShowSwitch(!showSwitch)}
            className="text-xs text-purple-500 font-medium px-2 py-1 bg-purple-50 rounded-lg"
          >
            切换
          </button>
        </div>
      </div>

      {/* Account switcher */}
      {showSwitch && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2 animate-[bounce-in_0.2s]">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm">切换账号</h3>
            <button onClick={() => { setShowCreate(true); setShowSwitch(false); }} className="text-xs text-purple-500 font-medium">
              + 新建
            </button>
          </div>
          {allProfiles.map(p => (
            <div key={p.id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${p.id === profile.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
              <span className="text-xl">{p.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{p.nickname}</div>
                <div className="text-[10px] text-gray-400">{p.id === profile.id ? '当前' : new Date(p.lastLogin).toLocaleDateString()}</div>
              </div>
              {p.id !== profile.id ? (
                <button onClick={() => handleSwitch(p.id)} className="text-xs text-purple-500 font-medium px-2 py-1 bg-purple-50 rounded-lg">
                  登录
                </button>
              ) : null}
              <button onClick={() => handleDelete(p.id)} className="p-1 text-gray-300 hover:text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create profile modal */}
      {showCreate && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100 space-y-3 animate-[bounce-in_0.2s]">
          <h3 className="font-semibold text-sm">新建账号</h3>
          <div className="flex gap-2 justify-center flex-wrap">
            {AVATARS.map(a => (
              <button key={a} onClick={() => setNewAvatar(a)} className={`text-2xl p-2 rounded-xl ${newAvatar === a ? 'bg-purple-100 ring-2 ring-purple-400' : 'hover:bg-gray-100'}`}>
                {a}
              </button>
            ))}
          </div>
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} placeholder="昵称" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-center focus:outline-none focus:border-purple-400" autoFocus />
          <div className="flex gap-2">
            <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl text-sm">取消</button>
            <button onClick={handleCreate} disabled={!newName.trim()} className="flex-1 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-medium disabled:opacity-40">创建</button>
          </div>
        </div>
      )}

      {/* Stats */}
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

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <MenuItem icon={<BookOpen size={18} className="text-blue-500" />} label="学习课程" onClick={() => navigate('/learn')} />
        <MenuItem icon={<Mic size={18} className="text-red-500" />} label="每日一音 🎯" onClick={() => navigate('/dailysound')} subtitle="30天发音训练" />
        <MenuItem icon={<Star size={18} className="text-purple-500" />} label="故事阅读" onClick={() => navigate('/scripts')} />
        <MenuItem icon={<TrendingUp size={18} className="text-green-500" />} label="语法故事" onClick={() => navigate('/grammar')} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <MenuItem icon={<MessageSquare size={18} className="text-pink-500" />} label="提意见 💬" onClick={() => navigate('/feedback')} subtitle="帮助我们改进" />
        <button onClick={() => handleClearChat(profile.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 text-left">
          <LogOut size={18} className="text-orange-400" />
          <div className="flex-1">
            <span className="text-sm font-medium">清除聊天记录</span>
            <span className="text-[10px] text-gray-400 ml-2">不可恢复</span>
          </div>
          <span className="text-gray-300">›</span>
        </button>
        <MenuItem icon={<Settings size={18} className="text-gray-500" />} label="设置" subtitle={hasAI ? 'AI 已连接 ✅' : 'AI 未配置'} onClick={() => navigate('/settings')} />
      </div>

      <p className="text-center text-[10px] text-gray-400">
        FrenchFlow · 数据存于浏览器 · 多账号独立
      </p>
    </div>
  );
}

function MenuItem({ icon, label, subtitle, onClick }: {
  icon: React.ReactNode; label: string; subtitle?: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
      {icon}
      <div className="flex-1 text-left">
        <span className="text-sm font-medium">{label}</span>
        {subtitle && <span className="text-[10px] text-gray-400 ml-2">{subtitle}</span>}
      </div>
      <span className="text-gray-300">›</span>
    </button>
  );
}
