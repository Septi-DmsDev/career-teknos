import Link from "next/link";

import { LinkButton } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-brand">
          Teknos Career
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/lowongan" className="hover:text-brand">
            Lowongan
          </Link>
          <Link href="/privacy" className="hover:text-brand">
            Privasi
          </Link>
        </nav>
        <LinkButton href="/lowongan" size="sm">
          Lamar Sekarang
        </LinkButton>
      </div>
    </header>
  );
}
