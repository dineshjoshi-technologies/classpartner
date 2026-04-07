"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const allProjects = [
  { id: 1, title: "AI Ethics Essay", type: "Essay", status: "In Progress", modified: "2 hours ago", description: "Exploring the ethical implications of AI in academic settings" },
  { id: 2, title: "Machine Learning Presentation", type: "Presentation", status: "Completed", modified: "Yesterday", description: "Introduction to ML models and their applications" },
  { id: 3, title: "Research Paper Draft", type: "Research Paper", status: "Draft", modified: "3 days ago", description: "Preliminary findings from user study" },
  { id: 4, title: "History Essay", type: "Essay", status: "Completed", modified: "1 week ago", description: "Analysis of key historical events" },
];

const statusColors: Record<string, "success" | "info" | "warning" | "error"> = {
  "In Progress": "info",
  Completed: "success",
  Draft: "warning",
};

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "In Progress", "Completed", "Draft"];

  const filtered = filter === "All" ? allProjects : allProjects.filter((p) => p.status === filter);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h2 text-text-primary">Projects</h1>
        <Link href="/dashboard/projects/new" className="btn-primary text-sm">
          New Project
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded text-body-sm transition-colors ${
              filter === f ? "bg-primary text-white" : "bg-surface text-text-secondary hover:bg-gray-100 border border-border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <svg className="mx-auto w-16 h-16 text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h3 className="text-h3 text-text-primary mb-2">No projects found</h3>
          <p className="text-text-secondary mb-4">Create your first project to get started</p>
          <Link href="/dashboard/projects/new" className="btn-primary">
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <Badge variant={statusColors[project.status]}>{project.status}</Badge>
              </div>
              <p className="text-body-sm text-text-secondary mb-3 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-caption text-text-secondary">{project.modified}</span>
                <div className="flex gap-2">
                  <button className="text-text-secondary hover:text-text-primary" aria-label="Duplicate project">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="text-text-secondary hover:text-error" aria-label="Delete project">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
