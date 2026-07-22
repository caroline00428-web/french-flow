import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { XP_REWARDS } from '../store/db';
import { useTTS } from '../hooks/useTTS';
import {
  pickBattleQuestions,
  getChloeAnswer,
  chloeReactions,
  randomReaction,
  addError,
  type QuizQuestion,
  type ChloeAnswer,
} from '../data/quizBattles';
import { Swords, Volume2, ChevronRight, RotateCcw, Home, Zap, Star } from 'lucide-react';

type BattlePhase =
  | 'start'
  | 'userTurn'
  | 'userResult'
  | 'chloeThinking'
  | 'chloeResult'
  | 'chloeWrong'
  | 'chloeCorrected'
  | 'end';

export default function QuizBattle() {
  const navigate = useNavigate();
  const addXP = useGameStore(s => s.addXP);
  const addGems = useGameStore(s => s.addGems);
  const completeLesson = useGameStore(s => s.completeLesson);
  const checkStreak = useGameStore(s => s.checkStreak);
  const { speak } = useTTS();

  const [phase, setPhase] = useState<BattlePhase>('start');
  const [round, setRound] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userScore, setUserScore] = useState(0);
  const [chloeScore, setChloeScore] = useState(0);
  const [userCorrect, setUserCorrect] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [chloeData, setChloeData] = useState<ChloeAnswer | null>(null);
  const [chloeReaction, setChloeReaction] = useState('');
  const [correctionDone, setCorrectionDone] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [totalGems, setTotalGems] = useState(0);
  const [userWon, setUserWon] = useState(false);

  const handleStart = () => {
    const picked = pickBattleQuestions(10);
    setQuestions(picked);
    setRound(0);
    setUserScore(0);
    setChloeScore(0);
    setUserCorrect(0);
    setTotalXP(0);
    setTotalGems(0);
    setPhase('userTurn');
  };

  const currentQuestion = questions[round] || null;

  // User selects an answer
  const handleUserAnswer = (idx: number) => {
    if (phase !== 'userTurn' || !currentQuestion) return;
    setUserAnswer(idx);
    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) {
      setUserScore(s => s + 10);
      setUserCorrect(c => c + 1);
      const xp = XP_REWARDS.quizCorrect || 10;
      addXP(xp);
      setTotalXP(t => t + xp);
    } else {
      // Track error
      addError(currentQuestion.id, idx);
    }
    setPhase('userResult');
  };

  // Advance from user result to Chloé's turn
  const handleUserResultNext = () => {
    if (!currentQuestion) return;
    setPhase('chloeThinking');
    const chloeAns = getChloeAnswer(currentQuestion.id, round);
    setChloeData(chloeAns);
    const pool = chloeAns.isCorrect ? chloeReactions.correct : chloeReactions.wrong;
    setChloeReaction(randomReaction(pool));
    setCorrectionDone(false);
    setTimeout(() => setPhase('chloeResult'), 1500);
  };

  // Chloé's result — advance
  const handleChloeResultNext = () => {
    if (!chloeData) return;
    if (chloeData.isCorrect) {
      setChloeScore(s => s + 10);
    }
    if (!chloeData.isCorrect) {
      // Chloé was wrong — user gets to correct her
      setPhase('chloeWrong');
    } else {
      advanceRound();
    }
  };

  // User corrects Chloé
  const handleCorrectChloe = (idx: number) => {
    if (!currentQuestion || correctionDone) return;
    setCorrectionDone(true);
    setUserAnswer(idx);
    if (idx === currentQuestion.correctIndex) {
      setUserScore(s => s + 5);
      const xp = XP_REWARDS.quizCorrectChloe || 5;
      addXP(xp);
      setTotalXP(t => t + xp);
      setChloeReaction(randomReaction(chloeReactions.corrected));
    }
    setPhase('chloeCorrected');
  };

  // Advance to next round or end
  const handleChloeCorrectedNext = () => {
    advanceRound();
  };

  const advanceRound = () => {
    if (round >= 9) {
      const won = userScore > chloeScore;
      setUserWon(won);
      if (won) {
        const xp = XP_REWARDS.quizWin || 20;
        addXP(xp);
        setTotalXP(t => t + xp);
        addGems(5);
        setTotalGems(5);
      } else {
        addGems(3);
        setTotalGems(3);
      }
      completeLesson('/quiz-battle');
      checkStreak();
      setPhase('end');
    } else {
      setRound(r => r + 1);
      setUserAnswer(null);
      setChloeData(null);
      setPhase('userTurn');
    }
  };

  // --- RENDER HELPERS ---

  const renderScoreBar = () => (
    <div className="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2">
        <span className="text-lg">😎</span>
        <span className="font-bold text-sm text-[var(--color-primary)]">{userScore}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{round + 1}/10</span>
        {currentQuestion && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
            currentQuestion.level === 'A1' ? 'bg-green-50 text-green-600' :
            currentQuestion.level === 'A2' ? 'bg-blue-50 text-blue-600' :
            'bg-purple-50 text-purple-600'
          }`}>
            {currentQuestion.type === 'grammar' ? '语法' : currentQuestion.type === 'vocab' ? '词汇' : '阅读'}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm text-purple-500">{chloeScore}</span>
        <span className="text-lg">👧</span>
      </div>
    </div>
  );

  const renderOptions = (
    options: string[],
    correctIndex: number,
    onSelect: (idx: number) => void,
    disabled: boolean,
    selectedIndex?: number | null,
    markedWrong?: number | null,
  ) => (
    <div className="grid grid-cols-1 gap-2">
      {options.map((opt, i) => {
        let style = 'bg-white border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5';
        if (disabled) {
          if (i === correctIndex) {
            style = 'bg-green-50 border-green-400 text-green-700 font-medium';
          } else if (selectedIndex === i && i !== correctIndex) {
            style = 'bg-red-50 border-red-400 text-red-700';
          } else if (markedWrong === i) {
            style = 'bg-red-50 border-red-300 text-red-500 opacity-50 line-through decoration-1';
          } else {
            style = 'bg-gray-50 border-gray-100 text-gray-400';
          }
        }
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            disabled={disabled}
            className={`w-full p-3.5 rounded-xl border-2 text-left text-sm transition-all ${style} ${
              disabled ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
            }`}
          >
            {opt}
            {disabled && i === correctIndex && <span className="float-right">✅</span>}
            {disabled && selectedIndex === i && i !== correctIndex && !(markedWrong === i) && <span className="float-right">❌</span>}
          </button>
        );
      })}
    </div>
  );

  const typeLabel = (q: QuizQuestion) => {
    const map = { grammar: '语法选择', vocab: '词汇辨析', reading: '阅读理解' };
    return map[q.type];
  };

  // --- START ---
  if (phase === 'start') {
    return (
      <div className="space-y-5 animate-[bounce-in_0.3s_ease-out]">
        <h1 className="text-xl font-bold text-center">DELF 对战 ⚔️</h1>

        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-pink-100 text-center">
          <div className="text-5xl mb-3">👧</div>
          <h2 className="font-bold text-lg text-purple-700 mb-1">Chloé</h2>
          <p className="text-sm text-purple-600 mb-4">
            "Salut! 来PK法语吧！<br />DELF 真题风格，看谁厉害！"
          </p>
          <div className="flex justify-center gap-4 text-xs text-purple-500 flex-wrap">
            <span>📝 语法选择</span>
            <span>📖 词汇辨析</span>
            <span>📚 阅读理解</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
          <h3 className="font-semibold text-sm">📋 规则</h3>
          <div className="text-xs text-gray-500 space-y-1.5">
            <p>1️⃣ 轮流答 DELF 真题风格的选择题</p>
            <p>2️⃣ Chloé 答对时会分享知识点</p>
            <p>3️⃣ Chloé 答错时你来纠正 +5分</p>
            <p>4️⃣ 你的错题会自动记录到错题本 📒</p>
            <p className="text-purple-500">💡 A1/A2/B1 混合，题型对标 DELF 考试</p>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-200/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Swords size={22} />
          开始对战！
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-center">对战 Chloé ⚔️</h1>

      {renderScoreBar()}

      {/* Progress */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
          style={{ width: `${((round + (phase === 'end' ? 1 : 0)) / 10) * 100}%` }}
        />
      </div>

      {currentQuestion && phase !== 'end' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  currentQuestion.level === 'A1' ? 'bg-green-100 text-green-700' :
                  currentQuestion.level === 'A2' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  DELF {currentQuestion.level}
                </span>
                <span className="text-[10px] text-gray-400">{typeLabel(currentQuestion)}</span>
              </div>
              {/* French text */}
              {currentQuestion.type === 'reading' ? (
                <div className="bg-amber-50 rounded-xl p-3 mb-3 border border-amber-100">
                  <p className="text-sm leading-relaxed whitespace-pre-line">{currentQuestion.french}</p>
                </div>
              ) : (
                <p className="text-base font-medium leading-relaxed mb-1">{currentQuestion.french}</p>
              )}
              <p className="text-sm text-gray-500">{currentQuestion.question}</p>
            </div>
            <button
              onClick={() => speak(
                currentQuestion.type === 'reading'
                  ? currentQuestion.french.slice(0, 80)
                  : currentQuestion.french,
                { rate: 0.8 }
              )}
              className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg shrink-0"
            >
              <Volume2 size={18} />
            </button>
          </div>

          {/* Options */}
          {phase === 'userTurn' && (
            renderOptions(currentQuestion.options, currentQuestion.correctIndex, handleUserAnswer, false)
          )}

          {phase === 'userResult' && (
            <>
              {renderOptions(currentQuestion.options, currentQuestion.correctIndex, () => {}, true, userAnswer)}
              <div className={`mt-3 p-3 rounded-xl text-sm ${userAnswer === currentQuestion.correctIndex ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <p className="font-semibold mb-1">
                  {userAnswer === currentQuestion.correctIndex ? '✅ 正确！ +10分' : '❌ 不对哦（已加入错题本 📒）'}
                </p>
                <p className="text-xs opacity-80">{currentQuestion.explanation}</p>
              </div>
              <button
                onClick={handleUserResultNext}
                className="w-full mt-3 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
              >
                轮到 Chloé 了 <ChevronRight size={14} />
              </button>
            </>
          )}

          {phase === 'chloeThinking' && (
            <div className="py-8 text-center">
              <div className="text-4xl mb-3 animate-bounce">👧</div>
              <p className="text-sm text-purple-500 font-medium">Chloé 思考中...</p>
              <div className="flex justify-center gap-1 mt-2">
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {phase === 'chloeResult' && chloeData && (
            <>
              {renderOptions(
                currentQuestion.options,
                currentQuestion.correctIndex,
                () => {},
                true,
                chloeData.chosenIndex,
              )}
              <div className={`mt-3 p-3 rounded-xl text-sm ${chloeData.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">👧</span>
                  <span className="font-semibold">
                    {chloeData.isCorrect ? 'Chloé 答对了！ +10分' : 'Chloé 答错了...'}
                  </span>
                </div>
                <p className="text-xs opacity-80 mb-1">💬 "{chloeReaction}"</p>
                {/* Chloé shares knowledge when correct */}
                {chloeData.isCorrect && currentQuestion.chloeTip && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <p className="text-xs opacity-80">📝 <span className="font-medium">Chloé 的知识点：</span>{currentQuestion.chloeTip}</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleChloeResultNext}
                className={`w-full mt-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                  chloeData.isCorrect
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                {chloeData.isCorrect ? <>下一题 <ChevronRight size={14} /></> : <>✏️ 纠正 Chloé +5分</>}
              </button>
            </>
          )}

          {phase === 'chloeWrong' && chloeData && (
            <>
              <p className="text-sm text-purple-600 font-medium mb-3">✏️ 告诉 Chloé 正确答案是哪个？</p>
              {renderOptions(
                currentQuestion.options,
                currentQuestion.correctIndex,
                handleCorrectChloe,
                false,
                undefined,
                chloeData.chosenIndex,
              )}
            </>
          )}

          {phase === 'chloeCorrected' && (
            <>
              {renderOptions(
                currentQuestion.options,
                currentQuestion.correctIndex,
                () => {},
                true,
                userAnswer === currentQuestion.correctIndex ? currentQuestion.correctIndex : undefined,
                chloeData?.chosenIndex,
              )}
              <div className="mt-3 p-3 rounded-xl text-sm bg-green-50 text-green-700">
                <p className="font-semibold mb-1">
                  {userAnswer === currentQuestion.correctIndex && correctionDone
                    ? '✅ 纠正成功！ +5分'
                    : '正确答案如下'}
                </p>
                <p className="text-xs opacity-80 mb-1">{currentQuestion.explanation}</p>
                <p className="text-xs opacity-80">👧 "{chloeReaction}"</p>
              </div>
              <button
                onClick={handleChloeCorrectedNext}
                className="w-full mt-3 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
              >
                下一题 <ChevronRight size={14} />
              </button>
            </>
          )}
        </div>
      )}

      {/* End screen */}
      {phase === 'end' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 animate-[bounce-in_0.4s_ease-out]">
          <div className="text-center">
            <div className="text-5xl mb-2">{userWon ? '🏆' : '🤝'}</div>
            <h2 className="text-xl font-bold">{userWon ? '你赢了！' : userScore === chloeScore ? '平局！' : '差一点就赢了！'}</h2>
            <p className="text-xs text-gray-400 mt-1">错题已自动记录，到错题本复习 📒</p>
          </div>

          <div className="flex items-center justify-center gap-6 py-3">
            <div className="text-center">
              <div className="text-3xl mb-1">😎</div>
              <div className="text-2xl font-bold text-[var(--color-primary)]">{userScore}</div>
              <div className="text-xs text-gray-400">对 {userCorrect}/10</div>
            </div>
            <div className="text-2xl text-gray-300 font-bold">vs</div>
            <div className="text-center">
              <div className="text-3xl mb-1">👧</div>
              <div className="text-2xl font-bold text-purple-500">{chloeScore}</div>
              <div className="text-xs text-gray-400">Chloé</div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <Zap size={14} className="text-amber-500" />
              <span className="text-amber-700">总获得</span>
              <span className="font-bold text-amber-800 ml-auto">+{totalXP} XP</span>
            </div>
            {totalGems > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Star size={14} className="text-purple-500" />
                <span className="text-purple-700">宝石奖励</span>
                <span className="font-bold text-purple-800 ml-auto">+{totalGems} 💎</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
            >
              <RotateCcw size={16} />
              再来一局
            </button>
            <button
              onClick={() => navigate('/learn')}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 hover:bg-gray-200 transition-colors"
            >
              <Home size={16} />
              返回学习
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
