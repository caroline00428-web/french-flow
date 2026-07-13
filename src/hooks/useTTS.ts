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
      setState(s => ({ ...s, error: '浏览器不支持' }));
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'fr-FR';
    utterance.rate = options?.rate || 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use saved/best French voice
    const savedVoice = getSavedVoiceName();
    if (savedVoice) {
      const voice = window.speechSynthesis.getVoices().find(v => v.name === savedVoice);
      if (voice) utterance.voice = voice;
    }
    if (!utterance.voice) {
      const best = getBestFrenchVoice();
      if (best) utterance.voice = best;
    }

    let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

    utterance.onstart = () => {
      setState({ isSpeaking: true, isPaused: false, currentText: text, error: null });
      keepAliveInterval = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 5000);
    };

    utterance.onend = () => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      setState({ isSpeaking: false, isPaused: false, currentText: null, error: null });
      options?.onEnd?.();
    };

    utterance.onerror = (event) => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      if (event.error !== 'canceled') {
        setState(s => ({ ...s, isSpeaking: false, error: `语音失败: ${event.error}` }));
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
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}
