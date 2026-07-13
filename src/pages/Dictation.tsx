import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { XP_REWARDS } from '../store/db';
import { useTTS } from '../hooks/useTTS';
import { foodDictation } from '../data/food';
import { dailyDictation } from '../data/daily';
import { Volume2, ArrowRight, RotateCcw, Check } from 'lucide-react';

const allItems = [...foodDictation, ...dailyDictation];

function compareDictation(original: string, userInput: string): {
  correct: boolean;
  display: Array<{ char: string; status: 'correct' | 'incorrect' | 'missing' | 'extra' }>;
} {
  const orig = original.toLowerCase().trim();
  const input = userInput.toLowerCase().trim();

  if (orig === input) {
    return {
      correct: true,
      display: orig.split('').map(char => ({ char, status: 'correct' as const })),
    };
  }

  // Character-by-character comparison
  const display: Array<{ char: string; status: 'correct' | 'incorrect' | 'missing' | 'extra' }> = [];
  const maxLen = Math.max(orig.length, input.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < orig.length && i < input.length) {
      if (orig[i] === input[i]) {
        display.push({ char: orig[i], status: 'correct' });
      } else {
        display.push({ char: orig[i], status: 'incorrect' });
      }
    } else if (i < orig.length) {
      display.push({ char: orig[i], status: 'missing' });
    } else {
      display.push({ char: input[i], status: 'extra' });
    }
  }

  return { correct: false, display };
}

export default function Dictation() {
  const addXP = useGameStore(s => s.addXP);
  const addGems = useGameStore(s => s.addGems);
  const { speak } = useTTS();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof compareDictation> | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = allItems[currentIndex];

  // Auto-play on new item
  useEffect(() => {
    if (current && !hasPlayed) {
      const timer = setTimeout(() => {
        speak(current.french, { rate: 0.85 });
        setHasPlayed(true);
        setPlayCount(1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, current, hasPlayed, speak]);

  // Focus input
  useEffect(() => {
    if (hasPlayed && !showResult && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasPlayed, showResult]);

  const handlePlayAgain = () => {
    speak(current.french, { rate: 0.85 });
    setPlayCount(c => c + 1);
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const comp = compareDictation(current.french, userInput);
    setResult(comp);
    setShowResult(true);

    if (comp.correct) {
      setSessionCorrect(c => c + 1);
      addXP(XP_REWARDS.dictationCorrect);
      if (playCount === 1) addGems(1); // bonus for getting it on first listen
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult) {
      handleSubmit();
    }
  };

  const handleNext = () => {
    if (currentIndex < allItems.length - 1) {
      setCurrentIndex(i => i + 1);
      setUserInput('');
      setHasPlayed(false);
      setShowResult(false);
      setResult(null);
      setPlayCount(0);
    } else {
      setSessionComplete(true);
      if (sessionCorrect === allItems.length) addGems(3);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserInput('');
    setHasPlayed(false);
    setShowResult(false);
    setResult(null);
    setSessionComplete(false);
    setSessionCorrect(0);
    setPlayCount(0);
  };

  if (allItems.length === 0) {
    return <div className="text-center py-12 text-[var(--color-text-secondary)]">暂无听写练习</div>;
  }

  if (sessionComplete) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">{sessionCorrect === allItems.length ? '🏆' : '✍️'}</div>
        <h2 className="text-xl font-bold">听写完成!</h2>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-correct)]">{sessionCorrect}/{allItems.length}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">正确</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round((sessionCorrect / allItems.length) * 100)}%</div>
            <div className="text-xs text-[var(--color-text-secondary)]">正确率</div>
          </div>
        </div>
        <button onClick={handleRestart} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl">
          <RotateCcw size={16} /> 再来一轮
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">听写练习</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">{currentIndex + 1} / {allItems.length}</p>
        </div>
        <span className="text-sm text-[var(--color-correct)] font-medium">{sessionCorrect} ✓</span>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / allItems.length) * 100}%` }}
        />
      </div>

      {/* Play audio */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <button
          onClick={handlePlayAgain}
          className="w-20 h-20 rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25 flex items-center justify-center mx-auto hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <Volume2 size={28} />
        </button>
        <p className="text-sm text-[var(--color-text-secondary)] mt-3">
          已播放 {playCount} 次 · 点击重播
        </p>
        {current.hint && !showResult && (
          <p className="text-xs text-amber-500 mt-2">💡 提示: {current.hint}</p>
        )}
      </div>

      {/* Input */}
      {!showResult && (
        <div>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你听到的法语..."
            className="w-full p-4 rounded-xl border border-gray-200 text-lg font-medium focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            onClick={handleSubmit}
            disabled={!userInput.trim()}
            className="w-full mt-3 py-3.5 bg-[var(--color-primary)] text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check size={18} /> 提交
          </button>
        </div>
      )}

      {/* Result */}
      {showResult && result && (
        <div className={`p-4 rounded-xl animate-[bounce-in_0.4s_ease-out] ${result.correct ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-center mb-3">
            <span className="text-2xl">{result.correct ? '✅' : '❌'}</span>
            <p className={`font-semibold mt-1 ${result.correct ? 'text-green-600' : 'text-red-500'}`}>
              {result.correct ? '完全正确!' : '有些小错误'}
            </p>
          </div>

          {/* Character diff */}
          <div className="bg-white rounded-xl p-3 mb-2">
            <p className="text-xs text-[var(--color-text-secondary)] mb-1">逐字对比:</p>
            <div className="text-lg font-mono">
              {result.display.map((d, i) => (
                <span
                  key={i}
                  className={
                    d.status === 'correct' ? 'text-green-600' :
                    d.status === 'incorrect' ? 'text-red-500 line-through' :
                    d.status === 'missing' ? 'text-red-400 underline' :
                    'text-gray-300'
                  }
                >
                  {d.char}
                </span>
              ))}
            </div>
          </div>

          {/* Correct answer */}
          {!result.correct && (
            <div className="text-sm mb-3">
              <span className="text-[var(--color-text-secondary)]">正确答案: </span>
              <span className="font-semibold">{current.french}</span>
              <span className="text-[var(--color-text-secondary)]"> ({current.english})</span>
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            {currentIndex < allItems.length - 1 ? (
              <>下一题 <ArrowRight size={18} /></>
            ) : (
              <>完成 <Check size={18} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
