import { notFound } from "next/navigation";

import { updateJobAction } from "@/app/admin/lowongan/_actions";
import { JobForm } from "@/components/forms/job-form";
import { getDepartments, getJobByIdAdmin } from "@/lib/services/jobs";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [job, departments] = await Promise.all([
    getJobByIdAdmin(id),
    getDepartments(),
  ]);

  if (!job) {
    notFound();
  }

  // Find the department id from the departments list matching the job's department code
  const matchedDept = departments.find(
    (d) => d.code === job.departmentCode,
  );

  const defaultValues: Record<string, unknown> = {
    title: job.title,
    slug: job.slug,
    departmentId: matchedDept?.id ?? "",
    employmentType: job.employmentType,
    location: job.location,
    deadline: job.deadline ?? "",
    status: job.status,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    benefits: job.benefits,
  };

  const boundAction = updateJobAction.bind(null, id);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-500">Edit Lowongan</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
          {job.title}
        </h2>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <JobForm
          departments={departments.map((d) => ({ id: d.id, name: d.name }))}
          defaultValues={defaultValues}
          action={boundAction}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  );
}
