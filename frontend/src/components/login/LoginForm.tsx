"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Phone, X } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleAuthRedirect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-fin-floating">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-sm text-muted-foreground mt-1">Access your FinYX account</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-secondary p-1 rounded-lg mb-6">
        <button
          type="button"
          onClick={() => setLoginMethod("email")}
          className={`flex-1 text-xs font-semibold py-2 rounded-md transition-all ${
            loginMethod === "email" ? "bg-card text-foreground shadow-fin-sm" : "text-muted-foreground"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod("phone")}
          className={`flex-1 text-xs font-semibold py-2 rounded-md transition-all ${
            loginMethod === "phone" ? "bg-card text-foreground shadow-fin-sm" : "text-muted-foreground"
          }`}
        >
          Phone Number
        </button>
      </div>

      <form onSubmit={handleAuthRedirect} className="space-y-4">
        {loginMethod === "email" ? (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-medium text-muted-foreground">Password</label>
            <button
              type="button"
              onClick={() => alert("Redirecting to password recovery...")}
              className="text-xs font-medium text-[#0B63F6] hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-finyx-accent-gradient text-white font-medium py-2.5 rounded-lg shadow-fin-sm hover:opacity-95 transition-opacity mt-2 cursor-pointer"
        >
          Sign In
        </button>
      </form>

      <div className="relative my-6 text-center">
        <hr className="border-border" />
        <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-xs text-muted-foreground">
          OR
        </span>
      </div>

      <div className="space-y-3">
        {/* Fixed Google Icon (Custom Inline SVG) */}
        <button
          type="button"
          onClick={() => handleAuthRedirect()}
          className="w-full flex items-center justify-center gap-2.5 bg-background border border-border py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setIsRegisterOpen(true)}
            className="text-[#0B63F6] font-semibold hover:underline inline-block cursor-pointer"
          >
            Register
          </button>
        </p>
      </div>

      {/* Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-fin-floating">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-foreground mb-1">Create an Account</h3>
            <p className="text-xs text-muted-foreground mb-4">Enter basic details to join FinYX</p>

            <form onSubmit={handleAuthRedirect} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Contact Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email ID</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-finyx-accent-gradient text-white font-medium py-2.5 rounded-lg shadow-fin-sm hover:opacity-95 transition-opacity mt-4 cursor-pointer"
              >
                Register & Enter Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}