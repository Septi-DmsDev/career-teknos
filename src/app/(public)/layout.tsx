import type { ReactNode } from "react";

import { SiteHeader } from "@/components/public/site-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      {children}
    </div>
  );
}
