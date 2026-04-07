"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

const apiKeys = [
  { id: 1, name: "OpenRouter Key 1", key: "sk-or-****-abc1", status: "active" as const, calls: 12450 },
  { id: 2, name: "OpenRouter Key 2", key: "sk-or-****-def2", status: "active" as const, calls: 9830 },
  { id: 3, name: "OpenRouter Key 3", key: "sk-or-****-ghi3", status: "active" as const, calls: 7620 },
  { id: 4, name: "OpenRouter Key 4", key: "sk-or-****-jkl4", status: "rate-limited" as const, calls: 5010 },
  { id: 5, name: "OpenRouter Key 5", key: "sk-or-****-mno5", status: "active" as const, calls: 4300 },
];

const statusColors: Record<"active" | "rate-limited" | "disabled", "success" | "info" | "warning" | "error"> = {
  active: "success",
  "rate-limited": "warning",
  disabled: "error",
};

export default function AdminSettingsPage() {
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [platformName, setPlatformName] = useState("ClassPartner.ai");
  const [maxFreePerMonth, setMaxFreePerMonth] = useState("3");
  const [rateLimitPerMin, setRateLimitPerMin] = useState("10");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowSignup, setAllowSignup] = useState(true);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleAddKey = () => {
    console.log("Adding API key:", { name: newKeyName, value: newKeyValue });
    setNewKeyName("");
    setNewKeyValue("");
    setShowAddKeyModal(false);
  };

  const handleTestApi = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise((r) => setTimeout(r, 1500));
    setTestResult("success");
    setTesting(false);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-h2 text-gray-900">Settings</h1>
        <p className="text-body-sm text-gray-500">Manage platform configuration and API keys</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card header={<h2 className="text-h3 text-gray-900">Platform Settings</h2>}>
          <div className="space-y-5">
            <Input
              label="Platform Name"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
            />
            <Input
              label="Max Free Requests Per Month"
              type="number"
              value={maxFreePerMonth}
              onChange={(e) => setMaxFreePerMonth(e.target.value)}
              helperText="Number of AI-generated documents allowed for free tier users"
            />
            <Input
              label="Rate Limit (requests per minute)"
              type="number"
              value={rateLimitPerMin}
              onChange={(e) => setRateLimitPerMin(e.target.value)}
              helperText="Maximum API calls per user per minute"
            />
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-body-sm text-gray-700">Allow New Signups</span>
                <input
                  type="checkbox"
                  checked={allowSignup}
                  onChange={(e) => setAllowSignup(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-body-sm text-gray-700">Maintenance Mode</span>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>
            </div>
            <Button className="w-full">Save Settings</Button>
          </div>
        </Card>

        <Card header={<h2 className="text-h3 text-gray-900">API Key Testing</h2>}>
          <div className="space-y-5">
            <p className="text-body-sm text-gray-500">
              Validate your OpenRouter API keys to ensure they&apos;re working correctly.
            </p>
            <Input
              label="API Key"
              type="password"
              placeholder="Enter API key to test"
            />
            <Button onClick={handleTestApi} disabled={testing} className="w-full">
              {testing ? "Testing..." : "Test API Key"}
            </Button>
            {testResult === "success" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-body-sm">
                API key is valid. Response time: 245ms. Model available: true.
              </div>
            )}
            <Button variant="ghost" onClick={() => setShowTestForm(!showTestForm)} className="w-full">
              {showTestForm ? "Hide" : "Show"} Advanced Test Options
            </Button>
            {showTestForm && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <Input label="Test Prompt" placeholder="Optional: Enter custom prompt" />
                <Input label="Max Tokens" type="number" value="200" />
                <Button variant="secondary" onClick={handleTestApi} disabled={testing} className="w-full">
                  Run Full Test
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6" header={<div className="flex items-center justify-between"><h2 className="text-h3 text-gray-900">OpenRouter API Keys</h2><Button variant="secondary" size="sm" onClick={() => setShowAddKeyModal(true)}>Add Key</Button></div>}>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 font-medium text-gray-500">Name</th>
                <th className="text-left py-2 px-2 font-medium text-gray-500">Key</th>
                <th className="text-left py-2 px-2 font-medium text-gray-500 hidden sm:table-cell">Status</th>
                <th className="text-left py-2 px-2 font-medium text-gray-500 hidden md:table-cell">Total Calls</th>
                <th className="text-left py-2 px-2 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-2 font-medium text-gray-900">{key.name}</td>
                  <td className="py-2 px-2 text-gray-400 font-mono text-caption">{key.key}</td>
                  <td className="py-2 px-2 hidden sm:table-cell">
                    <Badge variant={statusColors[key.status]}>{key.status}</Badge>
                  </td>
                  <td className="py-2 px-2 text-gray-500 hidden md:table-cell">{key.calls.toLocaleString()}</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-1">
                      <button className="text-xs text-primary hover:underline px-1">Test</button>
                      <button className="text-xs text-gray-500 hover:text-gray-700 px-1">Rotate</button>
                      <button className="text-xs text-error hover:underline px-1">Revoke</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showAddKeyModal}
        onClose={() => setShowAddKeyModal(false)}
        title="Add API Key"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Key Name"
            placeholder="e.g., OpenRouter Key 6"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <Input
            label="API Key Value"
            type="password"
            placeholder="sk-or-..."
            value={newKeyValue}
            onChange={(e) => setNewKeyValue(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleAddKey} className="flex-1">
              Add Key
            </Button>
            <Button variant="ghost" onClick={() => setShowAddKeyModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
