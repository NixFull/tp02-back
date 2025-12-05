import * as React from "react";
import { cn } from "../../lib/utils";

export function Alert({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700",
        className,
      )}
      {...props}
    />
  );
}
