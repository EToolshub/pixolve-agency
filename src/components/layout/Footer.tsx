import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { footerLegalLinks, navLinks, siteConfig } from "@/data/site";
import { services } from "@/data/services";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/icons/SocialIcons";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="border-b border-white/10">
        <Container className="flex flex-col items-center justify-between gap-6 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-lg font-bold text-white">
              Recibe ofertas, beneficios y lanzamientos
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Súmate a nuestra lista y sé de los primeros en enterarte.
            </p>
          </div>
          <NewsletterForm source="footer" className="w-full sm:w-auto" />
        </Container>
      </div>

      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-base font-bold text-white">
              P
            </span>
            <span className="text-lg font-bold text-white">{siteConfig.name}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            {siteConfig.description}
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-colors hover:bg-blue-600 hover:text-white"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-colors hover:bg-blue-600 hover:text-white"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-colors hover:bg-blue-600 hover:text-white"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Navegación
          </h3>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Servicios
          </h3>
          <ul className="mt-4 space-y-2.5">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/servicios/${service.slug}`}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {service.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contacto
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
              <span>{siteConfig.location}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {year} {siteConfig.legalName}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLegalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
