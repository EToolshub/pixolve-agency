import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "blue",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "blue" | "slate" | "green";
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
    slate: "bg-slate-100 text-slate-700 ring-slate-500/20",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
