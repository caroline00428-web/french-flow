import { useCallback, useState } from 'react';

// ============================================================
// TTS with French voice selection for natural pronunciation
// ============================================================

interface TTSState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string | null;
  error: string | null;
}

// Get best available French voice
function getBestFrenchVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Priority order for natural French voices
  const preferred = [
    'Google français',        // Chrome — most natural
    'French France',          // Chrome alt
    'Thomas',                 // macOS — very natural
    'Amélie',                 // macOS — female voice
    'Microsoft Hortense',     // Windows — French female
    'Microsoft Paul',         // Windows — French male
  ];

  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name) && v.lang.startsWith('fr'));
    if (v) return v;
  }

  // Any fr-FR voice as fallback
  const fr = voices.find(v => v.lang.startsWith('fr-FR')) || voices.find(v => v.lang.startsWith('fr'));
  return fr || null;
}

// Slow, clear speech — breaks sentences into phrases
export function speakSlow(text: string): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  // Split into phrases
  const phrases = text.split(/([,.;:!?])/).reduce((acc: string[], part: string) => {
    if (['.', ',', ';', ':', '!', '?'].includes(part.trim()) && acc.length > 0) {
      acc[acc.length - 1] += part;
    } else if (part.trim()) {
      acc.push(part.trim());
    }
    return acc;
  }, []);

  let idx = 0;
  const speakNext = () => {
    if (idx >= phrases.length) return;
    const u = new SpeechSynthesisUtterance(phrases[idx]);
    u.lang = 'fr-FR'; u.rate = 0.55; u.pitch = 1.0;
    const saved = getSavedVoiceName();
    if (saved) { const v = window.speechSynthesis.getVoices().find(vo => vo.name === saved); if (v) u.voice = v; }
    if (!u.voice) {
      // Fallback: pick best French voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = ['Google français', 'Thomas', 'Amélie', 'Microsoft Hortense'];
      for (const name of preferred) {
        const v = voices.find(vo => vo.name.includes(name) && vo.lang.startsWith('fr'));
        if (v) { u.voice = v; break; }
      }
      if (!u.voice) { const v = voices.find(vo => vo.lang.startsWith('fr')); if (v) u.voice = v; }
    }
    u.onend = () => { idx++; setTimeout(speakNext, 250); };
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
}

export function useTTS() {
  const [state, setState] = useState<TTSState>({
    isSpeaking: false, isPaused: false, currentText: null, error: null,
  });

  const speak = useCallback((text: string, options?: { rate?: number; lang?: string; onEnd?: () => void }) => {
    if (!('speechSynthesis' in window)) {
      setState(s => ({ ...s, error: '浏览器不支持语音合成' }));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'fr-FR';
    utterance.rate = options?.rate || 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Ensure voices are loaded (on some browsers getVoices() is empty on first call)
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // Force a reload — on some browsers this triggers onvoiceschanged
      const dummy = new SpeechSynthesisUtterance('');
      dummy.volume = 0;
      window.speechSynthesis.speak(dummy);
      voices = window.speechSynthesis.getVoices();
    }

    // Try to use saved/best French voice
    if (voices.length > 0) {
      const savedVoice = getSavedVoiceName();
      if (savedVoice) {
        const voice = voices.find(v => v.name === savedVoice);
        if (voice) utterance.voice = voice;
      }
      if (!utterance.voice) {
        const best = getBestFrenchVoice();
        if (best) utterance.voice = best;
      }
    }

    let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

    utterance.onstart = () => {
      setState({ isSpeaking: true, isPaused: false, currentText: text, error: null });
      // Chrome bug: speech stops after ~15s. Keep-alive prevents this.
      keepAliveInterval = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 8000);
    };

    utterance.onend = () => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      setState({ isSpeaking: false, isPaused: false, currentText: null, error: null });
      options?.onEnd?.();
    };

    utterance.onerror = (event) => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      // 'canceled' is normal when we call cancel() ourselves
      if (event.error !== 'canceled') {
        console.warn('FrenchFlow TTS error:', event.error);
        setState(s => ({ ...s, isSpeaking: false, error: `语音播放失败: ${event.error}` }));
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
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
  // Trigger voice loading — getVoices() is async on most browsers
  const voices = window.speechSynthesis.getVoices();
  // If already loaded on this browser, we're done
  if (voices.length > 0) {
    console.log('FrenchFlow TTS: voices loaded', voices.filter(v => v.lang.startsWith('fr')).length, 'French voices');
    return;
  }
  // Otherwise wait for onvoiceschanged
  window.speechSynthesis.onvoiceschanged = () => {
    const v = window.speechSynthesis.getVoices();
    console.log('FrenchFlow TTS: voices loaded (async)', v.filter(vo => vo.lang.startsWith('fr')).length, 'French voices');
  };
  // Also force-load with a dummy utterance (workaround for some browsers)
  const dummy = new SpeechSynthesisUtterance('');
  dummy.volume = 0;
  dummy.rate = 2;
  window.speechSynthesis.speak(dummy);
}
