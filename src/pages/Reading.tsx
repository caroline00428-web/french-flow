import { useState, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { XP_REWARDS } from '../store/db';
import { useTTS, speakSlow } from '../hooks/useTTS';
import TappableText from '../components/TappableText';
import { Play, Volume2, BookOpen, ChevronRight, Check, Lightbulb, Mic, RefreshCw } from 'lucide-react';

// ============================================================
// CEFR-graded French reading passages for reading aloud
// ============================================================

interface ReadingPassage {
  id: string;
  title: string;
  titleZh: string;
  level: 'A0' | 'A1' | 'A2';
  topic: string;
  emoji: string;
  passage: string; // French text
  translation: string; // Chinese/English
  vocab: { french: string; meaning: string }[];
  tips: string; // reading tips
}

const readings: ReadingPassage[] = [
  // ======== A0 ========
  {
    id: 'r-a0-1',
    title: 'Je m\'appelle Marie',
    titleZh: '我叫玛丽',
    level: 'A0',
    topic: '自我介绍',
    emoji: '👧',
    passage: `Bonjour! Je m'appelle Marie. Je suis française. J'habite à Paris. J'ai vingt-cinq ans. Je suis étudiante. J'aime le café et les croissants. Mon ami s'appelle Paul. Il est très gentil.`,
    translation: `你好！我叫玛丽。我是法国人。我住在巴黎。我25岁。我是学生。我喜欢咖啡和牛角面包。我的朋友叫保罗。他非常好。`,
    vocab: [
      { french: 'Je m\'appelle', meaning: 'My name is / 我叫' },
      { french: 'J\'habite à', meaning: 'I live in / 我住在' },
      { french: 'étudiante', meaning: 'student (female) / 学生(女)' },
      { french: 'gentil(le)', meaning: 'kind, nice / 友善的' },
    ],
    tips: '注意 Marie 的 r 要发法语小舌音。Paris 的 s 不发音。étudiante 末尾的 e 不发音。',
  },
  {
    id: 'r-a0-2',
    title: 'Ma famille',
    titleZh: '我的家庭',
    level: 'A0',
    topic: '家庭',
    emoji: '👨‍👩‍👧‍👦',
    passage: `Voici ma famille. Mon père s'appelle Jean. Il est médecin. Ma mère s'appelle Sophie. Elle est professeur. J'ai un frère, il s'appelle Luc. Il a dix-huit ans. J'ai aussi une sœur, elle s'appelle Anne. Nous habitons à Lyon.`,
    translation: `这是我的家庭。我爸爸叫让。他是医生。我妈妈叫苏菲。她是老师。我有一个哥哥，叫吕克，他18岁。我还有一个妹妹，叫安娜。我们住在里昂。`,
    vocab: [
      { french: 'Voici', meaning: 'Here is / 这是' },
      { french: 'médecin', meaning: 'doctor / 医生' },
      { french: 'professeur', meaning: 'teacher / 老师' },
      { french: 'aussi', meaning: 'also / 也' },
    ],
    tips: 'père 和 mère 的 è 要发开口音（像英语 bed 的 e）。frère 有 r 音+开口音，慢慢读。',
  },
  {
    id: 'r-a0-3',
    title: 'Au café',
    titleZh: '在咖啡馆',
    level: 'A0',
    topic: '日常',
    emoji: '☕',
    passage: `Je vais au café. Je commande un café noir et un croissant. Le café est chaud. Le croissant est délicieux. Le serveur est très sympathique. Je lis un livre. Il fait beau aujourd'hui.`,
    translation: `我去咖啡馆。我点了一杯黑咖啡和一个牛角面包。咖啡很热。牛角面包很好吃。服务员很友好。我在看书。今天天气很好。`,
    vocab: [
      { french: 'Je commande', meaning: 'I order / 我点单' },
      { french: 'délicieux', meaning: 'delicious / 美味的' },
      { french: 'sympathique', meaning: 'friendly / 友好的' },
      { french: 'Il fait beau', meaning: 'The weather is nice / 天气好' },
    ],
    tips: 'café noir 的 noir 要发鼻音。croissant 的 oi 发 "wa" 音。délicieux 的 eux 发 "eu" 音。',
  },
  // ======== A1 ========
  {
    id: 'r-a1-1',
    title: 'Ma journée',
    titleZh: '我的一天',
    level: 'A1',
    topic: '日常生活',
    emoji: '🌅',
    passage: `Je me réveille à sept heures. Je prends mon petit déjeuner: du pain avec du beurre et un café. Je vais au travail en métro. Je travaille de neuf heures à dix-sept heures. Le soir, je rentre à la maison. Je prépare le dîner. Après le dîner, je regarde la télévision ou je lis un livre. Je me couche à vingt-trois heures.`,
    translation: `我七点起床。我吃早餐：面包配黄油和咖啡。我坐地铁上班。我从九点工作到十七点。晚上，我回家。我准备晚餐。饭后我看电视或读书。我二十三点睡觉。`,
    vocab: [
      { french: 'Je me réveille', meaning: 'I wake up / 我醒来' },
      { french: 'Je prends', meaning: 'I take/have / 我吃/喝' },
      { french: 'en métro', meaning: 'by metro / 坐地铁' },
      { french: 'Je me couche', meaning: 'I go to bed / 我睡觉' },
    ],
    tips: 'réveille 的 eil 发 "ey" 音。premps 的 ps 不发音。premds 末尾 ds 不发音。日常动词多用 -ER 变位。',
  },
  {
    id: 'r-a1-2',
    title: 'Au restaurant',
    titleZh: '在餐厅',
    level: 'A1',
    topic: '饮食',
    emoji: '🍽️',
    passage: `Hier soir, je suis allé au restaurant avec des amis. Nous avons réservé une table pour quatre personnes. J'ai commandé du poulet rôti avec des légumes. C'était très bon! Mon ami a pris du poisson. Nous avons bu du vin rouge. Pour le dessert, j'ai mangé une mousse au chocolat. L'addition était de quatre-vingts euros.`,
    translation: `昨晚，我和朋友去了餐厅。我们订了四人桌。我点了烤鸡配蔬菜。非常好吃！我的朋友吃了鱼。我们喝了红酒。甜点我吃了巧克力慕斯。账单是80欧元。`,
    vocab: [
      { french: 'Hier soir', meaning: 'Last night / 昨晚' },
      { french: 'Je suis allé(e)', meaning: 'I went / 我去了' },
      { french: 'Nous avons réservé', meaning: 'We reserved / 我们预订了' },
      { french: 'L\'addition', meaning: 'The bill / 账单' },
    ],
    tips: '这是 passé composé（过去时）练习。注意 ai mangé 的 ai 和 mangé 连在一起读。C\'était = "se-tay"。',
  },
  {
    id: 'r-a1-3',
    title: 'Chercher un travail',
    titleZh: '找工作',
    level: 'A1',
    topic: '工作',
    emoji: '💼',
    passage: `Je cherche un travail à Paris. J'ai envoyé mon CV à plusieurs entreprises. Hier, j'ai eu un entretien d'embauche. L'entretien s'est bien passé. Le recruteur était très gentil. Il m'a posé des questions sur mon expérience. J'espère avoir une réponse bientôt. Je suis très motivé!`,
    translation: `我在巴黎找工作。我向几家公司投了简历。昨天，我参加了一个面试。面试很顺利。招聘官非常友好。他问了我一些关于经验的问题。我希望很快收到回复。我很有动力！`,
    vocab: [
      { french: 'Je cherche', meaning: 'I am looking for / 我在找' },
      { french: 'un entretien', meaning: 'an interview / 面试' },
      { french: 's\'est bien passé', meaning: 'went well / 进行顺利' },
      { french: 'J\'espère', meaning: 'I hope / 我希望' },
    ],
    tips: 'cherche 的 ch 发 "sh" 音。entretien 的 en 是鼻音。embauche 的 au 发 "o" 音。这是找工作必备法语！',
  },
  // ======== A2 ========
  {
    id: 'r-a2-1',
    title: 'Mon voyage à Bordeaux',
    titleZh: '我的波尔多之旅',
    level: 'A2',
    topic: '旅行',
    emoji: '🍷',
    passage: `Le week-end dernier, je suis allé à Bordeaux en train. Le voyage a duré deux heures. Bordeaux est une très belle ville. Je me suis promené dans le centre-ville. J'ai visité la cathédrale et le musée. J'ai goûté le vin local, qui est excellent. J'ai aussi mangé des cannelés, une spécialité bordelaise. Je suis rentré dimanche soir, fatigué mais heureux.`,
    translation: `上周末我坐火车去了波尔多。旅程花了两小时。波尔多是一个非常美的城市。我在市中心散步。我参观了教堂和博物馆。我品尝了当地葡萄酒，非常好喝。我还吃了可露丽，波尔多特色甜点。我周日晚上回家，疲惫但开心。`,
    vocab: [
      { french: 'a duré', meaning: 'lasted / 持续了' },
      { french: 'Je me suis promené', meaning: 'I walked around / 我散步' },
      { french: 'J\'ai goûté', meaning: 'I tasted / 我品尝了' },
      { french: 'Je suis rentré', meaning: 'I returned / 我回来了' },
    ],
    tips: 'Bordeaux 的 eaux 发 "o" 音。promené 的 pro 发短音。注意 passé composé 中 être 动词的性数配合（allé, rentré）。',
  },
  {
    id: 'r-a2-2',
    title: 'Une conversation téléphonique',
    titleZh: '一通电话',
    level: 'A2',
    topic: '日常沟通',
    emoji: '📞',
    passage: `— Allô? Bonjour, c'est Thomas à l'appareil.
— Bonjour Thomas! C'est Sophie. Comment allez-vous?
— Très bien, merci! Je vous appelle pour confirmer notre rendez-vous de demain.
— Oui, demain à 10 heures, c'est toujours d'accord?
— Tout à fait. On se retrouve au café en face de la gare?
— Parfait. À demain alors!
— À demain, bonne soirée!`,
    translation: `— 喂？你好，我是托马斯。
— 你好托马斯！我是苏菲。你好吗？
— 很好，谢谢！我打电话确认我们明天的约会。
— 是的，明天10点，没问题吧？
— 完全没问题。我们在火车站对面的咖啡馆见？
— 好的。明天见！
— 明天见，晚上愉快！`,
    vocab: [
      { french: 'à l\'appareil', meaning: 'speaking (on phone) / 在电话中' },
      { french: 'confirmer', meaning: 'to confirm / 确认' },
      { french: 'rendez-vous', meaning: 'appointment / 约会/见面' },
      { french: 'On se retrouve', meaning: 'Let\'s meet / 我们见面' },
    ],
    tips: '电话法语！Allô 只在接电话时说。c\'est [名字] à l\'appareil = 电话中自报姓名。对话中注意语调变化。',
  },
];

export default function Reading() {
  const addXP = useGameStore(s => s.addXP);
  const addGems = useGameStore(s => s.addGems);
  const completeLesson = useGameStore(s => s.completeLesson);
  const { speak } = useTTS();

  const [selected, setSelected] = useState<ReadingPassage | null>(null);
  const [mode, setMode] = useState<'read' | 'shadow'>('read');
  const [currentLine, setCurrentLine] = useState(-1); // -1 = show all
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showVocab, setShowVocab] = useState(false);

  const handleSelect = (r: ReadingPassage) => {
    setSelected(r);
    setCurrentLine(-1);
    setShowVocab(false);
    setMode('read');
  };

  const handleComplete = () => {
    if (!selected) return;
    setCompleted(prev => new Set([...prev, selected.id]));
    addXP(XP_REWARDS.perfectLesson);
    addGems(2);
    completeLesson(selected.id);
  };

  const lines = selected ? selected.passage.split('\n').filter(l => l.trim()) : [];

  // Reading list
  if (!selected) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">朗读练习 📖</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          精选法语短文，大声朗读 + 影子跟读，练发音和语感
        </p>

        {/* Tips card */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={18} className="text-amber-500" />
            <span className="font-semibold text-sm text-amber-700">朗读学习法</span>
          </div>
          <div className="text-xs text-amber-700 space-y-1">
            <p>1️⃣ <strong>默读</strong>：先看一遍，理解大意</p>
            <p>2️⃣ <strong>听读</strong>：点播放听标准发音，注意语调和节奏</p>
            <p>3️⃣ <strong>跟读</strong>：一句一句跟着读，模仿语音语调</p>
            <p>4️⃣ <strong>自读</strong>：不依赖音频，自己大声朗读全文</p>
          </div>
        </div>

        {/* Reading passages by level */}
        {(['A0', 'A1', 'A2'] as const).map(level => {
          const items = readings.filter(r => r.level === level);
          return (
            <div key={level} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  level === 'A0' ? 'bg-green-100 text-green-700' :
                  level === 'A1' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>{level}</span>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {level === 'A0' ? '入门短篇' : level === 'A1' ? '基础短篇' : '进阶短篇'}
                </span>
              </div>
              {items.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{r.title}</span>
                      {completed.has(r.id) && <Check size={14} className="text-green-500" />}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{r.titleZh} · {r.topic}</div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  // Reading detail view
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setSelected(null)} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
          ← 返回列表
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === 'read' ? 'shadow' : 'read')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              mode === 'shadow' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {mode === 'read' ? '📖 阅读模式' : '🎤 跟读模式'}
          </button>
          {!completed.has(selected.id) && (
            <button
              onClick={handleComplete}
              className="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-full text-xs font-bold"
            >
              标记完成
            </button>
          )}
        </div>
      </div>

      {/* Title card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
        <div className="text-2xl mb-1">{selected.emoji}</div>
        <h2 className="font-bold">{selected.title}</h2>
        <p className="text-xs text-[var(--color-text-secondary)]">{selected.titleZh} · {selected.topic} · {selected.level}</p>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
        <p className="text-xs text-amber-700">💡 {selected.tips}</p>
      </div>

      {/* Reading passage */}
      {mode === 'read' ? (
        /* Full text mode */
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">🇫🇷 全文朗读</span>
            <div className="flex gap-1">
              <button onClick={() => speak(selected.passage.replace(/\n/g, ' '), { rate: 0.85 })} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                <Volume2 size={12} /> 常速
              </button>
              <button onClick={() => speakSlow(selected.passage.replace(/\n/g, ' '))} className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
                <Volume2 size={12} /> 慢速跟读
              </button>
            </div>
          </div>
          <p className="text-lg leading-relaxed whitespace-pre-line french-text">
            {selected.passage}
          </p>
        </div>
      ) : (
        /* Shadowing mode — line by line with recording */
        <div className="space-y-2">
          {lines.map((line, i) => (
            <ShadowLine key={i} line={line.trim()} index={i} isActive={currentLine === i} onSelect={() => setCurrentLine(i)} speak={speak} />
          ))}
          <p className="text-xs text-[var(--color-text-secondary)] text-center">
            💡 先听标准发音 → 录下自己的跟读 → 对比找出差异
          </p>
        </div>
      )}

      {/* Translation */}
      <details className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <summary className="text-sm font-medium cursor-pointer">查看翻译 📝</summary>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2 whitespace-pre-line">{selected.translation}</p>
      </details>

      {/* Vocabulary */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <button
          onClick={() => setShowVocab(!showVocab)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-400" />
            <span className="text-sm font-medium">关键词汇 ({selected.vocab.length})</span>
          </div>
          <span className="text-xs text-gray-400">{showVocab ? '收起' : '展开'}</span>
        </button>
        {showVocab && (
          <div className="mt-3 space-y-2">
            {selected.vocab.map((v, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium french-text">{v.french}</span>
                <span className="text-xs text-[var(--color-text-secondary)]">{v.meaning}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completion */}
      {completed.has(selected.id) && (
        <div className="bg-green-50 rounded-xl p-3 text-center animate-[bounce-in_0.4s]">
          <p className="text-sm text-green-600 font-medium">✅ 已标记完成！继续下一篇文章吧</p>
        </div>
      )}
    </div>
  );
}

function ShadowLine({ line, index, isActive, onSelect, speak }: { line: string; index: number; isActive: boolean; onSelect: () => void; speak: any }) {
  const [isRec, setIsRec] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRec = async () => {
    setAudioUrl(null); chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mrRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => { setAudioUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: 'audio/webm' }))); stream.getTracks().forEach(t => t.stop()); };
      mr.start(); setIsRec(true);
      setTimeout(() => { if (mr.state === 'recording') { mr.stop(); setIsRec(false); } }, 8000);
    } catch { setIsRec(false); }
  };
  const stopRec = () => { if (mrRef.current?.state === 'recording') { mrRef.current.stop(); setIsRec(false); } };
  const clearRec = () => { if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioUrl(null); };

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border transition-all ${isActive ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/10' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-400">第 {index + 1} 句</span>
        <div className="flex gap-1">
          <button onClick={() => speak(line, { rate: 0.8 })} className="flex items-center gap-1 text-xs text-blue-500 px-1.5 py-0.5 rounded hover:bg-blue-50"><Play size={12} /> 听</button>
          <button onClick={() => speakSlow(line)} className="flex items-center gap-1 text-xs text-green-500 px-1.5 py-0.5 rounded hover:bg-green-50"><Volume2 size={12} /> 慢速</button>
        </div>
      </div>
      <p className={`text-base leading-relaxed cursor-pointer ${isActive ? 'text-[var(--color-primary-dark)] font-medium' : ''}`} onClick={onSelect}>
        <TappableText text={line} onSpeak={(w: string) => speak(w, { rate: 0.6 })} />
      </p>
      {isActive && (
        <div className="mt-2 space-y-2">
          {!audioUrl ? (
            <button onClick={isRec ? stopRec : startRec} className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${isRec ? 'bg-red-50 text-red-500 border border-red-200 recording-pulse' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
              {isRec ? <><div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> 录音中...</> : <><Mic size={12} /> 录下我的跟读</>}
            </button>
          ) : (
            <div className="space-y-1.5">
              <audio src={audioUrl} controls className="w-full h-8" />
              <div className="flex gap-1">
                <button onClick={clearRec} className="flex-1 py-1 bg-gray-100 text-gray-500 rounded text-[10px]"><RefreshCw size={10} /> 重录</button>
                <button onClick={() => speak(line, { rate: 0.6 })} className="flex-1 py-1 bg-blue-50 text-blue-500 rounded text-[10px]"><Volume2 size={10} /> 听标准</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
