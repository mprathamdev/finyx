"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Phone, X, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";

export function LoginForm() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login Form States
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Registration Form States
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (loginMethod === "email") {
        await authService.loginWithEmail(email, password);
      } else {
        throw new Error("Phone password authentication requires SMS OTP configured in Supabase.");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await authService.loginWithGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || "Google authentication failed.");
      setLoading(false);
    }
  };

  // Handle User Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await authService.signUp({
        email: regEmail,
        password: regPassword,
        fullName: regFullName,
        phoneNumber: regPhone,
      });
      setIsRegisterOpen(false);
      alert("Registration successful! Proceeding to dashboard.");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-fin-floating">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-sm text-muted-foreground mt-1">Access your FinYX account</p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-medium text-center">
          {errorMessage}
        </div>
      )}

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

      <form onSubmit={handleLogin} className="space-y-4">
        {loginMethod === "email" ? (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-finyx-accent-gradient text-white font-medium py-2.5 rounded-lg shadow-fin-sm hover:opacity-95 transition-opacity mt-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
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

      {/* Registration Modal */}
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

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Contact Number</label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email ID</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#0B63F6]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-finyx-accent-gradient text-white font-medium py-2.5 rounded-lg shadow-fin-sm hover:opacity-95 transition-opacity mt-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Register & Enter Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}