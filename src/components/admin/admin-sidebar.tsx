import {
  BriefcaseBusiness,
  Download,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/lowongan", label: "Lowongan", icon: BriefcaseBusiness },
  { href: "/admin/pelamar", label: "Pelamar", icon: Users },
  { href: "/admin/export", label: "Export", icon: Download },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="border-r border-slate-200 bg-white lg:min-h-screen lg:w-72">
      <div className="flex h-16 items-center border-b border-slate-200 px-5">
        <Link href="/admin/dashboard" className="font-bold text-brand">
          Teknos HRD
        </Link>
      </div>
      <nav className="grid gap-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
