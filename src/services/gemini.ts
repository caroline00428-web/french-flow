// ============================================================
// AI Tutor Service — 智谱AI GLM-4-Flash (国内免费直连) + Gemini 备用
// ============================================================

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Get API key from localStorage
function getApiKey(): string | null {
  try {
    return localStorage.getItem('frenchflow_api_key');
  } catch { return null; }
}

function getApiProvider(): 'zhipu' | 'gemini' {
  return (localStorage.getItem('frenchflow_api_provider') as 'zhipu' | 'gemini') || 'zhipu';
}

export function setApiKey(key: string, provider: 'zhipu' | 'gemini' = 'zhipu'): void {
  localStorage.setItem('frenchflow_api_key', key.trim());
  localStorage.setItem('frenchflow_api_provider', provider);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

export function getProvider(): 'zhipu' | 'gemini' {
  return getApiProvider();
}

export function clearApiKey(): void {
  localStorage.removeItem('frenchflow_api_key');
  localStorage.removeItem('frenchflow_api_provider');
}

// Build system prompt — optimized for short, fast replies
function buildSystemPrompt(context?: TutorContext): string {
  const base = `你是法国法语家教"Léo"🐱。回复规则：
- 用中文回答，3-5句话以内
- 直接给答案，不铺垫
- 法语例子配中文翻译
- 新手友好，用最简单的话解释`;

  if (context) {
    const ctxParts: string[] = [];
    if (context.currentPage) ctxParts.push(`学生正在"${context.currentPage}"页面`);
    if (context.currentWord) ctxParts.push(`正在查词:"${context.currentWord}"`);
    if (ctxParts.length > 0) return base + '\n' + ctxParts.join('；');
  }
  return base;
}

export interface TutorContext {
  currentPage?: string;
  currentWord?: string;
  currentLesson?: string;
  userLevel?: string;
}

// ============================================================
// 智谱AI (Zhipu) — 国内直连，免费
// ============================================================
async function askZhipu(
  question: string,
  history: ChatMessage[],
  context?: TutorContext
): Promise<string> {
  const apiKey = getApiKey()!;
  const messages: any[] = [
    { role: 'system', content: buildSystemPrompt(context) },
  ];

  // Add conversation history (last 10 messages to save tokens)
  const recentHistory = history.slice(-10);
  for (const msg of recentHistory) {
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: 'user', content: question });

  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'glm-4-flash',
      messages,
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error('API_KEY_INVALID');
    if (response.status === 429) throw new Error('RATE_LIMIT');
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('EMPTY_RESPONSE');
  return text;
}

// ============================================================
// Gemini — 备用（需VPN）
// ============================================================
async function askGemini(
  question: string,
  history: ChatMessage[],
  context?: TutorContext
): Promise<string> {
  const apiKey = getApiKey()!;
  const contents: any[] = [];

  contents.push({ role: 'user', parts: [{ text: buildSystemPrompt(context) }] });
  contents.push({ role: 'model', parts: [{ text: 'D\'accord! Je suis Professeur Léo. 🐱🇫🇷' }] });

  for (const msg of history.slice(-10)) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    });
  }
  contents.push({ role: 'user', parts: [{ text: question }] });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 800, topP: 0.9 },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 400) throw new Error('API_KEY_INVALID');
    if (response.status === 429) throw new Error('RATE_LIMIT');
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('EMPTY_RESPONSE');
  return text;
}

// ============================================================
// Main askTutor function — auto-selects provider
// ============================================================
export async function askTutor(
  question: string,
  history: ChatMessage[],
  context?: TutorContext
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const provider = getApiProvider();
  if (provider === 'gemini') {
    return askGemini(question, history, context);
  }
  return askZhipu(question, history, context);
}

// ============================================================
// Test API key
// ============================================================
export async function testApiKey(key: string, provider: 'zhipu' | 'gemini' = 'zhipu'): Promise<boolean> {
  try {
    if (provider === 'zhipu') {
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model: 'glm-4-flash',
          messages: [{ role: 'user', content: 'Say "测试成功" in Chinese' }],
          max_tokens: 20,
        }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      return !!data.choices?.[0]?.message?.content;
    } else {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Say OK in Chinese' }] }],
            generationConfig: { maxOutputTokens: 20 },
          }),
        }
      );
      if (!response.ok) return false;
      const data = await response.json();
      return !!data.candidates?.[0]?.content?.parts?.[0]?.text;
    }
  } catch {
    return false;
  }
}
