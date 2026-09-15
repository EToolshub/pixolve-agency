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
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className="w-full min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-64"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/25 disabled:opacity-60"
        >
          {status === "loading" ? "Enviando..." : "Suscribirme"}
          {status !== "loading" && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
      {status === "duplicate" && (
        <p className="mt-2 text-xs text-slate-400">
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
