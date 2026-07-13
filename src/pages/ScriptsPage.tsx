import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { wordBankDB, lookupWord } from '../services/wordBank';
import { useTTS } from '../hooks/useTTS';
import { getAllStories, downloadStoryAsHTML, downloadAllStoriesAsBook, type Story } from '../data/stories';
import { Download, Volume2, Bookmark, ChevronRight, ArrowLeft } from 'lucide-react';

export default function ScriptsPage() {
  const { speak } = useTTS();
  const addXP = useGameStore(s => s.addXP);
  const [selected, setSelected] = useState<Story | null>(null);
  const [popoverWord, setPopoverWord] = useState<{ word: string; meaning: string; x: number; y: number } | null>(null);

  const stories = getAllStories();

  // Tap on a word to translate
  const handleWordTap = async (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanWord = word.replace(/[.,!?;:'"()«»\s]/g, '').toLowerCase();
    if (cleanWord.length < 2) return;

    const entry = lookupWord(cleanWord);
    if (entry) {
      setPopoverWord({
        word: entry.f,
        meaning: entry.c,
        x: e.clientX,
        y: e.clientY,
      });
      setTimeout(() => setPopoverWord(null), 4000);
    }
  };

  // Save word to bank
  const handleSaveWord = async (word: string) => {
    const cleanWord = word.replace(/[.,!?;:'"()«»\s]/g, '').toLowerCase();
    if (cleanWord.length < 2) return;
    const entry = lookupWord(cleanWord);
    if (!entry) return;

    const exists = await wordBankDB.savedWords.where('french').equals(entry.f).first();
    if (exists) return;

    await wordBankDB.savedWords.put({
      id: Date.now().toString(),
      french: entry.f,
      translation: entry.c,
      notes: entry.p || '',
      tags: ['阅读'],
      createdAt: new Date().toISOString(),
      lastReviewed: new Date().toISOString(),
      reviewCount: 0,
      mastered: false,
    });
    addXP(3);
    setPopoverWord(null);
  };

  // Story list
  if (!selected) {
    const storyItems = stories.filter(s => s.type === 'story');
    const scriptItems = stories.filter(s => s.type === 'script');

    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">阅读 📚</h1>

        {/* Download all button */}
        <button
          onClick={downloadAllStoriesAsBook}
          className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Download size={20} className="text-indigo-500" />
            <div className="text-left">
              <div className="font-semibold text-sm text-indigo-700">下载全部文章</div>
              <div className="text-xs text-indigo-400">HTML格式 · 手机直接打开阅读</div>
            </div>
          </div>
        </button>

        {/* Stories */}
        <Section title="法语故事" icon="📖" items={storyItems} onSelect={setSelected} />

        {/* Scripts */}
        <Section title="电影台词" icon="🎬" items={scriptItems} onSelect={setSelected} />
      </div>
    );
  }

  // Reading view
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-gray-400">
          <ArrowLeft size={16} /> 返回
        </button>
        <div className="flex gap-2">
          <button onClick={() => downloadStoryAsHTML(selected)} className="p-1.5 text-gray-400 hover:text-indigo-500">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center py-2">
        <div className="text-3xl mb-1">{selected.emoji}</div>
        <h2 className="font-bold text-lg">{selected.title}</h2>
        <p className="text-xs text-gray-400">{selected.titleZh} · {selected.level} · {selected.source || ''}</p>
      </div>

      {/* Reading content */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 leading-loose">
        {selected.paragraphs.map((p, i) => (
          <div key={i} className="mb-6 last:mb-0">
            {/* Speaker */}
            {p.speaker && (
              <span className="inline-block px-2 py-0.5 bg-red-50 text-red-500 rounded text-xs font-medium mb-2">
                🎭 {p.speaker}
              </span>
            )}

            {/* French text — each word is tappable */}
            <p className="text-lg mb-2 leading-relaxed cursor-default">
              {p.french.split(/(\s+)/).map((token, j) => {
                if (token.trim() === '') return token;
                return (
                  <span
                    key={j}
                    onClick={(e) => handleWordTap(token, e)}
                    className="hover:bg-yellow-100 hover:rounded px-0.5 cursor-pointer transition-colors"
                  >
                    {token}
                  </span>
                );
              })}
            </p>

            {/* Chinese translation */}
            <p className="text-sm text-gray-400 leading-relaxed mb-2">{p.chinese}</p>

            {/* Vocabulary hints */}
            {p.vocab && (
              <div className="flex flex-wrap gap-1.5">
                {p.vocab.map((v, k) => (
                  <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
                    {v.word} = {v.meaning}
                  </span>
                ))}
              </div>
            )}

            {/* Listen + Save row */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => speak(p.french, { rate: 0.8 })}
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-500 rounded-lg text-xs"
              >
                <Volume2 size={12} /> 听朗读
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Word popover */}
      {popoverWord && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl animate-[bounce-in_0.2s] text-sm"
          style={{ left: Math.min(popoverWord.x - 80, window.innerWidth - 200), top: popoverWord.y - 80 }}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">{popoverWord.word}</span>
            <span className="text-gray-300">{popoverWord.meaning}</span>
            <button
              onClick={() => { handleSaveWord(popoverWord.word); setPopoverWord(null); }}
              className="ml-2 p-1 bg-green-500 rounded-full"
            >
              <Bookmark size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 text-center">
        💡 点击文中任意单词查词 · 点书签保存到词库 · 存够单词去学习
      </div>
    </div>
  );
}

// Section component for story list
function Section({ title, icon, items, onSelect }: {
  title: string; icon: string; items: Story[]; onSelect: (s: Story) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-50 flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs text-gray-400">{items.length}篇</span>
      </div>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0"
        >
          <span className="text-2xl">{item.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{item.title}</div>
            <div className="text-xs text-gray-400">{item.titleZh} · {item.level}</div>
          </div>
          <ChevronRight size={14} className="text-gray-300" />
        </button>
      ))}
    </div>
  );
}
