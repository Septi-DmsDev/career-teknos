import { JobCard } from "@/components/public/job-card";
import { LinkButton } from "@/components/ui/button";
import { getActiveJobs } from "@/lib/services/jobs";

export default async function AdminJobsPage() {
  const jobs = await getActiveJobs();

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            Lowongan
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Kelola draft, publish, close, dan archive lowongan.
          </p>
        </div>
        <LinkButton href="/admin/lowongan/tambah">Tambah Lowongan</LinkButton>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
