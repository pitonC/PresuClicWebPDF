create extension if not exists pgcrypto;

create table if not exists public.quote_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_name text not null default '',
  client_phone text not null default '',
  country_code text not null default '',
  currency_symbol text not null default '$',
  concept text not null default '',
  work_amount integer not null default 0,
  materials_amount integer not null default 0,
  deposit_amount integer not null default 0,
  total_amount integer not null default 0,
  balance_amount integer not null default 0,
  copy_to_self boolean not null default false,
  whatsapp_url text not null default '',
  created_at timestamptz not null default now()
);

alter table public.quote_records enable row level security;

drop policy if exists "Users can read their own records" on public.quote_records;
create policy "Users can read their own records"
on public.quote_records
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own records" on public.quote_records;
create policy "Users can insert their own records"
on public.quote_records
for insert
with check (auth.uid() = user_id);