import type { ReactNode } from "react";

import { RecruitmentFraudAlert } from "@/components/public/recruitment-fraud-alert";
import { SiteHeader } from "@/components/public/site-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      {children}
      <RecruitmentFraudAlert />
    </div>
  );
}
