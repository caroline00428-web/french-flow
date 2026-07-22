import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTTS } from '../hooks/useTTS';
import { dialogueScenarios, type DialogueScenario } from '../data/dialogues';
import { Volume2, ChevronRight, ArrowLeft } from 'lucide-react';

export default function Dialogue() {
  const navigate = useNavigate();
  const { speak } = useTTS();

  const [scenario, setScenario] = useState<DialogueScenario | null>(null);
  const [nodeIdx, setNodeIdx] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);

  const handleSelect = (s: DialogueScenario) => {
    setScenario(s);
    setNodeIdx(0);
    setFeedback(null);
    setScore(0);
    setTotal(0);
    setDone(false);
  };

  const handleChoice = (choice: { text: string; nextNode: number; feedback: string; isBest: boolean }) => {
    if (!scenario) return;
    setTotal(t => t + 1);
    if (choice.isBest) setScore(s => s + 1);
    setFeedback(choice.feedback);
    setTimeout(() => {
      setFeedback(null);
      const next = choice.nextNode;
      if (next >= scenario.nodes.length) {
        setDone(true);
      } else {
        setNodeIdx(next);
      }
    }, 1800);
  };

  // Advance nodes without choices (narrator text, single-line dialogue)
  const handleContinue = () => {
    if (!scenario) return;
    const next = nodeIdx + 1;
    if (next >= scenario.nodes.length) {
      setDone(true);
    } else {
      setNodeIdx(next);
    }
  };

  const handleBack = () => {
    if (scenario) {
      setScenario(null);
      setDone(false);
    } else {
      navigate('/learn');
    }
  };

  // List view
  if (!scenario) {
    const levels = ['A0', 'A1', 'A2'] as const;
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">情景对话 🎭</h1>
        <p className="text-sm text-gray-500">选择场景，练习真实法语对话</p>

        {levels.map(level => {
          const items = dialogueScenarios.filter(d => d.level === level);
          if (!items.length) return null;
          return (
            <div key={level} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`px-4 py-2.5 border-b flex items-center gap-2 ${
                level === 'A0' ? 'bg-green-50' : level === 'A1' ? 'bg-blue-50' : 'bg-purple-50'
              }`}>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  level === 'A0' ? 'bg-green-100 text-green-700' :
                  level === 'A1' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>{level}</span>
                <span className="text-xs text-gray-500">{items.length} 个场景</span>
              </div>
              {items.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleSelect(d)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0"
                >
                  <span className="text-2xl">{d.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{d.title}</div>
                    <div className="text-xs text-gray-400">{d.titleZh} · {d.description}</div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // Dialogue view
  const node = scenario.nodes[nodeIdx];
  if (!node) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="flex items-center gap-1 text-sm text-gray-400">
          <ArrowLeft size={16} /> {done ? '返回列表' : '退出'}
        </button>
        <div className="text-xs text-gray-400">{scenario.title} · {scenario.emoji}</div>
      </div>

      {/* Dialogue card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-h-[300px]">
        {done ? (
          /* Done screen */
          <div className="text-center py-6 space-y-4 animate-[bounce-in_0.3s]">
            <div className="text-5xl">{score >= total * 0.8 ? '🌟' : score >= total * 0.5 ? '👍' : '📚'}</div>
            <h3 className="font-bold text-lg">场景完成！</h3>
            <div className="text-sm text-gray-500">
              最佳选择 {score}/{total}
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
              💡 {scenario.description}
            </div>
            <button
              onClick={() => setScenario(null)}
              className="w-full py-2.5 bg-purple-500 text-white rounded-xl font-medium text-sm"
            >
              换一个场景
            </button>
          </div>
        ) : (
          <>
            {/* Speaker */}
            {node.speaker !== 'narrator' && node.speaker !== 'vous' && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">
                  {node.speaker === 'serveur' || node.speaker === 'marchand' || node.speaker === 'guichetier' || node.speaker === 'réceptionniste' ? '🧑‍💼' :
                   node.speaker === 'médecin' || node.speaker === 'pharmacien' ? '👨‍⚕️' :
                   node.speaker === 'passante' ? '👩' :
                   node.speaker === 'recruteur' ? '👔' : '🗣️'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                  {node.speaker}
                </span>
              </div>
            )}

            {/* Narrator text */}
            {node.speaker === 'narrator' && (
              <div className="text-center text-sm text-gray-400 italic mb-4">{node.french}</div>
            )}

            {/* Speaker text */}
            {node.speaker !== 'narrator' && (
              <div className="mb-4">
                <p className="text-lg leading-relaxed mb-1">{node.french}</p>
                {node.chinese && <p className="text-sm text-gray-400">{node.chinese}</p>}
                {node.french && (
                  <button
                    onClick={() => speak(node.french, { rate: 0.8 })}
                    className="mt-2 flex items-center gap-1 text-xs text-blue-500"
                  >
                    <Volume2 size={12} /> 听发音
                  </button>
                )}
              </div>
            )}

            {/* Choices or Continue button */}
            {!feedback && (
              node.choices ? (
                <div className="space-y-2 mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">你的选择：</p>
                  {node.choices.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(c)}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 text-left text-sm hover:border-purple-300 hover:bg-purple-50 transition-all active:scale-[0.98]"
                    >
                      {c.text}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={handleContinue}
                    className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    继续 <ChevronRight size={14} />
                  </button>
                </div>
              )
            )}

            {/* Feedback */}
            {feedback && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="p-3 rounded-xl bg-purple-50 text-sm text-purple-700 animate-[bounce-in_0.2s]">
                  {feedback}
                </div>
                <div className="text-xs text-gray-400 text-center mt-2">继续中...</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
