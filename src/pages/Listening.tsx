import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { XP_REWARDS } from '../store/db';
import { useTTS } from '../hooks/useTTS';
import { foodListening } from '../data/food';
import { dailyListening } from '../data/daily';
import { Volume2, ArrowRight, RotateCcw, Check, Play } from 'lucide-react';

const allItems = [...foodListening, ...dailyListening];

export default function Listening() {
  const [searchParams] = useSearchParams();
  const catFilter = searchParams.get('cat');

  const addXP = useGameStore(s => s.addXP);
  const addGems = useGameStore(s => s.addGems);
  const { speak } = useTTS();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [speed, setSpeed] = useState(1);

  const items = catFilter ? allItems.filter(i => i.category === catFilter) : allItems;
  const current = items[currentIndex];

  // Auto-play on new item
  useEffect(() => {
    if (current && !hasPlayed) {
      const timer = setTimeout(() => {
        speak(current.french, { rate: speed });
        setHasPlayed(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, current, hasPlayed, speak, speed]);

  const handlePlay = () => {
    speak(current.french, { rate: speed });
    setHasPlayed(true);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(index);
    const correct = index === current.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setSessionCorrect(c => c + 1);
      addXP(XP_REWARDS.listeningCorrect);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(i => i + 1);
      setHasPlayed(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setSessionComplete(true);
      if (sessionCorrect === items.length) addGems(3);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setHasPlayed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSessionComplete(false);
    setSessionCorrect(0);
  };

  if (items.length === 0) {
    return <div className="text-center py-12 text-[var(--color-text-secondary)]">暂无听力练习</div>;
  }

  if (sessionComplete) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">{sessionCorrect === items.length ? '🏆' : '🎯'}</div>
        <h2 className="text-xl font-bold">听力完成!</h2>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-correct)]">{sessionCorrect}/{items.length}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">正确</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round((sessionCorrect / items.length) * 100)}%</div>
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
          <h1 className="text-xl font-bold">听力理解</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">{currentIndex + 1} / {items.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeed(s => s === 1 ? 0.75 : 1)}
            className={`px-2 py-1 text-xs rounded-lg border ${
              speed === 0.75 ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            {speed}x
          </button>
          <span className="text-sm text-[var(--color-correct)] font-medium">{sessionCorrect} ✓</span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* Play button */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <button
          onClick={handlePlay}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${
            hasPlayed && selectedAnswer === null
              ? 'bg-blue-50 text-blue-500'
              : 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25'
          }`}
        >
          {hasPlayed && selectedAnswer === null ? (
            <Volume2 size={28} />
          ) : (
            <Play size={28} className="ml-1" />
          )}
        </button>
        <p className="text-sm text-[var(--color-text-secondary)] mt-3">
          {selectedAnswer === null ? '仔细听，然后选择对应的意思' : isCorrect ? '✅ 正确!' : '❌ 再听一次?'}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {current?.options.map((option, i) => {
          let optionStyle = 'bg-white border-gray-100 hover:border-[var(--color-primary)]';
          if (selectedAnswer !== null) {
            if (i === current.correctIndex) {
              optionStyle = 'bg-green-50 border-green-300 text-green-700';
            } else if (i === selectedAnswer && !isCorrect) {
              optionStyle = 'bg-red-50 border-red-300 text-red-600';
            } else {
              optionStyle = 'bg-white border-gray-100 opacity-50';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all ${optionStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {selectedAnswer !== null && (
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-[var(--color-primary)] text-white font-bold rounded-xl flex items-center justify-center gap-2 animate-[slide-up_0.3s_ease-out]"
        >
          {currentIndex < items.length - 1 ? (
            <>下一题 <ArrowRight size={18} /></>
          ) : (
            <>完成 <Check size={18} /></>
          )}
        </button>
      )}
    </div>
  );
}
