"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { applicantStatuses, APPLICANT_STATUS_LABELS } from "@/lib/domain";

export default function AdminExportPage() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function handleExport() {
    setError(null);
    startTransition(async () => {
      try {
        const params = new URLSearchParams();
        if (status) params.set("status", status);

        const url = `/api/export/applicants${params.toString() ? `?${params.toString()}` : ""}`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Export gagal: ${res.statusText}`);
        }

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        const suffix = status ? `-${status}` : "";
        link.download = `pelamar${suffix}-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Export gagal.");
      }
    });
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          Export Pelamar
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Download data pelamar dalam format CSV. Filter status opsional.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-800">
              Filter Status (opsional)
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Semua Status</option>
              {applicantStatuses.map((s) => (
                <option key={s} value={s}>
                  {APPLICANT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>

          <Button
            type="button"
            onClick={handleExport}
            disabled={isPending}
            className="mt-2 w-fit"
          >
            {isPending ? "Mengunduh…" : "Export CSV"}
          </Button>
        </div>
      </div>
    </div>
  );
}
