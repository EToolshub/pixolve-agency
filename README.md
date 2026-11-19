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

## Marca y diseño

- Paleta: naranja de marca `#F15A23` sobre negros cálidos (`ink-*`), definida
  como tokens en [`src/app/globals.css`](src/app/globals.css). Usa las clases
  `brand-*` / `ink-*` en lugar de colores sueltos.
- Tipografías: Sora (títulos) y Plus Jakarta Sans (texto).
- Logo, isotipo, favicon e íconos se generan desde los originales en
  `assets/brand/` con `node scripts/build-brand-assets.mjs`. Si cambias el
  logo, reemplaza esos JPG y vuelve a ejecutar el script.

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
   Al mismo tiempo, el sitio envía en segundo plano un correo con el mismo
   resumen a `pixolveagency@gmail.com` (ver "Notificación de pedidos por
   correo" abajo) para que quede un registro de todos los pedidos.
5. El cliente llega a `/pedido-confirmado` con el resumen y los próximos
   pasos.

Este es un flujo de **pago manual guiado**: no requiere claves secretas de
API ni una base de datos, y funciona desde el primer día. Si más adelante
quieres automatizar la captura de pagos (PayPal Checkout SDK con
verificación server-side, o Binance Pay API), se puede añadir sobre esta
misma base sin rehacer el sitio.

## Base de datos de suscriptores

El footer incluye un formulario de "Recibe ofertas, beneficios y lanzamientos"
que guarda el correo en una base de datos de Supabase (proyecto
`pixolve-agency`, tabla `subscribers`). La URL y la clave pública viven en
[`src/lib/supabase.ts`](src/lib/supabase.ts) — no son secretas, están
protegidas por Row Level Security: cualquiera puede suscribirse, pero nadie
puede leer ni exportar la lista desde el navegador.

Para ver o exportar los correos, entra al
[panel de Supabase](https://supabase.com/dashboard/project/gqjptrcvkbzotzserdop/editor)
→ tabla `subscribers`.

## Cuentas de clientes y panel de administrador

- **`/cuenta`** — cuadro de registro e inicio de sesión (Supabase Auth, correo
  + contraseña). Con sesión iniciada, el cliente ve sus pedidos y su estado,
  edita su nombre y WhatsApp, y el checkout se le completa solo. El ícono de
  persona del menú lleva aquí.
- **`/admin`** — panel solo para administradores: pedidos (con su briefing,
  botón de WhatsApp/correo y cambio de estado), clientes registrados y
  suscriptores (con exportación a CSV). Avisa si un pedido trae precios que
  no coinciden con el catálogo.
- Cada pedido confirmado se guarda en la tabla `orders` además de enviarse
  por WhatsApp y correo. Si Supabase falla, el checkout sigue funcionando.

Tablas, triggers y reglas de seguridad (RLS) están en
[`supabase/migrations/`](supabase/migrations/). La seguridad vive en la base
de datos: un cliente solo ve sus propios pedidos, no puede cambiar su estado
ni hacerse admin, aunque manipule el código de la página.

### Dar acceso de administrador

El panel no tiene una contraseña aparte: es tu cuenta normal con permiso de
admin. Regístrate en `/cuenta` y luego, en Supabase → **SQL Editor**, ejecuta
(cambiando el correo):

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'tu-correo@ejemplo.com';
```

Para quitar el acceso: `delete from public.admins where user_id = (select id from auth.users where email = '...');`

### Configuración necesaria en Supabase (una sola vez)

1. **Authentication → URL Configuration**: *Site URL* =
   `https://pixolve-agency.vercel.app` (o tu dominio) y en *Redirect URLs*
   agrega `https://pixolve-agency.vercel.app/**` y `http://localhost:3000/**`.
   Sin esto, los enlaces de confirmación y de "olvidé mi contraseña" apuntan
   a `localhost`.
2. **Authentication → Emails → SMTP Settings**: el servidor de correo gratis
   de Supabase **solo envía a los miembros de tu equipo**, así que tus
   clientes no recibirían el correo de confirmación y el registro fallaría.
   Activa *Custom SMTP* con Gmail: host `smtp.gmail.com`, puerto `465`,
   usuario `pixolveagency@gmail.com` y la misma contraseña de aplicación de
   16 caracteres de la sección de abajo. (Alternativa rápida pero menos
   segura: desactivar *Confirm email* en Authentication → Providers → Email.)

> El plan gratis de Supabase **pausa el proyecto tras 7 días sin actividad**
> y entonces ni el registro ni la suscripción funcionan. Si pasa, entra al
> panel de Supabase y pulsa *Restore project*.

## Notificación de pedidos por correo

Cada vez que un cliente confirma un pedido, `POST /api/notify-order`
([`src/app/api/notify-order/route.ts`](src/app/api/notify-order/route.ts))
envía un correo con el resumen completo (servicios, precio, datos del
cliente y briefing) a `pixolveagency@gmail.com`, usando el propio Gmail
como servidor SMTP. Si algo falla (o las credenciales no están
configuradas), el pedido sigue confirmándose normalmente por WhatsApp — el
correo es un respaldo, no un bloqueo.

**Para activarlo en producción**, faltan 3 pasos únicos (5 minutos):

1. En la cuenta de Google de `pixolveagency@gmail.com`, activa la
   **verificación en dos pasos**: [myaccount.google.com/security](https://myaccount.google.com/security).
2. Genera una **contraseña de aplicación**: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   → elige "Otra" como app, ponle un nombre como "Pixolve Web", y copia la
   contraseña de 16 caracteres que te genera (sin espacios).
3. En Vercel: tu proyecto → **Settings → Environment Variables**, agrega:
   - `GMAIL_USER` = `pixolveagency@gmail.com`
   - `GMAIL_APP_PASSWORD` = la contraseña de 16 caracteres del paso 2

   Guarda y vuelve a desplegar (Vercel → Deployments → ⋯ → Redeploy) para
   que tomen efecto.

Estas dos variables sí son secretas — a diferencia del resto de la
configuración del sitio, **no** viven en el código ni se suben a GitHub.

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
  context/        Carrito de compras (localStorage) y sesión del usuario (Supabase Auth)
  data/           Contenido editable (servicios, FAQ, proceso, config del sitio)
  lib/            Utilidades (formato de moneda, enlaces de WhatsApp, etc.)
```

## Despliegue

El proyecto está listo para desplegarse en [Vercel](https://vercel.com) sin
configuración adicional: Vercel detecta Next.js automáticamente. Conecta el
repositorio de GitHub a un nuevo proyecto de Vercel y cada `push` a la rama
principal generará un nuevo despliegue.
