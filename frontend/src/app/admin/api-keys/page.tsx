"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const apiKeys = [
  { id: 1, name: "OpenRouter Key 1", key: "sk-or-v-••••••••••••8392", provider: "OpenRouter", models: "All Free Tier", status: "Active", usage: 8442, limit: 10000, created: "2024-03-01" },
  { id: 2, name: "OpenRouter Key 2", key: "sk-or-v-••••••••••••7261", provider: "OpenRouter", models: "All Free Tier", status: "Active", usage: 6210, limit: 10000, created: "2024-03-05" },
  { id: 3, name: "OpenAI GPT-4 Key", key: "sk-proj-••••••••••••4829", provider: "OpenAI", models: "gpt-4, gpt-4-turbo", status: "Active", usage: 4580, limit: 5000, created: "2024-03-10" },
  { id: 4, name: "Claude 3 Key", key: "sk-ant-••••••••••••3147", provider: "Anthropic", models: "claude-3-opus, claude-3-sonnet", status: "Rate Limited", usage: 9850, limit: 10000, created: "2024-03-12" },
];

export default function AdminApiKeysPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredKeys = apiKeys.filter(
    (k) =>
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-h2 text-gray-900">API Keys</h1>
          <p className="text-body-sm text-gray-500">Manage AI provider API keys and monitor usage</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Key
        </Button>
      </div>

      <div className="mb-6 max-w-sm">
        <Input
          placeholder="Search keys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredKeys.map((key) => {
          const usagePct = Math.round((key.usage / key.limit) * 100);
          return (
            <Card key={key.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{key.name}</h3>
                  <p className="text-caption text-gray-500">{key.provider}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-caption font-medium ${
                    key.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {key.status}
                </span>
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-mono">{key.key}</p>
                <p className="text-xs text-gray-400 mt-0.5">Models: {key.models}</p>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Usage</span>
                  <span>
                    {key.usage.toLocaleString()} / {key.limit.toLocaleString()} ({usagePct}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usagePct > 90
                        ? "bg-red-500"
                        : usagePct > 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${usagePct}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-primary hover:underline">Edit</button>
                <span className="text-gray-300">|</span>
                <button className="text-sm text-gray-500 hover:text-gray-700">Rotate</button>
                <span className="text-gray-300">|</span>
                <button className="text-sm text-red-600 hover:text-red-700">Revoke</button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add API Key"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button>Add Key</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Key Name" placeholder="e.g., OpenRouter Key 3" />
          <Input label="Provider" placeholder="e.g., OpenRouter, OpenAI, Anthropic" />
          <Input label="API Key" type="password" placeholder="Paste your API key" />
          <Input label="Allowed Models" placeholder="e.g., All Free Tier, gpt-4, claude-3-opus" />
          <Input label="Monthly Limit" type="number" placeholder="e.g., 10000" helperText="Number of requests before rate limiting" />
        </div>
      </Modal>
    </AdminLayout>
  );
}
