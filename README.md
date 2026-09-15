# Pixolve Agency

Sitio web / e-commerce de servicios para **Pixolve Agency**: diseño gráfico,
manejo de redes sociales, diseño UI/UX, creación de páginas web y hosting.
Construido con Next.js 16 (App Router), TypeScript y Tailwind CSS v4.

## Antes de publicar: edita esto

Todo el contenido editable vive en `src/data/`. No necesitas tocar
componentes para actualizar textos o precios.

| Archivo | Qué contiene |
| --- | --- |
| [`src/data/site.ts`](src/data/site.ts) | Número de WhatsApp, correo, redes sociales, datos de pago (PayPal.me, wallet USDT) |
| [`src/data/services.ts`](src/data/services.ts) | Servicios, paquetes y precios |
| [`src/data/faq.ts`](src/data/faq.ts) | Preguntas frecuentes |
| [`src/data/process.ts`](src/data/process.ts) | Pasos del proceso de trabajo |

Busca los comentarios `// TODO` en `src/data/site.ts` — son los datos que
**debes** reemplazar antes de salir a producción:

- `whatsapp.phoneDigitsOnly` / `whatsapp.displayNumber` — tu número real de WhatsApp Business.
- `payments.paypal.meLink` / `payments.paypal.email` — tu enlace y correo de PayPal.
- `payments.usdt.walletAddress` / `binancePayId` — tu wallet/ID real de Binance Pay.
- `social.*` — tus redes sociales reales.
- `url` — tu dominio final una vez lo conectes en Vercel.

Ninguno de estos valores es secreto (son datos públicos pensados para
mostrarse en la web), así que viven directamente en el código y no en
variables de entorno.

## Cómo funciona el flujo de compra

1. El cliente navega `/servicios`, entra al detalle de un servicio y agrega
   uno o más paquetes al carrito (persistido en `localStorage`).
2. En `/carrito` revisa su pedido y continúa a `/checkout`, donde deja sus
   datos de contacto.
3. En `/checkout/pago` elige PayPal o USDT (Binance Pay), ve las
   instrucciones y confirma su pedido.
4. Al confirmar, se genera un número de pedido y se abre WhatsApp con un
   mensaje prellenado (resumen del pedido + datos del cliente) para que el
   cliente envíe su comprobante de pago directamente a tu WhatsApp Business.
5. El cliente llega a `/pedido-confirmado` con el resumen y los próximos
   pasos.

Este es un flujo de **pago manual guiado**: no requiere claves secretas de
API ni una base de datos, y funciona desde el primer día. Si más adelante
quieres automatizar la captura de pagos (PayPal Checkout SDK con
verificación server-side, o Binance Pay API), se puede añadir sobre esta
misma base sin rehacer el sitio.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build de producción

```bash
npm run build
npm start
```

## Estructura del proyecto

```
src/
  app/            Páginas (App Router)
  components/     Componentes de UI, layout, servicios, checkout, etc.
  context/        Contexto del carrito de compras (React Context + localStorage)
  data/           Contenido editable (servicios, FAQ, proceso, config del sitio)
  lib/            Utilidades (formato de moneda, enlaces de WhatsApp, etc.)
```

## Despliegue

El proyecto está listo para desplegarse en [Vercel](https://vercel.com) sin
configuración adicional: Vercel detecta Next.js automáticamente. Conecta el
repositorio de GitHub a un nuevo proyecto de Vercel y cada `push` a la rama
principal generará un nuevo despliegue.
