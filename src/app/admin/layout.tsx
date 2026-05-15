import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[288px_1fr]">
      <AdminSidebar />
      <main className="min-w-0">
        <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-slate-500">Admin HRD</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Recruitment Dashboard
          </h1>
        </div>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
