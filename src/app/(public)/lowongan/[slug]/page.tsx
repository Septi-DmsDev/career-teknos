import { ArrowRight, CalendarDays, FileText, MapPin, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { formatEmploymentType } from "@/lib/domain";
import { getJobBySlug } from "@/lib/services/jobs";

type JobDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  return {
    title: job ? job.title : "Lowongan",
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
      <article className="panel-shadow rounded-2xl border border-line bg-white/90 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge>{job.departmentName}</Badge>
          <Badge className="bg-white text-slate-600">
            {formatEmploymentType(job.employmentType)}
          </Badge>
        </div>
        <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-brand">
          {job.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            {job.location}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-accent" />
            {job.deadline ? `Batas ${job.deadline}` : "Dibuka sampai terpenuhi"}
          </span>
        </div>
        <p className="mt-8 rounded-xl border border-line bg-paper p-5 text-lg leading-8 text-slate-700">
          {job.description}
        </p>
        <Section title="Tanggung Jawab" items={job.responsibilities} />
        <Section title="Kualifikasi" items={job.requirements} />
        <Section title="Benefit" items={job.benefits} />
      </article>
      <aside className="panel-shadow h-fit rounded-2xl border border-line bg-white/90 p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-extrabold text-slate-950">Kirim lamaran</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Siapkan CV, KTP, dan Ijazah sebelum mengisi form lamaran.
        </p>
        <div className="mt-5 grid gap-3">
          <div className="flex gap-3 rounded-xl border border-line bg-paper p-3">
            <FileText className="mt-0.5 h-4 w-4 text-accent" />
            <p className="text-sm font-medium leading-6 text-slate-600">
              Form lamaran dikirim langsung melalui kanal resmi Teknos.
            </p>
          </div>
          <div className="flex gap-3 rounded-xl border border-line bg-paper p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-fresh" />
            <p className="text-sm font-medium leading-6 text-slate-600">
              Dokumen kandidat tidak ditampilkan ke publik.
            </p>
          </div>
        </div>
        <LinkButton href={`/lowongan/${job.slug}/lamar`} className="mt-5 w-full">
          Lamar Sekarang <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </aside>
    </main>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-extrabold text-slate-950">{title}</h2>
      <ul className="mt-4 grid gap-3 text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
