import { useState } from 'react';
import { useTTS, speakSlow } from '../hooks/useTTS';
import TappableText from '../components/TappableText';
import { getAllStories, downloadStoryAsHTML, downloadAllStoriesAsBook, type Story } from '../data/stories';
import { illustratedReadings, type IllustratedReading } from '../data/illustrated';
import { phrasebook } from '../data/phrasebook';
import { Download, Volume2, ChevronRight, ArrowLeft } from 'lucide-react';

export default function ScriptsPage() {
  const { speak } = useTTS();
  const [selected, setSelected] = useState<Story | null>(null);
  const [illusReading, setIllusReading] = useState<IllustratedReading | null>(null);
  const [phraseCat, setPhraseCat] = useState<typeof phrasebook[0] | null>(null);

  const stories = getAllStories();

  const openIllustrated = (r: IllustratedReading) => setIllusReading(r);

  // Illustrated reading view
  if (illusReading) { return <IllustratedView reading={illusReading} onBack={() => setIllusReading(null)} speak={speak} />; }
  // Phrasebook view
  if (phraseCat) { return <PhraseView cat={phraseCat} onBack={() => setPhraseCat(null)} speak={speak} />; }

  // Story list
  if (!selected) {
    const storyItems = stories.filter(s => s.type === 'story');
    const scriptItems = stories.filter(s => s.type === 'script');

    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">阅读 📚</h1>

        {/* Download all button */}
        <button
          onClick={downloadAllStoriesAsBook}
          className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Download size={20} className="text-indigo-500" />
            <div className="text-left">
              <div className="font-semibold text-sm text-indigo-700">下载全部文章</div>
              <div className="text-xs text-indigo-400">HTML格式 · 手机直接打开阅读</div>
            </div>
          </div>
        </button>

        {/* Stories */}
        <Section title="法语故事" icon="📖" items={storyItems} onSelect={setSelected} />

        {/* Scripts */}
        <Section title="电影台词" icon="🎬" items={scriptItems} onSelect={setSelected} />

        {/* Illustrated stories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-50 flex items-center gap-2">
            <span>🎨</span><span className="font-semibold text-sm">绘本阅读</span><span className="text-xs text-gray-400">{illustratedReadings.length}篇</span>
          </div>
          {illustratedReadings.map(r => (
            <button key={r.id} onClick={() => openIllustrated(r)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
              <span className="text-2xl">{r.emoji}</span>
              <div className="flex-1 min-w-0"><div className="font-medium text-sm">{r.title}</div><div className="text-xs text-gray-400">{r.titleZh} · {r.author} · {r.level}</div></div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Phrasebook */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-50 flex items-center gap-2">
            <span>💬</span><span className="font-semibold text-sm">情景句库</span><span className="text-xs text-gray-400">{phrasebook.reduce((s,c) => s + c.sentences.length, 0)}句</span>
          </div>
          {phrasebook.map(cat => (
            <button key={cat.name} onClick={() => setPhraseCat(cat)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
              <span className="text-xl">{cat.emoji}</span>
              <div className="flex-1 min-w-0"><div className="font-medium text-sm">{cat.nameZh} · {cat.name}</div><div className="text-xs text-gray-400">{cat.sentences.length}句</div></div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Reading view
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-gray-400">
          <ArrowLeft size={16} /> 返回
        </button>
        <div className="flex gap-2">
          <button onClick={() => downloadStoryAsHTML(selected)} className="p-1.5 text-gray-400 hover:text-indigo-500">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center py-2">
        <div className="text-3xl mb-1">{selected.emoji}</div>
        <h2 className="font-bold text-lg">{selected.title}</h2>
        <p className="text-xs text-gray-400">{selected.titleZh} · {selected.level} · {selected.source || ''}</p>
      </div>

      {/* Reading content */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 leading-loose">
        {selected.paragraphs.map((p, i) => (
          <div key={i} className="mb-6 last:mb-0">
            {/* Speaker */}
            {p.speaker && (
              <span className="inline-block px-2 py-0.5 bg-red-50 text-red-500 rounded text-xs font-medium mb-2">
                🎭 {p.speaker}
              </span>
            )}

            {/* French text with tap-to-lookup */}
            <p className="text-lg mb-2 leading-relaxed">
              <TappableText text={p.french} onSpeak={(w) => speak(w, { rate: 0.6 })} />
            </p>

            {/* Chinese translation */}
            <p className="text-sm text-gray-400 leading-relaxed mb-2">{p.chinese}</p>

            {/* Vocabulary hints */}
            {p.vocab && (
              <div className="flex flex-wrap gap-1.5">
                {p.vocab.map((v, k) => (
                  <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
                    {v.word} = {v.meaning}
                  </span>
                ))}
              </div>
            )}

            {/* Listen buttons */}
            <div className="flex gap-2 mt-2">
              <button onClick={() => speak(p.french, { rate: 0.8 })} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-500 rounded-lg text-xs">
                <Volume2 size={12} /> 常速
              </button>
              <button onClick={() => speakSlow(p.french)} className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs">
                <Volume2 size={12} /> 慢速跟读
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 text-center">
        💡 点击文中任意单词查词 · 点书签保存到词库 · 存够单词去学习
      </div>
    </div>
  );
}

// Section component for story list
function Section({ title, icon, items, onSelect }: {
  title: string; icon: string; items: Story[]; onSelect: (s: Story) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-50 flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs text-gray-400">{items.length}篇</span>
      </div>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0"
        >
          <span className="text-2xl">{item.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{item.title}</div>
            <div className="text-xs text-gray-400">{item.titleZh} · {item.level}</div>
          </div>
          <ChevronRight size={14} className="text-gray-300" />
        </button>
      ))}
    </div>
  );
}

// Illustrated reading view component
function IllustratedView({ reading, onBack, speak }: {
  reading: any; onBack: () => void; speak: any;
}) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400"><ArrowLeft size={16} /> 返回</button>
      <div className="text-center"><div className="text-3xl mb-1">{reading.emoji}</div>
        <h2 className="font-bold text-lg">{reading.title}</h2>
        <p className="text-xs text-gray-400">{reading.titleZh} · {reading.author} · {reading.level}</p>
      </div>
      {reading.scenes.map((scene: any, i: number) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl text-center mb-3">{scene.illustration}</div>
          <p className="text-lg leading-relaxed mb-2">{scene.french}</p>
          <p className="text-sm text-gray-400 mb-2">{scene.chinese}</p>
          {scene.vocab && <div className="flex flex-wrap gap-1">{scene.vocab.map((v: any, k: number) => <span key={k} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">{v.word}={v.meaning}</span>)}</div>}
          <button onClick={() => speak(scene.french, { rate: 0.8 })} className="mt-2 flex items-center gap-1 text-xs text-blue-500"><Volume2 size={12} /> 听朗读</button>
        </div>
      ))}
    </div>
  );
}

// Phrasebook view component
function PhraseView({ cat, onBack, speak }: { cat: any; onBack: () => void; speak: any }) {
  return (
    <div className="space-y-3">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400"><ArrowLeft size={16} /> 返回</button>
      <div className="flex items-center gap-2"><span className="text-2xl">{cat.emoji}</span><h2 className="font-bold text-lg">{cat.nameZh} · {cat.name}</h2></div>
      {cat.sentences.map((s: any, i: number) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex-1 mb-2"><p className="text-base leading-relaxed">{s.french}</p><p className="text-sm text-gray-400 mt-1">{s.chinese}</p></div>
          <div className="flex gap-1">
            <button onClick={() => speak(s.french, { rate: 0.8 })} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-500 rounded text-xs"><Volume2 size={12} /> 常速</button>
            <button onClick={() => speakSlow(s.french)} className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded text-xs"><Volume2 size={12} /> 慢速</button>
          </div>
        </div>
      ))}
    </div>
  );
}
