import type { Metadata } from "next";

import { JobFilter } from "@/components/public/job-filter";
import { GridPattern } from "@/components/ui/grid-pattern";
import { getActiveJobs } from "@/lib/services/jobs";

export const metadata: Metadata = {
  title: "Lowongan",
};

export default async function JobsPage() {
  const jobs = await getActiveJobs();

  return (
    <main>
      <section className="relative overflow-hidden border-b border-line bg-paper">
        <GridPattern
          width={36}
          height={36}
          squares={[
            [1, 2],
            [6, 1],
            [10, 3],
            [15, 2],
          ]}
          className="[mask-image:linear-gradient(to_bottom,white,transparent_80%)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-accent">
              Lowongan Aktif
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-brand">
              Pilih posisi yang paling sesuai dengan pengalaman Anda.
            </h1>
            <p className="mt-4 leading-7 text-slate-600">
              Semua lowongan di halaman ini adalah kanal resmi rekrutmen
              Teknos. Gunakan filter divisi atau cari posisi yang ingin dilamar.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-white/80 p-4 shadow-sm">
              <p className="text-2xl font-black text-brand">{jobs.length}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                lowongan aktif
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white/80 p-4 shadow-sm">
              <p className="text-2xl font-black text-brand">7</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                divisi tersedia
              </p>
            </div>
            <div className="rounded-xl border border-line bg-white/80 p-4 shadow-sm">
              <p className="text-2xl font-black text-brand">Online</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                pengiriman lamaran
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <JobFilter jobs={jobs} />
      </div>
    </main>
  );
}
