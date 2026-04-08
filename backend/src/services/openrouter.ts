import { OPENROUTER_CONFIG } from '../lib/config';
import prisma from '../lib/prisma';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface OpenRouterResponse {
  id: string;
  choices: {
    message: OpenRouterMessage;
    finish_reason: string;
  }[];
  usage: OpenRouterUsage;
  model: string;
}

interface OpenRouterStreamCallback {
  onChunk: (chunk: string) => void;
  onDone: (fullContent: string, usage: OpenRouterUsage) => void;
  onError: (error: Error) => void;
}

interface CachedKey {
  id: string;
  key: string;
  lastErrorAt: Date | null;
  errorCount: number;
}

let cachedKeys: CachedKey[] | null = null;
let cacheExpiry = 0;

async function getActiveKeys(): Promise<CachedKey[]> {
  const now = Date.now();
  if (cachedKeys && now < cacheExpiry) {
    return cachedKeys;
  }

  const keys = await prisma.apiKey.findMany({
    where: {
      provider: 'openrouter',
      isActive: true,
    },
    select: {
      id: true,
      key: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  cachedKeys = keys.map((k) => ({
    id: k.id,
    key: k.key,
    lastErrorAt: null,
    errorCount: 0,
  }));

  cacheExpiry = now + 30_000;
  return cachedKeys;
}

function isRateLimitError(status: number): boolean {
  return status === 429 || status === 503 || status === 502;
}

async function tryWithFailover<T>(
  fn: (apiKey: string) => Promise<T>
): Promise<{ result: T; keyUsed: string; modelUsed: string }> {
  const keys = await getActiveKeys();

  if (keys.length === 0 && process.env.OPENROUTER_API_KEY) {
    keys.push({
      id: 'env-fallback',
      key: process.env.OPENROUTER_API_KEY,
      lastErrorAt: null,
      errorCount: 0,
    });
  }

  if (keys.length === 0) {
    throw new Error('No OpenRouter API keys configured');
  }

  const models = [
    OPENROUTER_CONFIG.defaultModel,
    ...OPENROUTER_CONFIG.fallbackModels,
  ];

  for (const model of models) {
    for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
      const key = keys[keyIndex];
      try {
        const result = await fn(key.key);
        return { result, keyUsed: key.id, modelUsed: model };
      } catch (error: unknown) {
        const status =
          typeof error === 'object' && error !== null && 'status' in error
            ? (error as { status: number }).status
            : null;

        if (status && isRateLimitError(status)) {
          key.errorCount++;
          key.lastErrorAt = new Date();
          if (key.id !== 'env-fallback') {
            await prisma.apiKey.update({
              where: { id: key.id },
              data: {
                errorCount: 1,
                lastErrorAt: new Date(),
              },
            });
          }
          continue;
        }

        throw error;
      }
    }
  }

  throw new Error('All OpenRouter keys exhausted due to rate limits');
}

export async function callOpenRouter(
  messages: OpenRouterMessage[],
  model?: string,
  maxTokens?: number
): Promise<{ content: string; usage: OpenRouterUsage; modelUsed: string }> {
  const targetModel = model || OPENROUTER_CONFIG.defaultModel;

  const { result: response } = await tryWithFailover(async (apiKey) => {
    const res = await fetch(`${OPENROUTER_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'ClassPartner',
      },
      body: JSON.stringify({
        model: targetModel,
        messages,
        stream: false,
        max_tokens: maxTokens,
      }),
    });

    if (!res.ok) {
      const err = new Error(await res.text()) as Error & { status: number };
      err.status = res.status;
      throw err;
    }

    return (await res.json()) as OpenRouterResponse;
  });

  const choice = response.choices[0];
  return {
    content: choice.message.content,
    usage: response.usage,
    modelUsed: response.model || targetModel,
  };
}

export async function streamOpenRouter(
  messages: OpenRouterMessage[],
  callbacks: OpenRouterStreamCallback,
  model?: string,
  maxTokens?: number
): Promise<{ modelUsed: string }> {
  const targetModel = model || OPENROUTER_CONFIG.defaultModel;

  const { result: response, keyUsed } = await tryWithFailover(
    async (apiKey) => {
      const res = await fetch(`${OPENROUTER_CONFIG.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
          'X-Title': 'ClassPartner',
        },
        body: JSON.stringify({
          model: targetModel,
          messages,
          stream: true,
          max_tokens: maxTokens,
        }),
      });

      if (!res.ok) {
        const err = new Error(await res.text()) as Error & { status: number };
        err.status = res.status;
        throw err;
      }

      return res;
    }
  );

  let fullContent = '';
  let promptTokens = 0;
  let completionTokens = 0;

  const reader = (response as Response).body?.getReader();
  if (!reader) {
    throw new Error('Failed to get response stream');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let modelDetected = targetModel;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (!trimmed.startsWith('data: ')) continue;

        try {
          const json = JSON.parse(trimmed.slice(6)) as {
            choices?: { delta?: { content?: string }; finish_reason?: string }[];
            usage?: OpenRouterUsage;
            model?: string;
          };

          if (json.model) {
            modelDetected = json.model;
          }

          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            fullContent += delta;
            callbacks.onChunk(delta);
          }

          if (json.usage) {
            promptTokens = json.usage.prompt_tokens;
            completionTokens = json.usage.completion_tokens;
          }

          if (json.choices?.[0]?.finish_reason === 'stop') {
            if (json.usage) {
              promptTokens = json.usage.prompt_tokens;
              completionTokens = json.usage.completion_tokens;
            }
          }
        } catch {
        }
      }
    }
  } catch (error) {
    reader.releaseLock();
    if (error instanceof Error) {
      callbacks.onError(error);
    }
    throw error;
  }

  reader.releaseLock();

  const usage: OpenRouterUsage = {
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    total_tokens: promptTokens + completionTokens,
  };

  callbacks.onDone(fullContent, usage);

  return { modelUsed: modelDetected };
}

export async function refreshKeyCache(): Promise<void> {
  cachedKeys = null;
  cacheExpiry = 0;
  await getActiveKeys();
}
