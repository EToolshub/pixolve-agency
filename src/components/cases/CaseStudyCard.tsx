import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LoopVideo } from "@/components/cases/LoopVideo";
import type { CaseMedia, CaseStudy } from "@/data/cases";
import { cn } from "@/lib/utils";

function WebMockup({ media }: { media: Extract<CaseMedia, { kind: "web" }> }) {
  return (
    <div className="relative pb-10 pr-[14%] sm:pb-14">
      {/* Ventana de navegador con la captura de escritorio */}
      <div className="overflow-hidden rounded-2xl border border-default bg-ink-900 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]">
        <div className="flex items-center gap-1.5 border-b border-default px-3 py-2.5 sm:px-4 sm:py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="ml-2 truncate rounded-full bg-white/5 px-3 py-1 text-[11px] text-muted sm:ml-3 sm:text-xs">
            {media.domain}
          </span>
        </div>
        <div className="relative aspect-[16/10]">
          <Image
            src={media.desktop.src}
            alt={media.desktop.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 50vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* Celular con la versión móvil, montado sobre la esquina */}
      <div className="absolute bottom-0 right-0 w-[27%] overflow-hidden rounded-[1.1rem] border-[3px] border-ink-600 bg-ink-950 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.95)] sm:rounded-[1.6rem] sm:border-[5px]">
        <div className="relative aspect-[390/844]">
          <Image
            src={media.mobile.src}
            alt={media.mobile.alt}
            fill
            sizes="(max-width: 1024px) 25vw, 14vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

function VideoMockup({ media }: { media: Extract<CaseMedia, { kind: "video" }> }) {
  return (
    <div className="grid grid-cols-3 items-center gap-3 py-4 sm:gap-5">
      {media.clips.map((clip, index) => (
        <figure key={clip.src} className={cn(index === 1 ? "-translate-y-3 sm:-translate-y-5" : "translate-y-3 sm:translate-y-5")}>
          <div className="relative aspect-[9/16] overflow-hidden rounded-[1.1rem] border-[3px] border-ink-600 bg-ink-900 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.95)] sm:rounded-[1.6rem] sm:border-[5px]">
            <LoopVideo src={clip.src} poster={clip.poster} label={`Fragmento de un Short de la serie ${clip.label}`} />
          </div>
          <figcaption className="mt-3 text-center text-[11px] font-medium text-muted sm:text-xs">{clip.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function CaseStudyCard({ caseStudy, reverse = false }: { caseStudy: CaseStudy; reverse?: boolean }) {
  const { media } = caseStudy;

  return (
    <article className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <div className={cn(reverse && "lg:order-2")}>
        {media.kind === "web" ? <WebMockup media={media} /> : <VideoMockup media={media} />}
      </div>

      <div className={cn(reverse && "lg:order-1")}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold text-ink-950">
            {caseStudy.service}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/25">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {caseStudy.status}
          </span>
        </div>

        <p className="mt-5 text-sm font-semibold text-body-strong">
          {caseStudy.client} <span className="font-normal text-muted">· {caseStudy.sector}</span>
        </p>
        <h3 className="text-balance mt-2 text-2xl font-bold tracking-tight text-heading sm:text-3xl">
          {caseStudy.title}
        </h3>
        <p className="mt-4 leading-relaxed text-body">{caseStudy.challenge}</p>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">Qué hicimos</p>
        <ul className="mt-3 space-y-2.5">
          {caseStudy.work.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-body-strong">
              <Check className="mt-1 h-4 w-4 shrink-0 text-brand-400" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Etiquetas del proyecto">
          {caseStudy.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-body ring-1 ring-inset ring-white/10">
              {tag}
            </li>
          ))}
        </ul>

        <Button
          href={caseStudy.link.href}
          className="mt-8"
          icon={<ArrowUpRight className="h-4 w-4" />}
          iconPosition="right"
        >
          {caseStudy.link.label}
        </Button>
      </div>
    </article>
  );
}
