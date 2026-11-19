"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Eye, EyeOff, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldWrapper, Input } from "@/components/ui/Field";
import { supabase } from "@/lib/supabase";
import { authErrorMessage } from "@/lib/account";
import { cn } from "@/lib/utils";

type Mode = "registro" | "ingreso" | "recuperar";

const emailField = z.string().trim().toLowerCase().email("Escribe un correo válido, por ejemplo nombre@empresa.com");

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Escribe tu nombre completo").max(80, "Máximo 80 caracteres"),
  email: emailField,
  phone: z
    .string()
    .trim()
    .regex(/^(\+?[\d\s()-]{7,20})?$/, "Incluye el código de país, por ejemplo +58 412 123 4567")
    .optional(),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .max(72, "Máximo 72 caracteres")
    .regex(/[A-Za-z]/, "Incluye al menos una letra")
    .regex(/\d/, "Incluye al menos un número"),
});

const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Escribe tu contraseña"),
});

const recoverSchema = z.object({ email: emailField });

type RegisterValues = z.infer<typeof registerSchema>;
type LoginValues = z.infer<typeof loginSchema>;
type RecoverValues = z.infer<typeof recoverSchema>;

/** Cuadro de registro / inicio de sesión de clientes (Supabase Auth). */
export function AuthCard({ initialMode = "registro", className }: { initialMode?: Mode; className?: string }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [sentTo, setSentTo] = useState<{ email: string; kind: "confirmar" | "recuperar" } | null>(null);

  if (sentTo) {
    return (
      <div className={cn("rounded-3xl border border-default bg-card p-6 text-center sm:p-8", className)}>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 ring-1 ring-brand-500/20">
          <MailCheck className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-heading">Revisa tu correo</h2>
        <p className="mt-2 text-sm leading-relaxed text-body">
          {sentTo.kind === "confirmar" ? (
            <>Te enviamos un enlace a <strong className="text-heading">{sentTo.email}</strong> para confirmar tu cuenta. Ábrelo y listo: entrarás directo a tu cuenta.</>
          ) : (
            <>Si <strong className="text-heading">{sentTo.email}</strong> tiene una cuenta, te llegará un enlace para crear una nueva contraseña.</>
          )}
        </p>
        <p className="mt-3 text-xs text-muted">¿No lo ves? Revisa la carpeta de spam o promociones.</p>
        <Button
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setSentTo(null);
            setMode("ingreso");
          }}
        >
          Volver a iniciar sesión
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("rounded-3xl border border-default bg-card p-6 sm:p-8", className)}>
      {mode === "recuperar" ? (
        <button
          type="button"
          onClick={() => setMode("ingreso")}
          className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm font-medium text-muted transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
      ) : (
        <div role="tablist" aria-label="Acceso a tu cuenta" className="grid grid-cols-2 gap-1 rounded-full bg-ink-800/70 p-1 ring-1 ring-white/5">
          {(
            [
              { id: "registro", label: "Crear cuenta" },
              { id: "ingreso", label: "Iniciar sesión" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() => setMode(tab.id)}
              className={cn(
                "relative h-11 rounded-full text-sm font-semibold transition-colors",
                mode === tab.id ? "text-ink-950" : "text-body hover:text-white"
              )}
            >
              {mode === tab.id && (
                <motion.span
                  layoutId="auth-tab"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-brand-500"
                />
              )}
              <span className="relative">{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {mode === "registro" && <RegisterForm onConfirmationSent={(email) => setSentTo({ email, kind: "confirmar" })} onGoToLogin={() => setMode("ingreso")} />}
          {mode === "ingreso" && <LoginForm onForgot={() => setMode("recuperar")} />}
          {mode === "recuperar" && <RecoverForm onSent={(email) => setSentTo({ email, kind: "recuperar" })} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RegisterForm({
  onConfirmationSent,
  onGoToLogin,
}: {
  onConfirmationSent: (email: string) => void;
  onGoToLogin: () => void;
}) {
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), mode: "onTouched" });

  async function onSubmit(values: RegisterValues) {
    setFormError("");
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName, phone: values.phone || null },
        emailRedirectTo: `${window.location.origin}/cuenta`,
      },
    });

    if (error) {
      setFormError(authErrorMessage(error));
      return;
    }
    // Con confirmación de correo activa, Supabase no revela si el correo ya
    // existía: devuelve un usuario sin identidades.
    if (data.user && data.user.identities?.length === 0) {
      setFormError(authErrorMessage({ code: "user_already_exists" }));
      return;
    }
    // Sin sesión = hay que confirmar el correo. Con sesión, AuthContext
    // detecta el cambio y la página muestra la cuenta automáticamente.
    if (!data.session) onConfirmationSent(values.email);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
      <FieldWrapper id="reg-name" label="Nombre completo" required error={errors.fullName?.message}>
        <Input id="reg-name" autoComplete="name" placeholder="Ana Pérez" invalid={errors.fullName?.message} {...register("fullName")} />
      </FieldWrapper>
      <FieldWrapper id="reg-email" label="Correo electrónico" required error={errors.email?.message}>
        <Input id="reg-email" type="email" inputMode="email" autoComplete="email" placeholder="nombre@empresa.com" invalid={errors.email?.message} {...register("email")} />
      </FieldWrapper>
      <FieldWrapper id="reg-phone" label="WhatsApp" optional error={errors.phone?.message} hint="Con código de país. Lo usamos para coordinar tus proyectos.">
        <Input id="reg-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+58 412 123 4567" invalid={errors.phone?.message} {...register("phone")} />
      </FieldWrapper>
      <FieldWrapper id="reg-password" label="Contraseña" required error={errors.password?.message} hint="Mínimo 8 caracteres, con letras y números.">
        <PasswordInput id="reg-password" autoComplete="new-password" show={showPassword} onToggle={() => setShowPassword((v) => !v)} invalid={errors.password?.message} {...register("password")} />
      </FieldWrapper>

      <FormError message={formError} action={formError.startsWith("Ya existe") ? { label: "Iniciar sesión", onClick: onGoToLogin } : undefined} />

      <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Creando tu cuenta..." : "Crear mi cuenta"}
      </Button>
      <p className="text-center text-xs leading-relaxed text-muted">
        Al crear tu cuenta aceptas los{" "}
        <Link href="/terminos" className="font-medium text-brand-400 hover:underline">Términos</Link> y la{" "}
        <Link href="/privacidad" className="font-medium text-brand-400 hover:underline">Política de privacidad</Link>.
      </p>
    </form>
  );
}

function LoginForm({ onForgot }: { onForgot: () => void }) {
  const [formError, setFormError] = useState("");
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), mode: "onTouched" });

  async function onSubmit(values: LoginValues) {
    setFormError("");
    setUnconfirmedEmail(null);
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setFormError(authErrorMessage(error));
      if (error.code === "email_not_confirmed") setUnconfirmedEmail(values.email);
    }
  }

  async function resendConfirmation() {
    if (!unconfirmedEmail) return;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: unconfirmedEmail,
      options: { emailRedirectTo: `${window.location.origin}/cuenta` },
    });
    if (error) setFormError(authErrorMessage(error));
    else setResent(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
      <FieldWrapper id="login-email" label="Correo electrónico" error={errors.email?.message}>
        <Input id="login-email" type="email" inputMode="email" autoComplete="email" placeholder="nombre@empresa.com" invalid={errors.email?.message} {...register("email")} />
      </FieldWrapper>
      <div>
        <FieldWrapper id="login-password" label="Contraseña" error={errors.password?.message}>
          <PasswordInput id="login-password" autoComplete="current-password" show={showPassword} onToggle={() => setShowPassword((v) => !v)} invalid={errors.password?.message} {...register("password")} />
        </FieldWrapper>
        <button type="button" onClick={onForgot} className="mt-2 text-xs font-semibold text-brand-400 hover:text-brand-300">
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <FormError
        message={resent ? "" : formError}
        action={unconfirmedEmail && !resent ? { label: "Reenviar correo de confirmación", onClick: resendConfirmation } : undefined}
      />
      {resent && <p className="text-sm text-emerald-400">Listo, te reenviamos el correo de confirmación.</p>}

      <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Entrando..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}

function RecoverForm({ onSent }: { onSent: (email: string) => void }) {
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoverValues>({ resolver: zodResolver(recoverSchema), mode: "onTouched" });

  async function onSubmit({ email }: RecoverValues) {
    setFormError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/cuenta/nueva-clave`,
    });
    if (error) setFormError(authErrorMessage(error));
    else onSent(email);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-heading">Recupera tu contraseña</h2>
        <p className="mt-1.5 text-sm text-body">Te enviaremos un enlace para crear una nueva.</p>
      </div>
      <FieldWrapper id="recover-email" label="Correo de tu cuenta" error={errors.email?.message}>
        <Input id="recover-email" type="email" inputMode="email" autoComplete="email" placeholder="nombre@empresa.com" invalid={errors.email?.message} {...register("email")} />
      </FieldWrapper>
      <FormError message={formError} />
      <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar enlace"}
      </Button>
    </form>
  );
}

export function PasswordInput({
  show,
  onToggle,
  ...props
}: React.ComponentProps<typeof Input> & { show: boolean; onToggle: () => void }) {
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} className="pr-12" {...props} />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-white"
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
      </button>
    </div>
  );
}

function FormError({ message, action }: { message: string; action?: { label: string; onClick: () => void } }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/[0.07] p-3.5 text-sm text-red-300">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p>{message}</p>
        {action && (
          <button type="button" onClick={action.onClick} className="mt-1 font-semibold text-white underline-offset-2 hover:underline">
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
