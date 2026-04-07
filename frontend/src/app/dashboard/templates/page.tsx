"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-h2 text-text-primary mb-6">Templates</h1>
        <Card>
          <div className="text-center py-16">
            <svg className="mx-auto w-16 h-16 text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
            </svg>
            <h3 className="text-h3 text-text-primary mb-2">No templates yet</h3>
            <p className="text-text-secondary mb-4">Save your projects as templates to reuse later</p>
            <Link href="/dashboard/projects" className="btn-secondary">View Projects</Link>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
