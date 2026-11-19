"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, LayoutDashboard, Menu, MessageCircle, ShoppingBag, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { navLinks, siteConfig } from "@/data/site";
import { services, getStartingPrice } from "@/data/services";
import { iconMap } from "@/lib/icon-map";
import { buildWhatsAppLink, cn, formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const desktopLinks = navLinks.filter((link) => link.href !== "/" && link.href !== "/servicios");

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, openCart } = useCart();
  const { user, isAdmin } = useAuth();
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra menús al navegar.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza con la ruta
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Bloquea el scroll del fondo con el menú móvil abierto.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setServicesOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [servicesOpen]);

  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    siteConfig.whatsapp.defaultMessage
  );

  return (
    <header className="no-print sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-full border px-3 pl-5 transition-all duration-500 sm:px-4 sm:pl-6",
          scrolled || menuOpen
            ? "border-white/10 bg-header shadow-[0_10px_40px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <Link href="/" className="flex shrink-0 items-center py-1.5" aria-label="Pixolve Agency, ir al inicio">
          <Logo priority className="h-8 sm:h-9" />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          <div
            ref={servicesRef}
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-controls="menu-servicios"
              onClick={() => setServicesOpen((v) => !v)}
              className={cn(
                "relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive(pathname, "/servicios") ? "text-white" : "text-body hover:text-white"
              )}
            >
              {isActive(pathname, "/servicios") && <ActivePill />}
              <span className="relative">Servicios</span>
              <ChevronDown
                className={cn("relative h-4 w-4 transition-transform duration-300", servicesOpen && "rotate-180")}
              />
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  id="menu-servicios"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3"
                >
                  <div className="grid grid-cols-2 gap-1 rounded-3xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl backdrop-blur-xl">
                    {services.map((service) => {
                      const Icon = iconMap[service.icon];
                      return (
                        <Link
                          key={service.slug}
                          href={`/servicios/${service.slug}`}
                          className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-white/5"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20 transition-colors group-hover:bg-brand-500 group-hover:text-ink-950">
                            {Icon && <Icon className="h-5 w-5" />}
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-heading">
                              {service.shortName}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted">
                              Desde {formatCurrency(getStartingPrice(service))}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                    <Link
                      href="/servicios"
                      className="group flex items-center justify-between rounded-2xl bg-brand-500/10 p-3 text-sm font-semibold text-brand-300 ring-1 ring-brand-500/20 transition-colors hover:bg-brand-500 hover:text-ink-950"
                    >
                      Ver todos los servicios
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {desktopLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-white" : "text-body hover:text-white"
                )}
              >
                {active && <ActivePill />}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              href="/admin"
              aria-label="Panel de administrador"
              title="Panel de administrador"
              className={cn(
                "hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 sm:flex",
                isActive(pathname, "/admin") ? "text-brand-400" : "text-heading"
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
            </Link>
          )}
          <Link
            href="/cuenta"
            aria-label={user ? "Mi cuenta" : "Iniciar sesión o crear cuenta"}
            title={user ? "Mi cuenta" : "Iniciar sesión"}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10",
              isActive(pathname, "/cuenta") ? "text-brand-400" : "text-heading"
            )}
          >
            <UserRound className="h-5 w-5" />
            {user && (
              <span aria-hidden className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-ink-950" />
            )}
          </Link>
          <CartButton count={count} onClick={openCart} />
          <Button href="/servicios" size="sm" className="hidden lg:inline-flex" icon={<ArrowRight className="h-4 w-4" />} iconPosition="right">
            Empezar proyecto
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-heading transition-colors hover:bg-white/10 lg:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[5rem] z-40 overflow-y-auto bg-ink-950/98 px-5 pb-10 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Menú móvil" className="mx-auto max-w-lg pt-4">
              <p className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-subtle">Servicios</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {services.map((service, i) => {
                  const Icon = iconMap[service.icon];
                  return (
                    <motion.div
                      key={service.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i }}
                    >
                      <Link
                        href={`/servicios/${service.slug}`}
                        className="flex h-full flex-col gap-2 rounded-2xl border border-default bg-card p-3.5"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                          {Icon && <Icon className="h-4.5 w-4.5" />}
                        </span>
                        <span className="text-sm font-semibold text-heading">{service.shortName}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <ul className="mt-6 divide-y divide-white/5 border-y border-white/5">
                {navLinks
                  .filter((link) => link.href !== "/servicios")
                  .map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + 0.04 * i }}
                    >
                      <Link
                        href={link.href}
                        aria-current={isActive(pathname, link.href) ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between py-4 font-display text-lg font-semibold",
                          isActive(pathname, link.href) ? "text-brand-400" : "text-heading"
                        )}
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4 text-subtle" />
                      </Link>
                    </motion.li>
                  ))}
              </ul>

              <div className="mt-8 grid gap-3">
                <Button href="/servicios" fullWidth size="lg">
                  Empezar proyecto
                </Button>
                {isAdmin && (
                  <Button href="/admin" variant="secondary" fullWidth size="lg" icon={<LayoutDashboard className="h-5 w-5" />}>
                    Panel de administrador
                  </Button>
                )}
                <Button href="/cuenta" variant="secondary" fullWidth size="lg" icon={<UserRound className="h-5 w-5" />}>
                  {user ? "Mi cuenta" : "Iniciar sesión / Crear cuenta"}
                </Button>
                <Button href={whatsappHref} variant="secondary" fullWidth size="lg" icon={<MessageCircle className="h-5 w-5" />}>
                  Escribir por WhatsApp
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function ActivePill() {
  return (
    <motion.span
      layoutId="nav-active-pill"
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-white/10"
    />
  );
}

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-heading transition-colors hover:bg-white/10"
      aria-label={count > 0 ? `Abrir carrito (${count} ${count === 1 ? "servicio" : "servicios"})` : "Abrir carrito"}
    >
      <ShoppingBag className="h-5 w-5" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-ink-950 ring-2 ring-ink-950"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
