"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkeletonCard } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { DocumentType } from "@/lib/api";
import Link from "next/link";

const formatOrder = [
  { label: "All", value: "all" },
  { label: "Essay", value: "essay" },
  { label: "Research Paper", value: "research" },
  { label: "Presentation", value: "presentation" },
  { label: "Report", value: "report" },
];

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDocuments();
        setDocuments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load documents");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = documents.filter((doc) => {
    const matchesFilter = filter === "all" || doc.format === filter;
    const matchesSearch = search === "" || doc.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatColors: Record<string, "info" | "success" | "warning" | "error"> = {
    essay: "info",
    research: "success",
    presentation: "warning",
    report: "info",
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-h2 text-text-primary">Documents</h1>
          <p className="text-body-sm text-text-secondary">
            {loading ? "Loading..." : `${documents.length} document${documents.length !== 1 ? "s" : ""} generated`}
          </p>
        </div>
        <Link href="/dashboard/documents/new" className="btn-primary text-sm">
          New Document
        </Link>
      </div>

      {documents.length > 1 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {formatOrder.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`px-3 py-1 rounded-full text-body-sm transition-colors ${
                  filter === opt.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1 sm:max-w-xs"
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-error mb-2">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-secondary text-sm">
              Retry
            </button>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <svg className="mx-auto w-16 h-16 text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-h3 text-text-primary mb-2">
              {documents.length === 0 ? "No documents yet" : "No matching documents"}
            </h3>
            <p className="text-text-secondary mb-4">
              {documents.length === 0
                ? "Start a new document to generate your first content"
                : "Try adjusting your search or filter"}
            </p>
            {documents.length === 0 && (
              <Link href="/dashboard/documents/new" className="btn-primary">
                Generate Document
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <Link key={doc.id} href={`/dashboard/documents/${doc.id}`} className="block group">
              <Card padding="sm" className="h-full hover:shadow-md transition-shadow border-transparent group-hover:border-primary/20">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant={formatColors[doc.format] || "info"}>
                    {doc.format}
                  </Badge>
                  <span className="text-caption text-text-secondary whitespace-nowrap">
                    {timeAgo(doc.updatedAt)}
                  </span>
                </div>
                <h3 className="font-medium text-text-primary mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {doc.title}
                </h3>
                {doc.project && (
                  <p className="text-caption text-text-secondary">
                    {doc.project.title}
                  </p>
                )}
                <p className="text-caption text-text-secondary mt-2 line-clamp-3">
                  {doc.content.slice(0, 120)}
                  {doc.content.length > 120 ? "..." : ""}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
