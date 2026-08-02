create table if not exists public.isandre_service_requests (
  id uuid primary key,
  reference text not null unique check (
    reference ~ '^SR-[0-9]{8}-[0-9A-F]{6}$'
  ),
  kind text not null check (kind in ('project', 'trade', 'press')),
  source text not null check (
    source in ('contact', 'product-page', 'projection', 'trade-pack', 'press-kit')
  ),
  status text not null check (
    status in ('new', 'acknowledged', 'qualified', 'closed')
  ),
  locale text not null check (locale in ('en', 'fr')),
  name text not null,
  email text not null,
  organization text,
  phone text,
  location text,
  product_id text check (
    product_id is null or product_id in ('seuil-01', 'portee-02', 'veille-03')
  ),
  finish_id text check (
    finish_id is null or finish_id in ('chalk', 'butter', 'sage', 'rose-clay')
  ),
  quantity integer check (quantity is null or quantity between 1 and 500),
  message text not null,
  privacy_accepted boolean not null check (privacy_accepted),
  marketing_consent boolean not null default false,
  notification_status text not null check (
    notification_status in ('pending', 'sent', 'skipped', 'failed')
  ),
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.isandre_service_request_events (
  id uuid primary key,
  request_id uuid not null references public.isandre_service_requests(id) on delete cascade,
  kind text not null check (
    kind in (
      'created',
      'notification_sent',
      'notification_skipped',
      'notification_failed',
      'status_changed',
      'exported'
    )
  ),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null
);

create index if not exists isandre_service_requests_created_idx
  on public.isandre_service_requests (created_at desc);

create index if not exists isandre_service_requests_email_idx
  on public.isandre_service_requests (email);

create index if not exists isandre_service_request_events_request_idx
  on public.isandre_service_request_events (request_id, created_at);

alter table public.isandre_service_requests enable row level security;
alter table public.isandre_service_request_events enable row level security;

comment on table public.isandre_service_requests is
  'Canonical project, trade and press requests. Service-role access only.';

comment on table public.isandre_service_request_events is
  'Immutable request audit journal. Service-role access only.';
