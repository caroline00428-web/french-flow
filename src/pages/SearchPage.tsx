import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTTS } from '../hooks/useTTS';
import { lookupWord, lookupChinese, wordBankDB, type SavedWord, getDictionaryStats } from '../services/wordBank';
import { Search, Volume2, Bookmark, BookmarkCheck, Clock, X, Sparkles } from 'lucide-react';

export default function SearchPage() {
  const navigate = useNavigate();
  const { speak } = useTTS();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('ff_recent') || '[]'); } catch { return []; }
  });
  const [dictSize] = useState(getDictionaryStats().total);

  // Daily word
  const dailyWord = (() => {
    const words = [
      { f: 'bibliothèque', c: '图书馆 📚' },
      { f: 'aujourd\'hui', c: '今天 📅' },
      { f: 'dépaysement', c: '异国感 🌍' },
      { f: 'flâner', c: '闲逛 🚶' },
      { f: 'chuchoter', c: '耳语 🤫' },
      { f: 'retrouvailles', c: '重逢 🤗' },
      { f: 'éphémère', c: '短暂的 🦋' },
    ];
    return words[new Date().getDate() % words.length];
  })();

  const handleSearch = (text?: string) => {
    const q = (text || query).trim();
    if (!q) return;
    setSaved(false);
    setNotFound(false);

    // Try French→Chinese first, then Chinese→French
    let res = lookupWord(q);
    if (!res && /[一-鿿]/.test(q)) {
      res = lookupChinese(q);
    }
    if (!res && q.length > 2) {
      // Try remove accents
      const noAccent = q.normalize('NFD').replace(/[̀-ͯ]/g, '');
      res = lookupWord(noAccent);
    }

    if (res) {
      setResult({ word: res.f, translation: res.c, pronunciation: res.p || '', example: res.e || '', exampleTranslation: res.ec || '' });
    } else {
      setResult(null);
      setNotFound(true);
    }

    // Save to recent
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('ff_recent', JSON.stringify(updated));
  };

  const handleSave = async () => {
    if (!result || saved) return;
    const word: SavedWord = {
      id: Date.now().toString(),
      french: result.word || query,
      translation: result.translation,
      notes: result.pronunciation || '',
      tags: [],
      createdAt: new Date().toISOString(),
      lastReviewed: new Date().toISOString(),
      reviewCount: 0,
      mastered: false,
    };
    await wordBankDB.savedWords.put(word);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-2 gap-2">
          <Search size={18} className="text-gray-300 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="输入法语或中文..."
            className="flex-1 py-2 text-base outline-none bg-transparent"
            autoComplete="off"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResult(null); setNotFound(false); }} className="p-1">
              <X size={16} className="text-gray-300" />
            </button>
          )}
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim()}
            className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm disabled:opacity-40"
          >
            查询
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-right">本地词库 · {dictSize}+词条 · 离线可用</p>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-[slide-up_0.3s_ease-out]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{result.word}</h2>
                <button
                  onClick={() => speak(result.word, { rate: 0.8 })}
                  className="p-1.5 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100"
                >
                  <Volume2 size={16} />
                </button>
              </div>
              {result.pronunciation && (
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{result.pronunciation}</p>
              )}
            </div>
            <button
              onClick={handleSave}
              className={`p-2 rounded-xl transition-colors ${
                saved ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-500'
              }`}
              title="保存到词库"
            >
              {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            </button>
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl mb-3">
            <p className="text-lg font-semibold text-purple-700">{result.translation}</p>
          </div>

          {result.example && (
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-400">例句</span>
                <button onClick={() => speak(result.example, { rate: 0.8 })} className="text-xs text-blue-400">
                  <Volume2 size={12} />
                </button>
              </div>
              <p className="text-sm">{result.example}</p>
              <p className="text-xs text-gray-500 mt-0.5">{result.exampleTranslation}</p>
            </div>
          )}

          {saved && (
            <div className="mt-3 text-center text-sm text-green-600 font-medium animate-[bounce-in_0.3s]">
              ✅ 已保存到词库
            </div>
          )}
        </div>
      )}

      {notFound && (
        <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
          <p className="text-sm text-amber-700">未找到 "{query}"</p>
          <p className="text-xs text-amber-500 mt-1">试试其他拼写，或该词暂未收录</p>
        </div>
      )}

      {/* Daily word */}
      {!result && !notFound && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-purple-400" />
            <span className="text-xs font-medium text-purple-500">每日一词</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{dailyWord.f}</p>
              <p className="text-sm text-gray-500">{dailyWord.c}</p>
            </div>
            <button
              onClick={() => { setQuery(dailyWord.f); handleSearch(dailyWord.f); }}
              className="px-3 py-1.5 bg-purple-500 text-white text-xs font-bold rounded-full"
            >
              查看
            </button>
          </div>
        </div>
      )}

      {/* Recent searches */}
      {!result && recentSearches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-400">最近查询</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s, i) => (
              <button
                key={i}
                onClick={() => { setQuery(s); handleSearch(s); }}
                className="px-3 py-1.5 bg-white rounded-full text-sm border border-gray-200 text-gray-600 hover:border-[var(--color-primary)]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">快捷操作</p>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => navigate('/wordbank')}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:border-[var(--color-primary)]">
            <div className="text-xl mb-1">📖</div>
            <div className="text-xs font-medium">我的词库</div>
          </button>
          <button onClick={() => navigate('/learn')}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:border-[var(--color-primary)]">
            <div className="text-xl mb-1">📝</div>
            <div className="text-xs font-medium">开始学习</div>
          </button>
          <button onClick={() => navigate('/pronunciation')}
            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center hover:border-[var(--color-primary)]">
            <div className="text-xl mb-1">🎤</div>
            <div className="text-xs font-medium">练发音</div>
          </button>
        </div>
      </div>
    </div>
  );
}
