import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Lamaran Berhasil",
};

export default function ApplicationSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="w-full rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
        <h1 className="mt-5 text-3xl font-black tracking-tight text-brand">
          Lamaran berhasil dikirim
        </h1>
        <p className="mt-4 text-slate-600">
          Terima kasih. Data lamaran Anda akan diproses oleh tim HRD Teknos.
        </p>
        <LinkButton href="/lowongan" className="mt-7">
          Kembali ke Lowongan
        </LinkButton>
      </div>
    </main>
  );
}
