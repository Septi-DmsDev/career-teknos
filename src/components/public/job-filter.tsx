"use client";

import { Search } from "lucide-react";
import { useDeferredValue, useState } from "react";

import { JobCard } from "@/components/public/job-card";
import { departments, type DepartmentCode, type JobSummary } from "@/lib/domain";
import { cn } from "@/lib/utils";

export function JobFilter({ jobs }: { jobs: JobSummary[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<DepartmentCode | "all">("all");
  const deferredQuery = useDeferredValue(query);

  const filteredJobs = jobs.filter((job) => {
    const matchesDepartment =
      department === "all" || job.departmentCode === department;
    const matchesQuery = job.title
      .toLowerCase()
      .includes(deferredQuery.toLowerCase());

    return matchesDepartment && matchesQuery;
  });

  return (
    <div className="space-y-8">
      <div className="panel-shadow grid gap-4 rounded-xl border border-line/80 bg-white/90 p-4 backdrop-blur md:grid-cols-[minmax(260px,1fr)_auto]">
        <label className="relative block">
          <span className="sr-only">Cari lowongan</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari posisi"
            className="h-12 w-full rounded-lg border border-line bg-paper/70 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </label>
        <div className="flex max-w-3xl flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDepartment("all")}
            className={cn(
              "h-12 rounded-lg border px-4 text-sm font-semibold transition",
              department === "all"
                ? "border-brand bg-brand text-white shadow-sm"
                : "border-line bg-white/70 text-slate-600 hover:border-brand/40 hover:text-brand",
            )}
          >
            Semua
          </button>
          {departments.map((item) => (
            <button
              type="button"
              key={item.code}
              onClick={() => setDepartment(item.code)}
              className={cn(
                "h-12 rounded-lg border px-4 text-sm font-semibold transition",
                department === item.code
                  ? "border-brand bg-brand text-white shadow-sm"
                  : "border-line bg-white/70 text-slate-600 hover:border-brand/40 hover:text-brand",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line bg-white/90 p-10 text-center">
          <h2 className="text-lg font-bold text-slate-950">
            Belum ada lowongan yang cocok
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Coba ubah kata kunci atau filter divisi.
          </p>
        </div>
      )}
    </div>
  );
}
