"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { useAuth } from "@/lib/use-auth";

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showDropdown]);

  function handleLogout() {
    setShowDropdown(false);
    logout();
  }

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center px-6 justify-between sticky top-0 z-10">
      <button
        onClick={onMenuToggle}
        className="lg:hidden text-text-secondary hover:text-text-primary p-1"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-text-secondary hover:text-text-primary transition-colors" aria-label="Notifications">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full" />
        </button>

        <div className="relative" data-user-menu>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 focus:outline-none"
            aria-label="User menu"
            aria-expanded={showDropdown}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">
                {user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
              </span>
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-lg shadow-lg border border-border z-20">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-medium text-text-primary">{user?.name || "User"}</p>
                <p className="text-caption text-text-secondary">{user?.email || ""}</p>
              </div>
              <div className="py-1">
                <Link href="/dashboard/profile" className="block px-3 py-2 text-sm text-text-secondary hover:bg-gray-100">
                  Profile
                </Link>
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-gray-100">Account Settings</button>
                <button className="w-full text-left px-3 py-2 text-sm text-accent hover:bg-gray-100">Upgrade Plan</button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/5"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
