import { useState } from 'react';
import { lookupWord, wordBankDB } from '../services/wordBank';
import { Bookmark, Volume2 } from 'lucide-react';

// ============================================================
// TappableText — every word clickable for lookup + save
// ============================================================

interface Props {
  text: string;
  onSpeak?: (word: string) => void;
  className?: string;
}

export default function TappableText({ text, onSpeak, className = '' }: Props) {
  const [popover, setPopover] = useState<{ word: string; meaning: string; x: number; y: number } | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const handleTap = async (rawWord: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const word = rawWord.replace(/[.,!?;:'"()«»\-…]/g, '').toLowerCase();
    if (word.length < 2) return;

    const entry = lookupWord(word);
    if (entry) {
      setPopover({ word: entry.f, meaning: entry.c, x: e.clientX, y: e.clientY });
      setTimeout(() => setPopover(null), 5000);
    }
  };

  const handleSave = async (word: string) => {
    const entry = lookupWord(word);
    if (!entry) return;
    const exists = await wordBankDB.savedWords.where('french').equals(entry.f).first();
    if (!exists) {
      await wordBankDB.savedWords.put({
        id: Date.now().toString(), french: entry.f, translation: entry.c,
        notes: '', tags: ['阅读'],
        createdAt: new Date().toISOString(), lastReviewed: new Date().toISOString(),
        reviewCount: 0, mastered: false,
      });
    }
    setSaved(prev => new Set([...prev, word]));
    setPopover(null);
  };

  return (
    <span className={`relative ${className}`}>
      {text.split(/(\s+)/).map((token, i) => {
        if (token.trim() === '') return <span key={i}>{token}</span>;
        const isWord = /^[a-zA-ZÀ-ÿ'\-]+[.,!?;:]?$/.test(token);
        if (!isWord) return <span key={i}>{token}</span>;

        return (
          <span
            key={i}
            onClick={(e) => handleTap(token, e)}
            className="hover:bg-yellow-100 hover:rounded px-0.5 cursor-pointer transition-colors duration-150"
          >
            {token}
          </span>
        );
      })}

      {/* Popover */}
      {popover && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl animate-[bounce-in_0.2s] text-sm max-w-[200px]"
          style={{
            left: Math.min(popover.x - 80, window.innerWidth - 210),
            top: popover.y - 90,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold">{popover.word}</span>
            {onSpeak && (
              <button onClick={() => onSpeak(popover.word)} className="p-0.5 text-blue-300">
                <Volume2 size={12} />
              </button>
            )}
          </div>
          <p className="text-gray-300 text-xs">{popover.meaning}</p>
          <button
            onClick={() => handleSave(popover.word)}
            className={`mt-2 w-full py-1 rounded-lg text-xs font-medium ${
              saved.has(popover.word)
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            {saved.has(popover.word) ? '✅ 已保存' : '📖 加入词库'}
          </button>
        </div>
      )}
    </span>
  );
}
