"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DOCUMENT_TYPE_LABELS } from "@/lib/domain";

interface Document {
  id: string;
  document_type: string;
  file_name: string;
}

interface Props {
  documents: Document[];
}

export function DocumentList({ documents }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  async function handleDownload(doc: Document) {
    setLoadingId(doc.id);
    setErrorId(null);

    try {
      const res = await fetch(`/api/documents/${doc.id}/download`);
      if (!res.ok) throw new Error("Gagal mengambil URL unduhan.");
      const json = await res.json() as { url?: string };
      if (!json.url) throw new Error("URL tidak tersedia.");
      window.open(json.url, "_blank", "noopener,noreferrer");
    } catch {
      setErrorId(doc.id);
    } finally {
      setLoadingId(null);
    }
  }

  if (documents.length === 0) {
    return (
      <p className="text-sm text-slate-500">Tidak ada dokumen yang diunggah.</p>
    );
  }

  return (
    <ul className="grid gap-3">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {DOCUMENT_TYPE_LABELS[doc.document_type] ?? doc.document_type}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">{doc.file_name}</p>
            {errorId === doc.id && (
              <p className="mt-1 text-xs text-red-600">Gagal mengunduh dokumen.</p>
            )}
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleDownload(doc)}
            disabled={loadingId === doc.id}
          >
            {loadingId === doc.id ? "Memuat…" : "Unduh"}
          </Button>
        </li>
      ))}
    </ul>
  );
}
