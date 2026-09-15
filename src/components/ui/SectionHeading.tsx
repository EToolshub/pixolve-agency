import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-badge-blue px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-badge-blue">
          {eyebrow}
        </span>
      )}
      <h2 className="text-balance mt-4 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-body">
          {description}
        </p>
      )}
    </div>
  );
}
