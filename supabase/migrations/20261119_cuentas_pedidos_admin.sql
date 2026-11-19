-- ─────────────────────────────────────────────────────────────────────────
-- Cuentas de clientes, pedidos y panel de administrador
--
-- • profiles: datos de cada cliente registrado (se crea solo al registrarse).
-- • admins:   quién puede entrar al panel /admin (se asigna a mano, por SQL).
-- • orders:   cada pedido confirmado en el checkout.
-- • subscribers (ya existía): el admin ahora puede leerla y borrar correos.
--
-- Toda la seguridad vive aquí, en Row Level Security: la web solo tiene la
-- clave pública, así que lo que no permiten estas políticas no se puede
-- hacer desde el navegador, aunque alguien manipule el código de la página.
-- ─────────────────────────────────────────────────────────────────────────

-- Esquema privado: sus funciones no se exponen en la API pública.
create schema if not exists private;
grant usage on schema private to authenticated;

-- ── Administradores ──────────────────────────────────────────────────────
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Cada usuario solo puede ver si él mismo es admin (para mostrar el panel).
create policy "admins: ver mi propia fila"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke execute on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

-- ── Perfiles de clientes ─────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text check (char_length(full_name) <= 80),
  phone text check (char_length(phone) <= 25),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles: ver el mío o todos si soy admin"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy "profiles: editar el mío"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- El cliente solo puede cambiar su nombre y teléfono (no su correo ni su id).
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

-- Crea el perfil automáticamente al registrarse.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    left(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 80),
    left(nullif(trim(new.raw_user_meta_data ->> 'phone'), ''), 25)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Mantiene el correo del perfil al día si el cliente lo cambia.
create or replace function private.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function private.handle_user_email_change();

-- ── Pedidos ──────────────────────────────────────────────────────────────
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique check (order_code ~ '^PIX-[0-9]{6}-[A-Z0-9]{2,8}$'),
  user_id uuid references auth.users (id) on delete set null,
  customer_name text not null check (char_length(customer_name) between 2 and 80),
  customer_email text not null check (char_length(customer_email) between 3 and 120),
  customer_phone text not null check (char_length(customer_phone) between 7 and 25),
  customer_company text check (char_length(customer_company) <= 80),
  customer_country text not null check (char_length(customer_country) between 2 and 60),
  notes text check (char_length(notes) <= 1000),
  items jsonb not null check (
    jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 20
  ),
  briefs jsonb check (briefs is null or pg_column_size(briefs) < 60000),
  total_unico numeric(10, 2) not null default 0 check (total_unico >= 0),
  total_mensual numeric(10, 2) not null default 0 check (total_mensual >= 0),
  payment_method text check (payment_method in ('paypal', 'usdt')),
  status text not null default 'pendiente'
    check (status in ('pendiente', 'pagado', 'en_progreso', 'entregado', 'cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_user_id_idx on public.orders (user_id);
create index orders_created_at_idx on public.orders (created_at desc);
alter table public.orders enable row level security;

-- Cualquiera puede registrar su pedido (con o sin cuenta), siempre como
-- "pendiente" y, si tiene sesión, solo a su propio nombre.
create policy "orders: crear pedido"
  on public.orders for insert to anon, authenticated
  with check (
    status = 'pendiente'
    and (user_id is null or user_id = (select auth.uid()))
  );

create policy "orders: ver los míos o todos si soy admin"
  on public.orders for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy "orders: solo el admin cambia el estado"
  on public.orders for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "orders: solo el admin borra"
  on public.orders for delete to authenticated
  using ((select private.is_admin()));

-- Del pedido ya creado, el admin solo cambia el estado.
revoke update on public.orders from anon, authenticated;
grant update (status) on public.orders to authenticated;
revoke delete on public.orders from anon;

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function private.touch_updated_at();

-- ── Suscriptores (tabla existente) ───────────────────────────────────────
-- Antes solo podían suscribirse visitantes sin sesión; ahora también clientes con cuenta.
alter policy "Anyone can subscribe" on public.subscribers to anon, authenticated;

create policy "subscribers: el admin ve la lista"
  on public.subscribers for select to authenticated
  using ((select private.is_admin()));

create policy "subscribers: el admin borra correos"
  on public.subscribers for delete to authenticated
  using ((select private.is_admin()));

-- Perfiles para las cuentas que ya existieran antes de esta migración.
insert into public.profiles (id, email, full_name, phone)
select
  u.id,
  u.email,
  left(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), 80),
  left(nullif(trim(u.raw_user_meta_data ->> 'phone'), ''), 25)
from auth.users u
where u.email is not null
on conflict (id) do nothing;
