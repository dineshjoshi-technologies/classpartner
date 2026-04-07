interface AIRequest {
  provider: 'openai' | 'anthropic';
  model: string;
  body: Record<string, unknown>;
  apiKey: string;
}

interface AIResponse {
  status: number;
  data: Record<string, unknown>;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number };
}

export async function callAI(request: AIRequest): Promise<AIResponse> {
  const { provider, model, body, apiKey } = request;

  if (provider === 'openai') {
    return callOpenAI(model, body, apiKey);
  } else if (provider === 'anthropic') {
    return callAnthropic(model, body, apiKey);
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

async function callOpenAI(model: string, body: Record<string, unknown>, apiKey: string): Promise<AIResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      ...body,
      model,
    }),
  });

  if (!response.ok) {
    const error = await response.json() as Record<string, { message?: string }>;
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json() as Record<string, unknown>;
  const usage = data.usage as { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | undefined;

  return {
    status: response.status,
    data,
    usage: {
      promptTokens: usage?.prompt_tokens || 0,
      completionTokens: usage?.completion_tokens || 0,
      totalTokens: usage?.total_tokens || 0,
    },
  };
}

async function callAnthropic(model: string, body: Record<string, unknown>, apiKey: string): Promise<AIResponse> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      ...body,
      model,
      max_tokens: (body.max_tokens as number) || 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.json() as Record<string, { message?: string }>;
    throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json() as Record<string, unknown>;
  const usage = data.usage as { input_tokens?: number; output_tokens?: number } | undefined;

  return {
    status: response.status,
    data,
    usage: {
      promptTokens: usage?.input_tokens || 0,
      completionTokens: usage?.output_tokens || 0,
      totalTokens: (usage?.input_tokens || 0) + (usage?.output_tokens || 0),
    },
  };
}
