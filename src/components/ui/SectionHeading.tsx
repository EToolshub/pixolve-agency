import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-300",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  /** Parte final del título que se pinta con el degradado de marca. */
  highlight?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag
        className={cn(
          "text-balance mt-5 font-bold tracking-tight text-heading",
          Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
        )}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <span className="text-gradient-brand">{highlight}</span>
          </>
        )}
      </Tag>
      {description && (
        <p className="text-balance mt-5 text-lg leading-relaxed text-body">{description}</p>
      )}
    </div>
  );
}
