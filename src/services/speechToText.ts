// ============================================================
// Zhipu AI Speech-to-Text — accurate French recognition
// Uses your existing Zhipu API key, domestic direct connection
// ============================================================

function getApiKey(): string | null {
  return localStorage.getItem('frenchflow_api_key');
}

// Convert recorded audio blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function transcribeWithZhipu(audioBlob: Blob): Promise<{
  text: string;
  success: boolean;
  error?: string;
}> {
  const apiKey = getApiKey();
  if (!apiKey) return { text: '', success: false, error: '未配置API Key' };

  try {
    const base64 = await blobToBase64(audioBlob);

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'whisper-1',
        file: base64,
        language: 'fr',
        response_format: 'json',
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return { text: '', success: false, error: err.error?.message || `API错误: ${response.status}` };
    }

    const data = await response.json();
    return { text: data.text?.trim() || '', success: true };
  } catch (e: any) {
    return { text: '', success: false, error: e.message || '网络错误' };
  }
}

// Hybrid: try Zhipu first, fall back to browser speech recognition
export async function transcribeHybrid(
  audioBlob: Blob,
  browserTranscript?: string
): Promise<{ text: string; source: 'zhipu' | 'browser' | 'none' }> {
  // Try Zhipu first
  const result = await transcribeWithZhipu(audioBlob);
  if (result.success && result.text) {
    return { text: result.text.toLowerCase().trim(), source: 'zhipu' };
  }

  // Fall back to browser result
  if (browserTranscript) {
    return { text: browserTranscript.toLowerCase().trim(), source: 'browser' };
  }

  return { text: '', source: 'none' };
}
