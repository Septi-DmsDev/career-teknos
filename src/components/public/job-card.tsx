import { ArrowUpRight, CalendarDays, MapPin, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatEmploymentType, type JobSummary } from "@/lib/domain";

export function JobCard({ job }: { job: JobSummary }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_18px_44px_rgba(15,34,55,0.12)]">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{job.departmentName}</Badge>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {formatEmploymentType(job.employmentType)}
        </span>
      </div>
      <div className="mt-5 flex-1">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-950 transition group-hover:text-brand">
          {job.title}
        </h2>
        <div className="mt-4 grid gap-2.5 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            {job.location}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-accent" />
            {job.deadline ? `Batas ${job.deadline}` : "Dibuka sampai terpenuhi"}
          </p>
          {typeof job.applicantCount === "number" && (
            <p className="flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-fresh" />
              {job.applicantCount} pelamar masuk
            </p>
          )}
        </div>
      </div>
      <LinkButton
        href={`/lowongan/${job.slug}`}
        variant="secondary"
        className="mt-6 w-full justify-between"
      >
        Lihat Detail <ArrowUpRight className="h-4 w-4" />
      </LinkButton>
    </Card>
  );
}
