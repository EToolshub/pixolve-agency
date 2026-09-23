import Image from "next/image";
import { cn } from "@/lib/utils";

// Recursos generados con `node scripts/build-brand-assets.mjs` a partir de
// los originales en assets/brand/.
const LOGO = { src: "/brand/pixolve-logo.png", width: 1200, height: 440 };
const MARK = { src: "/brand/pixolve-mark.png", width: 600, height: 745 };

/** Logotipo completo "pxolve Agency". */
export function Logo({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={LOGO.src}
      width={LOGO.width}
      height={LOGO.height}
      alt="Pixolve Agency"
      priority={priority}
      className={cn("h-9 w-auto", className)}
    />
  );
}

/** Isotipo (la "X" con la figura naranja). */
export function LogoMark({
  className,
  priority,
  decorative,
}: {
  className?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  return (
    <Image
      src={MARK.src}
      width={MARK.width}
      height={MARK.height}
      alt={decorative ? "" : "Pixolve Agency"}
      aria-hidden={decorative || undefined}
      priority={priority}
      className={cn("h-10 w-auto", className)}
    />
  );
}
