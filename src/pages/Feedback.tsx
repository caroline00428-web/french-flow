import { useState, useEffect } from 'react';
import { Send, Check, Clock } from 'lucide-react';

interface Feedback {
  id: string;
  text: string;
  date: string;
  page: string;
}

export default function Feedback() {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<Feedback[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ff_feedback') || '[]');
      setHistory(saved);
    } catch {}
  }, []);

  const handleSubmit = () => {
    if (!text.trim()) return;
    const fb: Feedback = {
      id: Date.now().toString(),
      text: text.trim(),
      date: new Date().toISOString(),
      page: window.location.pathname,
    };
    const updated = [fb, ...history];
    localStorage.setItem('ff_feedback', JSON.stringify(updated));
    setHistory(updated);
    setText('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">提意见 💬</h1>
      <p className="text-sm text-gray-500">任何想法、Bug反馈、功能建议都可以留在这里。意见保存在本地，下次更新会查看。</p>

      {/* Input */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="写下你的意见或建议..."
          className="w-full p-3 rounded-xl border border-gray-200 text-sm min-h-[120px] outline-none focus:border-[var(--color-primary)] resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">{text.length} 字</span>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold ${
              sent ? 'bg-green-100 text-green-600' : 'bg-[var(--color-primary)] text-white disabled:opacity-40'
            }`}
          >
            {sent ? <><Check size={16} /> 已提交</> : <><Send size={16} /> 提交</>}
          </button>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={14} />
            {showHistory ? '收起历史' : `查看历史 (${history.length}条)`}
          </button>
          {showHistory && (
            <div className="mt-2 space-y-2">
              {history.map(fb => (
                <div key={fb.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-400">{new Date(fb.date).toLocaleString('zh-CN')}</span>
                    <span className="text-[10px] text-gray-300">{fb.page}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{fb.text}</p>
                </div>
              ))}
              <button
                onClick={() => { localStorage.removeItem('ff_feedback'); setHistory([]); }}
                className="text-xs text-red-400 underline"
              >清空历史</button>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
        <p className="text-xs text-blue-600">
          <strong>📬 如何让开发者看到你的意见？</strong><br/>
          目前意见保存在浏览器本地。后续版本会加入云端同步功能，届时所有意见会自动上传。<br/>
          也可以直接发邮件或提交 GitHub Issue（见设置页）。
        </p>
      </div>
    </div>
  );
}
