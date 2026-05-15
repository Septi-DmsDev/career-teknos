import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Login Admin",
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-accent">
          Admin HRD
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-brand">
          Masuk Dashboard
        </h1>
        <form className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-800">Email</span>
            <input
              type="email"
              className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-800">
              Password
            </span>
            <input
              type="password"
              className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <Button type="button" className="mt-2">
            Masuk
          </Button>
        </form>
      </div>
    </main>
  );
}
