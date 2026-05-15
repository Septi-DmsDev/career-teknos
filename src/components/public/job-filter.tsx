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
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Cari lowongan</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari posisi"
            className="h-11 w-full rounded-md border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDepartment("all")}
            className={cn(
              "h-11 rounded-md border px-4 text-sm font-semibold transition",
              department === "all"
                ? "border-brand bg-brand text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand/40",
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
                "h-11 rounded-md border px-4 text-sm font-semibold transition",
                department === item.code
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand/40",
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
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
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
