"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  FileUp,
  BarChart3,
  LogOut,
  KeyRound,
  MoreVertical,
  Tags,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { userService, UserProfile } from "@/services/user.service";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Category", href: "/category", icon: Tags },
  { label: "Add Expense", href: "/add-expense", icon: PlusCircle },
  { label: "Upload Statement", href: "/upload-statement", icon: FileUp },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Dynamic user state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        setIsLoadingUser(true);
        const profile = await userService.getCurrentUser();
        setUser(profile);
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      setIsProfileOpen(false);
      setIsMobileOpen(false);
      await authService.logout();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-40 w-full shadow-fin-sm">
        <Link href="/dashboard" className="flex items-center">
          {/* Light Theme Logo */}
          <Image
            src="/logo/logo.png"
            alt="FinYX Logo"
            width={120}
            height={36}
            className="h-8 w-auto object-contain block dark:hidden"
            priority
          />
          {/* Dark Theme Logo */}
          <Image
            src="/logo/dark-logo.png"
            alt="FinYX Logo"
            width={120}
            height={36}
            className="h-8 w-auto object-contain hidden dark:block"
            priority
          />
        </Link>

        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop Overlay for Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 bg-card border-r border-border h-screen flex flex-col justify-between p-4 shadow-fin-card transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-2 py-1">
            <Link href="/dashboard" className="flex items-center">
              {/* Light Theme Logo */}
              <Image
                src="/logo/logo.png"
                alt="FinYX Logo"
                width={140}
                height={42}
                className="h-9 w-auto object-contain block dark:hidden"
                priority
              />
              {/* Dark Theme Logo */}
              <Image
                src="/logo/dark-logo.png"
                alt="FinYX Logo"
                width={140}
                height={42}
                className="h-9 w-auto object-contain hidden dark:block"
                priority
              />
            </Link>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#0B63F6]/10 text-[#0B63F6] font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#0B63F6]" : "text-muted-foreground"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dynamic User Profile Footer */}
        <div className="relative border-t border-border pt-4">
          {isLoadingUser ? (
            <div className="flex items-center gap-3 p-2 rounded-lg animate-pulse">
              <div className="w-9 h-9 rounded-full bg-secondary shrink-0" />
              <div className="space-y-1.5 flex-1 overflow-hidden">
                <div className="h-3.5 bg-secondary rounded w-3/4" />
                <div className="h-2.5 bg-secondary rounded w-1/2" />
              </div>
            </div>
          ) : user ? (
            <>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        user.name
                      )}`;
                    }}
                  />
                  <div className="truncate">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <MoreVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>

              {/* Profile Menu Dropdown */}
              {isProfileOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-card border border-border rounded-xl shadow-fin-floating p-1.5 space-y-1 z-50">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      alert(`Password reset link sent to ${user.email}`);
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-muted-foreground" />
                    Forgot Password
                  </button>
                  <hr className="border-border my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-2 text-xs text-muted-foreground text-center">
              User not authenticated
            </div>
          )}
        </div>
      </aside>
    </>
  );
}