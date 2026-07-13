import { useState } from 'react';
import { useTTS } from '../hooks/useTTS';
import { getTodayLesson, getLessonByDay } from '../data/dailySound';
import { Volume2 } from 'lucide-react';

export default function DailySoundPage() {
  const { speak } = useTTS();
  const [lesson, setLesson] = useState(getTodayLesson());
  const [step, setStep] = useState<'intro' | 'listen' | 'compare' | 'sentences'>('intro');
  const [currentWord, setCurrentWord] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set(
    JSON.parse(localStorage.getItem('ff_sound_completed') || '[]')
  ));

  const markComplete = () => {
    const next = new Set(completed);
    next.add(lesson.day);
    setCompleted(next);
    localStorage.setItem('ff_sound_completed', JSON.stringify([...next]));
  };

  const selectDay = (day: number) => {
    const l = getLessonByDay(day);
    if (l) { setLesson(l); setStep('intro'); setCurrentWord(0); }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">每日一音 🎯</h1>
          <p className="text-xs text-gray-400">Day {lesson.day}/30 · {completed.has(lesson.day) ? '✅ 已完成' : '今日任务'}</p>
        </div>
      </div>

      {/* Day selector */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {Array.from({length: 30}, (_, i) => i + 1).map(d => (
          <button key={d} onClick={() => selectDay(d)}
            className={`shrink-0 w-8 h-8 rounded-full text-[10px] font-bold ${
              d === lesson.day ? 'bg-[var(--color-primary)] text-white' :
              completed.has(d) ? 'bg-green-100 text-green-600' :
              'bg-gray-100 text-gray-400'
            }`}>
            {completed.has(d) ? '✓' : d}
          </button>
        ))}
      </div>

      {/* Lesson content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Sound header */}
        <div className="p-5 text-center bg-gradient-to-b from-[var(--color-primary)]/5 to-white">
          <div className="w-20 h-20 mx-auto rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-3xl mb-3">
            {lesson.ipa || lesson.focusWord.charAt(0)}
          </div>
          <h2 className="text-xl font-bold">{lesson.sound}</h2>
          <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
          <button onClick={() => speak(lesson.focusWord, { rate: 0.6 })} className="mt-3 inline-flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-500 rounded-full text-sm">
            <Volume2 size={14} /> 听核心词: {lesson.focusWord}
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-gray-100">
          {(['intro', 'listen', 'compare', 'sentences'] as const).map(s => (
            <button key={s} onClick={() => { setStep(s); setCurrentWord(0); }}
              className={`flex-1 py-2.5 text-xs font-medium ${step === s ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]' : 'text-gray-400'}`}>
              {s === 'intro' ? '学' : s === 'listen' ? '听' : s === 'compare' ? '比' : '句'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {step === 'intro' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">今天只做一件事：掌握 <strong>{lesson.sound}</strong> 这个音</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {lesson.words.slice(0, 8).map((w, i) => (
                  <button key={i} onClick={() => { setCurrentWord(i); speak(w, { rate: 0.6 }); }}
                    className={`px-3 py-1.5 rounded-full text-sm ${currentWord === i ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {w}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center">👆 每个都点一下，反复听。不用背，只感受这个音。</p>
            </div>
          )}

          {step === 'listen' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">逐个听，跟读，录下自己的声音对比</p>
              {lesson.words.map((w, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-sm">{w}</span>
                  <button onClick={() => speak(w, { rate: 0.6 })} className="p-2 bg-blue-50 text-blue-500 rounded-full">
                    <Volume2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {step === 'compare' && lesson.compare && (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-amber-700">昨日音: {lesson.compare.sound} {lesson.compare.ipa}</p>
                <p className="text-xs text-amber-500 mt-1">vs 今日音: {lesson.sound} {lesson.ipa}</p>
              </div>
              {lesson.compare.pairs.map((pair, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <button onClick={() => speak(pair.a.split(' ')[0], { rate: 0.6 })} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-bold">A</button>
                    <div>
                      <p className="text-sm font-semibold">{pair.a}</p>
                    </div>
                  </div>
                  <span className="text-gray-300 text-lg">↔</span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold">{pair.b}</p>
                    </div>
                    <button onClick={() => speak(pair.b.split(' ')[0], { rate: 0.6 })} className="px-4 py-2 bg-blue-50 text-blue-500 rounded-lg text-sm font-bold">B</button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 text-center">👆 反复点A和B，直到你能听出区别为止。这是最关键的一步。</p>
            </div>
          )}

          {step === 'compare' && !lesson.compare && (
            <div className="text-center py-8 text-gray-400 text-sm">本课没有对比音（第一天或复习课）</div>
          )}

          {step === 'sentences' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">完整句子朗读。今天学的音在句子里怎么发。</p>
              {lesson.sentences.map((s, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <p className="text-base flex-1">{s}</p>
                    <button onClick={() => speak(s, { rate: 0.75 })} className="p-2 bg-blue-50 text-blue-500 rounded-full ml-2">
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={markComplete}
        className={`w-full py-4 rounded-2xl font-bold text-sm ${completed.has(lesson.day) ? 'bg-green-100 text-green-600' : 'bg-[var(--color-primary)] text-white'}`}
        disabled={completed.has(lesson.day)}
      >
        {completed.has(lesson.day) ? '✅ 本课已完成' : '✓ 标记完成 · 明天继续下一个音'}
      </button>

      {/* Explanation of the method */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4">
        <p className="text-xs text-purple-700">
          <strong>💡 为什么这样学？</strong><br/>
          传统方法：一天学10个词，每个发音都不同→容易混淆→没自信。<br/>
          这个方法：一天只学1个音，反复听、跟读、对比→耳朵和嘴同时记住→建立音感。<br/>
          30天后，法语所有核心音素你都能听出来、读出来。
        </p>
      </div>
    </div>
  );
}
