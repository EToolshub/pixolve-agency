"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { navLinks, siteConfig } from "@/data/site";
import { useCart } from "@/context/CartContext";

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-default-80 bg-header backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-base font-bold text-white shadow-md shadow-blue-600/30">
            P
          </span>
          <span className="text-lg font-bold tracking-tight text-heading">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-body transition-colors hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-body transition-colors hover:bg-alt-2 hover:text-blue-600"
            aria-label="Ver carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Button href="/servicios" size="sm">
            Ver servicios
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/carrito"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-body hover:bg-alt-2"
            aria-label="Ver carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-body-strong hover:bg-alt-2"
            aria-label="Abrir menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-default bg-card lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-body-strong hover:bg-alt hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/servicios" className="mt-2" onClick={() => setOpen(false)}>
              Ver servicios
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
