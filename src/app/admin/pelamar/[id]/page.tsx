import { Button } from "@/components/ui/button";

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">Pelamar ID</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">{id}</h2>
        <p className="mt-4 text-slate-600">
          Detail kandidat, timeline status, dan activity log akan memakai data
          Supabase pada fase integrasi.
        </p>
      </section>
      <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950">Aksi HRD</h3>
        <div className="mt-5 grid gap-4">
          <select className="h-11 rounded-md border border-slate-200 px-3 text-sm">
            <option>screening</option>
            <option>shortlisted</option>
            <option>interview</option>
            <option>accepted</option>
            <option>rejected</option>
          </select>
          <textarea
            placeholder="Catatan internal"
            className="min-h-28 rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
          <Button type="button">Simpan</Button>
        </div>
      </aside>
    </div>
  );
}
