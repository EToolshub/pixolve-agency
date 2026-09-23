import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "brand",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "brand" | "neutral" | "green";
}) {
  const tones = {
    brand: "bg-badge-brand text-badge-brand ring-brand-500/25",
    neutral: "bg-white/5 text-body-strong ring-white/10",
    green: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/25",
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
