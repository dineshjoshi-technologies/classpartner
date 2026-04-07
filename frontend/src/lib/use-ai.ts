"use client";

import { useState, useCallback, useRef } from "react";
import { api } from "./api";

interface UseAIOptions {
  projectId?: string;
  onSuccess?: (content: string, documentId: string) => void;
  onError?: (error: string) => void;
}

interface UseAIReturn {
  content: string;
  isGenerating: boolean;
  documentId: string | null;
  error: string | null;
  generate: (prompt: string, options?: {
    documentType?: string;
    subject?: string;
    citationStyle?: string;
    wordCount?: number;
  }) => Promise<void>;
  clearContent: () => void;
}

export function useAI({ projectId, onSuccess, onError }: UseAIOptions = {}): UseAIReturn {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (
    prompt: string,
    options?: {
      documentType?: string;
      subject?: string;
      citationStyle?: string;
      wordCount?: number;
    },
  ) => {
    setIsGenerating(true);
    setError(null);
    abortRef.current = new AbortController();

    try {
      const result = await api.generateContent({
        prompt,
        documentType: options?.documentType,
        subject: options?.subject,
        citationStyle: options?.citationStyle,
        wordCount: options?.wordCount,
        projectId,
      });
      setContent(result.content);
      setDocumentId(result.documentId);
      onSuccess?.(result.content, result.documentId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
      onError?.(message);
    } finally {
      setIsGenerating(false);
    }
  }, [projectId, onSuccess, onError]);

  const clearContent = useCallback(() => {
    setContent("");
    setDocumentId(null);
    setError(null);
    abortRef.current?.abort();
  }, []);

  return {
    content,
    isGenerating,
    documentId,
    error,
    generate,
    clearContent,
  };
}
