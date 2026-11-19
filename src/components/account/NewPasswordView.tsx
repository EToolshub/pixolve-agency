"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FieldWrapper } from "@/components/ui/Field";
import { PasswordInput } from "@/components/account/AuthCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { authErrorMessage } from "@/lib/account";

const schema = z.object({
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(72, "Máximo 72 caracteres")
    .regex(/[A-Za-z]/, "Incluye al menos una letra")
    .regex(/\d/, "Incluye al menos un número"),
});

type Values = z.infer<typeof schema>;

/**
 * Destino del enlace "Recupera tu contraseña": Supabase inicia la sesión con
 * el token del enlace y aquí el cliente elige su nueva contraseña.
 */
export function NewPasswordView() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: "onTouched" });

  async function onSubmit({ password }: Values) {
    setFormError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setFormError(authErrorMessage(error));
    else router.replace("/cuenta");
  }

  if (loading) return <Container className="min-h-[70vh] py-16" />;

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-default bg-card p-6 sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
          <KeyRound className="h-5 w-5" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-heading">Crea una nueva contraseña</h1>
        {user ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
            <FieldWrapper id="new-password" label="Nueva contraseña" error={errors.password?.message} hint="Mínimo 8 caracteres, con letras y números.">
              <PasswordInput id="new-password" autoComplete="new-password" show={show} onToggle={() => setShow((v) => !v)} invalid={errors.password?.message} {...register("password")} />
            </FieldWrapper>
            {formError && <p role="alert" className="text-sm text-red-400">{formError}</p>}
            <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar contraseña"}
            </Button>
          </form>
        ) : (
          <>
            <p className="mt-2 text-body">El enlace no es válido o ya venció. Pide uno nuevo desde «¿Olvidaste tu contraseña?».</p>
            <Button href="/cuenta" className="mt-6">Ir a iniciar sesión</Button>
          </>
        )}
      </div>
    </Container>
  );
}
