import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wordBankDB, type SavedWord } from '../services/wordBank';
import { useTTS } from '../hooks/useTTS';
import { Search, Volume2, Trash2, ChevronRight, Plus, Check } from 'lucide-react';
import { allCEFRPacks } from '../data/cefrPacks';

export default function WordBank() {
  const navigate = useNavigate();
  const { speak } = useTTS();
  const [words, setWords] = useState<SavedWord[]>([]);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<SavedWord | null>(null);

  const loadWords = async () => {
    let all = await wordBankDB.savedWords.orderBy('createdAt').reverse().toArray();
    if (tagFilter) all = all.filter(w => w.tags.includes(tagFilter));
    if (search) all = all.filter(w =>
      w.french.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.includes(search)
    );
    setWords(all);
  };

  useEffect(() => { loadWords(); }, [tagFilter, search]);

  // Get all unique tags
  const allTags = [...new Set(words.flatMap(w => w.tags))];

  const handleDelete = async (id: string) => {
    await wordBankDB.savedWords.delete(id);
    if (selectedWord?.id === id) setSelectedWord(null);
    loadWords();
  };

  const handleToggleMastered = async (word: SavedWord) => {
    await wordBankDB.savedWords.update(word.id, { mastered: !word.mastered });
    loadWords();
  };

  const masteredCount = words.filter(w => w.mastered).length;
  const totalCount = words.length;

  // Word detail view
  if (selectedWord) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelectedWord(null)} className="text-sm text-gray-400">← 返回词库</button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-3xl font-bold french-text mb-2">{selectedWord.french}</p>
          <button onClick={() => speak(selectedWord.french, { rate: 0.8 })}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-500 rounded-full text-sm mb-3">
            <Volume2 size={14} /> 听发音
          </button>
          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-xl font-semibold text-purple-700">{selectedWord.translation}</p>
          </div>
          {selectedWord.notes && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">💬 {selectedWord.notes}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={() => handleToggleMastered(selectedWord)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm ${
              selectedWord.mastered ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
            {selectedWord.mastered ? '✅ 已掌握' : '标记已掌握'}
          </button>
          <button onClick={() => handleDelete(selectedWord.id)}
            className="px-4 py-3 bg-red-50 text-red-400 rounded-xl">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">我的词库 📖</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {totalCount}个词 · {masteredCount}个已掌握
          </p>
        </div>
        <button onClick={() => navigate('/')}
          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-full text-xs font-bold">
          <Plus size={14} /> 添加
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索词库..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setTagFilter(null)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
              !tagFilter ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >全部</button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag === tagFilter ? null : tag)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                tagFilter === tag ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >{tag}</button>
          ))}
        </div>
      )}

      {/* CEFR Word Packs — one-click add */}
      <div>
        <p className="text-xs font-medium text-gray-400 mb-2">DELF/DALF 考试词包 · 点击导入</p>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {['A1', 'A2', 'B1', 'B2'].map(level => (
            <button
              key={level}
              onClick={() => setTagFilter(level === tagFilter ? null : level)}
              className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium ${
                tagFilter === level ? 'bg-[var(--color-primary)] text-white' : 'bg-white border border-gray-200 text-gray-500'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="grid gap-2 mt-2">
          {allCEFRPacks.filter(p => !tagFilter || p.level === tagFilter).slice(0, 6).map(pack => (
            <div key={pack.id} className="bg-white rounded-xl p-3 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg">{pack.emoji}</span>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{pack.name}</div>
                  <div className="text-[10px] text-gray-400">{pack.description} · {pack.words.length}词</div>
                </div>
              </div>
              <button
                onClick={async () => {
                  let count = 0;
                  for (const w of pack.words) {
                    const exists = await wordBankDB.savedWords.where('french').equals(w.french).first();
                    if (!exists) {
                      await wordBankDB.savedWords.put({
                        id: Date.now().toString() + '_' + Math.random().toString(36).slice(2, 6),
                        french: w.french,
                        translation: w.chinese,
                        notes: '',
                        tags: [pack.level, pack.name],
                        createdAt: new Date().toISOString(),
                        lastReviewed: new Date().toISOString(),
                        reviewCount: 0,
                        mastered: false,
                      });
                      count++;
                    }
                  }
                  alert(`已添加 ${count} 个新词到词库！`);
                  loadWords();
                }}
                className="shrink-0 px-3 py-1.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full"
              >
                添加
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Word list */}
      {words.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-sm text-[var(--color-text-secondary)]">词库还是空的</p>
          <p className="text-xs text-gray-400 mt-1">去首页搜索并保存你的第一个法语词吧！</p>
          <button onClick={() => navigate('/')}
            className="mt-4 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm">
            去添加单词 →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {words.map(word => (
            <button
              key={word.id}
              onClick={() => setSelectedWord(word)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 text-left hover:border-[var(--color-primary)] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm french-text">{word.french}</span>
                  {word.mastered && <Check size={12} className="text-green-500" />}
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">{word.translation}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); speak(word.french, { rate: 0.8 }); }}
                className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg"
              >
                <Volume2 size={14} />
              </button>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
