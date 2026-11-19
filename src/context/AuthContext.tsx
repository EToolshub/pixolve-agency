"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { authRedirect, supabase } from "@/lib/supabase";

type AuthContextValue = {
  user: User | null;
  /** true mientras se recupera la sesión guardada o se verifican los permisos. */
  loading: boolean;
  /** Si la cuenta tiene acceso al panel /admin (lo decide la tabla `admins`). */
  isAdmin: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [adminCheck, setAdminCheck] = useState<{ userId: string; isAdmin: boolean } | null>(null);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setSessionLoading(false);
    });

    // No se llaman otras funciones de Supabase dentro de este callback
    // (puede bloquear el cliente); la verificación de admin va en otro efecto.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSessionLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // Al llegar desde un enlace de correo (que puede caer en cualquier página,
  // p. ej. el inicio), lleva al cliente al lugar correcto con un aviso claro.
  const router = useRouter();
  const redirectHandled = useRef(false);

  useEffect(() => {
    const target = authRedirect;
    if (!target || redirectHandled.current) return;
    redirectHandled.current = true;
    // getSession espera a que supabase-js termine de leer el token del enlace;
    // cambiar la URL antes haría que se perdiera la sesión.
    supabase.auth.getSession().then(() => {
      if (target.kind === "error") {
        router.replace(`/cuenta?enlace=${encodeURIComponent(target.code)}`);
      } else if (target.type === "recovery") {
        if (window.location.pathname !== "/cuenta/nueva-clave") router.replace("/cuenta/nueva-clave");
      } else {
        router.replace("/cuenta?enlace=confirmado");
      }
    });
  }, [router]);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    let active = true;
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setAdminCheck({ userId, isAdmin: Boolean(data) });
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const adminLoading = Boolean(userId) && adminCheck?.userId !== userId;
  const isAdmin = Boolean(userId) && adminCheck?.userId === userId && Boolean(adminCheck?.isAdmin);

  return (
    <AuthContext.Provider value={{ user, loading: sessionLoading || adminLoading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
}
