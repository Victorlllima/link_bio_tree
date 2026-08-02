-- Mensageria do grupo (aba /lpsg). Editável na página → texto vive no banco.
-- Supabase self-hosted: rodar UMA VEZ no SQL Editor de supabase.redpro.com.br.

create table if not exists public.mensageria (
  id           bigint generated always as identity primary key,
  ordem        int not null,              -- ordem cronológica no cronograma
  ciclo        text not null default 'c1',
  quando       text not null,             -- "SEG 03/08 · 7h" (legível)
  fase         text not null,             -- rótulo curto: "Aula 1", "Carrinho"...
  nome_grupo   text,                      -- nome do grupo a aplicar naquele momento (null = mantém)
  texto        text not null,             -- a mensagem, formato WhatsApp (*negrito*)
  enviada      boolean not null default false,
  enviada_em   timestamptz,
  atualizado_em timestamptz not null default now(),
  unique (ciclo, ordem)
);

create index if not exists mensageria_ciclo_ordem on public.mensageria (ciclo, ordem);
alter table public.mensageria enable row level security;

create or replace function public.touch_mensageria()
returns trigger language plpgsql as $$
begin new.atualizado_em = now(); return new; end $$;
drop trigger if exists trg_touch_mensageria on public.mensageria;
create trigger trg_touch_mensageria before update on public.mensageria
  for each row execute function public.touch_mensageria();
