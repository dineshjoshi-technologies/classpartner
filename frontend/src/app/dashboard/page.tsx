"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UsageBadge } from "@/components/ui/usage-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { api } from "@/lib/api";
import type { Project, UsageStats } from "@/lib/api";
import Link from "next/link";

const statusColors: Record<string, string> = {
  "in_progress": "badge-primary",
  completed: "badge-success",
  draft: "badge-accent",
};

function SkeletonLine() {
  return <div className="animate-pulse space-y-2">
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-3 bg-gray-100 rounded w-1/2" />
  </div>;
}

export default function DashboardHome() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [recentDocs, setRecentDocs] = useState<
    Array<{ id: string; title: string; format: string; updatedAt: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const [projectsData, usageData, docsData] = await Promise.all([
          api.getProjects(),
          api.getUsageStats(),
          api.getDocuments(),
        ]);
        if (!controller.signal.aborted) {
          setProjects(projectsData);
          setUsage(usageData);
          setRecentDocs(
            docsData
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )
              .slice(0, 3)
              .map((doc) => ({
                id: doc.id,
                title: doc.title,
                format: doc.format,
                updatedAt: doc.updatedAt,
              }))
          );
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Failed to load dashboard data"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    loadData();

    return () => controller.abort();
  }, []);

  function formatDate(date: string): string {
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

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-h2 text-text-primary mb-1">Welcome back</h1>
        <p className="text-text-secondary">Here&apos;s an overview of your work</p>
      </div>

      {error && (
        <Card className="mb-8 bg-error/5 border-error/20">
          <p className="text-body-sm text-error">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              window.location.reload();
            }}
            className="mt-2 text-sm font-medium text-error hover:underline"
          >
            Retry
          </button>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-caption text-text-secondary mb-1">Total Projects</p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-h2 text-text-primary">{projects.length}</p>
          )}
        </Card>
        <Card>
          <p className="text-caption text-text-secondary mb-1">
            Documents Generated
          </p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-h2 text-text-primary">{usage?.documentsThisMonth ?? 0}</p>
          )}
        </Card>
        <Card>
          <p className="text-caption text-text-secondary mb-1">
            Usage This Month
          </p>
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          ) : (
            usage && (
              <UsageBadge
                used={usage.documentsThisMonth}
                limit={usage.documentLimit}
                className="my-1"
              />
            )
          )}
        </Card>
      </div>

      <Card className="mb-8 bg-accent/5 border-accent/20">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-accent/20 rounded w-2/3 animate-pulse" />
            <div className="h-2 bg-border rounded-full w-full overflow-hidden">
              <div className="h-full bg-accent/50 rounded-full w-1/2 animate-pulse" />
            </div>
          </div>
        ) : usage ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary mb-1">
                  {usage.currentTier === "free" ? "Free Plan" : `${usage.currentTier.charAt(0).toUpperCase() + usage.currentTier.slice(1)} Plan`} Usage
                </p>
                <p className="text-body-sm text-text-secondary">
                  {usage.documentsThisMonth} of {usage.documentLimit} documents used this month
                </p>
              </div>
              {usage.currentTier === "free" && usage.documentsThisMonth >= usage.documentLimit && (
                <Link href="/dashboard/upgrade" className="btn-primary text-sm">
                  Upgrade to Pro
                </Link>
              )}
            </div>
            <div className="mt-3">
              <ProgressBar
                value={usage.documentsThisMonth}
                max={usage.documentLimit}
                variant={
                  usage.documentsThisMonth / usage.documentLimit >= 1
                    ? "error"
                    : usage.documentsThisMonth / usage.documentLimit >= 0.8
                      ? "warning"
                      : "primary"
                }
                size="sm"
                showPercentage
              />
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <SkeletonLine />
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <Skeleton className="h-full w-2/3" />
            </div>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 text-text-primary">Recent Activity</h2>
        <div className="flex gap-4">
          {(projects.length > 0 || recentDocs.length > 0) && (
            <>
              <Link
                href="/dashboard/projects"
                className="text-body-sm text-primary hover:underline"
              >
                View projects
              </Link>
              <Link
                href="/dashboard/documents"
                className="text-body-sm text-primary hover:underline"
              >
                View documents
              </Link>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} padding="sm">
              <SkeletonLine />
            </Card>
          ))}
        </div>
      ) : projects.length === 0 && recentDocs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg
              className="mx-auto w-16 h-16 text-text-secondary mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-h3 text-text-primary mb-2">
              No activity yet
            </h3>
            <p className="text-text-secondary mb-4">
              Start by creating a project or generating your first document
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard/projects/new" className="btn-primary text-sm">
                New Project
              </Link>
              <Link href="/dashboard/documents/new" className="btn-secondary text-sm">
                Generate Document
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.slice(0, 3).map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="block">
              <Card
                padding="sm"
                className="flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
              >
                <div>
                  <p className="font-medium text-text-primary">{project.title}</p>
                  <p className="text-caption text-text-secondary">
                    {project.type} &middot; Updated {formatDate(project.updatedAt)}
                  </p>
                </div>
                <span className={statusColors[project.status] || "badge-accent"}>
                  {project.status.replace("_", " ")}
                </span>
              </Card>
            </Link>
          ))}
          {recentDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/dashboard/documents/${doc.id}`}
              className="block"
            >
              <Card
                padding="sm"
                className="flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
              >
                <div>
                  <p className="font-medium text-text-primary">{doc.title}</p>
                  <p className="text-caption text-text-secondary">
                    {doc.format} &middot; Updated {formatDate(doc.updatedAt)}
                  </p>
                </div>
                <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link href="/dashboard/projects/new" className="btn-primary">
          New Project
        </Link>
        <Link href="/dashboard/documents/new" className="btn-secondary">
          Generate Document
        </Link>
      </div>
    </DashboardLayout>
  );
}
