import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line/80 bg-white/90 shadow-sm backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
