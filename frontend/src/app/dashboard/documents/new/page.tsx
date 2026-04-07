"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

const subjectMap: Record<string, string> = {
  cs: "Computer Science",
  business: "Business",
  arts: "Arts & Humanities",
  science: "Natural Sciences",
};

export default function DocumentEditorPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedDocumentId, setGeneratedDocumentId] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("essay");
  const [selectedCitation, setSelectedCitation] = useState("apa");
  const [wordCount, setWordCount] = useState(1500);
  const [subject, setSubject] = useState("");
  const [generationError, setGenerationError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const result = await api.generateContent({
        prompt,
        documentType: selectedFormat,
        subject: subjectMap[subject] || subject,
        citationStyle: selectedCitation,
        wordCount,
      });
      setGeneratedContent(result.content);
      setGeneratedDocumentId(result.documentId);
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "AI generation is not yet connected. The backend /api/generate route needs to be implemented to power this feature.";
      setGenerationError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleExport(format: string) {
    console.log(`Exporting as ${format}`);
  }

  function handleSaveDocument() {
    if (!generatedContent) return;
    if (generatedDocumentId) {
      router.push(`/dashboard/documents/${generatedDocumentId}`);
    }
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-5rem)] flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Back to documents"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-h3 text-text-primary">Document Editor</h1>
              <p className="text-caption text-text-secondary">AI-Powered Content Generation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {generatedDocumentId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveDocument}
                className="text-secondary font-medium"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Saved &rarr;
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExport("pdf")}
              disabled={!generatedContent}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleExport("docx")}
              disabled={!generatedContent}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export DOCX
            </Button>
          </div>
        </div>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Left Panel - Input Controls */}
          <div className="w-80 flex-shrink-0 overflow-y-auto pr-2">
            <div className="space-y-4">
              <div>
                <label className="block text-text-primary font-medium text-body-sm mb-1.5">
                  Document Type
                </label>
                <Select
                  options={[
                    { value: "essay", label: "Essay" },
                    { value: "research", label: "Research Paper" },
                    { value: "presentation", label: "Presentation" },
                    { value: "report", label: "Report" },
                  ]}
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium text-body-sm mb-1.5">
                  Subject
                </label>
                <Select
                  placeholder="Select subject area"
                  options={[
                    { value: "cs", label: "Computer Science" },
                    { value: "business", label: "Business" },
                    { value: "arts", label: "Arts & Humanities" },
                    { value: "science", label: "Natural Sciences" },
                  ]}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium text-body-sm mb-1.5">
                  Citation Style
                </label>
                <Select
                  options={[
                    { value: "apa", label: "APA 7th Edition" },
                    { value: "mla", label: "MLA 9th Edition" },
                    { value: "harvard", label: "Harvard" },
                    { value: "chicago", label: "Chicago" },
                  ]}
                  value={selectedCitation}
                  onChange={(e) => setSelectedCitation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-text-primary font-medium text-body-sm mb-1.5">
                  Target Word Count: {wordCount}
                </label>
                <input
                  type="range"
                  min={500}
                  max={5000}
                  step={250}
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-caption text-text-secondary mt-0.5">
                  <span>500</span>
                  <span>5000</span>
                </div>
              </div>

              <div>
                <label htmlFor="prompt" className="block text-text-primary font-medium text-body-sm mb-1.5">
                  Your Prompt
                </label>
                <Textarea
                  id="prompt"
                  placeholder="Describe what you want to write about..."
                  rows={6}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  helperText="Be specific for best results"
                />
              </div>

              {generationError && (
                <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-body-sm" role="alert">
                  {generationError}
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Panel - Content Preview */}
          <div className="flex-1 overflow-y-auto bg-surface rounded-lg border border-border p-6">
            {isGenerating && (
              <div className="max-w-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-body-sm text-text-secondary">AI is generating your document...</p>
                </div>
                <ProgressBar value={65} variant="primary" size="sm" className="mb-8" />
                <div className="space-y-3">
                  <SkeletonText lines={4} />
                  <div className="mt-6" />
                  <SkeletonText lines={6} />
                  <div className="mt-6" />
                  <SkeletonText lines={3} />
                </div>
              </div>
            )}

            {!isGenerating && !generatedContent && !generationError && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="w-24 h-24 text-border mb-6" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1}>
                  <path d="M24 4L4 14v20l20 10 20-10V14L24 4z" />
                  <path d="M14 24h20M14 30h12" />
                </svg>
                <h3 className="text-h3 text-text-primary mb-2">Ready to Create</h3>
                <p className="text-body-sm text-text-secondary max-w-sm mb-6">
                  Enter your prompt on the left panel and click Generate to create AI-powered academic content.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center mt-4">
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-primary">4</p>
                    <p className="text-caption text-text-secondary">Formats</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-2xl font-bold text-secondary">5000</p>
                    <p className="text-caption text-text-secondary">Max Words</p>
                  </div>
                </div>
              </div>
            )}

            {!isGenerating && generatedContent && (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-text-primary text-body leading-relaxed font-sans">
                  {generatedContent.split("\n").map((line, index) => {
                    if (line.startsWith("# ")) {
                      return (
                        <h1 key={index} className="text-h1 text-text-primary mt-6 first:mt-0 mb-4">
                          {line.replace("# ", "")}
                        </h1>
                      );
                    }
                    if (line.startsWith("## ")) {
                      return (
                        <h2 key={index} className="text-h2 text-text-primary mt-8 mb-3">
                          {line.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (line.startsWith("- **")) {
                      const match = line.match(/^- \*\*(.+?)\*\*\s*(.*)/);
                      if (match) {
                        return (
                          <li key={index} className="flex items-start gap-2 my-1 text-body">
                            <span className="text-primary mt-1">•</span>
                            <span>
                              <strong className="text-text-primary">{match[1]}</strong>
                              {match[2] && <span className="text-text-primary"> {match[2]}</span>}
                            </span>
                          </li>
                        );
                      }
                    }
                    if (line.trim() === "") {
                      return <div key={index} className="h-4" />;
                    }
                    return (
                      <p key={index} className="text-body text-text-primary mb-2">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
