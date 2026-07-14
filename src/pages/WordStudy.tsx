import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { wordBankDB, type SavedWord } from '../services/wordBank';
import { useTTS } from '../hooks/useTTS';
import { Volume2, ArrowRight, ArrowLeft, Check, X, Target, Shuffle, Headphones, Brain, RotateCcw, ChevronRight } from 'lucide-react';

type StudyMode = 'listen-pick' | 'random' | 'weak';

export default function WordStudy() {
  const navigate = useNavigate();
  const { speak } = useTTS();
  const [words, setWords] = useState<SavedWord[]>([]);
  const [allWords, setAllWords] = useState<SavedWord[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mode, setMode] = useState<StudyMode | null>(null);
  const [count, setCount] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [touchStart, setTouchStart] = useState(0);

  // Load words
  useEffect(() => {
    (async () => {
      const all = await wordBankDB.savedWords.toArray();
      setAllWords(all);
    })();
  }, []);

  // Recommendation based on word count and progress
  const recommendation = useMemo(() => {
    if (allWords.length === 0) return 10;
    const weakWords = allWords.filter(w => !w.mastered && w.reviewCount < 3).length;
    if (weakWords === 0) return Math.min(20, allWords.length);
    return Math.max(5, Math.min(30, Math.round(weakWords * 0.5)));
  }, [allWords]);

  const startStudy = (m: StudyMode) => {
    setMode(m);
    setDone(false);
    setCorrectCount(0);
    setCurrentIdx(0);
    setShowResult(false);

    let selected: SavedWord[] = [];
    if (m === 'weak') {
      // Words not yet mastered, sorted by least reviewed
      selected = [...allWords]
        .filter(w => !w.mastered)
        .sort((a, b) => a.reviewCount - b.reviewCount)
        .slice(0, count);
    } else {
      // Random or listen-pick: shuffle all words
      selected = [...allWords].sort(() => Math.random() - 0.5).slice(0, count);
    }

    if (selected.length === 0) { alert('词库为空，请先添加单词'); return; }
    setWords(selected);
    if (m === 'listen-pick') generateOptions(selected, 0);
  };

  const generateOptions = (wordList: SavedWord[], idx: number) => {
    const correct = wordList[idx];
    const others = allWords.filter(w => w.id !== correct.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [correct.translation, ...others.map(w => w.translation)].sort(() => Math.random() - 0.5);
    setOptions(opts);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    const correct = answer === words[currentIdx].translation;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) setCorrectCount(c => c + 1);
    // Update review count
    wordBankDB.savedWords.update(words[currentIdx].id, {
      lastReviewed: new Date().toISOString(),
      reviewCount: words[currentIdx].reviewCount + 1,
      mastered: correct && words[currentIdx].reviewCount >= 2,
    });
  };

  const handleNext = () => {
    if (currentIdx < words.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setShowResult(false);
      setIsCorrect(null);
      setSwipeDir(null);
      if (mode === 'listen-pick') generateOptions(words, next);
      // Speak the word for listen-pick mode
      if (mode === 'listen-pick') speak(words[next].french, { rate: 0.7 });
    } else {
      setDone(true);
    }
  };

  const handleSwipe = (dir: 'left' | 'right') => {
    if (showResult) return;
    setSwipeDir(dir);
    if (mode === 'random' || mode === 'weak') {
      // Swipe right = got it, swipe left = didn't
      const gotIt = dir === 'right';
      setIsCorrect(gotIt);
      setShowResult(true);
      if (gotIt) setCorrectCount(c => c + 1);
      wordBankDB.savedWords.update(words[currentIdx].id, {
        lastReviewed: new Date().toISOString(),
        reviewCount: words[currentIdx].reviewCount + 1,
        mastered: gotIt && words[currentIdx].reviewCount >= 2,
      });
    }
  };

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) handleSwipe(diff > 0 ? 'left' : 'right');
  };

  // Mode selection
  if (!mode) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">背单词 📝</h1>
        <p className="text-sm text-gray-500">词库共 {allWords.length} 个词，选一种模式开始</p>

        {/* Word count selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">学习数量</span>
            <span className="text-xs text-gray-400">推荐 {recommendation} 个</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="range" min={5} max={Math.min(50, allWords.length || 50)} value={count}
              onChange={e => setCount(Number(e.target.value))} className="flex-1" />
            <span className="text-lg font-bold w-10 text-center">{count}</span>
          </div>
        </div>

        {/* Modes */}
        <div className="space-y-3">
          <button onClick={() => startStudy('listen-pick')} className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3"><Headphones size={24} className="text-blue-500" /><div><div className="font-semibold text-sm">听音选词 🎧</div><div className="text-xs text-gray-400">听发音 → 选对应的中文意思</div></div></div>
          </button>
          <button onClick={() => startStudy('random')} className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left hover:border-green-300 transition-colors">
            <div className="flex items-center gap-3"><Shuffle size={24} className="text-green-500" /><div><div className="font-semibold text-sm">随机背词 🔀</div><div className="text-xs text-gray-400">左右滑动 · 右滑=会了 · 左滑=不会</div></div></div>
          </button>
          <button onClick={() => startStudy('weak')} className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-left hover:border-orange-300 transition-colors">
            <div className="flex items-center gap-3"><Brain size={24} className="text-orange-500" /><div><div className="font-semibold text-sm">复习弱词 🎯</div><div className="text-xs text-gray-400">重点攻克还没掌握的 · 今天最需要复习的</div></div></div>
          </button>
        </div>
      </div>
    );
  }

  // Done
  if (done) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">{correctCount >= words.length * 0.7 ? '🎉' : '📝'}</div>
        <h2 className="text-xl font-bold">本轮完成!</h2>
        <div className="flex justify-center gap-6">
          <div className="text-center"><div className="text-2xl font-bold text-green-600">{correctCount}/{words.length}</div><div className="text-xs text-gray-400">正确</div></div>
          <div className="text-center"><div className="text-2xl font-bold">{Math.round(correctCount / words.length * 100)}%</div><div className="text-xs text-gray-400">正确率</div></div>
        </div>
        <button onClick={() => setMode(null)} className="px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl">再来一轮</button>
      </div>
    );
  }

  const word = words[currentIdx];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setMode(null)} className="text-sm text-gray-400">← 退出</button>
        <span className="text-sm font-medium">{currentIdx + 1}/{words.length}</span>
        <span className="text-sm text-green-600 font-medium">✓ {correctCount}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] rounded-full transition-all" style={{ width: `${((currentIdx + 1) / words.length) * 100}%` }} />
      </div>

      {/* Card — with swipe for random/weak mode */}
      {mode === 'listen-pick' ? (
        /* Listen & Pick mode */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <button onClick={() => speak(word.french, { rate: 0.7 })} className="w-20 h-20 mx-auto rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg mb-3">
              <Volume2 size={32} />
            </button>
            <p className="text-sm text-gray-400">听发音，选正确的意思</p>
          </div>

          <div className="grid gap-2">
            {options.map((opt, i) => {
              let cls = 'bg-white border-gray-200';
              if (showResult) {
                if (opt === word.translation) cls = 'bg-green-50 border-green-300 text-green-700';
                else if (opt === isCorrect === false ? opt : '') cls = 'bg-red-50 border-red-300';
                else cls = 'opacity-40';
              }
              return (
                <button key={i} onClick={() => handleAnswer(opt)} disabled={showResult}
                  className={`w-full p-4 rounded-xl border text-sm font-medium ${cls} transition-all`}>{opt}</button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Swipe card mode */
        <div
          onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
          className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[300px] flex flex-col items-center justify-center text-center transition-all ${
            swipeDir === 'right' ? 'translate-x-20 opacity-0' : swipeDir === 'left' ? '-translate-x-20 opacity-0' : ''
          }`}
        >
          <p className="text-3xl font-bold mb-3">{word.french}</p>
          <button onClick={() => speak(word.french, { rate: 0.7 })} className="mb-4 p-2 bg-blue-50 text-blue-500 rounded-full">
            <Volume2 size={20} />
          </button>
          {!showResult ? (
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">← 左滑：不会 &nbsp;|&nbsp; 右滑：会了 →</p>
              <div className="flex gap-4 justify-center">
                <button onClick={() => handleSwipe('left')} className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl">✗</button>
                <button onClick={() => handleSwipe('right')} className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-xl">✓</button>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="text-2xl mb-1">{isCorrect ? '✅' : '❌'}</div>
              <p className="font-semibold text-lg">{word.translation}</p>
              <button onClick={handleNext} className="mt-3 px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm">
                {currentIdx < words.length - 1 ? '下一词' : '完成'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Next button for listen-pick mode */}
      {mode === 'listen-pick' && showResult && (
        <div className={`p-4 rounded-xl text-center ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="text-2xl mb-1">{isCorrect ? '✅' : '❌'}</div>
          <p className="font-semibold">{word.french} = {word.translation}</p>
          <button onClick={handleNext} className="mt-3 px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm">
            {currentIdx < words.length - 1 ? '下一词' : '完成'}
          </button>
        </div>
      )}
    </div>
  );
}
