"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const fetchedUser = await api.getMe();
        updateUser(fetchedUser);
        setName(fetchedUser.name || "");
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [updateUser]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const updated = await api.updateProfile({ name });
      updateUser(updated);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-16">
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-h2 text-text-primary mb-6">Profile</h1>

        {success && (
          <div className="mb-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg text-secondary text-body-sm" role="alert">
            Profile updated successfully
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-body-sm" role="alert">
            {error}
          </div>
        )}

        <Card>
          <div className="space-y-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xl font-bold">
                  {user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                </span>
              </div>
              <div>
                <p className="font-medium text-text-primary">{user?.name || "User"}</p>
                <p className="text-body-sm text-text-secondary">{user?.email}</p>
              </div>
            </div>

            <Input
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />

            <Input
              label="Email address"
              type="email"
              value={email}
              disabled
              helperText="Contact support to change your email"
            />

            {user?.role && (
              <div>
                <label className="block text-text-primary font-medium text-body-sm mb-1.5">Role</label>
                <div className="px-4 py-3 bg-background border border-border rounded-lg text-text-secondary capitalize">
                  {user.role}
                </div>
              </div>
            )}

            {user?.tier && (
              <div>
                <label className="block text-text-primary font-medium text-body-sm mb-1.5">Plan</label>
                <div className="px-4 py-3 bg-background border border-border rounded-lg capitalize">
                  {user.tier === "free" ? "Free" : user.tier === "pro" ? "Pro" : user.tier}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
