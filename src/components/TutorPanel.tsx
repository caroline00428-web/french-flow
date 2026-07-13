import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { askTutor, type TutorContext } from '../services/gemini';
import { Send, User, X, AlertCircle } from 'lucide-react';

// Quick questions based on page context
const QUICK_QUESTIONS: Record<string, string[]> = {
  default: [
    '怎么用法语自我介绍？',
    '"Bonjour" 和 "Salut" 有什么区别？',
    '给我讲一个简单的法语小故事',
    '今天推荐我学什么？',
  ],
  pronunciation: ['法语鼻音怎么发？', '法语R音怎么练？', 'é和è发音区别？'],
  vocabulary: ['怎么区分le和la？', '帮我用这个词造句', '记单词有什么好方法？'],
  grammar: ['être和avoir怎么记？', '这个语法能用更简单的话解释吗？'],
  story: ['对话里这个词我不懂', '这句话在什么场景用？'],
};

function getQuickQuestions(pathname: string): string[] {
  if (pathname.includes('pronunciation')) return QUICK_QUESTIONS.pronunciation;
  if (pathname.includes('vocabulary')) return QUICK_QUESTIONS.vocabulary;
  if (pathname.includes('grammar')) return QUICK_QUESTIONS.grammar;
  if (pathname.includes('story')) return QUICK_QUESTIONS.story;
  return QUICK_QUESTIONS.default;
}

function getPageName(pathname: string): string {
  if (pathname.includes('vocabulary')) return '词汇学习';
  if (pathname.includes('pronunciation')) return '发音训练';
  if (pathname.includes('grammar')) return '语法学习';
  if (pathname.includes('listening')) return '听力理解';
  if (pathname.includes('dictation')) return '听写练习';
  if (pathname.includes('story')) return '情景对话';
  if (pathname.includes('videos')) return '视频学习';
  if (pathname.includes('learn')) return '课程列表';
  return '主页';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// Simple expand/minimize icons inline
function MinIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function MaxIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>; }

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TutorPanel({ isOpen, onClose }: Props) {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pageName = getPageName(location.pathname);
  const quickQuestions = getQuickQuestions(location.pathname);

  const context: TutorContext = { currentPage: pageName };

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setInput('');
    }
  }, [isOpen]);

  // Scroll to bottom
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

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await askTutor(question, history, context);
      const assistantMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      if (err.message === 'RATE_LIMIT') setError('请求太快，稍等一下再问');
      else setError(`出错了: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-50 lg:hidden" onClick={onClose} />

      {/* Panel */}
      <div className={`fixed z-50 bg-white shadow-2xl flex flex-col transition-all duration-300 ${
        isExpanded
          ? 'inset-4 rounded-2xl'
          : 'inset-x-0 bottom-0 rounded-t-2xl h-[55vh] lg:inset-y-0 lg:left-auto lg:right-0 lg:w-96 lg:rounded-none lg:rounded-l-2xl lg:h-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐱</span>
            <div>
              <span className="font-semibold text-sm">Professeur Léo</span>
              <p className="text-[10px] text-[var(--color-text-secondary)]">{pageName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              {isExpanded ? <MinIcon /> : <MaxIcon />}
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
          {messages.length === 0 && (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">🐱</div>
              <p className="text-sm text-[var(--color-text-secondary)]">Bonjour! 有不懂的随时问我～</p>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                msg.role === 'assistant' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                {msg.role === 'assistant' ? '🐱' : <User size={12} className="text-blue-500" />}
              </div>
              <div className={`max-w-[80%] p-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-sm'
                  : 'bg-gray-50 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs">🐱</div>
              <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-red-50 p-2 rounded-lg">
              <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Quick questions */}
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-1.5 px-3 pb-2 shrink-0">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full text-[11px] hover:bg-purple-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 p-3 border-t border-gray-100 shrink-0">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="问任何法语问题..."
            disabled={isLoading}
            className="flex-1 p-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400 disabled:bg-gray-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="px-3 py-2.5 bg-purple-500 text-white rounded-xl font-bold disabled:opacity-40 hover:bg-purple-600"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
