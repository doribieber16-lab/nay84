create type public.reservation_status as enum ('pendente','confirmada','cancelada','concluida','nao_compareceu');

create table public.restaurant_settings (
  id int primary key default 1 check (id = 1),
  total_seats int not null default 40,
  slot_minutes int not null default 30,
  seating_minutes int not null default 120,
  last_seating_before_close_minutes int not null default 60,
  min_advance_minutes int not null default 120,
  max_days_ahead int not null default 60,
  max_party int not null default 10,
  auto_confirm boolean not null default false
);
insert into public.restaurant_settings (id) values (1);
grant select on public.restaurant_settings to anon, authenticated;
grant all on public.restaurant_settings to service_role;
alter table public.restaurant_settings enable row level security;
create policy "settings public read" on public.restaurant_settings for select to anon, authenticated using (true);

create table public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  weekday int not null check (weekday between 0 and 6),
  opens time not null,
  closes time not null
);
insert into public.opening_hours (weekday, opens, closes) values
 (2,'12:00','15:00'),(2,'19:00','22:00'),
 (3,'12:00','15:00'),(3,'19:00','22:00'),
 (4,'12:00','15:00'),(4,'19:00','22:00'),
 (5,'12:00','15:00'),(5,'19:00','22:00'),
 (6,'12:00','22:00'),(0,'12:00','22:00');
grant select on public.opening_hours to anon, authenticated;
grant all on public.opening_hours to service_role;
alter table public.opening_hours enable row level security;
create policy "hours public read" on public.opening_hours for select to anon, authenticated using (true);

create table public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  day date not null,
  starts time,
  ends time,
  reason text,
  created_at timestamptz not null default now()
);
grant all on public.blocked_slots to service_role;
alter table public.blocked_slots enable row level security;

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  day date not null,
  slot time not null,
  party int not null check (party between 1 and 50),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 255),
  phone text not null check (char_length(phone) between 6 and 30),
  notes text check (char_length(notes) <= 1000),
  status public.reservation_status not null default 'pendente',
  privacy_accepted boolean not null,
  created_at timestamptz not null default now()
);
create index on public.reservations (day, status);
grant all on public.reservations to service_role;
alter table public.reservations enable row level security;

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position int not null default 0
);
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price_cents int,
  image_url text,
  allergens text[] not null default '{}',
  is_special boolean not null default false,
  is_available boolean not null default true,
  position int not null default 0
);
grant select on public.menu_categories, public.menu_items to anon, authenticated;
grant all on public.menu_categories, public.menu_items to service_role;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
create policy "cats public read" on public.menu_categories for select to anon, authenticated using (true);
create policy "items public read" on public.menu_items for select to anon, authenticated using (true);

-- Availability: returns slots with free seats for a party
create or replace function public.get_available_slots(_day date, _party int)
returns table(slot time, available boolean)
language plpgsql stable security definer set search_path = public as $$
declare
  s public.restaurant_settings;
  now_local timestamp := (now() at time zone 'Europe/Lisbon');
  h record;
  t time;
  used int;
begin
  select * into s from public.restaurant_settings where id = 1;
  if _party < 1 or _party > s.max_party then return; end if;
  if _day < now_local::date or _day > now_local::date + s.max_days_ahead then return; end if;
  if exists (select 1 from public.blocked_slots b where b.day = _day and b.starts is null) then return; end if;
  for h in select * from public.opening_hours where weekday = extract(dow from _day)::int order by opens loop
    t := h.opens;
    while t <= h.closes - make_interval(mins => s.last_seating_before_close_minutes) loop
      if (_day + t) >= now_local + make_interval(mins => s.min_advance_minutes)
         and not exists (select 1 from public.blocked_slots b where b.day = _day and b.starts is not null and t >= b.starts and t < b.ends) then
        select coalesce(sum(r.party),0) into used from public.reservations r
          where r.day = _day and r.status in ('pendente','confirmada')
            and r.slot > t - make_interval(mins => s.seating_minutes)
            and r.slot < t + make_interval(mins => s.seating_minutes);
        slot := t; available := used + _party <= s.total_seats; return next;
      end if;
      t := t + make_interval(mins => s.slot_minutes);
      exit when t < h.opens; -- wrap guard
    end loop;
  end loop;
end $$;

-- Atomic creation with lock to prevent overbooking
create or replace function public.create_reservation(_day date, _slot time, _party int, _name text, _email text, _phone text, _notes text, _privacy boolean)
returns table(id uuid, status public.reservation_status)
language plpgsql volatile security definer set search_path = public as $$
declare
  ok boolean;
  st public.reservation_status;
  new_id uuid;
begin
  if not _privacy then raise exception 'privacy_required'; end if;
  perform pg_advisory_xact_lock(hashtext('reservations:' || _day::text));
  select a.available into ok from public.get_available_slots(_day, _party) a where a.slot = _slot;
  if ok is not true then raise exception 'slot_unavailable'; end if;
  if exists (select 1 from public.reservations r where r.day = _day and r.slot = _slot and lower(r.email) = lower(_email) and r.status in ('pendente','confirmada')) then
    raise exception 'duplicate';
  end if;
  select case when auto_confirm then 'confirmada'::public.reservation_status else 'pendente' end into st from public.restaurant_settings where restaurant_settings.id = 1;
  insert into public.reservations(day, slot, party, name, email, phone, notes, status, privacy_accepted)
    values (_day, _slot, _party, trim(_name), lower(trim(_email)), trim(_phone), nullif(trim(_notes),''), st, true)
    returning reservations.id into new_id;
  id := new_id; status := st; return next;
end $$;

revoke all on function public.get_available_slots(date,int) from public;
revoke all on function public.create_reservation(date,time,int,text,text,text,text,boolean) from public;
grant execute on function public.get_available_slots(date,int) to anon, authenticated, service_role;
grant execute on function public.create_reservation(date,time,int,text,text,text,text,boolean) to service_role;