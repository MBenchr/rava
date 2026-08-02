create table if not exists public.isandre_passport_activation_claims (
  id uuid primary key default gen_random_uuid(),
  passport_serial text not null references public.isandre_passports(serial) on delete cascade,
  order_id uuid references public.isandre_orders(id) on delete restrict,
  activation_secret_hash text not null unique check (
    activation_secret_hash ~ '^[0-9a-f]{64}$'
  ),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create table if not exists public.isandre_passport_owner_events (
  id uuid primary key default gen_random_uuid(),
  passport_serial text not null references public.isandre_passports(serial) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (
    action in (
      'activation_requested',
      'activated',
      'recovery_requested',
      'transfer_requested',
      'transfer_accepted',
      'transfer_cancelled',
      'data_exported',
      'retired'
    )
  ),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists isandre_passport_activation_serial_idx
  on public.isandre_passport_activation_claims (passport_serial, created_at);

create index if not exists isandre_passport_owner_events_serial_idx
  on public.isandre_passport_owner_events (passport_serial, created_at);

alter table public.isandre_passport_activation_claims enable row level security;
alter table public.isandre_passport_owner_events enable row level security;

comment on table public.isandre_passport_activation_claims is
  'One-time owner activation proof. No direct client access before H-018.';

comment on table public.isandre_passport_owner_events is
  'Append-only owner lifecycle audit. Service-role access only before H-018.';
