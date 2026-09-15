import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { siteConfig } from "@/data/site";

export function GoogleReviewsBanner() {
  return (
    <section className="py-10">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-default bg-alt p-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card shadow-sm">
              <GoogleIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 font-bold text-heading sm:justify-start">
                Encuéntranos en Google
                <span className="ml-1 flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
                  ))}
                </span>
              </p>
              <p className="text-sm text-body">
                Mira nuestro perfil y las reseñas de clientes anteriores.
              </p>
            </div>
          </div>
          <Button href={siteConfig.googleBusinessUrl} variant="secondary">
            Ver reseñas en Google
          </Button>
        </div>
      </Container>
    </section>
  );
}
