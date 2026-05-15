import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-brand">
          Kebijakan Privasi Kandidat
        </h1>
        <div className="mt-6 space-y-4 leading-7 text-slate-700">
          <p>
            Data lamaran digunakan hanya untuk proses rekrutmen Teknos. Dokumen
            kandidat disimpan pada bucket private dan hanya dapat diakses admin
            HRD yang terautentikasi.
          </p>
          <p>
            Informasi kandidat tidak dipublikasikan dan tidak digunakan untuk
            kebutuhan di luar proses seleksi tanpa persetujuan tambahan.
          </p>
        </div>
      </div>
    </main>
  );
}
