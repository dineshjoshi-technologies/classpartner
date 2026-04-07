"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

export default function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [tipsTutorials, setTipsTutorials] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-h2 text-text-primary mb-6">Settings</h1>
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-text-primary mb-1">Notifications</h3>
            <p className="text-body-sm text-text-secondary mb-4">Manage how you receive updates and alerts</p>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-body-sm text-text-primary">Email notifications</span>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-body-sm text-text-primary">Product updates</span>
                <input
                  type="checkbox"
                  checked={productUpdates}
                  onChange={(e) => setProductUpdates(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-body-sm text-text-primary">Tips &amp; tutorials</span>
                <input
                  type="checkbox"
                  checked={tipsTutorials}
                  onChange={(e) => setTipsTutorials(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </label>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-text-primary mb-1">Change Password</h3>
            <p className="text-body-sm text-text-secondary mb-4">Update your password to keep your account secure</p>
            <form className="space-y-4">
              <Input label="Current password" type="password" placeholder="Enter current password" />
              <Input label="New password" type="password" placeholder="Enter new password" />
              <Input label="Confirm new password" type="password" placeholder="Re-enter new password" />
              <Button type="submit">Update Password</Button>
            </form>
          </Card>

          <Card>
            <h3 className="font-semibold text-text-primary mb-1">Appearance</h3>
            <p className="text-body-sm text-text-secondary mb-4">Customize how ClassPartner looks for you</p>
            <div className="space-y-4">
              <Select
                label="Default export format"
                options={[
                  { value: "pdf", label: "PDF" },
                  { value: "docx", label: "Word (DOCX)" },
                  { value: "ppt", label: "PowerPoint (PPT)" },
                ]}
                placeholder="Select a format"
              />
              <Select
                label="Default citation style"
                options={[
                  { value: "apa", label: "APA 7th Edition" },
                  { value: "mla", label: "MLA 9th Edition" },
                  { value: "harvard", label: "Harvard" },
                  { value: "chicago", label: "Chicago" },
                ]}
                placeholder="Select a style"
              />
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-text-primary mb-1">Data Management</h3>
            <p className="text-body-sm text-text-secondary mb-4">Control your data and account information</p>
            <div className="space-y-3">
              <Button variant="secondary">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download My Data
              </Button>
            </div>
          </Card>

          <Card className="border-error/20">
            <h3 className="font-semibold text-error mb-1">Danger Zone</h3>
            <p className="text-body-sm text-text-secondary mb-4">These actions are irreversible. Proceed with caution.</p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="border-error text-error hover:bg-error/5"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
          size="sm"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                className="border-error text-error hover:bg-error/5"
              >
                Delete Permanently
              </Button>
            </div>
          }
        >
          <p className="text-body-sm text-text-secondary">
            Are you sure you want to delete your account? This action cannot be undone.
            All your projects, documents, and data will be permanently removed.
          </p>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
