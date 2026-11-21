"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "duplicate" | "error";

export function NewsletterForm({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");

    const { error } = await supabase
      .from("subscribers")
      .insert({ email: email.trim().toLowerCase(), source });

    if (!error) {
      setStatus("success");
      setEmail("");
      return;
    }

    setStatus(error.code === "23505" ? "duplicate" : "error");
  }

  if (status === "success") {
    return (
      <p className={cn("flex items-center gap-2 text-sm font-medium text-emerald-400", className)}>
        <Check className="h-4 w-4" />
        ¡Listo! Te avisaremos de nuevas ofertas y lanzamientos.
      </p>
    );
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-full sm:flex-row sm:border sm:border-white/10 sm:bg-white/[0.03] sm:p-1.5">
        <input
          id={`newsletter-${source}`}
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          aria-label="Tu correo electrónico"
          autoComplete="email"
          className="h-12 w-full min-w-0 rounded-full border border-white/10 bg-white/[0.03] px-5 text-base text-white sm:flex-1 sm:text-sm outline-none transition placeholder:text-subtle focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 sm:h-11 sm:w-72 sm:border-transparent sm:bg-transparent sm:focus:ring-0"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-brand-500 px-6 text-sm font-semibold text-ink-950 transition-all hover:bg-brand-400 disabled:opacity-60 sm:h-11"
        >
          {status === "loading" ? "Enviando..." : "Suscribirme"}
          {status !== "loading" && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
      {status === "duplicate" && (
        <p className="mt-2 text-xs text-muted">
          Ese correo ya está suscrito. ¡Gracias por tu interés!
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-red-400">
          Algo salió mal. Intenta de nuevo en un momento.
        </p>
      )}
    </div>
  );
}
