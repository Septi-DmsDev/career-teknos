"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const supabase = createBrowserSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Email atau password salah.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-xl font-black text-white shadow">
            T
          </div>
          <p className="mt-3 text-sm font-bold uppercase tracking-widest text-slate-500">
            Admin HRD
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
            Masuk Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Masukkan kredensial akun HRD Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-800">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              placeholder="admin@teknos.id"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-800">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              placeholder="••••••••"
            />
          </label>

          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending ? "Memproses…" : "Masuk"}
          </Button>
        </form>
      </div>
    </main>
  );
}
