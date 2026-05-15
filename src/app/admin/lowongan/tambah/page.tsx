import { createJobAction } from "@/app/admin/lowongan/_actions";
import { JobForm } from "@/components/forms/job-form";
import { getDepartments } from "@/lib/services/jobs";

export default async function AddJobPage() {
  const departments = await getDepartments();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          Tambah Lowongan
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Isi detail lowongan baru dan simpan sebagai draft atau langsung publish.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <JobForm
          departments={departments.map((d) => ({ id: d.id, name: d.name }))}
          action={createJobAction}
          submitLabel="Simpan Lowongan"
        />
      </div>
    </div>
  );
}
