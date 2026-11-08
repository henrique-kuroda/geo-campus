-- Geo Campus: banco de locais e fotos no Supabase.
-- Rode uma vez no SQL Editor do painel (Supabase → SQL Editor → New query → colar → Run).

-- Locais do jogo. A coordenada é onde a foto foi tirada (a posição de quem fotografou).
create table if not exists public.places (
  id          text primary key,                     -- ex.: 'capela'
  name        text not null,                        -- nome mostrado no resultado
  latitude    double precision not null,
  longitude   double precision not null,
  difficulty  text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  indoor      boolean not null default false,
  photos      text[] not null default '{}',         -- arquivos no bucket 'places', ex.: {'capela-1.jpg'}
  updated_at  timestamptz not null default now()
);

-- Row Level Security: o app (chave publishable) só pode LER.
-- Gravar fica só para o script de cadastro, que usa a chave secret (ela ignora o RLS).
alter table public.places enable row level security;

drop policy if exists "locais são públicos para leitura" on public.places;
create policy "locais são públicos para leitura"
  on public.places for select
  to anon, authenticated
  using (true);

grant select on public.places to anon, authenticated;

-- Bucket público das fotos: cada foto tem uma URL pública de leitura.
-- Envio de fotos também só pelo script, com a chave secret.
insert into storage.buckets (id, name, public)
values ('places', 'places', true)
on conflict (id) do update set public = true;
