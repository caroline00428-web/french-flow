import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { ChevronRight, TrendingUp } from 'lucide-react';

interface Lesson {
  name: string;
  desc: string;
  to: string;
  category?: string;
}

interface CourseSection {
  title: string;
  subtitle: string;
  icon: string;
  lessons: Lesson[];
}

const courses: CourseSection[] = [
  {
    title: 'A0 入门基础',
    subtitle: '问候、数字、颜色、基础词汇',
    icon: '🌱',
    lessons: [
      { name: '基础问候', desc: 'Bonjour, Salut, Merci...', to: '/vocabulary?cat=greetings', category: 'greetings' },
      { name: '数字 1-20', desc: 'un, deux, trois...', to: '/vocabulary?cat=numbers', category: 'numbers' },
      { name: '颜色', desc: 'rouge, bleu, vert...', to: '/vocabulary?cat=colors', category: 'colors' },
      { name: '星期与月份', desc: 'lundi, mardi, janvier...', to: '/vocabulary?cat=time', category: 'time' },
      { name: '入门朗读', desc: '自我介绍·我的家庭', to: '/reading' },
    ],
  },
  {
    title: 'A1 日常交流',
    subtitle: '饮食、家庭、基础动词和对话',
    icon: '🌿',
    lessons: [
      { name: '食物与饮品', desc: 'pain, café, fromage...', to: '/vocabulary?cat=food', category: 'food' },
      { name: '人称代词', desc: 'je, tu, il, elle...', to: '/vocabulary?cat=pronouns', category: 'pronouns' },
      { name: '基础动词', desc: 'être, avoir, parler...', to: '/vocabulary?cat=verbs-basic', category: 'verbs-basic' },
      { name: '家庭与日常', desc: 'famille, ami, maison...', to: '/vocabulary?cat=family', category: 'family' },
      { name: '每日听力', desc: '听日常对话选意思', to: '/listening?cat=daily' },
      { name: '情景对话', desc: '咖啡馆·餐厅点餐', to: '/story' },
      { name: '日常朗读', desc: '我的一天·找工作', to: '/reading' },
    ],
  },
  {
    title: 'A1+ 出行工作',
    subtitle: '交通、方向、职场法语',
    icon: '🌳',
    lessons: [
      { name: '旅行交通', desc: 'gare, train, métro...', to: '/vocabulary?cat=travel', category: 'travel' },
      { name: '职场词汇', desc: 'bureau, entretien, CV...', to: '/vocabulary?cat=work', category: 'work' },
      { name: '发音训练', desc: '法语音标 + 鼻音练习', to: '/pronunciation' },
      { name: '听写练习', desc: '听单词写出法语', to: '/dictation' },
      { name: '旅行朗读', desc: '波尔多之旅·电话对话', to: '/reading' },
    ],
  },
  {
    title: '语法系统学习',
    subtitle: 'A0-A2 核心语法知识点',
    icon: '📝',
    lessons: [
      { name: '名词性别 le/la', desc: '法语名词的阴阳性', to: '/grammar?lesson=story-gender' },
      { name: '动词 Être', desc: 'to be 的变化形式', to: '/grammar?lesson=story-etre' },
      { name: '动词 Avoir', desc: 'to have 及常用表达', to: '/grammar?lesson=story-avoir' },
      { name: '现在时 -ER 动词', desc: '80%动词的变位规律', to: '/grammar?lesson=story-er-verbs' },
      { name: '否定 ne...pas', desc: '法语怎么说不', to: '/grammar?lesson=story-negation' },
      { name: '过去时', desc: 'Passé Composé 入门', to: '/grammar?lesson=story-past' },
    ],
  },
];

// Calculate estimated progress based on completed lessons
function getProgress(courseLessons: Lesson[], completedLessons: string[]): number {
  if (courseLessons.length === 0) return 0;
  const completed = courseLessons.filter(l => completedLessons.includes(l.to)).length;
  return Math.round((completed / courseLessons.length) * 100);
}

export default function Learn() {
  const navigate = useNavigate();
  const progress = useGameStore(s => s.progress);

  // Find last accessed page from completed lessons
  const lastCompleted = progress.completedLessons[progress.completedLessons.length - 1];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">学习课程</h1>

      {/* Resume / Progress summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg mb-1">✅</div>
          <div className="font-bold text-sm">{progress.completedLessons.length}</div>
          <div className="text-[10px] text-[var(--color-text-secondary)]">已完成</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg mb-1">📚</div>
          <div className="font-bold text-sm">{progress.totalWordsLearned}</div>
          <div className="text-[10px] text-[var(--color-text-secondary)]">已学词</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 text-center">
          <div className="text-lg mb-1">🔥</div>
          <div className="font-bold text-sm">{progress.currentStreak}天</div>
          <div className="text-[10px] text-[var(--color-text-secondary)]">连续</div>
        </div>
      </div>

      {/* Quick resume */}
      {lastCompleted && (
        <button
          onClick={() => navigate(lastCompleted)}
          className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white p-4 rounded-2xl shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={20} />
            <div className="text-left">
              <div className="font-bold text-sm">继续上次学习</div>
              <div className="text-xs opacity-80">点击接着学，不从头开始</div>
            </div>
          </div>
          <ChevronRight size={20} />
        </button>
      )}

      {/* Course sections with progress */}
      {courses.map((course, i) => {
        const pct = getProgress(course.lessons, progress.completedLessons);
        return (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{course.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{course.title}</h3>
                    <span className="text-xs text-[var(--color-text-secondary)]">{pct}%</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate">{course.subtitle}</p>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {course.lessons.map((lesson, j) => {
              const done = progress.completedLessons.includes(lesson.to);
              return (
                <button
                  key={j}
                  onClick={() => navigate(lesson.to)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${done ? 'text-green-500' : 'text-gray-300'}`}>
                      {done ? '✅' : '○'}
                    </span>
                    <div>
                      <div className={`font-medium text-sm ${done ? 'text-[var(--color-text-secondary)]' : ''}`}>
                        {lesson.name}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)]">{lesson.desc}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
