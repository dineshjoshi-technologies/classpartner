import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const recentProjects = [
  { id: 1, title: "AI Ethics Essay", type: "Essay", status: "In Progress", modified: "2 hours ago" },
  { id: 2, title: "Machine Learning Presentation", type: "Presentation", status: "Completed", modified: "Yesterday" },
  { id: 3, title: "Research Paper Draft", type: "Research Paper", status: "Draft", modified: "3 days ago" },
];

const statusColors: Record<string, string> = {
  "In Progress": "badge-primary",
  Completed: "badge-success",
  Draft: "badge-accent",
};

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-h2 text-text-primary mb-1">Welcome back, Student</h1>
        <p className="text-text-secondary">Here&apos;s an overview of your work</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-caption text-text-secondary mb-1">Total Projects</p>
          <p className="text-h2 text-text-primary">12</p>
        </Card>
        <Card>
          <p className="text-caption text-text-secondary mb-1">Documents Generated</p>
          <p className="text-h2 text-text-primary">28</p>
        </Card>
        <Card>
          <p className="text-caption text-text-secondary mb-1">Usage This Month</p>
          <p className="text-h2 text-text-primary">2/3</p>
        </Card>
      </div>

      <Card className="mb-8 bg-accent/5 border-accent/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-text-primary mb-1">Free Plan Usage</p>
            <p className="text-body-sm text-text-secondary">2 of 3 essays remaining this month</p>
          </div>
          <Link href="/dashboard/upgrade" className="btn-primary text-sm">
            Upgrade to Pro
          </Link>
        </div>
        <div className="mt-3 h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full w-2/3 transition-all" />
        </div>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 text-text-primary">Recent Projects</h2>
        <Link href="/dashboard/projects" className="text-body-sm text-primary hover:underline">
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {recentProjects.map((project) => (
          <Card key={project.id} padding="sm" className="flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div>
              <p className="font-medium text-text-primary">{project.title}</p>
              <p className="text-caption text-text-secondary">{project.type} &middot; {project.modified}</p>
            </div>
            <span className={statusColors[project.status]}>{project.status}</span>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/dashboard/projects/new" className="btn-primary">
          New Project
        </Link>
        <button className="btn-secondary">
          Continue Last Project
        </button>
      </div>
    </DashboardLayout>
  );
}
