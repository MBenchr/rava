create table if not exists public.isandre_passports (
  serial text primary key check (
    serial ~ '^TAQA-(S01|P02|V03)-20(2[6-9]|[3-9][0-9])-[0-9]{6}-[0-9A-Z]$'
  ),
  product_id text not null check (product_id in ('seuil-01', 'portee-02', 'veille-03')),
  finish_id text not null check (finish_id in ('chalk', 'butter', 'sage', 'rose-clay')),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'transferred', 'retired')
  ),
  manufactured_at date,
  activated_at timestamptz,
  material_batch text,
  edition text,
  nfc_uid_hash text unique,
  owner_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.isandre_passport_repairs (
  id uuid primary key default gen_random_uuid(),
  passport_serial text not null references public.isandre_passports(serial) on delete cascade,
  kind text not null,
  internal_notes text,
  public_summary text not null,
  provider_name text,
  completed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.isandre_passport_transfers (
  id uuid primary key default gen_random_uuid(),
  passport_serial text not null references public.isandre_passports(serial) on delete cascade,
  from_owner_user_id uuid references auth.users(id) on delete set null,
  to_owner_user_id uuid references auth.users(id) on delete set null,
  status text not null check (status in ('requested', 'accepted', 'cancelled')),
  requested_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.isandre_passports enable row level security;
alter table public.isandre_passport_repairs enable row level security;
alter table public.isandre_passport_transfers enable row level security;

comment on table public.isandre_passports is
  'Product identity and ownership registry. No public direct table access.';

comment on table public.isandre_passport_repairs is
  'Durable service history attached to a product passport.';

comment on table public.isandre_passport_transfers is
  'Voluntary ownership transfer audit. Requires authenticated owner service.';
