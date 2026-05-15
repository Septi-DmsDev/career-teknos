import { ArrowRight, BriefcaseBusiness, CheckCircle2, Factory } from "lucide-react";

import { JobCard } from "@/components/public/job-card";
import { LinkButton } from "@/components/ui/button";
import { departments } from "@/lib/domain";
import { getLatestJobs } from "@/lib/services/jobs";

export default async function HomePage() {
  const latestJobs = await getLatestJobs();

  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">
              Career Teknos
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-brand sm:text-5xl">
              Bangun karier di lingkungan kerja produksi yang rapi dan bertumbuh.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Temukan posisi yang sesuai, kirim lamaran tanpa akun kandidat, dan
              biarkan tim HRD Teknos memproses data Anda dari satu sistem resmi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/lowongan" size="lg">
                Lihat Lowongan <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/privacy" variant="secondary" size="lg">
                Kebijakan Data
              </LinkButton>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-brand p-3 text-white">
                <Factory className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Divisi rekrutmen aktif
                </p>
                <p className="text-2xl font-bold text-slate-950">7 Divisi</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {departments.map((department) => (
                <div
                  key={department.code}
                  className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-slate-700">
                    {department.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent">
              <BriefcaseBusiness className="h-4 w-4" />
              Lowongan terbaru
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Posisi yang sedang dibuka
            </h2>
          </div>
          <LinkButton href="/lowongan" variant="secondary">
            Semua Lowongan
          </LinkButton>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {latestJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </main>
  );
}
