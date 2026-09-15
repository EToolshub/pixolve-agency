import { ArrowUpRight } from "lucide-react";
import type { PortfolioItem } from "@/data/portfolio";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <a
      href={item.behanceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-alt-2"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- imagen remota del CDN público de Behance */}
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="mb-1 inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
          {item.category}
        </span>
        <p className="flex items-center gap-1 text-sm font-semibold text-white">
          {item.title}
          <ArrowUpRight className="h-4 w-4 shrink-0" />
        </p>
      </div>
    </a>
  );
}
