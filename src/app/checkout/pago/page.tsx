import type { Metadata } from "next";
import { PaymentView } from "@/components/checkout/PaymentView";

export const metadata: Metadata = {
  title: "Método de pago",
  robots: { index: false },
};

export default function PagoPage() {
  return <PaymentView />;
}
