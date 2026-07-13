import { useState } from 'react';
import { useTTS } from '../hooks/useTTS';
import { frenchSoundSystem, letterSoundMap, getSoundCount, type FrenchSound } from '../data/phonics';
import { Volume2, ChevronRight, ArrowLeft, BookOpen, Ear, Lightbulb, Target } from 'lucide-react';

export default function PhonicsPage() {
  const { speak } = useTTS();
  const [selectedSound, setSelectedSound] = useState<FrenchSound | null>(null);
  const [view, setView] = useState<'sounds' | 'spelling'>('sounds');

  const counts = getSoundCount();

  if (selectedSound) {
    return <SoundDetail sound={selectedSound} onBack={() => setSelectedSound(null)} speak={speak} />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">法语发音系统 🗣️</h1>
      <p className="text-sm text-gray-500">拆解每个音素 · 建立发音自信 · 像英语一样敢读</p>

      {/* View toggle */}
      <div className="flex gap-2">
        <button onClick={() => setView('sounds')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${view === 'sounds' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-500'}`}>音素学习</button>
        <button onClick={() => setView('spelling')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${view === 'spelling' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-500'}`}>拼读规则</button>
      </div>

      {view === 'sounds' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-red-50 rounded-xl p-2"><div className="font-bold text-red-500">{counts.vowels}</div>口腔元音</div>
            <div className="bg-purple-50 rounded-xl p-2"><div className="font-bold text-purple-500">{counts.nasals}</div>鼻化元音</div>
            <div className="bg-blue-50 rounded-xl p-2"><div className="font-bold text-blue-500">{counts.consonants}</div>辅音</div>
          </div>

          {/* Key insight */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-2"><Lightbulb size={18} className="text-amber-500" /><span className="font-semibold text-sm text-amber-700">为什么你觉得法语发音难？</span></div>
            <p className="text-xs text-amber-600">法语有16个元音（中文6个）——其中4个是鼻化元音，气流从鼻子和嘴同时出来，中文完全没有。再加上法语R（小舌音），不系统学习当然会没自信。</p>
          </div>

          {/* Sounds by type */}
          {(['vowel', 'nasal', 'consonant'] as const).map(type => {
            const sounds = frenchSoundSystem.filter(s => s.type === type);
            const label = { vowel: '口腔元音', nasal: '鼻化元音', consonant: '辅音' }[type];
            const color = { vowel: 'border-red-200', nasal: 'border-purple-200', consonant: 'border-blue-200' }[type];
            return (
              <div key={type} className={`bg-white rounded-2xl shadow-sm border ${color} overflow-hidden`}>
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-50 flex items-center gap-2">
                  <span className="font-semibold text-sm">{label}</span>
                  <span className="text-xs text-gray-400">{sounds.length}个音</span>
                </div>
                {sounds.map(s => (
                  <button key={s.id} onClick={() => setSelectedSound(s)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
                    <button onClick={(e) => { e.stopPropagation(); speak(s.examples[0].word, { rate: 0.7 }); }} className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-sm">{s.ipa}</button>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{s.sound}</div>
                      <div className="text-xs text-gray-400 truncate">{s.spelling.slice(0,4).join(', ')} → {s.examples.slice(0,2).map(e => e.word).join(', ')}</div>
                    </div>
                    <ChevronRight size={14} className="text-gray-300" />
                  </button>
                ))}
              </div>
            );
          })}
        </>
      ) : (
        /* Spelling rules view */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-50">
            <span className="font-semibold text-sm">字母组合 → 发音速查表</span>
            <span className="text-xs text-gray-400 ml-2">记住这些，法语拼读就通了</span>
          </div>
          {letterSoundMap.map((rule, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-[var(--color-primary)] min-w-[60px]">{rule.letters}</span>
                <span className="text-xs text-gray-600">{rule.sound}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{rule.example}</span>
                <button onClick={() => speak(rule.example, { rate: 0.7 })} className="p-1 text-blue-400"><Volume2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sound detail view
function SoundDetail({ sound, onBack, speak }: { sound: FrenchSound; onBack: () => void; speak: any }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400"><ArrowLeft size={16} /> 返回</button>

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-2xl mb-3">{sound.ipa}</div>
        <h2 className="text-lg font-bold">{sound.sound}</h2>
        <p className="text-sm text-gray-400 mt-1">{sound.type === 'vowel' ? '口腔元音' : sound.type === 'nasal' ? '鼻化元音' : '辅音'}</p>
      </div>

      {/* How to make the sound */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
        <div className="flex items-center gap-2 mb-2"><Target size={16} className="text-amber-500" /><span className="font-semibold text-sm text-amber-700">怎么发这个音</span></div>
        <p className="text-sm text-amber-700 leading-relaxed">{sound.description}</p>
      </div>

      {/* Tip for Chinese speakers */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-2"><Lightbulb size={16} className="text-blue-500" /><span className="font-semibold text-sm text-blue-700">中文母语者提示</span></div>
        <p className="text-sm text-blue-700">{sound.tip}</p>
      </div>

      {/* Spelling patterns */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3"><BookOpen size={16} className="text-indigo-400" /><span className="font-semibold text-sm">拼写方式</span></div>
        <div className="flex flex-wrap gap-2">
          {sound.spelling.map(s => <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-mono">{s}</span>)}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3"><Volume2 size={16} className="text-green-500" /><span className="font-semibold text-sm">例词</span></div>
        {sound.examples.map((ex, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <div>
              <span className="font-semibold text-sm">{ex.word}</span>
              <span className="text-xs text-gray-400 ml-2 font-mono">{ex.ipa}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{ex.meaning}</span>
              <button onClick={() => speak(ex.word, { rate: 0.6 })} className="p-1.5 bg-blue-50 text-blue-400 rounded-full"><Volume2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Minimal pairs */}
      {sound.minimalPairs && sound.minimalPairs.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3"><Ear size={16} className="text-orange-400" /><span className="font-semibold text-sm">容易混淆的音 — 训练耳朵</span></div>
          {sound.minimalPairs.map((mp, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div>
                <span className="text-sm font-medium font-mono">{mp.wordA}</span>
                <span className="text-gray-300 mx-2">vs</span>
                <span className="text-sm font-medium font-mono">{mp.wordB}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => speak(mp.wordA.split(' ')[0], { rate: 0.6 })} className="p-1 text-xs text-blue-400">A</button>
                <button onClick={() => speak(mp.wordB.split(' ')[0], { rate: 0.6 })} className="p-1 text-xs text-red-400">B</button>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 mt-3">👆 反复听A和B的对比，训练耳朵分辨这两个音</p>
        </div>
      )}
    </div>
  );
}
