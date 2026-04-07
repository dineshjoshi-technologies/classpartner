"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-h2 text-text-primary mb-6">Documents</h1>
        <Card>
          <div className="text-center py-16">
            <svg className="mx-auto w-16 h-16 text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-h3 text-text-primary mb-2">No documents yet</h3>
            <p className="text-text-secondary mb-4">Start a new project to generate your first document</p>
            <Link href="/dashboard/projects/new" className="btn-primary">Create Project</Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
