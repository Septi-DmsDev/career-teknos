"use client";

import { useTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { addApplicantNoteAction } from "@/app/admin/pelamar/_actions";

interface Props {
  applicantId: string;
}

export function NotePanel({ applicantId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await addApplicantNoteAction(applicantId, note);

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
      <p className="text-sm font-semibold text-slate-700">Tambah Catatan</p>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
          Catatan berhasil ditambahkan.
        </p>
      )}

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-slate-600">Catatan</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          required
          className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
          placeholder="Tulis catatan internal…"
        />
      </label>

      <Button type="submit" disabled={isPending || !note.trim()} size="sm" variant="secondary">
        {isPending ? "Menyimpan…" : "Simpan Catatan"}
      </Button>
    </form>
  );
}
