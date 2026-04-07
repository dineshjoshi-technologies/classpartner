export const TIER_LIMITS: Record<string, { dailyApiCalls: number; maxApiKeys: number; monthlyTokenLimit: number; monthlyDocuments: number }> = {
  free: {
    dailyApiCalls: 10,
    maxApiKeys: 0,
    monthlyTokenLimit: 0,
    monthlyDocuments: 3,
  },
  pro: {
    dailyApiCalls: 100,
    maxApiKeys: 3,
    monthlyTokenLimit: 100000,
    monthlyDocuments: 50,
  },
  team: {
    dailyApiCalls: 500,
    maxApiKeys: 10,
    monthlyTokenLimit: 500000,
    monthlyDocuments: 200,
  },
  institution: {
    dailyApiCalls: 2000,
    maxApiKeys: 25,
    monthlyTokenLimit: 2000000,
    monthlyDocuments: 1000,
  },
};

export const OPENROUTER_CONFIG = {
  baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  defaultModel: process.env.DEFAULT_MODEL || 'openai/gpt-4o',
  fallbackModels: JSON.parse(process.env.FALLBACK_MODELS || '["anthropic/claude-3-haiku","google/gemini-flash"]'),
};

export const DOCUMENT_PROMPTS: Record<string, { system: string; maxTokens: number }> = {
  essay: {
    system: 'You are an expert academic essay writer. Write a well-structured, academically rigorous essay on the given topic. Include an introduction, body paragraphs with supporting evidence, and a conclusion. Use formal academic language.',
    maxTokens: 4000,
  },
  presentation: {
    system: 'You are an expert presentation designer. Create a well-structured presentation on the given topic. Use clear slide-by-slide format with titles, bullet points, and speaker notes where appropriate.',
    maxTokens: 3000,
  },
  research_paper: {
    system: 'You are a senior academic researcher. Write a comprehensive research paper on the given topic. Include abstract, introduction, literature review, methodology discussion, results analysis, and conclusion. Use formal academic language with citations.',
    maxTokens: 8000,
  },
};

export const PROVIDERS: Record<string, { baseUrl: string; models: string[] }> = {
  openai: {
    baseUrl: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
    models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o'],
  },
  anthropic: {
    baseUrl: process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1',
    models: ['claude-3-haiku-20240307', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229', 'claude-3-5-sonnet-20240620'],
  },
};
