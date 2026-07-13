import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wordBankDB, type SavedWord } from '../services/wordBank';
import { useTTS } from '../hooks/useTTS';
import { Search, Volume2, Trash2, ChevronRight, Plus, Check, Download, Upload } from 'lucide-react';
import { generateWordPacks, downloadWordPack, importWordPack } from '../services/wordBank';

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

          {/* Download word packs */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-gray-400">或下载预置词包快速填充</p>
            {generateWordPacks().map((pack, i) => (
              <button
                key={i}
                onClick={() => downloadWordPack(pack)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-[var(--color-primary)]"
              >
                <div className="text-left">
                  <div className="text-sm font-medium">{pack.name}</div>
                  <div className="text-xs text-gray-400">{pack.description} · {pack.wordCount}词</div>
                </div>
                <Download size={16} className="text-gray-400" />
              </button>
            ))}
            <label className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-100">
              <div className="text-left">
                <div className="text-sm font-medium text-blue-600">导入词包</div>
                <div className="text-xs text-blue-400">从JSON文件导入词汇</div>
              </div>
              <Upload size={16} className="text-blue-400" />
              <input type="file" accept=".json" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const count = await importWordPack(file);
                  alert(`成功导入 ${count} 个新词！`);
                  loadWords();
                }
              }} />
            </label>
          </div>
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
