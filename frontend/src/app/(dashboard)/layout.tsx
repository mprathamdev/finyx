// src/app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}