create table if not exists public.isandre_orders (
  id uuid primary key,
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  reference text not null,
  status text not null check (
    status in ('paid', 'preparing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'refunded')
  ),
  locale text not null check (locale in ('en', 'fr')),
  market_code text,
  currency text not null,
  subtotal_cents bigint not null check (subtotal_cents >= 0),
  shipping_cents bigint not null check (shipping_cents >= 0),
  tax_cents bigint not null check (tax_cents >= 0),
  total_cents bigint not null check (total_cents >= 0),
  customer_email text,
  customer_name text,
  customer_phone text,
  shipping_address jsonb,
  lines jsonb not null default '[]'::jsonb,
  notification_status text not null check (
    notification_status in ('pending', 'sent', 'partially_sent')
  ),
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table if not exists public.isandre_order_events (
  id uuid primary key,
  stripe_event_id text not null unique,
  stripe_session_id text not null,
  kind text not null,
  status text not null check (status in ('processing', 'completed', 'failed')),
  error_code text,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index if not exists isandre_orders_customer_email_idx
  on public.isandre_orders (customer_email);

create index if not exists isandre_order_events_session_idx
  on public.isandre_order_events (stripe_session_id);

alter table public.isandre_orders enable row level security;
alter table public.isandre_order_events enable row level security;

comment on table public.isandre_orders is
  'Canonical paid-order projection. Service-role access only.';

comment on table public.isandre_order_events is
  'Stripe webhook idempotency and audit journal. Service-role access only.';
