import { CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatEmploymentType, type JobSummary } from "@/lib/domain";

export function JobCard({ job }: { job: JobSummary }) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{job.departmentName}</Badge>
        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {formatEmploymentType(job.employmentType)}
        </span>
      </div>
      <div className="mt-5 flex-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-950">
          {job.title}
        </h2>
        <div className="mt-4 grid gap-2 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand" />
            {job.location}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand" />
            {job.deadline ? `Batas ${job.deadline}` : "Dibuka sampai terpenuhi"}
          </p>
        </div>
      </div>
      <LinkButton
        href={`/lowongan/${job.slug}`}
        variant="secondary"
        className="mt-6 w-full"
      >
        Lihat Detail
      </LinkButton>
    </Card>
  );
}
