"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { formatCurrency, buildWhatsAppLink } from "@/lib/utils";
import { getPendingOrder, type PendingOrder } from "@/lib/order-storage";
import { siteConfig } from "@/data/site";

export function OrderConfirmationView() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<PendingOrder | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hidratación desde localStorage al montar
    setOrder(getPendingOrder());
  }, []);

  const whatsappHref = buildWhatsAppLink(
    siteConfig.whatsapp.phoneDigitsOnly,
    `Hola Pixolve Agency 👋, tengo una duda sobre mi pedido ${orderId ?? ""}.`
  );

  return (
    <Container className="max-w-2xl py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-heading">
        ¡Gracias por tu pedido!
      </h1>
      {orderId && (
        <p className="mt-2 text-body">
          Número de pedido: <span className="font-semibold">{orderId}</span>
        </p>
      )}
      <p className="mt-4 text-body">
        Enviamos el resumen de tu pedido por WhatsApp. Si no se abrió
        automáticamente, escríbenos con tu comprobante de pago para
        confirmar tu proyecto.
      </p>

      <div className="mt-8">
        <Button
          href={whatsappHref}
          variant="whatsapp"
          size="lg"
          icon={<MessageCircle className="h-5 w-5" />}
        >
          Abrir WhatsApp
        </Button>
      </div>

      <div className="mt-12 rounded-2xl border border-default p-6 text-left">
        <h2 className="font-bold text-heading">¿Qué sigue ahora?</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-body">
          <li>Nuestro equipo confirmará tu pago en menos de 24 horas hábiles.</li>
          <li>Te contactaremos por WhatsApp o correo para agendar la reunión de arranque.</li>
          <li>Comenzamos la producción de tu proyecto según el tiempo de entrega de tu paquete.</li>
        </ol>
      </div>

      {order && order.items.length > 0 && (
        <div className="mt-6 rounded-2xl bg-alt p-6 text-left">
          <h2 className="font-bold text-heading">Resumen de tu compra</h2>
          <ul className="mt-4 space-y-2">
            {order.items.map((item) => (
              <li key={item.cartItemId} className="flex justify-between text-sm">
                <span className="text-body">
                  {item.packageName} ({item.serviceName})
                </span>
                <span className="font-medium text-heading">
                  {formatCurrency(item.price)}
                  {item.billing === "mensual" ? "/mes" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}
