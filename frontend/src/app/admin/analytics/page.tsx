"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

const timeRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

type TimeRange = (typeof timeRanges)[number]["value"];

const metrics: Record<
  TimeRange,
  {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    totalDocuments: number;
    avgResponseTime: string;
    apiCallsToday: number;
    errorRate: string;
  }
> = {
  "7d": {
    totalUsers: 847,
    newUsers: 63,
    activeUsers: 312,
    totalDocuments: 2184,
    avgResponseTime: "1.4s",
    apiCallsToday: 1249,
    errorRate: "0.3%",
  },
  "30d": {
    totalUsers: 3241,
    newUsers: 287,
    activeUsers: 891,
    totalDocuments: 8932,
    avgResponseTime: "1.5s",
    apiCallsToday: 4821,
    errorRate: "0.4%",
  },
  "90d": {
    totalUsers: 10447,
    newUsers: 1103,
    activeUsers: 2340,
    totalDocuments: 32150,
    avgResponseTime: "1.6s",
    apiCallsToday: 5934,
    errorRate: "0.5%",
  },
};

const dailyUsage = [
  { day: "Mon", documents: 142, apiCalls: 320 },
  { day: "Tue", documents: 198, apiCalls: 445 },
  { day: "Wed", documents: 256, apiCalls: 512 },
  { day: "Thu", documents: 189, apiCalls: 398 },
  { day: "Fri", documents: 312, apiCalls: 620 },
  { day: "Sat", documents: 98, apiCalls: 210 },
  { day: "Sun", documents: 67, apiCalls: 145 },
];

const recentUsers = [
  { id: 1, name: "Emma Wilson", email: "emma@example.com", plan: "Free", joined: "2 hours ago", status: "active" as const },
  { id: 2, name: "James Chen", email: "james@example.com", plan: "Pro", joined: "5 hours ago", status: "active" as const },
  { id: 3, name: "Sofia Martinez", email: "sofia@example.com", plan: "Free", joined: "1 day ago", status: "active" as const },
  { id: 4, name: "Liam Brown", email: "liam@example.com", plan: "Enterprise", joined: "2 days ago", status: "active" as const },
  { id: 5, name: "Aisha Patel", email: "aisha@example.com", plan: "Pro", joined: "3 days ago", status: "suspended" as const },
];

const planDistribution = [
  { plan: "Free", count: 712, percent: 84, color: "bg-text-secondary" },
  { plan: "Pro", count: 98, percent: 12, color: "bg-primary" },
  { plan: "Enterprise", count: 37, percent: 4, color: "bg-secondary" },
];

const maxDocuments = Math.max(...dailyUsage.map((d) => d.documents));

const statusColors: Record<string, "success" | "info" | "warning" | "error"> = {
  active: "success",
  suspended: "error",
};

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const m = metrics[timeRange];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-h2 text-gray-900">Analytics</h1>
          <p className="text-body-sm text-gray-500">
            Monitor platform usage and performance metrics
          </p>
        </div>
        <Select
          label="Time range"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as TimeRange)}
          options={timeRanges}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card padding="sm">
          <p className="text-caption text-gray-500 mb-1">Total Users</p>
          <p className="text-h3 text-gray-900">
            {m.totalUsers.toLocaleString()}
          </p>
          <p className="text-caption text-green-600 mt-1">+{m.newUsers} new</p>
        </Card>
        <Card padding="sm">
          <p className="text-caption text-gray-500 mb-1">Active Users</p>
          <p className="text-h3 text-gray-900">
            {m.activeUsers.toLocaleString()}
          </p>
          <p className="text-caption text-gray-400 mt-1">This period</p>
        </Card>
        <Card padding="sm">
          <p className="text-caption text-gray-500 mb-1">
            Documents Generated
          </p>
          <p className="text-h3 text-gray-900">
            {m.totalDocuments.toLocaleString()}
          </p>
          <p className="text-caption text-green-600 mt-1">
            +{Math.round(m.totalDocuments * 0.12)} vs prior
          </p>
        </Card>
        <Card padding="sm">
          <p className="text-caption text-gray-500 mb-1">API Calls (24h)</p>
          <p className="text-h3 text-gray-900">
            {m.apiCallsToday.toLocaleString()}
          </p>
          <p className="text-caption text-gray-400 mt-1">
            Avg: {m.avgResponseTime}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card
          header={
            <h2 className="text-h3 text-gray-900">
              Daily Document Generation
            </h2>
          }
        >
          <div className="flex items-end gap-3 h-48 mt-4">
            {dailyUsage.map((d) => (
              <div key={d.day} className="flex flex-col items-center flex-1">
                <span className="text-caption text-gray-500 mb-1">
                  {d.documents}
                </span>
                <div
                  className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                  style={{
                    height: `${(d.documents / maxDocuments) * 100}%`,
                    minHeight: "4px",
                  }}
                />
                <span className="text-caption text-gray-400 mt-2">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          header={
            <h2 className="text-h3 text-gray-900">Plan Distribution</h2>
          }
        >
          <div className="space-y-4 mt-4">
            {planDistribution.map((p) => (
              <div key={p.plan}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-body-sm font-medium text-gray-700">
                    {p.plan}
                  </span>
                  <span className="text-caption text-gray-500">
                    {p.count.toLocaleString()} ({p.percent}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${p.color} rounded-full transition-all`}
                    style={{ width: `${p.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card
          header={
            <h2 className="text-h3 text-gray-900">Daily API Calls</h2>
          }
        >
          <div className="flex items-end gap-3 h-48 mt-4">
            {dailyUsage.map((d) => (
              <div key={d.day} className="flex flex-col items-center flex-1">
                <span className="text-caption text-gray-500 mb-1">
                  {d.apiCalls}
                </span>
                <div
                  className="w-full bg-secondary/80 rounded-t transition-all hover:bg-secondary"
                  style={{
                    height: `${(d.apiCalls / 700) * 100}%`,
                    minHeight: "4px",
                  }}
                />
                <span className="text-caption text-gray-400 mt-2">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          header={
            <h2 className="text-h3 text-gray-900">System Health</h2>
          }
        >
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-gray-700">Error Rate</span>
              <Badge
                variant={
                  m.errorRate === "0.3%" ? "success" : "warning"
                }
              >
                {m.errorRate}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-gray-700">
                Avg Response Time
              </span>
              <Badge variant="info">{m.avgResponseTime}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-gray-700">Uptime (30d)</span>
              <Badge variant="success">99.97%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-gray-700">
                OpenRouter Keys
              </span>
              <Badge variant="success">5/5 Active</Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card
        header={
          <h2 className="text-h3 text-gray-900">Recent Sign-Ups</h2>
        }
      >
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 font-medium text-gray-500">
                  User
                </th>
                <th className="text-left py-2 px-2 font-medium text-gray-500 hidden sm:table-cell">
                  Plan
                </th>
                <th className="text-left py-2 px-2 font-medium text-gray-500 hidden md:table-cell">
                  Joined
                </th>
                <th className="text-left py-2 px-2 font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-2 px-2">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-caption text-gray-400">
                      {user.email}
                    </p>
                  </td>
                  <td className="py-2 px-2 hidden sm:table-cell">
                    <Badge
                      variant={
                        user.plan === "Pro"
                          ? "info"
                          : user.plan === "Enterprise"
                          ? "success"
                          : "warning"
                      }
                    >
                      {user.plan}
                    </Badge>
                  </td>
                  <td className="py-2 px-2 text-gray-500 hidden md:table-cell">
                    {user.joined}
                  </td>
                  <td className="py-2 px-2">
                    <Badge variant={statusColors[user.status]}>
                      {user.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/admin/users"
            className="text-body-sm text-primary hover:underline"
          >
            View all users &rarr;
          </Link>
        </div>
      </Card>
    </AdminLayout>
  );
}
