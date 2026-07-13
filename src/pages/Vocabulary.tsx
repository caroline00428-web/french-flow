import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { XP_REWARDS } from '../store/db';
import { db } from '../store/db';
import { basicsWords } from '../data/basics';
import { foodWords } from '../data/food';
import { dailyWords } from '../data/daily';
import { travelWords } from '../data/travel';
import { useTTS } from '../hooks/useTTS';
import type { VocabWord, VocabCategory, WordProgress } from '../types';
import { CATEGORY_NAMES } from '../types';
import { ArrowRight, RotateCcw, Check, Volume2, BookOpen, Brain, Lightbulb } from 'lucide-react';

// Combine all words
const allWords = [...basicsWords, ...foodWords, ...dailyWords, ...travelWords];
const wordMap = new Map<string, VocabWord>();
allWords.forEach(w => wordMap.set(w.id, w));
const uniqueWords = Array.from(wordMap.values());

// ============================================================
// Learning stages
// ============================================================
type Stage = 'new' | 'learning' | 'review' | 'mastered';

function getStage(progress: WordProgress | undefined): Stage {
  if (!progress) return 'new';
  if (progress.status === 'mastered') return 'mastered';
  if (progress.repetitions >= 5) return 'review';
  if (progress.repetitions >= 1) return 'learning';
  return 'new';
}

const STAGE_CONFIG: Record<Stage, { label: string; color: string; icon: string; bg: string }> = {
  new: { label: '新词', color: 'text-purple-500', icon: '🆕', bg: 'bg-purple-50' },
  learning: { label: '学习中', color: 'text-blue-500', icon: '📖', bg: 'bg-blue-50' },
  review: { label: '复习中', color: 'text-amber-500', icon: '🔄', bg: 'bg-amber-50' },
  mastered: { label: '已掌握', color: 'text-green-500', icon: '✅', bg: 'bg-green-50' },
};

const DAILY_NEW_WORD_LIMIT = 10;

// SM-2 algorithm (proper implementation)
function sm2(quality: number, prev: { easeFactor: number; interval: number; repetitions: number }) {
  let { easeFactor, interval, repetitions } = prev;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  return { easeFactor, interval, repetitions };
}

export default function Vocabulary() {
  const [searchParams] = useSearchParams();
  const catFilter = searchParams.get('cat') as VocabCategory | null;

  const addXP = useGameStore(s => s.addXP);
  const addGems = useGameStore(s => s.addGems);
  const learnWord = useGameStore(s => s.learnWord);
  const updateWordProgress = useGameStore(s => s.updateWordProgress);
  const { speak } = useTTS();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [mode, setMode] = useState<'learn' | 'review'>('learn');
  const [wordProgressMap, setWordProgressMap] = useState<Map<string, WordProgress>>(new Map());

  // Load all word progress
  useEffect(() => {
    (async () => {
      const allIds = uniqueWords.map(w => w.id);
      const allProgress = await db.wordProgress.bulkGet(allIds);
      const map = new Map<string, WordProgress>();
      allIds.forEach((id, i) => {
        if (allProgress[i]) map.set(id, allProgress[i]!);
      });
      setWordProgressMap(map);
    })();
  }, [sessionComplete]);

  // Filter and sort words
  const words = useMemo(() => {
    let filtered = catFilter ? uniqueWords.filter(w => w.category === catFilter) : uniqueWords;

    if (mode === 'review') {
      // Only show words due for review
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(w => {
        const wp = wordProgressMap.get(w.id);
        if (!wp || wp.status === 'new') return false;
        if (wp.status === 'mastered') return false;
        return wp.nextReview <= today;
      });
      if (filtered.length === 0) {
        // Fallback: show learning-stage words
        filtered = uniqueWords.filter(w => {
          const wp = wordProgressMap.get(w.id);
          return wp && wp.status === 'learning';
        });
      }
    } else {
      // Learn mode: prioritize new words, limit daily new
      const today = new Date().toISOString().split('T')[0];
      const learnedToday = Array.from(wordProgressMap.values())
        .filter(wp => wp.lastReview === today)
        .length;

      const newWords = filtered.filter(w => !wordProgressMap.has(w.id));
      const learningWords = filtered.filter(w => {
        const wp = wordProgressMap.get(w.id);
        return wp && wp.status === 'learning';
      });

      // Daily limit on new words
      const remainingNew = Math.max(0, DAILY_NEW_WORD_LIMIT - learnedToday);
      filtered = [
        ...newWords.slice(0, Math.max(remainingNew, 3)),
        ...learningWords,
        ...newWords.slice(Math.max(remainingNew, 3)),
      ];
    }

    return filtered;
  }, [catFilter, mode, wordProgressMap]);

  const currentWord = words[currentIndex];
  const currentProgress = currentWord ? wordProgressMap.get(currentWord.id) : undefined;
  const currentStage = getStage(currentProgress);

  // Reset card state when word changes
  useEffect(() => {
    setIsFlipped(false);
    setShowResult(false);
    setRating(null);
  }, [currentIndex]);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      // Speak the word
      speak(currentWord.french, { rate: 0.85 });
      // Also speak example sentence after a delay
      if (currentWord.exampleSentence) {
        setTimeout(() => {
          speak(currentWord.exampleSentence!, { rate: 0.8 });
        }, 2000);
      }
    }
  };

  const handleRate = async (quality: number) => {
    setRating(quality);
    setShowResult(true);

    const isCorrect = quality >= 3;
    if (isCorrect) {
      addXP(XP_REWARDS.vocabCorrect);
      setSessionXP(s => s + XP_REWARDS.vocabCorrect);
      setSessionCorrect(s => s + 1);
      if (quality === 5) addGems(1);
    }

    // SM-2 update
    const today = new Date().toISOString().split('T')[0];
    const prev = currentProgress
      ? { easeFactor: currentProgress.easeFactor, interval: currentProgress.interval, repetitions: currentProgress.repetitions }
      : { easeFactor: 2.5, interval: 0, repetitions: 0 };

    const { easeFactor, interval, repetitions } = sm2(quality, prev);
    const nextReviewDate = new Date(Date.now() + interval * 86400000).toISOString().split('T')[0];
    const newStatus: WordProgress['status'] =
      repetitions >= 8 ? 'mastered' :
      repetitions >= 3 ? 'reviewing' :
      repetitions >= 1 ? 'learning' : 'new';

    await updateWordProgress({
      wordId: currentWord.id,
      easeFactor,
      interval,
      repetitions,
      nextReview: nextReviewDate,
      lastReview: today,
      status: newStatus,
    });

    // Update local map
    setWordProgressMap(prev => {
      const next = new Map(prev);
      next.set(currentWord.id, {
        wordId: currentWord.id,
        easeFactor,
        interval,
        repetitions,
        nextReview: nextReviewDate,
        lastReview: today,
        status: newStatus,
      });
      return next;
    });

    if (isCorrect) {
      learnWord(currentWord.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(i => i + 1);
      setIsFlipped(false);
      setShowResult(false);
      setRating(null);
    } else {
      setSessionComplete(true);
      if (sessionCorrect === words.length && words.length > 5) {
        addGems(5);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowResult(false);
    setRating(null);
    setSessionComplete(false);
    setSessionXP(0);
    setSessionCorrect(0);
  };

  if (words.length === 0) {
    const counts = {
      new: uniqueWords.filter(w => !wordProgressMap.has(w.id)).length,
      learning: uniqueWords.filter(w => {
        const wp = wordProgressMap.get(w.id);
        return wp && wp.status === 'learning';
      }).length,
      review: uniqueWords.filter(w => {
        const wp = wordProgressMap.get(w.id);
        return wp && (wp.status === 'reviewing');
      }).length,
      mastered: uniqueWords.filter(w => {
        const wp = wordProgressMap.get(w.id);
        return wp && wp.status === 'mastered';
      }).length,
    };

    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">词汇学习</h1>

        {/* Stage overview */}
        <div className="grid grid-cols-4 gap-2">
          {(['new', 'learning', 'review', 'mastered'] as Stage[]).map(stage => (
            <div key={stage} className={`${STAGE_CONFIG[stage].bg} rounded-xl p-3 text-center`}>
              <div className="text-lg">{STAGE_CONFIG[stage].icon}</div>
              <div className="text-lg font-bold">{counts[stage === 'review' ? 'review' : stage]}</div>
              <div className={`text-[10px] ${STAGE_CONFIG[stage].color} font-medium`}>{STAGE_CONFIG[stage].label}</div>
            </div>
          ))}
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { setMode('learn'); handleRestart(); }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-[var(--color-primary)] transition-colors"
          >
            <BookOpen size={24} className="text-purple-500 mb-2" />
            <div className="font-semibold text-sm">学习新词</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              今日还可学 {Math.max(0, DAILY_NEW_WORD_LIMIT - Array.from(wordProgressMap.values()).filter(wp => wp.lastReview === new Date().toISOString().split('T')[0]).length)} 个
            </div>
          </button>
          <button
            onClick={() => { setMode('review'); handleRestart(); }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-[var(--color-primary)] transition-colors"
          >
            <Brain size={24} className="text-amber-500 mb-2" />
            <div className="font-semibold text-sm">间隔复习</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              {counts.learning + counts.review} 个词待复习
            </div>
          </button>
        </div>

        {/* Category picker */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">按主题学习</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_NAMES).map(([key, { zh, icon }]) => (
              <button
                key={key}
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('cat', key);
                  window.history.pushState({}, '', url);
                  window.location.reload();
                }}
                className="px-3 py-1.5 bg-white rounded-full text-sm border border-gray-200 hover:border-[var(--color-primary)] transition-colors"
              >
                {icon} {zh}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">🎉</div>
        <h2 className="text-xl font-bold">{mode === 'review' ? '复习完成!' : '学习完成!'}</h2>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-correct)]">{sessionCorrect}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">正确</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-xp)]">+{sessionXP}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{words.length}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">总词数</div>
          </div>
        </div>
        <button
          onClick={() => { setMode(mode === 'review' ? 'learn' : 'review'); handleRestart(); }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl"
        >
          <RotateCcw size={16} />
          {mode === 'review' ? '去学新词' : '去复习'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">
            {mode === 'review' ? '间隔复习' : catFilter ? CATEGORY_NAMES[catFilter]?.zh || '词汇' : '词汇学习'}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-[var(--color-text-secondary)]">{currentIndex + 1} / {words.length}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${STAGE_CONFIG[currentStage].bg} ${STAGE_CONFIG[currentStage].color}`}>
              {STAGE_CONFIG[currentStage].icon} {STAGE_CONFIG[currentStage].label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--color-correct)] font-medium">{sessionCorrect} ✓</span>
          <span className="text-[var(--color-xp)] font-medium">+{sessionXP} XP</span>
        </div>
      </div>

      {/* Progress + Stage bar */}
      <div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {(['new', 'learning', 'review', 'mastered'] as Stage[]).map(s => (
            <div
              key={s}
              className={`text-[10px] font-medium transition-opacity ${s === currentStage ? 'opacity-100' : 'opacity-30'}`}
            >
              <span className={STAGE_CONFIG[s].color}>{STAGE_CONFIG[s].icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flashcard */}
      <div
        onClick={!isFlipped ? handleFlip : undefined}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[260px] flex flex-col items-center justify-center cursor-pointer select-none"
      >
        <div className="text-center">
          <p className="text-3xl font-bold mb-3 french-text">{currentWord.french}</p>
          {!isFlipped && (
            <div className="space-y-2">
              <p className="text-sm text-[var(--color-text-secondary)]">点击翻转查看意思</p>
              <button
                onClick={(e) => { e.stopPropagation(); speak(currentWord.french, { rate: 0.85 }); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Volume2 size={14} /> 听发音
              </button>
            </div>
          )}
        </div>

        {isFlipped && (
          <div className="mt-4 pt-4 border-t border-gray-100 w-full text-center animate-[slide-up_0.3s_ease-out]">
            <p className="text-xl font-semibold text-[var(--color-primary-dark)] mb-2">
              {currentWord.english}
            </p>
            {currentWord.exampleSentence && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl text-left">
                <div className="flex items-center justify-between mb-1">
                  <Lightbulb size={14} className="text-amber-400" />
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(currentWord.exampleSentence!, { rate: 0.8 }); }}
                    className="flex items-center gap-1 text-xs text-blue-500 hover:bg-blue-50 px-2 py-0.5 rounded"
                  >
                    <Volume2 size={12} /> 听例句
                  </button>
                </div>
                <p className="text-sm text-[var(--color-text)]">{currentWord.exampleSentence}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {currentWord.exampleTranslation}
                </p>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); speak(currentWord.french, { rate: 0.85 }); }}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Volume2 size={14} /> 再听一遍
            </button>
          </div>
        )}
      </div>

      {/* Rating */}
      {isFlipped && !showResult && (
        <div className="space-y-2 animate-[slide-up_0.3s_ease-out]">
          <p className="text-sm text-center text-[var(--color-text-secondary)]">你记住了吗?</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {[
              { q: 0, label: '完全不会', style: 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' },
              { q: 1, label: '有点难', style: 'bg-orange-50 text-orange-500 border-orange-200 hover:bg-orange-100' },
              { q: 3, label: '差不多', style: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100' },
              { q: 4, label: '会了', style: 'bg-green-50 text-green-500 border-green-200 hover:bg-green-100' },
              { q: 5, label: '很轻松!', style: 'bg-emerald-50 text-emerald-500 border-emerald-200 hover:bg-emerald-100' },
            ].map(({ q, label, style }) => (
              <button
                key={q}
                onClick={() => handleRate(q)}
                className={`px-3 py-2 rounded-xl border text-sm font-medium ${style} transition-all active:scale-95`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div className={`text-center p-4 rounded-xl animate-[bounce-in_0.4s_ease-out] ${
          (rating ?? 0) >= 3 ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="text-2xl mb-1">{(rating ?? 0) >= 3 ? '✅' : '❌'}</div>
          <p className={`font-semibold ${(rating ?? 0) >= 3 ? 'text-green-600' : 'text-red-500'}`}>
            {(rating ?? 0) >= 4 ? '太棒了!' : (rating ?? 0) >= 3 ? '继续加油!' : '下次会更好!'}
          </p>
          <button
            onClick={handleNext}
            className="mt-3 inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl"
          >
            {currentIndex < words.length - 1 ? (
              <>下一词 <ArrowRight size={16} /></>
            ) : (
              <>完成 <Check size={16} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
