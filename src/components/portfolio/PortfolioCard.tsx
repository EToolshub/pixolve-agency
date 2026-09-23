import { ArrowUpRight } from "lucide-react";
import type { PortfolioItem } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function PortfolioCard({ item, className }: { item: PortfolioItem; className?: string }) {
  return (
    <a
      href={item.behanceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-default bg-alt-2",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- imagen remota del CDN público de Behance */}
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/20 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0 translate-y-1 transition-transform duration-300 group-hover:translate-y-0">
          <span className="inline-flex w-fit items-center rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold text-ink-950">
            {item.category}
          </span>
          <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">{item.title}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 scale-75 items-center justify-center rounded-full bg-white text-ink-950 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}
