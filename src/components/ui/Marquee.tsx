import { cn } from "@/lib/utils";

/** Cinta infinita horizontal. Se pausa al pasar el cursor. */
export function Marquee({
  items,
  className,
  itemClassName,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
}) {
  const loop = [...items, ...items];
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]">
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= items.length || undefined}
            className={cn("flex items-center whitespace-nowrap", itemClassName)}
          >
            {item}
            <span className="mx-8 inline-block h-2.5 w-2.5 rotate-45 rounded-[3px] bg-brand-500" />
          </span>
        ))}
      </div>
    </div>
  );
}
