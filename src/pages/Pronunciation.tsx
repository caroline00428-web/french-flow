import { useState, useRef, useCallback, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { XP_REWARDS } from '../store/db';
import { pronunciationExercises } from '../data/pronunciation';
import { Mic, Volume2, ArrowRight, RotateCcw, Check, SkipForward, AlertCircle, Keyboard, Play, RefreshCw, Ear } from 'lucide-react';
import { useTTS } from '../hooks/useTTS';
import { transcribeHybrid } from '../services/speechToText';

// Audio recorder — records real audio for self-listen feedback
function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    setError(null); setAudioUrl(null); chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(); setIsRecording(true);
      setTimeout(() => { if (mr.state === 'recording') { mr.stop(); setIsRecording(false); } }, 5000);
    } catch { setError('无法访问麦克风'); }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') { mediaRecorderRef.current.stop(); setIsRecording(false); }
  }, []);

  const clear = useCallback(() => { if (audioUrl) URL.revokeObjectURL(audioUrl); setAudioUrl(null); setError(null); }, [audioUrl]);
  return { isRecording, audioUrl, error, startRecording, stopRecording, clear };
}

// Speech recognition hook
function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startListening = useCallback((lang = 'fr-FR') => {
    setError(null);
    setTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('您的浏览器不支持语音识别。请使用 Chrome 浏览器，或使用下方键盘输入。');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.continuous = false;

      // Auto-stop after 5 seconds of no result
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          setError('录音超时，请再试一次或使用键盘输入');
          setIsListening(false);
        }
      }, 5000);

      recognition.onresult = (event: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const results: string[] = [];
        for (let i = 0; i < event.results.length; i++) {
          results.push(event.results[i][0].transcript);
        }
        setTranscript(results.join(' ').toLowerCase().trim());
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (event.error === 'no-speech') {
          setError('没有检测到语音，请重试或使用键盘输入');
        } else if (event.error === 'not-allowed') {
          setError('请允许麦克风权限后重试，或使用键盘输入');
        } else if (event.error === 'aborted') {
          // User cancelled, don't show error
        } else {
          setError(`识别失败，请使用键盘输入。(${event.error})`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch (e: any) {
      setError('无法启动录音，请使用键盘输入');
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);
  const reset = useCallback(() => {
    setTranscript('');
    setError(null);
    setIsListening(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (recognitionRef.current) try { recognitionRef.current.stop(); } catch {}
  }, []);

  return { isListening, transcript, error, startListening, stopListening, clearError, reset };
}

// Compare strings with fuzzy matching
function comparePronunciation(original: string, spoken: string): { score: number; differences: string[] } {
  const orig = original.toLowerCase().trim().replace(/[.,!?;:]/g, '');
  const spok = spoken.toLowerCase().trim().replace(/[.,!?;:]/g, '');

  if (!spok) return { score: 0, differences: ['No speech detected'] };

  const origWords = orig.split(/\s+/);
  const spokWords = spok.split(/\s+/);

  let matches = 0;
  const differences: string[] = [];

  for (const ow of origWords) {
    const cleanOrig = ow.replace(/[’']/g, "'");
    const found = spokWords.some(sw => {
      const cleanSpok = sw.replace(/[’']/g, "'");
      if (cleanOrig === cleanSpok) return true;
      if (cleanOrig.length > 3 && cleanSpok.includes(cleanOrig.slice(0, -1))) return true;
      if (cleanSpok.length > 3 && cleanOrig.includes(cleanSpok.slice(0, -1))) return true;
      return false;
    });
    if (found) matches++;
    else differences.push(ow);
  }

  const score = origWords.length > 0 ? Math.round((matches / origWords.length) * 100) : 0;
  return { score, differences };
}

export default function Pronunciation() {
  const addXP = useGameStore(s => s.addXP);
  const addGems = useGameStore(s => s.addGems);
  const { isListening, transcript, error, startListening, stopListening, clearError, reset } = useSpeechRecognition();
  const { isRecording, audioUrl, startRecording, stopRecording, clear: clearAudio } = useAudioRecorder();
  const { speak } = useTTS();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [result, setResult] = useState<{ score: number; differences: string[] } | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionScores, setSessionScores] = useState<number[]>([]);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [played, setPlayed] = useState(false);
  const [zhipuText, setZhipuText] = useState<string | null>(null);
  const [sttSource, setSttSource] = useState<'zhipu' | 'browser' | 'none'>('none');

  const current = pronunciationExercises[currentIndex];

  // Auto-speak when moving to new word
  useEffect(() => {
    if (current && !played) {
      const t = setTimeout(() => {
        speak(current.french, { rate: 0.8 });
        setPlayed(true);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [currentIndex, current, played, speak]);

  // Reset state when word changes
  useEffect(() => {
    setHasRecorded(false);
    setResult(null);
    setShowTextInput(false);
    setTextInput('');
    setPlayed(false);
    setZhipuText(null);
    setSttSource('none');
    clearError();
    clearAudio();
    reset();
  }, [currentIndex]);

  // Send recorded audio to Zhipu for accurate transcription
  useEffect(() => {
    if (!audioUrl) return;
    (async () => {
      try {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const result = await transcribeHybrid(blob, transcript);
        if (result.text) {
          setZhipuText(result.text);
          setSttSource(result.source);
          if (!transcript) {
            // If browser STT failed, use Zhipu result directly
            const comp = comparePronunciation(current.french, result.text);
            setResult(comp);
            setHasRecorded(true);
            setSessionScores(s => [...s, comp.score]);
            if (comp.score >= 60) addXP(XP_REWARDS.pronunciationGood);
            if (comp.score >= 90) addGems(1);
          }
        }
      } catch {}
    })();
  }, [audioUrl]);

  const handleRecord = () => {
    if (isListening) {
      stopListening();
    } else {
      setHasRecorded(false);
      setResult(null);
      clearError();
      setShowTextInput(false);
      startListening('fr-FR');
    }
  };

  // Process transcript
  useEffect(() => {
    if (transcript && !hasRecorded) {
      setHasRecorded(true);
      const comp = comparePronunciation(current.french, transcript);
      setResult(comp);
      setSessionScores(s => [...s, comp.score]);
      if (comp.score >= 60) addXP(XP_REWARDS.pronunciationGood);
      if (comp.score >= 90) addGems(1);
    }
  }, [transcript, hasRecorded, current, addXP, addGems]);

  // Text input submission (fallback)
  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    const comp = comparePronunciation(current.french, textInput);
    setResult(comp);
    setHasRecorded(true);
    setSessionScores(s => [...s, comp.score]);
    // Lower XP for text input
    if (comp.score >= 60) addXP(Math.floor(XP_REWARDS.pronunciationGood / 2));
    setShowTextInput(false);
  };

  const handleSkip = () => {
    setResult({ score: 0, differences: ['Skipped'] });
    setHasRecorded(true);
    setSessionScores(s => [...s, 0]);
  };

  const handleNext = () => {
    if (currentIndex < pronunciationExercises.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setSessionComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setHasRecorded(false);
    setResult(null);
    setSessionComplete(false);
    setSessionScores([]);
    setShowTextInput(false);
    setTextInput('');
    setPlayed(false);
  };

  if (sessionComplete) {
    const avgScore = sessionScores.length > 0
      ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)
      : 0;

    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">{avgScore >= 80 ? '🎉' : avgScore >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-xl font-bold">发音练习完成!</h2>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-primary)]">{avgScore}%</div>
            <div className="text-xs text-[var(--color-text-secondary)]">平均准确率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{sessionScores.filter(s => s >= 60).length}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">达标次数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{sessionScores.filter(s => s === 0).length}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">跳过</div>
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl"
        >
          <RotateCcw size={16} /> 再来一轮
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">发音训练</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">
            {currentIndex + 1} / {pronunciationExercises.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {current.focusSounds && current.focusSounds.map(s => (
            <span key={s} className="px-2 py-0.5 text-xs bg-purple-50 text-purple-600 rounded-full font-medium">
              {s}
            </span>
          ))}
          {/* SKIP BUTTON - always visible */}
          {!result && (
            <button
              onClick={handleSkip}
              className="px-3 py-1.5 text-xs bg-gray-100 text-gray-500 rounded-full font-medium hover:bg-gray-200 flex items-center gap-1"
            >
              <SkipForward size={12} /> 跳过
            </button>
          )}
        </div>
      </div>

      {/* Word card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-3xl font-bold mb-2 french-text">{current.french}</p>
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">{current.english}</p>

        <button
          onClick={() => speak(current.french, { rate: 0.8 })}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors text-sm"
        >
          <Volume2 size={16} />
          听标准发音
        </button>

        {current.tips && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl text-left">
            <p className="text-xs text-amber-700">💡 {current.tips}</p>
          </div>
        )}
      </div>

      {/* Record button + Skip */}
      {!result && (
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleRecord}
            disabled={showTextInput}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isListening
                ? 'bg-red-500 text-white recording-pulse'
                : 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25'
            }`}
          >
            {isListening ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Mic size={32} />
            )}
          </button>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {isListening ? '正在录音...请朗读法语...' : hasRecorded ? '已录音' : '点击录音，朗读上面的法语'}
          </p>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 p-3 rounded-xl max-w-sm">
              <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Text input fallback */}
          <div className="w-full max-w-sm">
            {!showTextInput ? (
              <button
                onClick={() => { setShowTextInput(true); stopListening(); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-100"
              >
                <Keyboard size={16} />
                麦克风有问题？用键盘输入
              </button>
            ) : (
              <div className="space-y-2 bg-blue-50 p-4 rounded-xl">
                <p className="text-xs text-blue-600 font-medium">输入你读出的法语发音：</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleTextSubmit()}
                    placeholder="输入你的发音..."
                    className="flex-1 p-2.5 rounded-lg border border-blue-200 text-sm focus:outline-none focus:border-blue-400"
                    autoFocus
                  />
                  <button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg disabled:opacity-40"
                  >
                    提交
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Self-listen mode: record your voice and play back */}
          <div className="w-full max-w-sm border-t border-gray-100 pt-3 mt-2">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2 text-center flex items-center justify-center gap-1">
              <Ear size={14} /> 自我聆听模式 — 录下你的声音，对比标准发音
            </p>
            {!audioUrl ? (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isRecording
                    ? 'bg-red-50 text-red-500 border border-red-200 recording-pulse'
                    : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isRecording ? (
                  <><div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> 录音中...点击停止</>
                ) : (
                  <><Play size={14} /> 录下我的发音</>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <audio src={audioUrl} controls className="w-full h-8" />
                <div className="flex gap-2">
                  <button
                    onClick={() => speak(current.french, { rate: 0.7 })}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-medium"
                  >
                    <Volume2 size={12} /> 听标准发音
                  </button>
                  <button
                    onClick={() => { clearAudio(); }}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs"
                  >
                    <RefreshCw size={12} /> 重新录制
                  </button>
                </div>
                <p className="text-[10px] text-[var(--color-text-secondary)] text-center">
                  👆 对比你的发音和标准发音，自己找差异
                </p>
              </div>
            )}
          </div>

          {/* Skip button at bottom too */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SkipForward size={16} />
            跳过此题
          </button>
        </div>
      )}

      {/* Transcript — browser STT */}
      {transcript && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-[slide-up_0.3s_ease-out]">
          <p className="text-xs text-[var(--color-text-secondary)] mb-1">浏览器识别:</p>
          <p className="text-lg font-medium">{transcript}</p>
        </div>
      )}

      {/* Transcript — Zhipu AI STT */}
      {zhipuText && zhipuText !== transcript && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 shadow-sm border border-purple-100 animate-[slide-up_0.3s_ease-out]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-purple-500 font-medium">🤖 AI 语音识别</span>
            <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">智谱</span>
          </div>
          <p className="text-lg font-medium text-purple-700">{zhipuText}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-xl animate-[bounce-in_0.4s_ease-out] ${
          result.score >= 80 ? 'bg-green-50' : result.score >= 50 ? 'bg-yellow-50' : result.score === 0 ? 'bg-gray-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">
              {result.score === 0 && result.differences[0] === 'Skipped'
                ? '⏭️ 已跳过'
                : `${result.score >= 80 ? '🎉' : result.score >= 50 ? '👍' : '💪'} 准确率: ${result.score}%`
              }
            </span>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm"
            >
              {currentIndex < pronunciationExercises.length - 1 ? (
                <>下一词 <ArrowRight size={16} /></>
              ) : (
                <>完成 <Check size={16} /></>
              )}
            </button>
          </div>
          {result.differences.length > 0 && result.differences[0] !== 'Skipped' && (
            <div className="text-sm">
              <span className="text-[var(--color-text-secondary)]">需改进: </span>
              {result.differences.map((d, i) => (
                <span key={i} className="inline-block px-2 py-0.5 bg-red-100 text-red-600 rounded mr-1 mb-1">
                  {d}
                </span>
              ))}
            </div>
          )}
          {result.score === 0 && result.differences[0] === 'Skipped' && (
            <p className="text-sm text-gray-400">可以重播发音，多听几遍再试</p>
          )}
        </div>
      )}
    </div>
  );
}
