-- ─────────────────────────────────────────────────────────────────────────
-- Endurecimiento de seguridad (auditoría 21/11/2026)
--
-- 1. Quita permisos sobrantes que Supabase concede por defecto a los roles
--    públicos (anon / authenticated). RLS ya bloqueaba casi todo, pero así
--    no dependemos de una sola capa (defensa en profundidad).
-- 2. Valida formato y tamaño de correos para que nadie guarde basura.
-- 3. Frena inundaciones de pedidos o suscripciones falsas (spam / DoS)
--    hechas con la clave pública directamente contra la API.
-- ─────────────────────────────────────────────────────────────────────────

-- ── 1. Permisos mínimos ─────────────────────────────────────────────────
revoke truncate, references, trigger on all tables in schema public from anon, authenticated;

-- admins: nadie la modifica desde la web; solo se lee la propia fila.
revoke all on public.admins from anon, authenticated;
grant select on public.admins to authenticated;

-- subscribers: el público solo puede suscribirse (correo + origen).
revoke all on public.subscribers from anon, authenticated;
grant insert (email, source) on public.subscribers to anon, authenticated;
grant select, delete on public.subscribers to authenticated; -- filtrado por RLS: solo admin

-- orders: el público solo crea pedidos con las columnas del checkout
-- (no puede fijar id, estado ni fechas). El admin lee, cambia estado y borra.
revoke all on public.orders from anon, authenticated;
grant insert (
  order_code, user_id, customer_name, customer_email, customer_phone,
  customer_company, customer_country, notes, items, briefs,
  total_unico, total_mensual, payment_method
) on public.orders to anon, authenticated;
grant select, delete on public.orders to authenticated; -- filtrado por RLS
grant update (status) on public.orders to authenticated; -- filtrado por RLS: solo admin

-- profiles: nadie anónimo la lee.
revoke all on public.profiles from anon;
revoke all on public.profiles from authenticated;
grant select on public.profiles to authenticated; -- filtrado por RLS
grant update (full_name, phone) on public.profiles to authenticated;

-- Las funciones de triggers no deben ser invocables por los roles públicos.
revoke execute on function private.handle_new_user() from public, anon, authenticated;
revoke execute on function private.handle_user_email_change() from public, anon, authenticated;
revoke execute on function private.touch_updated_at() from public, anon, authenticated;

-- ── 2. Validación de datos ──────────────────────────────────────────────
alter table public.subscribers
  add constraint subscribers_email_formato
    check (char_length(email) between 6 and 254 and email ~* '^[^@\s<>"'']+@[^@\s<>"'']+\.[a-z]{2,}$'),
  add constraint subscribers_source_largo
    check (source is null or char_length(source) <= 40);

alter table public.orders
  add constraint orders_email_formato
    check (customer_email ~* '^[^@\s<>"'']+@[^@\s<>"'']+\.[a-z]{2,}$'),
  add constraint orders_items_tamano
    check (pg_column_size(items) < 20000);

-- ── 3. Límites anti-spam ────────────────────────────────────────────────
create or replace function private.limitar_pedidos()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.orders
        where customer_email = new.customer_email
          and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Demasiados pedidos con este correo. Intenta más tarde.'
      using errcode = 'P0001';
  end if;
  if (select count(*) from public.orders
        where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'Demasiados pedidos en poco tiempo. Intenta más tarde.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke execute on function private.limitar_pedidos() from public, anon, authenticated;

create trigger orders_limitar_spam
  before insert on public.orders
  for each row execute function private.limitar_pedidos();

create or replace function private.limitar_suscripciones()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.subscribers
        where created_at > now() - interval '10 minutes') >= 40 then
    raise exception 'Demasiadas suscripciones en poco tiempo. Intenta más tarde.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke execute on function private.limitar_suscripciones() from public, anon, authenticated;

create trigger subscribers_limitar_spam
  before insert on public.subscribers
  for each row execute function private.limitar_suscripciones();
