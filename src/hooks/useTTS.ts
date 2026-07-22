import { useCallback, useState, useRef } from 'react';

// ============================================================
// TTS with French voice selection for natural pronunciation
// ============================================================

interface TTSState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string | null;
  error: string | null;
}

// --- Cached voice lookup (refreshed via initVoices) ---
let cachedFrenchVoice: SpeechSynthesisVoice | null = null;
let voiceCacheTime = 0;

function getCachedFrenchVoice(): SpeechSynthesisVoice | null {
  // Refresh cache every 30 seconds (voices can change if user changes system settings)
  if (cachedFrenchVoice && Date.now() - voiceCacheTime < 30000) return cachedFrenchVoice;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const preferred = [
    'Google français', 'French France',       // Chrome
    'Thomas', 'Amélie',                        // macOS
    'Microsoft Hortense', 'Microsoft Paul',    // Windows
  ];

  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name) && v.lang.startsWith('fr'));
    if (v) { cachedFrenchVoice = v; voiceCacheTime = Date.now(); return v; }
  }

  const fr = voices.find(v => v.lang.startsWith('fr-FR')) || voices.find(v => v.lang.startsWith('fr'));
  if (fr) { cachedFrenchVoice = fr; voiceCacheTime = Date.now(); }
  return cachedFrenchVoice;
}

// Slow, clear speech — breaks sentences into phrases
export function speakSlow(text: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const phrases = text.split(/([,.;:!?])/).reduce((acc: string[], part: string) => {
    if (['.', ',', ';', ':', '!', '?'].includes(part.trim()) && acc.length > 0) {
      acc[acc.length - 1] += part;
    } else if (part.trim()) {
      acc.push(part.trim());
    }
    return acc;
  }, []);

  // Lookup voice ONCE for the entire chain
  const voice = getCachedFrenchVoice();
  const saved = getSavedVoiceName();
  const savedVoice = saved ? window.speechSynthesis.getVoices().find(v => v.name === saved) : null;

  let idx = 0;
  const speakNext = () => {
    if (idx >= phrases.length) return;
    const u = new SpeechSynthesisUtterance(phrases[idx]);
    u.lang = 'fr-FR'; u.rate = 0.55; u.pitch = 1.0;
    u.voice = savedVoice || voice || u.voice;
    u.onend = () => { idx++; setTimeout(speakNext, 150); }; // 250→150ms pause
    window.speechSynthesis.speak(u);
  };
  speakNext();
}

// Get all French voices
export function getFrenchVoices(): SpeechSynthesisVoice[] {
  return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('fr'));
}

// Load saved voice preference
export function getSavedVoiceName(): string | null {
  return localStorage.getItem('ff_voice');
}

export function saveVoiceName(name: string): void {
  localStorage.setItem('ff_voice', name);
  cachedFrenchVoice = null; // invalidate cache so new voice is picked up
}

export function useTTS() {
  const [state, setState] = useState<TTSState>({
    isSpeaking: false, isPaused: false, currentText: null, error: null,
  });
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speak = useCallback((text: string, options?: { rate?: number; lang?: string; onEnd?: () => void }) => {
    if (!('speechSynthesis' in window)) {
      setState(s => ({ ...s, error: '浏览器不支持语音合成' }));
      return;
    }

    // Only cancel if something is actually speaking (cancel() can be slow)
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'fr-FR';
    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Use cached voice (fast path)
    const voice = getCachedFrenchVoice();
    if (voice) {
      const saved = getSavedVoiceName();
      if (saved && saved !== voice.name) {
        const sv = window.speechSynthesis.getVoices().find(v => v.name === saved);
        utterance.voice = sv || voice;
      } else {
        utterance.voice = voice;
      }
    }

    utterance.onstart = () => {
      setState({ isSpeaking: true, isPaused: false, currentText: text, error: null });
      // Chrome bug: speech stops after ~15s. Keep-alive prevents this.
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      keepAliveRef.current = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000); // 8s→10s, even less aggressive
    };

    utterance.onend = () => {
      if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
      setState({ isSpeaking: false, isPaused: false, currentText: null, error: null });
      options?.onEnd?.();
    };

    utterance.onerror = (event) => {
      if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.warn('FrenchFlow TTS error:', event.error);
        setState(s => ({ ...s, isSpeaking: false, error: `语音播放失败: ${event.error}` }));
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
    window.speechSynthesis.cancel();
    setState({ isSpeaking: false, isPaused: false, currentText: null, error: null });
  }, []);

  const pause = useCallback(() => { window.speechSynthesis.pause(); setState(s => ({ ...s, isPaused: true })); }, []);
  const resume = useCallback(() => { window.speechSynthesis.resume(); setState(s => ({ ...s, isPaused: false })); }, []);

  return { ...state, speak, cancel, pause, resume };
}

// Pre-load voices (call once on app start)
export function initVoices(): void {
  if (!('speechSynthesis' in window)) return;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    getCachedFrenchVoice(); // warm cache
    return;
  }

  // Async voice loading
  window.speechSynthesis.onvoiceschanged = () => {
    getCachedFrenchVoice(); // refresh cache when voices arrive
  };

  // Force-load with a silent dummy utterance (workaround for some browsers)
  const dummy = new SpeechSynthesisUtterance('');
  dummy.volume = 0;
  window.speechSynthesis.speak(dummy);
}
