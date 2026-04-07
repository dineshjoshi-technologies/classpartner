"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

const projectTypes = [
  {
    id: "essay",
    label: "Essay",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    id: "presentation",
    label: "Presentation",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
  },
  {
    id: "research",
    label: "Research Paper",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: "report",
    label: "Report",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
];

const aiSuggestions = [
  { label: "Compare machine learning algorithms", prompt: "Write a comparative analysis of common machine learning algorithms including decision trees, neural networks, and SVM" },
  { label: "Marketing strategy plan", prompt: "Create a comprehensive digital marketing strategy for a new SaaS product targeting small businesses" },
  { label: "Literature review structure", prompt: "Write a literature review on the impact of social media on student engagement in higher education" },
  { label: "Business case study", prompt: "Analyze the business model disruption of Airbnb in the hospitality industry" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState("essay");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useAi, setUseAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    setError(null);

    try {
      const project = await api.createProject({
        title,
        description: description || undefined,
        type: selectedType,
      });

      if (aiPrompt.trim()) {
        try {
          await api.generateContent({
            prompt: aiPrompt,
            documentType: selectedType,
            projectId: project.id,
          });
        } catch (genErr) {
          console.error("AI generation failed, but project was created:", genErr);
        }
      }

      router.push(`/dashboard/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      setCreating(false);
    }
  }

  async function handleAiSuggest() {
    if (!aiPrompt.trim() && !description.trim()) return;
    setAiGenerating(true);
    try {
      const promptToUse = aiPrompt || `Create a project for: ${description}`;
      const result = await api.generateContent({
        prompt: `Based on the following topic, generate only a project title (1 line, max 80 characters): ${promptToUse}`,
        documentType: selectedType,
      });
      const suggestedTitle = result.content.split("\n")[0].replace(/^#*\s*/, "").slice(0, 80);
      setGeneratedTitle(suggestedTitle);
      setTitle(suggestedTitle);
    } catch {
      setError("AI title generation failed. Please enter a title manually.");
    } finally {
      setAiGenerating(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-h2 text-text-primary">New Project</h1>
          <Link href="/dashboard/projects" className="text-body-sm text-primary hover:underline">
            &larr; Back to projects
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-body-sm" role="alert">
            {error}
          </div>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Project title"
              type="text"
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-text-primary font-medium text-body-sm mb-1.5">Project type</label>
              <div className="grid grid-cols-2 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="text-primary mb-1">{type.icon}</div>
                    <div className="text-body-sm font-medium text-text-primary">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-text-primary font-medium text-body-sm mb-1.5" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                placeholder="Describe what you want to create..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* AI Integration Section */}
            <div className="border border-border rounded-lg p-4">
              <button
                type="button"
                onClick={() => setUseAi(!useAi)}
                className="flex items-center gap-2 text-body-sm font-medium text-text-primary hover:text-primary transition-colors mb-3"
              >
                <svg className={`w-4 h-4 transition-transform ${useAi ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 5l7 7-7 7" />
                </svg>
                <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate with AI
              </button>

              {useAi && (
                <div className="space-y-3">
                  {!description.trim() && (
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => {
                            setAiPrompt(s.prompt);
                            setDescription(s.prompt);
                          }}
                          className="px-3 py-1 rounded-full text-caption bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-secondary text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary resize-none"
                      placeholder="Describe your topic and what you'd like AI to generate..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAiSuggest}
                      disabled={aiGenerating || (!aiPrompt.trim() && !description.trim())}
                    >
                      {aiGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Generating title...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Auto-generate title
                        </>
                      )}
                    </Button>
                    {generatedTitle && (
                      <span className="text-caption text-secondary">Title generated — you can edit it</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Project"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
