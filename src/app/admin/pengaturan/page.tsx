import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function AdminSettingsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          Pengaturan
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Informasi akun admin Anda.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-5 text-sm">
          <div className="grid gap-1">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </dt>
            <dd className="text-base font-semibold text-slate-950">
              {user.email ?? "-"}
            </dd>
          </div>

          <div className="grid gap-1">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              User ID
            </dt>
            <dd className="font-mono text-slate-700">{user.id}</dd>
          </div>

          <div className="grid gap-1">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Login Terakhir
            </dt>
            <dd className="text-slate-700">
              {user.last_sign_in_at
                ? formatDate(user.last_sign_in_at, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </dd>
          </div>

          <div className="grid gap-1">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Role
            </dt>
            <dd className="text-slate-700">Admin HRD</dd>
          </div>
        </dl>

        <div className="mt-6 rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Untuk mengubah password, silakan gunakan Supabase Auth Dashboard atau
          fitur reset password yang dikirim ke email Anda.
        </div>
      </div>
    </div>
  );
}
