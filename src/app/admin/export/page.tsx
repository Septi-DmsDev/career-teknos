import { Download } from "lucide-react";

import { LinkButton } from "@/components/ui/button";

export default function AdminExportPage() {
  return (
    <div className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">
        Export Pelamar
      </h2>
      <p className="mt-2 text-slate-600">
        Export CSV akan menggunakan endpoint server agar filter dan audit log
        tetap berada di boundary aman.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          placeholder="Divisi"
          className="h-11 rounded-md border border-slate-200 px-3 text-sm"
        />
        <input
          placeholder="Status"
          className="h-11 rounded-md border border-slate-200 px-3 text-sm"
        />
      </div>
      <LinkButton href="/api/export/applicants" className="mt-6">
        <Download className="h-4 w-4" />
        Export CSV
      </LinkButton>
    </div>
  );
}
