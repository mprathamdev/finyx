"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileUp, 
  BarChart3, 
  User, 
  LogOut, 
  KeyRound, 
  MoreVertical,
  Tags,
  Wallet,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

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

  const user = {
    name: "Alex Morgan",
    email: "alex.m@finyx.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-40 w-full shadow-fin-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-finyx-accent-gradient flex items-center justify-center text-white shadow-fin-sm">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Fin<span className="text-[#0B63F6]">YX</span>
          </span>
        </div>

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

      {/* Sidebar Container (Responsive Sheet on Mobile, Fixed Panel on Desktop) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 bg-card border-r border-border h-screen flex flex-col justify-between p-4 shadow-fin-card transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-finyx-accent-gradient flex items-center justify-center text-white shadow-fin-sm">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Fin<span className="text-[#0B63F6]">YX</span>
              </span>
            </div>

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

        {/* User Profile Footer */}
        <div className="relative border-t border-border pt-4">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-border"
              />
              <div className="truncate">
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <MoreVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>

          {/* Profile Menu Dropdown */}
          {isProfileOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-card border border-border rounded-xl shadow-fin-floating p-1.5 space-y-1 z-50">
              <Link
                href="/profile"
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                Profile Tab
              </Link>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  alert("Password reset instructions sent.");
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors w-full text-left"
              >
                <KeyRound className="w-4 h-4 text-muted-foreground" />
                Forgot Password
              </button>
              <hr className="border-border my-1" />
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsMobileOpen(false);
                  router.push("/login");
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}