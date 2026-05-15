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
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-accent">
          Form Lamaran
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-brand">
          Lamar {job.title}
        </h1>
        <p className="mt-4 text-slate-600">
          Isi data secara lengkap. Form ini akan dihubungkan ke Supabase pada
          fase integrasi submit.
        </p>
      </div>
      <ApplicationForm job={job} />
    </main>
  );
}
