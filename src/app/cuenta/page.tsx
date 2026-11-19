import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Crea tu cuenta en Pixolve Agency o inicia sesión para seguir tus pedidos.",
  robots: { index: false },
};

export default function CuentaPage() {
  return (
    <Suspense fallback={null}>
      <AccountView />
    </Suspense>
  );
}
