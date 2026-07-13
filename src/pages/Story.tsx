import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { XP_REWARDS } from '../store/db';
import { useTTS } from '../hooks/useTTS';
import { Play, ChevronRight, ArrowLeft, Check, X } from 'lucide-react';

// ============================================================
// Scenario-based learning with character dialogues
// ============================================================

interface DialogueLine {
  speaker: string;
  emoji: string;
  french: string;
  english: string;
  hint?: string;
}

interface Scenario {
  id: string;
  title: string;
  titleZh: string;
  icon: string;
  setting: string;
  dialogues: DialogueLine[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
}

const scenarios: Scenario[] = [
  {
    id: 'cafe',
    title: '在巴黎咖啡馆',
    titleZh: '点咖啡和甜点',
    icon: '☕',
    setting: '🏪 巴黎某咖啡馆，上午10点',
    dialogues: [
      { speaker: '服务员', emoji: '👨‍🍳', french: 'Bonjour! Vous désirez?', english: 'Hello! What would you like?', hint: 'désirer = to want/desire' },
      { speaker: '你', emoji: '🙂', french: 'Bonjour! Un café, s\'il vous plaît.', english: 'Hello! A coffee, please.' },
      { speaker: '服务员', emoji: '👨‍🍳', french: 'Avec du lait ou du sucre?', english: 'With milk or sugar?' },
      { speaker: '你', emoji: '🙂', french: 'Non, noir, merci. Et un croissant aussi.', english: 'No, black, thank you. And a croissant too.', hint: 'noir = black (for coffee)' },
      { speaker: '服务员', emoji: '👨‍🍳', french: 'Très bien. Ça fait 5 euros.', english: 'Very well. That\'s 5 euros.', hint: 'Ça fait = it costs' },
      { speaker: '你', emoji: '🙂', french: 'Voilà. Merci beaucoup!', english: 'Here you go. Thank you very much!' },
      { speaker: '服务员', emoji: '👨‍🍳', french: 'Bonne journée!', english: 'Have a good day!' },
    ],
    quiz: [
      { question: '"Vous désirez?" 是什么意思?', options: ['你想要什么?', '你叫什么名字?', '你从哪里来?', '你多大了?'], correct: 0, explanation: '"Vous désirez?" = 你想要什么？（服务员问你想点什么）' },
      { question: 'noir 在咖啡语境中是什么意思?', options: ['加糖', '加奶', '黑咖啡(不加奶)', '冰的'], correct: 2, explanation: 'un café noir = 黑咖啡，不加奶 ☕' },
      { question: '"Ça fait 5 euros" 是什么意思?', options: ['太便宜了', '一共5欧元', '我有5欧元', '给我5欧元'], correct: 1, explanation: 'Ça fait X euros = 一共X欧元 💶' },
    ],
  },
  {
    id: 'restaurant',
    title: '在法国餐厅',
    titleZh: '点菜和用餐礼仪',
    icon: '🍽️',
    setting: '🍷 里昂某传统法餐厅，晚上7点',
    dialogues: [
      { speaker: '服务员', emoji: '👩‍🍳', french: 'Bonsoir! Vous avez réservé?', english: 'Good evening! Do you have a reservation?', hint: 'réserver = to reserve' },
      { speaker: '你', emoji: '🙂', french: 'Oui, une table pour deux personnes.', english: 'Yes, a table for two people.' },
      { speaker: '服务员', emoji: '👩‍🍳', french: 'Par ici, s\'il vous plaît. Voici le menu.', english: 'This way, please. Here is the menu.', hint: 'Par ici = this way' },
      { speaker: '你', emoji: '🙂', french: 'Merci. Je voudrais le poulet rôti.', english: 'Thank you. I would like the roast chicken.', hint: 'Je voudrais = I would like' },
      { speaker: '服务员', emoji: '👩‍🍳', french: 'Et comme boisson?', english: 'And to drink?', hint: 'boisson = drink' },
      { speaker: '你', emoji: '🙂', french: 'Un verre de vin rouge, s\'il vous plaît.', english: 'A glass of red wine, please.' },
      { speaker: '服务员', emoji: '👩‍🍳', french: 'Excellent choix!', english: 'Excellent choice!' },
      { speaker: '你', emoji: '🙂', french: 'L\'addition, s\'il vous plaît.', english: 'The bill, please.' },
    ],
    quiz: [
      { question: '"Je voudrais" 是什么意思?', options: ['我想要(I would like)', '我看见了', '我听到了', '我知道了'], correct: 0, explanation: 'Je voudrais = I would like = 我想要。这是点菜最礼貌的说法！🍗' },
      { question: '在法国餐厅，怎么叫服务员拿账单?', options: ['L\'addition, s\'il vous plaît.', 'Donnez-moi l\'argent!', 'Je pars.', 'Au revoir!'], correct: 0, explanation: 'L\'addition, s\'il vous plaît = 请给我账单 💳' },
      { question: '"comme boisson" 是什么意思?', options: ['像鱼一样', '作为饮料', '好的，老板', '请您'], correct: 1, explanation: 'comme = as, boisson = drink → 喝什么? 🍷' },
    ],
  },
  {
    id: 'work',
    title: '第一天上班',
    titleZh: '职场法语入门',
    icon: '💼',
    setting: '🏢 巴黎拉德芳斯商务区，某公司办公室',
    dialogues: [
      { speaker: '同事', emoji: '👩‍💼', french: 'Bonjour! Vous êtes le nouveau collègue?', english: 'Hello! Are you the new colleague?', hint: 'nouveau = new' },
      { speaker: '你', emoji: '🙂', french: 'Oui, c\'est moi! Je suis très heureux d\'être ici.', english: 'Yes, that\'s me! I\'m very happy to be here.' },
      { speaker: '同事', emoji: '👩‍💼', french: 'Bienvenue dans l\'équipe! Je m\'appelle Sophie.', english: 'Welcome to the team! My name is Sophie.' },
      { speaker: '你', emoji: '🙂', french: 'Enchanté! Où est mon bureau?', english: 'Nice to meet you! Where is my desk?' },
      { speaker: '同事', emoji: '👩‍💼', french: 'C\'est juste là, à côté de la fenêtre.', english: 'It\'s right there, next to the window.', hint: 'à côté de = next to' },
      { speaker: '经理', emoji: '👨‍💼', french: 'On a une réunion à 14h dans la salle de conférence.', english: 'We have a meeting at 2pm in the conference room.', hint: 'réunion = meeting' },
      { speaker: '你', emoji: '🙂', french: 'D\'accord, je serai là. Merci!', english: 'OK, I\'ll be there. Thanks!' },
      { speaker: '同事', emoji: '👩‍💼', french: 'On va déjeuner ensemble?', english: 'Shall we have lunch together?', hint: 'déjeuner = lunch' },
    ],
    quiz: [
      { question: '"Je suis très heureux d\'être ici" 是什么意思?', options: ['我饿了', '我很高兴来这里', '我想回家', '我今天很忙'], correct: 1, explanation: 'Je suis heureux = 我很开心。第一天上班必备句！😊' },
      { question: '"On a une réunion à 14h" - réunion 是?', options: ['午餐', '会议', '休息', '下班'], correct: 1, explanation: 'réunion = meeting = 会议。法国人喜欢开 réunion! 📋' },
      { question: '"On va déjeuner ensemble?" 是谁提出的邀请?', options: ['一起去开会', '一起吃午饭', '一起下班', '一起工作'], correct: 1, explanation: 'déjeuner = 午餐，ensemble = 一起 → 一起吃午饭? 🍽️' },
    ],
  },
  {
    id: 'metro',
    title: '坐巴黎地铁',
    titleZh: '问路和买票',
    icon: '🚇',
    setting: '🚉 巴黎地铁站 Châtelet',
    dialogues: [
      { speaker: '你', emoji: '🙂', french: 'Excusez-moi, où est la ligne 1?', english: 'Excuse me, where is line 1?' },
      { speaker: '路人', emoji: '🧑', french: 'C\'est par là. Suivez les panneaux jaunes.', english: 'It\'s that way. Follow the yellow signs.', hint: 'panneaux = signs' },
      { speaker: '你', emoji: '🙂', french: 'Merci! Et pour aller à La Défense?', english: 'Thanks! And to go to La Défense?' },
      { speaker: '路人', emoji: '🧑', french: 'Prenez la ligne 1 direction La Défense. C\'est direct.', english: 'Take line 1 towards La Défense. It\'s direct.', hint: 'direct = direct, no transfers' },
      { speaker: '你', emoji: '🙂', french: 'Il me faut combien de temps?', english: 'How long does it take?' },
      { speaker: '路人', emoji: '🧑', french: 'Environ 15 minutes. Bon voyage!', english: 'About 15 minutes. Have a good trip!', hint: 'environ = about' },
    ],
    quiz: [
      { question: '问路时怎么说"请问...在哪"?', options: ['Où est...?', 'Qui est...?', 'Quand est...?', 'Pourquoi est...?'], correct: 0, explanation: 'Où est = Where is。Où = 哪里 📍' },
      { question: '"Il me faut combien de temps?" 问的是什么?', options: ['多少钱', '多长时间', '在哪里', '几个人'], correct: 1, explanation: 'combien de temps = how much time ⏱️' },
      { question: '"C\'est direct" 在地铁语境中的意思是?', options: ['快到了', '直达(不用换乘)', '走这边', '需要转车'], correct: 1, explanation: 'direct = 直达，不用换乘 🚇' },
    ],
  },
];

export default function Story() {
  const addXP = useGameStore(s => s.addXP);
  const addGems = useGameStore(s => s.addGems);
  const completeLesson = useGameStore(s => s.completeLesson);
  const { speak } = useTTS();

  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentLine, setCurrentLine] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [qResult, setQResult] = useState<boolean | null>(null);
  const [qCorrect, setQCorrect] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQ(0);
    setQCorrect(0);
    setQuizDone(false);
    setQResult(null);
    setSelectedAnswer(null);
  };

  const handleAnswer = (idx: number) => {
    if (qResult !== null) return;
    setSelectedAnswer(idx);
    const correct = idx === selectedScenario!.quiz[currentQ].correct;
    setQResult(correct);
    if (correct) {
      setQCorrect(c => c + 1);
      addXP(XP_REWARDS.listeningCorrect);
    }
  };

  const handleNextQ = () => {
    if (currentQ < selectedScenario!.quiz.length - 1) {
      setCurrentQ(q => q + 1);
      setQResult(null);
      setSelectedAnswer(null);
    } else {
      setQuizDone(true);
      if (qCorrect >= selectedScenario!.quiz.length * 0.6) {
        addGems(3);
        completeLesson(selectedScenario!.id);
        addXP(XP_REWARDS.perfectLesson);
      }
    }
  };

  // Scene list
  if (!selectedScenario) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">情景对话 🎭</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">在真实场景中学法语</p>

        <div className="grid gap-3">
          {scenarios.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:border-[var(--color-primary)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{s.title}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">{s.titleZh}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s.setting}</div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (quizDone) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">{qCorrect >= selectedScenario.quiz.length * 0.6 ? '🎭' : '📝'}</div>
        <h2 className="text-xl font-bold">场景完成!</h2>
        <div className="text-sm text-[var(--color-text-secondary)]">{selectedScenario.title}</div>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-correct)]">{qCorrect}/{selectedScenario.quiz.length}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">正确</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">+{qCorrect * 10}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">XP</div>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <button onClick={handleStartQuiz} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">重做测验</button>
          <button onClick={() => setSelectedScenario(null)} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-bold">更多场景</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setSelectedScenario(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold">{showQuiz ? '情景测验' : selectedScenario.title}</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">{selectedScenario.setting}</p>
        </div>
        <span className="text-2xl ml-auto">{selectedScenario.icon}</span>
      </div>

      {!showQuiz ? (
        <>
          {/* Dialogue */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            {selectedScenario.dialogues.map((line, i) => (
              <div
                key={i}
                className={`flex gap-3 transition-all ${i > currentLine ? 'opacity-20' : 'opacity-100'}`}
              >
                <div className="text-2xl shrink-0">{line.emoji}</div>
                <div className={`flex-1 p-3 rounded-2xl ${
                  line.speaker === '你' ? 'bg-blue-50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-400">{line.speaker}</span>
                    <button
                      onClick={() => speak(line.french, { rate: 0.8 })}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-600"
                    >
                      <Play size={10} /> 听
                    </button>
                  </div>
                  <p className="text-sm font-medium">{line.french}</p>
                  {i <= currentLine && (
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">{line.english}</p>
                  )}
                  {line.hint && i <= currentLine && (
                    <p className="text-xs text-purple-500 mt-0.5 italic">📖 {line.hint}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentLine(l => Math.max(0, l - 1))}
              disabled={currentLine === 0}
              className="flex-1 py-3 bg-gray-100 rounded-xl font-medium text-sm disabled:opacity-30"
            >
              上一句
            </button>
            {currentLine < selectedScenario.dialogues.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentLine(l => l + 1);
                  // Auto-speak the new line
                  const next = selectedScenario.dialogues[currentLine + 1];
                  setTimeout(() => speak(next.french, { rate: 0.8 }), 200);
                }}
                className="flex-1 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm"
              >
                下一句 →
              </button>
            ) : (
              <button
                onClick={handleStartQuiz}
                className="flex-1 py-3 bg-[var(--color-accent)] text-white font-bold rounded-xl text-sm"
              >
                ✨ 测验理解 ({selectedScenario.quiz.length}题)
              </button>
            )}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1">
            {selectedScenario.dialogues.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i <= currentLine ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Quiz */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">
              {currentQ + 1} / {selectedScenario.quiz.length}
            </p>
            <p className="text-lg font-medium mb-4">{selectedScenario.quiz[currentQ].question}</p>

            <div className="space-y-2">
              {selectedScenario.quiz[currentQ].options.map((opt, i) => {
                let style = 'bg-white border-gray-200 hover:border-[var(--color-primary)]';
                if (qResult !== null) {
                  if (i === selectedScenario.quiz[currentQ].correct) style = 'bg-green-50 border-green-300 text-green-700';
                  else if (i === selectedAnswer) style = 'bg-red-50 border-red-300 text-red-600';
                  else style = 'opacity-40';
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-3 rounded-xl border text-left text-sm ${style} transition-all`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {qResult !== null && (
            <div className={`p-4 rounded-xl animate-[bounce-in_0.4s_ease-out] ${qResult ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {qResult ? <Check size={18} className="text-green-500" /> : <X size={18} className="text-red-500" />}
                    <span className="font-semibold">{selectedScenario.quiz[currentQ].explanation}</span>
                  </div>
                </div>
                <button
                  onClick={handleNextQ}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm shrink-0"
                >
                  {currentQ < selectedScenario.quiz.length - 1 ? '下一题' : '完成'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
