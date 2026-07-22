import { useState, useMemo } from 'react';
import { searchFAQ, faqDatabase, getFAQByTag } from '../data/faq';
import { Search, ChevronRight } from 'lucide-react';

const TAG_LABELS: Record<string, string> = {
  grammar: '语法', vocab: '词汇', pronunciation: '发音', culture: '文化', exam: '考试',
};

export default function FAQPage() {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const results = useMemo(() => {
    if (activeTag) return getFAQByTag(activeTag);
    if (query.trim()) return searchFAQ(query, 20);
    return faqDatabase;
  }, [query, activeTag]);

  const tags = ['grammar', 'vocab', 'pronunciation', 'culture', 'exam'];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">法语百问 📚</h1>
      <p className="text-sm text-gray-500">100+ 法语常见问题，零 AI，全部专家撰写</p>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveTag(null); }}
          placeholder="搜索问题... 如：虚拟式、passé composé..."
          className="w-full pl-9 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => { setActiveTag(null); setQuery(''); }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !activeTag && !query ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => { setActiveTag(tag); setQuery(''); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeTag === tag ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {TAG_LABELS[tag] || tag}
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">🔍</div>
          <p>未找到相关问题，试试其他关键词</p>
        </div>
      ) : (
        <div className="space-y-2">
          {results.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="w-full px-4 py-3.5 text-left flex items-start gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{entry.question}</div>
                  <div className="flex gap-1.5 mt-1.5">
                    {entry.tags.map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-purple-50 text-purple-500 rounded text-[10px] font-medium">
                        {TAG_LABELS[t] || t}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={16} className={`text-gray-300 mt-1 transition-transform shrink-0 ${expandedId === entry.id ? 'rotate-90' : ''}`} />
              </button>
              {expandedId === entry.id && (
                <div className="px-4 pb-4 animate-[bounce-in_0.2s_ease-out]">
                  <div className="border-t border-gray-50 pt-3" />
                  <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
                    {entry.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
