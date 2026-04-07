import { AdminLayout } from "@/components/admin/admin-layout";
import Link from "next/link";

const stats = [
  { label: "Total Users", value: "12,847", change: "+12%", trend: "up" as const, color: "text-primary" },
  { label: "Active Users (7d)", value: "3,421", change: "+8%", trend: "up" as const, color: "text-secondary" },
  { label: "Documents Generated", value: "54,230", change: "+24%", trend: "up" as const, color: "text-primary" },
  { label: "API Requests Today", value: "8,942", change: "-5%", trend: "down" as const, color: "text-error" },
];

const recentUsers = [
  { id: 1, name: "Alice Thompson", email: "alice@university.edu", tier: "Pro", joined: "2 hours ago", status: "Active" },
  { id: 2, name: "Bob Martinez", email: "bob@college.edu", tier: "Free", joined: "5 hours ago", status: "Active" },
  { id: 3, name: "Carol Zhang", email: "carol@institute.edu", tier: "Team", joined: "1 day ago", status: "Active" },
  { id: 4, name: "David Kim", email: "david@school.edu", tier: "Free", joined: "2 days ago", status: "Banned" },
  { id: 5, name: "Eva Johnson", email: "eva@academy.edu", tier: "Pro", joined: "3 days ago", status: "Active" },
];

const apiKeys = [
  { id: 1, name: "OpenRouter Key 1", provider: "OpenRouter", status: "Active", usage: "84%" },
  { id: 2, name: "OpenRouter Key 2", provider: "OpenRouter", status: "Active", usage: "62%" },
  { id: 3, name: "OpenAI GPT-4 Key", provider: "OpenAI", status: "Active", usage: "91%" },
  { id: 4, name: "Claude 3 Key", provider: "Anthropic", status: "Rate Limited", usage: "100%" },
];

export default function AdminHome() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Overview</h1>
        <p className="text-gray-500">System health, user metrics, and activity overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Users</h2>
            <Link href="/admin/users" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-bold">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.tier === "Pro" ? "bg-primary/10 text-primary" :
                    user.tier === "Team" ? "bg-orange-100 text-orange-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {user.tier}
                  </span>
                  {user.status === "Banned" && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Banned
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Key Health */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">API Key Health</h2>
            <Link href="/admin/api-keys" className="text-sm text-primary hover:underline">
              Manage keys
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {apiKeys.map((key) => (
              <div key={key.id} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{key.name}</p>
                    <p className="text-xs text-gray-500">{key.provider}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    key.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {key.status}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      parseInt(key.usage) > 90 ? "bg-red-500" :
                      parseInt(key.usage) > 70 ? "bg-yellow-500" :
                      "bg-green-500"
                    }`}
                    style={{ width: key.usage }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{key.usage} usage</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
