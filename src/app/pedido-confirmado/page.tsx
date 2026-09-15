import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmationView } from "@/components/checkout/OrderConfirmationView";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false },
};

export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationView />
    </Suspense>
  );
}
