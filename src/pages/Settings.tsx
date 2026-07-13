import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Target, Download, Trash2, Info, Key, Check, Eye, EyeOff, ExternalLink, Volume2 } from 'lucide-react';
import { hasApiKey, setApiKey, clearApiKey, testApiKey, getProvider } from '../services/gemini';
import { getFrenchVoices, getSavedVoiceName, saveVoiceName } from '../hooks/useTTS';

export default function Settings() {
  const progress = useGameStore(s => s.progress);
  const updateDailyGoal = useGameStore(s => s.updateDailyGoal);
  const resetProgress = useGameStore(s => s.resetProgress);

  const [goalInput, setGoalInput] = useState(progress.dailyGoal);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [apiProvider, setApiProvider] = useState<'zhipu' | 'gemini'>(getProvider());
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'none' | 'testing' | 'valid' | 'invalid'>('none');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    setHasKey(hasApiKey());
  }, []);

  const handleSaveGoal = () => {
    if (goalInput >= 10 && goalInput <= 500) {
      updateDailyGoal(goalInput);
    }
  };

  const handleReset = async () => {
    await resetProgress();
    setShowResetConfirm(false);
    window.location.reload();
  };

  const handleExportData = async () => {
    const data = {
      progress,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frenchflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">设置</h1>

      {/* Daily Goal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target size={18} className="text-[var(--color-primary)]" />
          <span className="font-semibold text-sm">每日 XP 目标</span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            value={goalInput}
            onChange={e => setGoalInput(Number(e.target.value))}
            className="flex-1 p-3 rounded-xl border border-gray-200 text-center text-lg font-bold focus:outline-none focus:border-[var(--color-primary)]"
            min={10}
            max={500}
            step={10}
          />
          <button
            onClick={handleSaveGoal}
            disabled={goalInput === progress.dailyGoal || goalInput < 10 || goalInput > 500}
            className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl disabled:opacity-40 transition-opacity"
          >
            保存
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mt-2">设定每天想获得的经验值 (10-500 XP)</p>
      </div>

      {/* Voice Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 size={18} className="text-blue-500" />
          <span className="font-semibold text-sm">法语发音语音</span>
        </div>
        <select
          value={getSavedVoiceName() || ''}
          onChange={(e) => saveVoiceName(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 text-sm bg-white"
        >
          <option value="">自动选择最佳语音</option>
          {getFrenchVoices().map(v => (
            <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
          ))}
        </select>
        <p className="text-[10px] text-gray-400 mt-2">
          Chrome 的 "Google français" 或 macOS 的 "Thomas/Amélie" 最自然。
          如果列表为空，先在浏览器中触发一次朗读再回来。
        </p>
        <button
          onClick={() => {
            const u = new SpeechSynthesisUtterance('Bonjour');
            u.lang = 'fr-FR';
            window.speechSynthesis.speak(u);
            setTimeout(() => window.location.reload(), 500);
          }}
          className="mt-2 text-xs text-blue-500 underline"
        >
          点击测试发音 → 刷新语音列表
        </button>
      </div>

      {/* AI API Key */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-purple-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Key size={18} className="text-purple-500" />
          <span className="font-semibold text-sm">AI 家教 API Key</span>
          {hasKey && keyStatus === 'valid' && (
            <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
              <Check size={10} /> 已连接
            </span>
          )}
        </div>

        {!hasKey ? (
          <>
            {/* Provider selector */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setApiProvider('zhipu')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors ${
                  apiProvider === 'zhipu'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-500'
                }`}
              >
                🇨🇳 智谱AI（推荐）
              </button>
              <button
                onClick={() => setApiProvider('gemini')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors ${
                  apiProvider === 'gemini'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-500'
                }`}
              >
                🔷 Gemini（需VPN）
              </button>
            </div>

            {apiProvider === 'zhipu' ? (
              <>
                <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                  智谱AI GLM-4-Flash · <strong>国内直连</strong> · 完全免费 · 无需VPN
                </p>
                <p className="text-[10px] text-amber-600 mb-2">
                  ⚠️ 注册后可能需要等待几分钟才能调用API
                </p>
              </>
            ) : (
              <p className="text-xs text-[var(--color-text-secondary)] mb-2">
                Google Gemini 2.0 Flash · 免费1500次/天 · 需要VPN
              </p>
            )}

            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder={apiProvider === 'zhipu' ? '粘贴智谱API Key...' : '粘贴Gemini API Key...'}
                  className="w-full p-2.5 pr-10 rounded-xl border border-purple-200 text-sm focus:outline-none focus:border-purple-400"
                />
                <button onClick={() => setShowKey(!showKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (!apiKeyInput.trim()) return;
                  setKeyStatus('testing');
                  const valid = await testApiKey(apiKeyInput.trim(), apiProvider);
                  if (valid) {
                    setApiKey(apiKeyInput.trim(), apiProvider);
                    setKeyStatus('valid');
                    setHasKey(true);
                    setApiKeyInput('');
                  } else {
                    setKeyStatus('invalid');
                  }
                }}
                disabled={!apiKeyInput.trim() || keyStatus === 'testing'}
                className="px-4 py-2 bg-purple-500 text-white font-bold rounded-xl text-sm disabled:opacity-40 hover:bg-purple-600 transition-colors"
              >
                {keyStatus === 'testing' ? '验证中...' : '验证并保存'}
              </button>

              <a
                href={apiProvider === 'zhipu'
                  ? 'https://open.bigmodel.cn/usercenter/apikeys'
                  : 'https://aistudio.google.com/apikey'}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 bg-white text-purple-600 text-sm font-medium rounded-xl border border-purple-200 hover:bg-purple-50"
              >
                获取密钥 <ExternalLink size={12} />
              </a>
            </div>
            {keyStatus === 'invalid' && (
              <p className="text-xs text-red-500 mt-2">
                {apiProvider === 'zhipu'
                  ? '密钥无效或请求过于频繁，请检查后重试'
                  : '密钥无效或无法连接（可能需要VPN），请检查'}
              </p>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-green-600 flex items-center gap-1">
              <Check size={12} /> {apiProvider === 'zhipu' ? '智谱AI' : 'Gemini'} 已就绪！
              <a href="/tutor" className="underline font-medium">去 AI 家教对话</a>
            </p>
            <button
              onClick={() => { clearApiKey(); setHasKey(false); setKeyStatus('none'); setApiKeyInput(''); }}
              className="text-xs text-red-400 hover:text-red-600 underline"
            >
              移除 API Key
            </button>
          </div>
        )}
        <p className="text-[10px] text-[var(--color-text-secondary)] mt-2">
          密钥仅保存在浏览器本地，不上传任何服务器。
        </p>
      </div>

      {/* Quick options */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={handleExportData}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Download size={18} className="text-blue-500" />
            <span className="text-sm font-medium">导出学习数据</span>
          </div>
        </button>
      </div>

      {/* Reset */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={18} className="text-red-400" />
              <span className="text-sm font-medium text-red-500">重置所有学习进度</span>
            </div>
          </button>
        ) : (
          <div className="p-4">
            <p className="text-sm text-red-500 font-medium mb-3">
              ⚠️ 确定要重置所有进度吗？此操作不可撤销！
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl text-sm"
              >
                取消
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm"
              >
                确认重置
              </button>
            </div>
          </div>
        )}
      </div>

      {/* App info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Info size={16} className="text-[var(--color-text-secondary)]" />
          <span className="text-sm font-medium">关于</span>
        </div>
        <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
          <p>FrenchFlow v1.0 — 趣味学法语 🇫🇷</p>
          <p>基于游戏化学习理论 · 纯前端实现</p>
          <p>语音功能需 Chrome 浏览器 · 数据存储在本地</p>
          <p className="mt-2">Bon courage! 💪</p>
        </div>
      </div>
    </div>
  );
}
