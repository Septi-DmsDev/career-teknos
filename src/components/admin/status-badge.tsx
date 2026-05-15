import { APPLICANT_STATUS_COLORS, APPLICANT_STATUS_LABELS } from "@/lib/domain";
import type { ApplicantStatus } from "@/lib/domain";
import { cn } from "@/lib/utils";

interface Props {
  status: ApplicantStatus;
  className?: string;
}

export function StatusBadge({ status, className }: Props) {
  const label = APPLICANT_STATUS_LABELS[status] ?? status;
  const color = APPLICANT_STATUS_COLORS[status] ?? "bg-slate-100 text-slate-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        color,
        className,
      )}
    >
      {label}
    </span>
  );
}
