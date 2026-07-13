import { useCallback, useRef, useState } from 'react';

// ============================================================
// Robust TTS hook — handles queue, prevents cutoff, supports replay
// ============================================================

interface TTSState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string | null;
  error: string | null;
}

export function useTTS() {
  const [state, setState] = useState<TTSState>({
    isSpeaking: false,
    isPaused: false,
    currentText: null,
    error: null,
  });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setState({ isSpeaking: false, isPaused: false, currentText: null, error: null });
  }, []);

  const speak = useCallback((text: string, options?: { rate?: number; lang?: string; onEnd?: () => void }) => {
    if (!('speechSynthesis' in window)) {
      setState(s => ({ ...s, error: '浏览器不支持语音合成' }));
      return;
    }

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'fr-FR';
    utterance.rate = options?.rate || 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Workaround for Chrome bug where speech stops after ~15s
    // We use a keep-alive interval
    let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

    utterance.onstart = () => {
      setState({ isSpeaking: true, isPaused: false, currentText: text, error: null });
      // Chrome timeout workaround: periodically pause/resume to keep alive
      keepAliveInterval = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 5000);
    };

    utterance.onend = () => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      utteranceRef.current = null;
      setState({ isSpeaking: false, isPaused: false, currentText: null, error: null });
      options?.onEnd?.();
    };

    utterance.onerror = (event) => {
      if (keepAliveInterval) clearInterval(keepAliveInterval);
      // 'canceled' is expected when we intentionally cancel
      if (event.error !== 'canceled') {
        setState(s => ({ ...s, isSpeaking: false, error: `语音播放失败: ${event.error}` }));
      }
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setState(s => ({ ...s, isPaused: true }));
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setState(s => ({ ...s, isPaused: false }));
  }, []);

  // Speak a list of texts sequentially
  const speakSequence = useCallback(async (
    texts: string[],
    options?: { rate?: number; lang?: string; delayBetween?: number }
  ) => {
    const delay = options?.delayBetween || 800;
    for (let i = 0; i < texts.length; i++) {
      await new Promise<void>((resolve) => {
        speak(texts[i], {
          ...options,
          onEnd: () => {
            setTimeout(resolve, delay);
          },
        });
      });
    }
  }, [speak]);

  return {
    ...state,
    speak,
    speakSequence,
    cancel,
    pause,
    resume,
  };
}

// ============================================================
// Speak a French word with proper pronunciation
// ============================================================
export function speakFrench(text: string, rate = 0.85): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    let keepAlive: ReturnType<typeof setInterval> | null = null;

    utterance.onstart = () => {
      keepAlive = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 5000);
    };

    utterance.onend = () => {
      if (keepAlive) clearInterval(keepAlive);
      resolve();
    };

    utterance.onerror = (e) => {
      if (keepAlive) clearInterval(keepAlive);
      if (e.error !== 'canceled') reject(new Error(e.error));
      else resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}
