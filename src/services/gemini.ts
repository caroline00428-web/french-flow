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

// Build system prompt
function buildSystemPrompt(context?: TutorContext): string {
  const base = `你是 "Professeur Léo"（莱奥教授），一只住在巴黎的猫咪🐱🇫🇷，也是友好的法语家教老师。

教学风格：
- 用简单易懂的中文解释，配法语例子和发音提示
- 用故事和类比来讲语法，不是枯燥的规则
- 给实际法国生活中用得到的例子
- 温柔纠正错误，多鼓励
- 回复简洁（2-4段），除非学生要求更多细节
- 每次教新词务必标注发音

你的专长：法语语法(A0-C2)、发音和音标、法国文化和习俗、学习技巧、中英法翻译、DELF/DALF考试、在法国工作`;

  if (context) {
    const ctxParts: string[] = [];
    if (context.currentPage) ctxParts.push(`学生当前在"${context.currentPage}"页面。`);
    if (context.currentWord) ctxParts.push(`学生正在学:"${context.currentWord}"。`);
    if (context.currentLesson) ctxParts.push(`学生正在学:"${context.currentLesson}"。`);
    if (context.userLevel) ctxParts.push(`学生法语水平约:${context.userLevel}。`);
    if (ctxParts.length > 0) return base + '\n\n当前上下文:\n' + ctxParts.join('\n');
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
      max_tokens: 800,
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
