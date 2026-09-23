import Link from "next/link";
import { ArrowUpRight, Clock, Lock, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { footerLegalLinks, navLinks, siteConfig } from "@/data/site";
import { services } from "@/data/services";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/icons/SocialIcons";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";

const socialLinks = [
  { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print relative overflow-hidden border-t border-white/10 bg-ink-950">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]" />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-8 border-b border-white/10 py-12 lg:grid-cols-2">
          <div className="flex items-center gap-5">
            <LogoMark decorative className="hidden h-16 sm:block" />
            <div>
              <h2 className="text-xl font-bold text-heading sm:text-2xl">
                Recibe ofertas, beneficios y lanzamientos
              </h2>
              <p className="mt-1 text-sm text-body">
                Súmate a nuestra lista y sé de los primeros en enterarte. Sin spam.
              </p>
            </div>
          </div>
          <NewsletterForm source="footer" className="w-full lg:justify-self-end" />
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" aria-label="Pixolve Agency, ir al inicio" className="inline-block">
              <Logo className="h-11" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-body">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex gap-2.5">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-body-strong transition-all hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-500 hover:text-ink-950"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Servicios" className="lg:col-span-3">
            {services.map((service) => (
              <FooterLink key={service.slug} href={`/servicios/${service.slug}`}>
                {service.shortName}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Agencia" className="lg:col-span-2">
            {navLinks
              .filter((link) => link.href !== "/" && link.href !== "/servicios")
              .map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
          </FooterColumn>

          <div className="col-span-2 sm:col-span-1 lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle">Contacto</h3>
            <ul className="mt-5 space-y-3.5 text-sm text-body">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href={`mailto:${siteConfig.email}`} className="-my-2.5 inline-block break-all py-2.5 transition-colors hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>{siteConfig.businessHours}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>{siteConfig.location}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>Pagos por PayPal y USDT (Binance Pay). Nunca pedimos datos de tarjeta.</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Wordmark gigante decorativo */}
      <div aria-hidden className="pointer-events-none relative select-none overflow-hidden">
        <p className="text-outline text-center font-display text-[22vw] font-extrabold leading-[0.8] tracking-tighter">
          pixolve
        </p>
      </div>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-subtle">
            © {year} {siteConfig.legalName}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 sm:gap-y-2">
            {footerLegalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="inline-flex min-h-10 items-center text-xs text-subtle transition-colors hover:text-body-strong sm:min-h-0">
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-subtle">{title}</h3>
      <ul className="mt-4 space-y-0.5 sm:mt-5 sm:space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="group inline-flex min-h-10 items-center gap-1 text-sm text-body transition-colors hover:text-white sm:min-h-0">
        {children}
        <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-brand-400" />
      </Link>
    </li>
  );
}
