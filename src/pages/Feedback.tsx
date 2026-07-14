import { useState, useEffect } from 'react';
import { Clock, Mail, Copy } from 'lucide-react';

export default function Feedback() {
  const [text, setText] = useState('');

  const EMAIL = 'caroline00428@gmail.com';
  const subject = 'FrenchFlow 意见反馈';

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">提意见 & 联系开发者 💬</h1>
      <p className="text-sm text-gray-500">任何想法、Bug反馈、功能建议都欢迎！直接发邮件给我。</p>

      {/* Email card — main CTA */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <Mail size={20} className="text-blue-500" />
          <span className="font-semibold text-blue-700">发邮件给开发者</span>
        </div>

        {/* Email copy */}
        <div className="flex items-center justify-between p-3 bg-white rounded-xl mb-4">
          <span className="text-sm font-bold text-gray-700">{EMAIL}</span>
          <button
            onClick={() => { navigator.clipboard.writeText(EMAIL); alert('邮箱已复制！'); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold"
          >
            <Copy size={12} /> 复制邮箱
          </button>
        </div>

        {/* Text input */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="写下你的意见或建议..."
          className="w-full p-3 rounded-xl border border-blue-200 text-sm min-h-[100px] outline-none focus:border-blue-400 resize-none bg-white"
        />
        <div className="flex gap-2 mt-3">
          {/* Simple mailto without body — won't crash */}
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white font-bold rounded-xl text-sm hover:bg-blue-600"
          >
            <Mail size={16} /> 打开邮箱
          </a>
          <button
            onClick={() => { navigator.clipboard.writeText(text); alert('内容已复制！粘贴到邮件中即可'); }}
            disabled={!text.trim()}
            className="px-4 py-3 bg-white text-gray-600 rounded-xl text-sm font-medium border border-gray-200 disabled:opacity-40"
          >
            <Copy size={16} /> 复制内容
          </button>
        </div>
        <p className="text-[10px] text-blue-400 mt-2">
          ① 复制邮箱 → ② 点「打开邮箱」→ ③ 粘贴邮箱和内容到邮件。
        </p>
      </div>

      {/* History */}
      <FeedbackHistory />
    </div>
  );
}

function FeedbackHistory() {
  const [items, setItems] = useState<any[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('ff_feedback') || '[]')); } catch {}
  }, []);

  if (items.length === 0) return null;

  return (
    <div>
      <button onClick={() => setShow(!show)} className="flex items-center gap-2 text-sm text-gray-500">
        <Clock size={14} /> {show ? '收起' : `本地历史 (${items.length}条)`}
      </button>
      {show && (
        <div className="mt-2 space-y-2">
          {items.map((fb: any, i: number) => (
            <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <span className="text-[10px] text-gray-400">{new Date(fb.date).toLocaleString('zh-CN')}</span>
              <p className="text-sm mt-1">{fb.text}</p>
            </div>
          ))}
          <button onClick={() => { localStorage.removeItem('ff_feedback'); setItems([]); }} className="text-xs text-red-400 underline">清空</button>
        </div>
      )}
    </div>
  );
}
