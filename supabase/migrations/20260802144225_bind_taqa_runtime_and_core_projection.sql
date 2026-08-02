alter table isandre_core.checkout_attempts
  add column if not exists price_book_version text not null default 'legacy';

alter table isandre_core.orders
  add column if not exists price_book_version text not null default 'legacy';

-- Stripe Checkout line items are immutable once a session is paid. A stable
-- source index lets webhook retries upsert the same lines without granting the
-- runtime DELETE on the shared house ledger.
alter table isandre_core.order_lines
  add column if not exists source_line_index integer
  check (source_line_index is null or source_line_index >= 0);

create unique index if not exists isandre_core_order_lines_source_idx
  on isandre_core.order_lines (order_id, source_line_index)
  where source_line_index is not null;

-- The public tables below are a TAQA-only operational projection. The explicit
-- discriminator makes every RLS policy auditable and prevents an accidentally
-- widened runtime role from becoming a cross-universe data path.
alter table public.isandre_orders
  add column if not exists universe_id text not null default 'taqa'
  check (universe_id = 'taqa');

alter table public.isandre_service_requests
  add column if not exists universe_id text not null default 'taqa'
  check (universe_id = 'taqa');

alter table public.isandre_service_request_events
  add column if not exists universe_id text not null default 'taqa'
  check (universe_id = 'taqa');

alter table public.isandre_passports
  add column if not exists universe_id text not null default 'taqa'
  check (universe_id = 'taqa');

alter table public.isandre_passport_repairs
  add column if not exists universe_id text not null default 'taqa'
  check (universe_id = 'taqa');

grant usage on schema public to isandre_taqa_runtime;

grant select, insert, update on public.isandre_orders
  to isandre_taqa_runtime;
grant select, insert, update on public.isandre_service_requests
  to isandre_taqa_runtime;
grant insert on public.isandre_service_request_events
  to isandre_taqa_runtime;
grant select on public.isandre_passports, public.isandre_passport_repairs
  to isandre_taqa_runtime;

-- No runtime access is granted to legacy order events, passport transfers,
-- activation claims or owner events. Those write paths remain closed until the
-- corresponding product gate is implemented and reviewed.

drop policy if exists taqa_runtime_orders_select on public.isandre_orders;
create policy taqa_runtime_orders_select on public.isandre_orders
  for select to isandre_taqa_runtime
  using (universe_id = 'taqa');

drop policy if exists taqa_runtime_orders_insert on public.isandre_orders;
create policy taqa_runtime_orders_insert on public.isandre_orders
  for insert to isandre_taqa_runtime
  with check (universe_id = 'taqa');

drop policy if exists taqa_runtime_orders_update on public.isandre_orders;
create policy taqa_runtime_orders_update on public.isandre_orders
  for update to isandre_taqa_runtime
  using (universe_id = 'taqa')
  with check (universe_id = 'taqa');

drop policy if exists taqa_runtime_service_requests_select on public.isandre_service_requests;
create policy taqa_runtime_service_requests_select on public.isandre_service_requests
  for select to isandre_taqa_runtime
  using (universe_id = 'taqa');

drop policy if exists taqa_runtime_service_requests_insert on public.isandre_service_requests;
create policy taqa_runtime_service_requests_insert on public.isandre_service_requests
  for insert to isandre_taqa_runtime
  with check (universe_id = 'taqa');

drop policy if exists taqa_runtime_service_requests_update on public.isandre_service_requests;
create policy taqa_runtime_service_requests_update on public.isandre_service_requests
  for update to isandre_taqa_runtime
  using (universe_id = 'taqa')
  with check (universe_id = 'taqa');

drop policy if exists taqa_runtime_service_request_events_insert on public.isandre_service_request_events;
create policy taqa_runtime_service_request_events_insert on public.isandre_service_request_events
  for insert to isandre_taqa_runtime
  with check (
    universe_id = 'taqa'
    and exists (
      select 1
      from public.isandre_service_requests request
      where request.id = request_id
        and request.universe_id = 'taqa'
    )
  );

drop policy if exists taqa_runtime_passports_select on public.isandre_passports;
create policy taqa_runtime_passports_select on public.isandre_passports
  for select to isandre_taqa_runtime
  using (universe_id = 'taqa' and status <> 'draft');

drop policy if exists taqa_runtime_passport_repairs_select on public.isandre_passport_repairs;
create policy taqa_runtime_passport_repairs_select on public.isandre_passport_repairs
  for select to isandre_taqa_runtime
  using (
    universe_id = 'taqa'
    and exists (
      select 1
      from public.isandre_passports passport
      where passport.serial = passport_serial
        and passport.universe_id = 'taqa'
        and passport.status <> 'draft'
    )
  );

do $$
begin
  if exists (
    select 1 from pg_roles where rolname = 'isandre_taqa_render_login'
  ) then
    execute 'grant isandre_taqa_runtime to isandre_taqa_render_login';
  end if;
end
$$;

comment on role isandre_taqa_runtime is
  'Least-privilege runtime for the ISANDRE TAQA catalog, canonical commerce projection, service requests and read-only public product passports.';
