import { ArrowUpRight, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { siteConfig } from "@/data/site";

export function GoogleReviewsBanner() {
  return (
    <section className="cv-auto py-6 sm:py-8">
      <Container>
        <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl border border-default bg-card p-6 text-center sm:flex-row sm:p-8 sm:text-left">
          <div aria-hidden className="pointer-events-none absolute -left-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-lg">
              <GoogleIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="flex flex-wrap items-center justify-center gap-2 font-display text-lg font-bold text-heading sm:justify-start">
                Encuéntranos en Google
                <span className="flex items-center gap-0.5 text-amber-400" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill="currentColor" />
                  ))}
                </span>
              </p>
              <p className="mt-1 text-sm text-body">
                Mira nuestro perfil verificado y las reseñas de clientes que ya trabajaron con nosotros.
              </p>
            </div>
          </div>
          <Button
            href={siteConfig.googleBusinessUrl}
            variant="secondary"
            fullWidth
            className="relative sm:w-auto"
            icon={<ArrowUpRight className="h-4 w-4" />}
            iconPosition="right"
          >
            Ver reseñas en Google
          </Button>
        </div>
      </Container>
    </section>
  );
}
