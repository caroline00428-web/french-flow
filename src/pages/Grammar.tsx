import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { XP_REWARDS } from '../store/db';
import { useTTS } from '../hooks/useTTS';
import { ChevronRight, ArrowLeft, Check, X, BookOpen, Lightbulb, Sparkles, MessageCircle, Star, Play } from 'lucide-react';

// ============================================================
// Story-based grammar lessons — kid-friendly, visual, interactive
// ============================================================

interface GrammarScene {
  type: 'story' | 'explain' | 'example' | 'practice' | 'tip';
  character?: string; // emoji character
  text: string;
  french?: string;
  english?: string;
  highlight?: string; // key grammar point to highlight
}

interface StoryGrammarLesson {
  id: string;
  title: string;
  titleZh: string;
  level: 'A0' | 'A1' | 'A2';
  emoji: string;
  scenes: GrammarScene[];
  exercises: {
    type: 'fill' | 'choice';
    question: string;
    options?: string[];
    answer: string;
    hint?: string;
    explanation: string;
  }[];
}

const storyLessons: StoryGrammarLesson[] = [
  // ======== LESSON 1: GENDER ========
  {
    id: 'story-gender',
    title: '为什么面包是男的？',
    titleZh: '法语名词的性别',
    level: 'A0',
    emoji: '👫',
    scenes: [
      {
        type: 'story',
        character: '🐱',
        text: '嘿！我是小猫 Léo，我在巴黎出生。让我告诉你一个法语的秘密...',
      },
      {
        type: 'story',
        character: '🐱',
        text: '在法语里，所有的东西都有性别！桌子是女的，面包是男的，连门都有性别！',
        highlight: '每个名词 = 👦 或 👧',
      },
      {
        type: 'explain',
        character: '📖',
        text: '怎么知道一个词是男是女呢？看它前面的小词：\n\n👦 男的用 le（相当于 the）\n👧 女的用 la（相当于 the）',
        french: 'le pain = 面包 👦\nla table = 桌子 👧',
      },
      {
        type: 'tip',
        character: '💡',
        text: '小窍门：以 -e 结尾的词，70% 是女的！\n\n👧 la salade（沙拉）\n👧 la viande（肉）\n👧 la baguette（法棍）\n\n但不是100%哦！le fromage（奶酪）也是 -e 结尾但是男的 😺',
      },
      {
        type: 'explain',
        character: '📖',
        text: '如果词以 a, e, i, o, u 开头，不管男女，都用 l\'',
        french: 'l\'eau（水 👧）\nl\'ami（朋友 👦）\nl\'orange（橙子 👧）',
        highlight: '元音开头 = l\'',
      },
      {
        type: 'example',
        character: '🗣️',
        text: '练一练！试着判断：',
        french: 'le café ☕ → 咖啡是男的\nla bière 🍺 → 啤酒是女的\nl\'hôtel 🏨 → h不发音，用 l\'',
      },
      {
        type: 'story',
        character: '🐱',
        text: '记住：每次学新单词的时候，把 le/la 一起记！就像记住一个人的性别一样～',
      },
    ],
    exercises: [
      {
        type: 'choice', question: '🍞 面包 = ?', options: ['le pain', 'la pain', 'l\'pain'], answer: 'le pain',
        hint: 'pain 不以 -e 结尾，通常是男的', explanation: 'le pain！面包是男的 👦'
      },
      {
        type: 'choice', question: '💧 水 = ?', options: ['le eau', 'la eau', 'l\'eau'], answer: 'l\'eau',
        hint: 'eau 以元音 e 开头！', explanation: 'l\'eau！元音开头用 l\' 💧'
      },
      {
        type: 'choice', question: '🥗 沙拉 = ?', options: ['le salade', 'la salade', 'l\'salade'], answer: 'la salade',
        hint: '以 -e 结尾，很可能是女的', explanation: 'la salade！以 e 结尾，女的 👧'
      },
      {
        type: 'fill', question: '☕ 一杯咖啡 = ___ café', answer: 'un',
        hint: 'un = 一个（男的），une = 一个（女的）', explanation: 'un café！café 是男的，所以用 un ☕'
      },
      {
        type: 'fill', question: '🍺 一杯啤酒 = ___ bière', answer: 'une',
        hint: 'bière 是女的', explanation: 'une bière！bière 以 e 结尾，是女的 🍺'
      },
    ],
  },
  // ======== LESSON 2: ÊTRE ========
  {
    id: 'story-etre',
    title: '我是谁？你是谁？',
    titleZh: '动词 Être = 是',
    level: 'A0',
    emoji: '🎭',
    scenes: [
      {
        type: 'story', character: '🐱',
        text: '现在我们来学法语里最重要的词 —— être（是）。没有它，你什么都说不出来！',
      },
      {
        type: 'explain', character: '📖',
        text: 'être 就像一个变形金刚 🤖，遇到不同的人会变成不同的样子：',
        french: 'Je suis = 我是\nTu es = 你是\nIl/Elle est = 他/她是',
        highlight: 'être = to be = 是',
      },
      {
        type: 'explain', character: '📖',
        text: '复数形式：',
        french: 'Nous sommes = 我们是\nVous êtes = 你们/您是\nIls/Elles sont = 他们/她们是',
      },
      {
        type: 'tip', character: '💡',
        text: '发音秘密：suis, es, est 都读成 "ay"（就像英文的 A）！只有 sommes, êtes, sont 不一样。口语中它们经常连读～',
      },
      {
        type: 'story', character: '🐱',
        text: '来认识一下我的朋友们：',
        french: 'Je suis Léo. 🐱\nTu es mon ami. 🤝\nElle est française. 🇫🇷\nNous sommes contents! 😊',
      },
    ],
    exercises: [
      {
        type: 'fill', question: 'Je ___ français. (我是法国人)', answer: 'suis',
        hint: 'Je + ? = 我是', explanation: 'Je suis = 我是！就像英文的 I am 🎯'
      },
      {
        type: 'fill', question: 'Elle ___ belle. (她很美)', answer: 'est',
        hint: '她/他 + ? = 她/他是', explanation: 'Elle est = 她是 👧'
      },
      {
        type: 'choice', question: 'We are = ?', options: ['Nous sommes', 'Vous êtes', 'Ils sont'], answer: 'Nous sommes',
        hint: '我们 = Nous', explanation: 'Nous sommes = 我们是 👨‍👩‍👧‍👦'
      },
      {
        type: 'fill', question: 'Tu ___ mon ami. (你是我的朋友)', answer: 'es',
        hint: 'Tu + ? = 你是', explanation: 'Tu es = 你是（对朋友说）🤝'
      },
      {
        type: 'choice', question: 'They are (女孩子们) = ?', options: ['Ils sont', 'Elles sont', 'Elle est'], answer: 'Elles sont',
        hint: '全是女生用 Elles', explanation: 'Elles sont！全是女生 👧👧👧'
      },
    ],
  },
  // ======== LESSON 3: AVOIR ========
  {
    id: 'story-avoir',
    title: '我有一个秘密...',
    titleZh: '动词 Avoir = 有',
    level: 'A0',
    emoji: '🤲',
    scenes: [
      {
        type: 'story', character: '🐱',
        text: '第二个最重要的词是 avoir（有）。但法语里的"有"和中文不一样！',
      },
      {
        type: 'explain', character: '📖',
        text: 'avoir 的变身：',
        french: 'J\'ai = 我有\nTu as = 你有\nIl/Elle a = 他/她有',
        highlight: 'avoir = to have = 有',
      },
      {
        type: 'explain', character: '📖',
        text: '复数：',
        french: 'Nous avons = 我们有\nVous avez = 你们/您有\nIls/Elles ont = 他们/她们有',
      },
      {
        type: 'tip', character: '💡',
        text: '法语里，"我饿"要说 "J\'ai faim" = "我有饥饿"！\n\n有趣吧？法国人用 avoir（有）来表达感觉：\n🔥 J\'ai chaud = 我热（我有热）\n❄️ J\'ai froid = 我冷（我有冷）\n😨 J\'ai peur = 我怕（我有怕）\n🎂 J\'ai 20 ans = 我20岁（我有20年）',
      },
      {
        type: 'story', character: '🐱',
        text: '看看这些日常对话：',
        french: '🐱: Tu as faim?\n🐶: Oui, j\'ai très faim!\n🐱: Allons manger! （我们去吃吧！）',
      },
    ],
    exercises: [
      {
        type: 'fill', question: 'J\'___ un chat. (我有一只猫)', answer: 'ai',
        hint: 'J\' + ? = 我有', explanation: 'J\'ai = 我有！注意是 J\' 不是 Je 🐱'
      },
      {
        type: 'fill', question: 'Elle ___ 25 ans. (她25岁)', answer: 'a',
        hint: '她 + ? = 她有', explanation: 'Elle a 25 ans = 她有25年 = 她25岁 🎂'
      },
      {
        type: 'choice', question: '我饿了 = ?', options: ['Je suis faim', 'J\'ai faim', 'Je faim'], answer: 'J\'ai faim',
        hint: '法语用"有"来表达饿！', explanation: 'J\'ai faim！我有饥饿 = 我饿了 🍽️'
      },
      {
        type: 'fill', question: 'Nous ___ une maison. (我们有一栋房子)', answer: 'avons',
        hint: 'Nous + ? = 我们有', explanation: 'Nous avons = 我们有 🏠'
      },
    ],
  },
  // ======== LESSON 4: ER VERBS ========
  {
    id: 'story-er-verbs',
    title: '80%的法语动词都会这个魔法',
    titleZh: '-ER 动词变位',
    level: 'A1',
    emoji: '🪄',
    scenes: [
      {
        type: 'story', character: '🐱',
        text: '告诉你一个秘密：法语里 80% 的动词都是 -ER 结尾的！学会一个 = 学会几百个！',
      },
      {
        type: 'explain', character: '📖',
        text: '拿 parler（说话）举例。就像做蛋糕 🎂：\n\n1. 去掉 -ER = 得到 parl-（蛋糕底）\n2. 加上不同人的结尾（装饰）：',
        french: 'Je parle = 我说 （-e）\nTu parles = 你说 （-es）\nIl parle = 他说 （-e）\nNous parlons = 我们说 （-ons）\nVous parlez = 你们说 （-ez）\nIls parlent = 他们说 （-ent）',
        highlight: '词根 parl- + 结尾',
      },
      {
        type: 'tip', character: '💡',
        text: '注意！je parle, tu parles, il parle, ils parlent — 这些结尾（-e, -es, -e, -ent）发音完全一样！都是 "parl" 的音。只有 nous parlons 和 vous parlez 不一样！',
      },
      {
        type: 'story', character: '🐱',
        text: '试试这些常用的 -ER 动词：\n\n🗣️ parler = 说\n❤️ aimer = 爱/喜欢\n🏠 habiter = 住\n💼 travailler = 工作\n🍽️ manger = 吃',
      },
    ],
    exercises: [
      {
        type: 'fill', question: 'Je ___ français. (parler)', answer: 'parle',
        hint: 'Je + parler → parl + e', explanation: 'Je parle！去掉 er + e 🗣️'
      },
      {
        type: 'fill', question: 'Nous ___ à Paris. (habiter)', answer: 'habitons',
        hint: 'Nous → 加 -ons', explanation: 'Nous habitons！nous 结尾是 ons 🏠'
      },
      {
        type: 'choice', question: '她工作 = ?', options: ['Elle travaille', 'Elle travailler', 'Elle travailles'], answer: 'Elle travaille',
        hint: 'elle → 加 -e', explanation: 'Elle travaille！去掉 -er 加 -e 💼'
      },
      {
        type: 'fill', question: 'Vous ___ anglais? (parler)', answer: 'parlez',
        hint: 'Vous → 加 -ez', explanation: 'Vous parlez！vous 的结尾是 -ez 👥'
      },
    ],
  },
  // ======== LESSON 5: NEGATION ========
  {
    id: 'story-negation',
    title: '不！我不！',
    titleZh: '否定：ne...pas',
    level: 'A1',
    emoji: '🙅',
    scenes: [
      {
        type: 'story', character: '🐱',
        text: '法国人说不的方式很有趣——他们把动词"包"起来！就像做了一个三明治 🥪',
      },
      {
        type: 'explain', character: '📖',
        text: '否定三明治 🥪：\n\nne + 动词 + pas = 不！',
        french: 'Je parle français. → 我说法语。\nJe NE parle PAS français. → 我不说法语。\n\n看见了？ne 在动词前面，pas 在动词后面！',
        highlight: 'ne...pas = 不',
      },
      {
        type: 'tip', character: '💡',
        text: '如果动词以元音开头（a, e, i, o, u），ne 变成 n\'：\n\nIl est content. → Il N\'est PAS content. 😢\nJ\'aime ça. → Je N\'aime PAS ça. 👎',
      },
      {
        type: 'story', character: '🐱',
        text: '日常对话里，法国人经常把 ne 省掉！\n\n标准法语：Je ne sais pas.（我不知道）\n日常口语：Je sais pas. 😅\n\n但刚开始学的时候，还是用完整的 ne...pas 比较好！',
      },
    ],
    exercises: [
      {
        type: 'fill', question: 'Je ___ parle ___ anglais. (我不说英语)', answer: 'ne...pas',
        hint: '把动词包起来！ne 在前，pas 在后', explanation: 'Je NE parle PAS anglais! 🥪'
      },
      {
        type: 'choice', question: '他不累 = ?', options: ['Il n\'est pas fatigué.', 'Il est ne pas fatigué.', 'Il ne pas est fatigué.'], answer: 'Il n\'est pas fatigué.',
        hint: 'est 以元音开头，ne 要缩写', explanation: 'Il N\'EST PAS fatigué！est 以元音开头，ne → n\' 🎯'
      },
      {
        type: 'fill', question: 'Elle ___ aime ___ le café. (她不喜欢咖啡)', answer: 'n\'...pas',
        hint: 'aime 以 a 开头！', explanation: 'Elle N\'AIME PAS le café！aime 开头是元音 ☕'
      },
    ],
  },
  // ======== LESSON 6: PAST TENSE ========
  {
    id: 'story-past',
    title: '回到昨天...',
    titleZh: '过去时：Passé Composé',
    level: 'A2',
    emoji: '⏪',
    scenes: [
      {
        type: 'story', character: '🐱',
        text: '想说你昨天做了什么？你需要"复合过去时"。别被名字吓到——它其实很简单！',
      },
      {
        type: 'explain', character: '📖',
        text: '配方 🧪：\n\navoir（现在时）+ 动词的过去分词\n\n就像做一道菜：上面是 avoir，下面是动词变身：',
        french: 'J\'ai mangé = 我吃了（avoir 的 ai + manger 变 mangé）\nTu as parlé = 你说了\nIl a fini = 他完成了',
        highlight: 'avoir + 过去分词',
      },
      {
        type: 'tip', character: '💡',
        text: '动词怎么变过去分词？\n\n-ER 动词 → -é：manger → mangé 🍽️\n-IR 动词 → -i：finir → fini ✅\n-RE 动词 → -u：vendre → vendu 🏪',
      },
      {
        type: 'story', character: '🐱',
        text: '有少数动词用 être 而不是 avoir：\n\nJe suis allé(e) = 我去了\nElle est née = 她出生了\nIls sont arrivés = 他们到了\n\n用 être 的时候，过去分词要配合性别！👦👧',
      },
    ],
    exercises: [
      {
        type: 'fill', question: 'J\'___ ___ (manger) une pizza. = 我吃了披萨', answer: 'ai mangé',
        hint: 'avoir 的 je 形式 + mangé', explanation: 'J\'ai mangé！ai（avoir）+ mangé（过去分词）🍕'
      },
      {
        type: 'choice', question: '她去了巴黎 = ?', options: ['Elle a allé à Paris.', 'Elle est allée à Paris.', 'Elle est allé à Paris.'], answer: 'Elle est allée à Paris.',
        hint: 'aller 用 être！而且要配合性别', explanation: 'Elle est allée！aller 用 être，elle 加 -e 👧✈️'
      },
    ],
  },
];

export default function Grammar() {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson');

  const addXP = useGameStore(s => s.addXP);
  const addGems = useGameStore(s => s.addGems);
  const completeLesson = useGameStore(s => s.completeLesson);
  const { speak } = useTTS();

  const [selectedLesson, setSelectedLesson] = useState<StoryGrammarLesson | null>(
    lessonId ? storyLessons.find(l => l.id === lessonId) || null : null
  );
  const [currentScene, setCurrentScene] = useState(0);
  const [showExercise, setShowExercise] = useState(false);
  const [currentEx, setCurrentEx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [exResult, setExResult] = useState<boolean | null>(null);
  const [exCorrect, setExCorrect] = useState(0);
  const [exDone, setExDone] = useState(false);

  // Lesson list
  if (!selectedLesson) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">语法故事 📖</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">用有趣的方式理解法语语法</p>

        {['A0', 'A1', 'A2'].map(level => {
          const lessons = storyLessons.filter(l => l.level === level);
          if (!lessons.length) return null;
          return (
            <div key={level} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  level === 'A0' ? 'bg-green-100 text-green-700' :
                  level === 'A1' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {level === 'A0' ? '入门故事' : level === 'A1' ? '基础故事' : '进阶故事'}
                </span>
              </div>
              {lessons.map(l => (
                <button
                  key={l.id}
                  onClick={() => { setSelectedLesson(l); setCurrentScene(0); setShowExercise(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-2xl">{l.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{l.title}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{l.titleZh}</div>
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

  const lesson = selectedLesson;

  const handleStartExercise = () => {
    setShowExercise(true);
    setCurrentEx(0);
    setExCorrect(0);
    setExDone(false);
    setUserAnswer('');
    setExResult(null);
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    const correct = userAnswer.toLowerCase().trim() === lesson.exercises[currentEx].answer.toLowerCase().trim();
    setExResult(correct);
    if (correct) {
      setExCorrect(c => c + 1);
      addXP(XP_REWARDS.grammarCorrect);
    }
  };

  const handleNextEx = () => {
    if (currentEx < lesson.exercises.length - 1) {
      setCurrentEx(i => i + 1);
      setUserAnswer('');
      setExResult(null);
    } else {
      setExDone(true);
      if (exCorrect >= lesson.exercises.length * 0.8) {
        addGems(3);
        completeLesson(lesson.id);
        addXP(XP_REWARDS.perfectLesson);
      }
    }
  };

  const scene = lesson.scenes[currentScene];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setSelectedLesson(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold">{showExercise ? '练习时间!' : lesson.title}</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">{lesson.titleZh}</p>
        </div>
        <span className="text-2xl ml-auto">{lesson.emoji}</span>
      </div>

      {!showExercise ? (
        <>
          {/* Story scene */}
          {scene && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-[slide-up_0.3s_ease-out]">
              {/* Character + narration */}
              <div className="flex items-start gap-3 mb-4">
                <div className="text-4xl shrink-0">{scene.character}</div>
                <div className={`flex-1 p-4 rounded-2xl ${
                  scene.type === 'tip' ? 'bg-amber-50 border border-amber-100' :
                  scene.type === 'explain' ? 'bg-blue-50 border border-blue-100' :
                  scene.type === 'example' ? 'bg-green-50 border border-green-100' :
                  'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {scene.type === 'tip' && <Lightbulb size={14} className="text-amber-500" />}
                    {scene.type === 'explain' && <BookOpen size={14} className="text-blue-500" />}
                    {scene.type === 'story' && <MessageCircle size={14} className="text-gray-500" />}
                    {scene.type === 'example' && <Sparkles size={14} className="text-green-500" />}
                    <span className="text-[10px] font-medium text-gray-400 uppercase">
                      {scene.type === 'tip' ? '小窍门' :
                       scene.type === 'explain' ? '知识点' :
                       scene.type === 'example' ? '例子' : '故事'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{scene.text}</p>
                </div>
              </div>

              {/* French examples */}
              {scene.french && (
                <div className="mb-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-indigo-400">🇫🇷 法语</span>
                    <button
                      onClick={() => speak(scene.french!.split('\n')[0], { rate: 0.8 })}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-600"
                    >
                      <Play size={12} /> 听发音
                    </button>
                  </div>
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{scene.french}</p>
                </div>
              )}

              {/* Highlight */}
              {scene.highlight && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                  <p className="text-sm font-bold text-yellow-700">✨ {scene.highlight}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentScene(s => Math.max(0, s - 1))}
              disabled={currentScene === 0}
              className="flex-1 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl disabled:opacity-30 text-sm"
            >
              ← 上一页
            </button>
            {currentScene < lesson.scenes.length - 1 ? (
              <button
                onClick={() => setCurrentScene(s => s + 1)}
                className="flex-1 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm"
              >
                下一页 →
              </button>
            ) : (
              <button
                onClick={handleStartExercise}
                className="flex-1 py-3 bg-[var(--color-accent)] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <Star size={16} /> 开始练习 ({lesson.exercises.length}题)
              </button>
            )}
          </div>

          {/* Scene dots */}
          <div className="flex justify-center gap-1.5">
            {lesson.scenes.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentScene(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentScene ? 'bg-[var(--color-primary)] w-6' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </>
      ) : exDone ? (
        <div className="text-center py-8 space-y-4">
          <div className="text-6xl">{exCorrect >= lesson.exercises.length * 0.8 ? '🏆' : '📝'}</div>
          <h2 className="text-xl font-bold">
            {exCorrect >= lesson.exercises.length * 0.8 ? '太厉害了!' : '练习完成!'}
          </h2>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--color-correct)]">{exCorrect}/{lesson.exercises.length}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">正确</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round((exCorrect / lesson.exercises.length) * 100)}%</div>
              <div className="text-xs text-[var(--color-text-secondary)]">正确率</div>
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={handleStartExercise} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">重做</button>
            <button onClick={() => setSelectedLesson(null)} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm font-bold">返回列表</button>
          </div>
        </div>
      ) : (
        <>
          {/* Exercise card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">
              第 {currentEx + 1} / {lesson.exercises.length} 题
            </p>
            <p className="text-lg font-medium mb-4">{lesson.exercises[currentEx].question}</p>

            {lesson.exercises[currentEx].type === 'choice' ? (
              <div className="space-y-2">
                {lesson.exercises[currentEx].options?.map((opt, i) => {
                  const isCorrect = opt === lesson.exercises[currentEx].answer;
                  let style = 'bg-white border-gray-200 hover:border-[var(--color-primary)]';
                  if (exResult !== null) {
                    if (isCorrect) style = 'bg-green-50 border-green-300 text-green-700';
                    else if (opt === userAnswer) style = 'bg-red-50 border-red-300 text-red-600';
                    else style = 'opacity-40';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        if (exResult !== null) return;
                        setUserAnswer(opt);
                        const correct = opt === lesson.exercises[currentEx].answer;
                        setExResult(correct);
                        if (correct) { setExCorrect(c => c + 1); addXP(XP_REWARDS.grammarCorrect); }
                      }}
                      className={`w-full p-3 rounded-xl border text-left text-sm ${style} transition-all`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') exResult !== null ? handleNextEx() : handleSubmit();
                  }}
                  placeholder="输入答案..."
                  disabled={exResult !== null}
                  className="w-full p-3 rounded-xl border border-gray-200 text-lg focus:outline-none focus:border-[var(--color-primary)] disabled:bg-gray-50"
                  autoComplete="off"
                />
                {lesson.exercises[currentEx].hint && !exResult && (
                  <p className="text-xs text-amber-500 mt-2">💡 {lesson.exercises[currentEx].hint}</p>
                )}
                {!exResult && (
                  <button onClick={handleSubmit} disabled={!userAnswer.trim()}
                    className="w-full mt-3 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl disabled:opacity-40">
                    确认
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Result */}
          {exResult !== null && (
            <div className={`p-4 rounded-xl animate-[bounce-in_0.4s_ease-out] ${exResult ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {exResult ? <Check size={18} className="text-green-500" /> : <X size={18} className="text-red-500" />}
                    <span className={`font-semibold ${exResult ? 'text-green-600' : 'text-red-500'}`}>
                      {exResult ? '正确!' : `答案: ${lesson.exercises[currentEx].answer}`}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">{lesson.exercises[currentEx].explanation}</p>
                </div>
                <button
                  onClick={handleNextEx}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm shrink-0"
                >
                  {currentEx < lesson.exercises.length - 1 ? '下一题' : '完成'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
