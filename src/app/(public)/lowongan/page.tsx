import type { Metadata } from "next";

import { JobFilter } from "@/components/public/job-filter";
import { getActiveJobs } from "@/lib/services/jobs";

export const metadata: Metadata = {
  title: "Lowongan",
};

export default async function JobsPage() {
  const jobs = await getActiveJobs();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-wide text-accent">
          Lowongan Aktif
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-brand">
          Temukan posisi yang sesuai
        </h1>
        <p className="mt-4 text-slate-600">
          Filter berdasarkan divisi atau cari nama posisi yang ingin dilamar.
        </p>
      </div>
      <JobFilter jobs={jobs} />
    </main>
  );
}
