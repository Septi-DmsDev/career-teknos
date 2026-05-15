import { Button } from "@/components/ui/button";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">Edit lowongan</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">{id}</h2>
      <form className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-800">Judul</span>
          <input className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" />
        </label>
        <Button type="button">Simpan Perubahan</Button>
      </form>
    </div>
  );
}
