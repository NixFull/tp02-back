import * as React from "react";
import { cn } from "../../lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
