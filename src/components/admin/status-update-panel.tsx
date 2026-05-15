"use client";

import { useTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { updateApplicantStatusAction } from "@/app/admin/pelamar/_actions";
import {
  applicantStatuses,
  APPLICANT_STATUS_LABELS,
} from "@/lib/domain";
import type { ApplicantStatus } from "@/lib/domain";

interface Props {
  applicantId: string;
  currentStatus: ApplicantStatus;
}

export function StatusUpdatePanel({ applicantId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicantStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateApplicantStatusAction(
        applicantId,
        selectedStatus,
        note.trim() || undefined,
      );

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setNote("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-700">Update Status</p>
        <p className="mt-0.5 text-xs text-slate-500">
          Status saat ini:{" "}
          <span className="font-semibold text-slate-800">
            {APPLICANT_STATUS_LABELS[currentStatus]}
          </span>
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
          Status berhasil diperbarui.
        </p>
      )}

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-slate-600">
          Status Baru
        </span>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as ApplicantStatus)}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
        >
          {applicantStatuses.map((s) => (
            <option key={s} value={s}>
              {APPLICANT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-slate-600">
          Catatan (opsional)
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
          placeholder="Catatan perubahan status…"
        />
      </label>

      <Button
        type="submit"
        disabled={isPending || selectedStatus === currentStatus}
        size="sm"
      >
        {isPending ? "Menyimpan…" : "Update Status"}
      </Button>
    </form>
  );
}
