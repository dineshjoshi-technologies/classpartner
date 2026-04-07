"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Input } from "@/components/ui/input";

const allUsers = [
  { id: 1, name: "Alice Thompson", email: "alice@university.edu", tier: "Pro", status: "Active", projects: 12, docsGenerated: 34, joined: "2024-03-01" },
  { id: 2, name: "Bob Martinez", email: "bob@college.edu", tier: "Free", status: "Active", projects: 3, docsGenerated: 2, joined: "2024-03-05" },
  { id: 3, name: "Carol Zhang", email: "carol@institute.edu", tier: "Team", status: "Active", projects: 28, docsGenerated: 89, joined: "2024-02-15" },
  { id: 4, name: "David Kim", email: "david@school.edu", tier: "Free", status: "Banned", projects: 1, docsGenerated: 1, joined: "2024-03-10" },
  { id: 5, name: "Eva Johnson", email: "eva@academy.edu", tier: "Pro", status: "Active", projects: 8, docsGenerated: 22, joined: "2024-02-28" },
  { id: 6, name: "Frank Lee", email: "frank@university.edu", tier: "Free", status: "Active", projects: 5, docsGenerated: 5, joined: "2024-03-12" },
  { id: 7, name: "Grace Park", email: "grace@institute.edu", tier: "Pro", status: "Active", projects: 15, docsGenerated: 41, joined: "2024-01-20" },
  { id: 8, name: "Henry Wilson", email: "henry@college.edu", tier: "Free", status: "Suspended", projects: 2, docsGenerated: 8, joined: "2024-03-08" },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === "All" || user.tier === filterTier;
    const matchesStatus = filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter((u) => u.status === "Active").length;
  const proUsers = allUsers.filter((u) => u.tier === "Pro").length;
  const freeUsers = allUsers.filter((u) => u.tier === "Free").length;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
        <p className="text-gray-500">Manage user accounts, tiers, and statuses</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Pro Users</p>
          <p className="text-2xl font-bold text-primary">{proUsers}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Free Users</p>
          <p className="text-2xl font-bold text-gray-600">{freeUsers}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="All">All Tiers</option>
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Team">Team</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Banned">Banned</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">User</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Tier</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Projects</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Docs</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Joined</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs font-bold">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.tier === "Pro" ? "bg-primary/10 text-primary" :
                      user.tier === "Team" ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "Active" ? "bg-green-100 text-green-700" :
                      user.status === "Suspended" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600">{user.projects}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{user.docsGenerated}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{user.joined}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-sm text-primary hover:underline">Edit</button>
                      <span className="text-gray-300">|</span>
                      <button className={`text-sm ${user.status === "Banned" ? "text-green-600 hover:underline" : "text-red-600 hover:underline"}`}>
                        {user.status === "Banned" ? "Unban" : "Ban"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filtered.length} of {allUsers.length} users
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
