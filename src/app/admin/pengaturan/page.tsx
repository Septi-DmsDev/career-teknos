export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">
        Pengaturan
      </h2>
      <dl className="mt-6 grid gap-4 text-sm">
        <div>
          <dt className="font-semibold text-slate-500">Role</dt>
          <dd className="mt-1 text-slate-950">Admin HRD</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Akses</dt>
          <dd className="mt-1 text-slate-950">
            Dikelola melalui Supabase Auth dan tabel admin_profiles.
          </dd>
        </div>
      </dl>
    </div>
  );
}
