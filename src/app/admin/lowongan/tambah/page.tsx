import { Button } from "@/components/ui/button";

export default function AddJobPage() {
  return (
    <div className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">
        Tambah Lowongan
      </h2>
      <form className="mt-6 grid gap-4">
        {["Judul", "Slug", "Lokasi", "Deadline"].map((label) => (
          <label key={label} className="grid gap-2">
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            <input className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
          </label>
        ))}
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Deskripsi</span>
          <textarea className="min-h-32 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
        </label>
        <Button type="button">Simpan Draft</Button>
      </form>
    </div>
  );
}
