import { ClipboardList } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ApplicationForm } from "@/components/forms/application-form";
import { getJobBySlug } from "@/lib/services/jobs";

type ApplyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ApplyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  return {
    title: job ? `Lamar ${job.title}` : "Lamar Lowongan",
  };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-5 rounded-2xl border border-line bg-paper p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent">
            <ClipboardList className="h-4 w-4" />
            Form Lamaran
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-brand">
            Lamar {job.title}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Lengkapi data sesuai dokumen Anda. Tim HRD akan memakai kontak yang
            tercantum untuk proses lanjutan.
          </p>
        </div>
        <div className="rounded-xl border border-line bg-white px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Posisi
          </p>
          <p className="mt-1 font-extrabold text-slate-950">
            {job.departmentName}
          </p>
        </div>
      </div>
      <ApplicationForm job={job} />
    </main>
  );
}
