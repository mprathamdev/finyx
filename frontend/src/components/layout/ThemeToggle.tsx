"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting until client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed right-6 bottom-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-card text-foreground border border-border shadow-fin-floating hover:scale-105 active:scale-95 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-200" />
      ) : (
        <Moon className="w-5 h-5 text-finyx-navy transition-transform duration-200" />
      )}
    </button>
  );
}