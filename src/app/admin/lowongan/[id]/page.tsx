export default async function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">Lowongan ID</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950">{id}</h2>
      <p className="mt-4 text-slate-600">
        Detail lowongan akan dihubungkan ke service CRUD pada fase berikutnya.
      </p>
    </div>
  );
}
