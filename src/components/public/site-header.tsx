import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { LinkButton } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-extrabold tracking-tight text-brand"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
            <Building2 className="h-4 w-4" />
          </span>
          <span>Teknos Career</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/lowongan" className="transition hover:text-brand">
            Lowongan
          </Link>
          <Link href="/#divisi" className="transition hover:text-brand">
            Divisi
          </Link>
          <Link href="/#proses" className="transition hover:text-brand">
            Proses
          </Link>
          <Link href="/privacy" className="transition hover:text-brand">
            Privasi
          </Link>
        </nav>
        <LinkButton href="/lowongan" size="sm">
          Lamar <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </div>
    </header>
  );
}
