create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'student' check (role in ('student','admin')),
  is_blocked boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_brl numeric(10,2) not null,
  is_active boolean not null default true,
  cover_url text,
  whatsapp_group_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  content_type text not null check (content_type in ('html_local','external_link')),
  local_path text,
  external_url text,
  is_active boolean not null default true,
  position integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id uuid primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','paid','blocked','cancelled')),
  amount_brl numeric(10,2) not null,
  provider text not null default 'mercado_pago' check (provider in ('mercado_pago')),
  provider_payment_id text,
  pix_qr_code text,
  pix_qr_code_base64 text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.sales_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  actor_user_id uuid references public.profiles(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete set null,
  purchase_id uuid references public.purchases(id) on delete set null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.contents enable row level security;
alter table public.purchases enable row level security;
alter table public.sales_logs enable row level security;

create policy "profiles_self_select" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_self_update" on public.profiles
for update using (auth.uid() = id);

create policy "products_public_read" on public.products
for select using (is_active = true or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "contents_read_paid_or_admin" on public.contents
for select using (
  exists (
    select 1
    from public.purchases p
    where p.product_id = contents.product_id
      and p.user_id = auth.uid()
      and p.status = 'paid'
  )
  or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "purchases_own_read" on public.purchases
for select using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "sales_logs_admin_read" on public.sales_logs
for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

insert into public.products (name, slug, description, price_brl, is_active, whatsapp_group_url)
values (
  'Português PMAL',
  'portugues-pmal',
  'Jogo de Português PMAL com foco em Cebraspe, revisão inteligente, histórico, fases e treino completo.',
  29.90,
  true,
  null
)
on conflict (slug) do nothing;

insert into public.contents (product_id, title, slug, description, content_type, local_path, position)
select p.id,
       'Jogo de Português PMAL',
       'jogo-portugues-pmal',
       'Versão protegida do jogo inicial da Missão de Estudo.',
       'html_local',
       'private-content/pmal/portugues-pmal.html',
       1
from public.products p
where p.slug = 'portugues-pmal'
and not exists (select 1 from public.contents c where c.slug = 'jogo-portugues-pmal');
