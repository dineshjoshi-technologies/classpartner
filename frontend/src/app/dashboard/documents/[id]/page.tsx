"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { api } from "@/lib/api";
import type { DocumentType } from "@/lib/api";
import Link from "next/link";

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

const formatColors: Record<string, "info" | "success" | "warning" | "error"> = {
  essay: "info",
  research: "success",
  presentation: "warning",
  report: "info",
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [doc, setDoc] = useState<DocumentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadDocument = useCallback(async () => {
    try {
      const data = await api.getDocument(id);
      setDoc(data);
      setEditTitle(data.title);
      setEditContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load document");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateDocument(id, {
        title: editTitle,
        content: editContent,
      });
      setDoc(updated);
      setEditing(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteDocument(id);
      router.push("/dashboard/documents");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleExport = (format: "pdf" | "docx") => {
    console.log(`Exporting as ${format}:`, doc?.title);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Card className="max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-64 bg-gray-100 rounded" />
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (error || !doc) {
    return (
      <DashboardLayout>
        <Card className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <p className="text-error mb-4">{error || "Document not found"}</p>
            <Link href="/dashboard/documents" className="btn-primary">
              Back to Documents
            </Link>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/dashboard/documents" className="text-body-sm text-primary hover:underline">
                &larr; Documents
              </Link>
            </div>
            {editing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-h2 font-semibold text-text-primary w-full border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <h1 className="text-h2 text-text-primary">{doc.title}</h1>
            )}
            <div className="flex items-center gap-3 text-body-sm text-text-secondary mt-1">
              <Badge variant={formatColors[doc.format] || "info"}>{doc.format}</Badge>
              <span>Updated {timeAgo(doc.updatedAt)}</span>
              {doc.project && <span>&middot; {doc.project.title}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {editing ? (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="ghost" onClick={() => { setEditing(false); setEditTitle(doc.title); setEditContent(doc.content); }}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <button onClick={() => handleExport("pdf")} className="btn-secondary text-sm">
                  Export PDF
                </button>
                <button onClick={() => handleExport("docx")} className="btn-secondary text-sm">
                  Export DOCX
                </button>
                <Button variant="ghost" size="sm" onClick={() => { setEditing(true); }}>
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(true)} className="text-error">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="min-h-96">
          {editing ? (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-80 font-mono text-body-sm"
            />
          ) : (
            <div className="prose prose-sm max-w-none text-text-primary whitespace-pre-wrap">
              {doc.content.split("\n").map((line, i) => {
                if (line.startsWith("# ")) {
                  return <h1 key={i} className="text-h1 mt-6 mb-3">{line.slice(2)}</h1>;
                }
                if (line.startsWith("## ")) {
                  return <h2 key={i} className="text-h2 mt-5 mb-2">{line.slice(3)}</h2>;
                }
                if (line.startsWith("### ")) {
                  return <h3 key={i} className="text-h3 mt-4 mb-2">{line.slice(4)}</h3>;
                }
                if (line.startsWith("- ")) {
                  return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
                }
                if (line.startsWith("**") && line.endsWith("**")) {
                  return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
                }
                if (line.trim() === "") {
                  return <br key={i} />;
                }
                return <p key={i} className="mb-2">{line}</p>;
              })}
            </div>
          )}
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${doc.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </DashboardLayout>
  );
}
