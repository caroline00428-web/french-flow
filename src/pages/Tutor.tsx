import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { askTutor, hasApiKey, type TutorContext } from '../services/gemini';
import { Send, User, Lightbulb, BookOpen, MessageCircle, AlertCircle, Key } from 'lucide-react';

// Quick question suggestions based on context
const QUICK_QUESTIONS: Record<string, string[]> = {
  default: [
    '怎么用法语自我介绍？',
    '"Bonjour" 和 "Salut" 有什么区别？',
    '法语最难发音的词有哪些？',
    '给我讲一个简单的法语小故事',
    '今天推荐我学什么？',
  ],
  pronunciation: [
    '法语鼻音怎么发？an, en, in, on 的区别',
    '法语 R 音到底怎么练？',
    'é 和 è 发音有什么不同？',
    '怎么判断一个词末尾的字母发不发音？',
    '帮我拆解 "enchanté" 的发音',
  ],
  vocabulary: [
    '有没有记法语单词的好方法？',
    '怎么区分 le 和 la？有什么规律？',
    '帮我用 "manger" 造几个实用句子',
    '法语里"很"怎么说？très 和 beaucoup 的区别',
    '给我10个最常用的法语动词',
  ],
  grammar: [
    'être 和 avoir 怎么记不容易混？',
    '法语动词变位为什么这么复杂？有什么规律？',
    '什么时候用 passé composé 什么时候用 imparfait？',
    'ne...pas 在口语里可以省略 ne 吗？',
    '法语形容词为什么要配合名词的阴阳性？',
  ],
  listening: [
    '法国人说话为什么那么快？怎么练听力？',
    '法语连读 (liaison) 的规则是什么？',
    '推荐一些适合初学者的法语播客或视频',
    '"Je suis" 和 "J\'ai" 听起来很像，怎么区分？',
  ],
};

function getQuickQuestions(pathname: string): string[] {
  if (pathname.includes('pronunciation')) return QUICK_QUESTIONS.pronunciation;
  if (pathname.includes('vocabulary')) return QUICK_QUESTIONS.vocabulary;
  if (pathname.includes('grammar')) return QUICK_QUESTIONS.grammar;
  if (pathname.includes('listening') || pathname.includes('dictation')) return QUICK_QUESTIONS.listening;
  return QUICK_QUESTIONS.default;
}

function getPageName(pathname: string): string {
  if (pathname === '/') return '主页';
  if (pathname.includes('vocabulary')) return '词汇学习';
  if (pathname.includes('pronunciation')) return '发音训练';
  if (pathname.includes('grammar')) return '语法学习';
  if (pathname.includes('listening')) return '听力理解';
  if (pathname.includes('dictation')) return '听写练习';
  if (pathname.includes('story')) return '情景对话';
  if (pathname.includes('learn')) return '课程列表';
  return '学习';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Tutor() {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(hasApiKey());
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions = getQuickQuestions(location.pathname);
  const pageName = getPageName(location.pathname);

  const context: TutorContext = {
    currentPage: pageName,
  };

  // Check API key
  useEffect(() => {
    setHasKey(hasApiKey());
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const question = (text || input).trim();
    if (!question || isLoading) return;

    setInput('');
    setError(null);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await askTutor(question, history, context);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      if (err.message === 'NO_API_KEY') {
        setError('请先在设置中配置 Gemini API Key（免费获取: makersuite.google.com）');
        setHasKey(false);
      } else if (err.message === 'API_KEY_INVALID') {
        setError('API Key 无效，请检查后在设置中重新配置');
      } else if (err.message === 'RATE_LIMIT') {
        setError('请求太频繁，请稍后再试（免费版每分钟15次）');
      } else {
        setError(`出错了: ${err.message}`);
      }
      // Remove the user message if we couldn't get a response
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // No API key — show setup
  if (!hasKey && messages.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">AI 法语家教 🤖</h1>
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 text-center space-y-4">
          <div className="text-6xl">🐱</div>
          <div>
            <h2 className="text-lg font-bold">认识 Professeur Léo</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              你的专属AI法语家教，随时解答疑问、纠正发音、讲解语法
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 text-left space-y-2">
            <div className="flex items-start gap-2">
              <MessageCircle size={16} className="text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">随时提问</p>
                <p className="text-xs text-[var(--color-text-secondary)]">学习中遇到任何问题，直接问AI家教</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">知无不言</p>
                <p className="text-xs text-[var(--color-text-secondary)]">语法、发音、文化、学习方法……什么都能问</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BookOpen size={16} className="text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">上下文感知</p>
                <p className="text-xs text-[var(--color-text-secondary)]">知道你正在学什么，回答更有针对性</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-left">
            <p className="text-xs text-amber-700">
              💡 <strong>完全免费：</strong>推荐使用智谱AI GLM-4-Flash（国内直连，无需VPN），30秒获取密钥
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/settings'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-colors"
          >
            <Key size={18} />
            去设置配置 API Key
          </button>
          <p className="text-xs text-[var(--color-text-secondary)]">
            免费密钥：<a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank" rel="noopener" className="text-blue-500 underline">open.bigmodel.cn</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold">AI 法语家教 🐱</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">Professeur Léo · 正在学习: {pageName}</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
          >
            清空对话
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">🐱</div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              Bonjour! 我是你的法语家教 Léo
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              有任何法语问题都可以问我！试试下面的问题：
            </p>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm ${
              msg.role === 'assistant' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              {msg.role === 'assistant' ? '🐱' : <User size={14} className="text-blue-500" />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white rounded-tr-sm'
                : 'bg-white border border-gray-100 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm">🐱</div>
            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 p-3 rounded-xl">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Quick questions */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 shrink-0">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-[var(--color-text-secondary)] hover:border-purple-300 hover:text-purple-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="问任何法语问题..."
          disabled={isLoading}
          className="flex-1 p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 disabled:bg-gray-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="px-4 py-3 bg-purple-500 text-white rounded-xl font-bold disabled:opacity-40 hover:bg-purple-600 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
