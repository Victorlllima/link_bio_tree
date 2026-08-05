-- ============================================================
-- Extensão do painel de criativos (dashboard /lpsg/criativos)
-- Rodar UMA VEZ no Supabase Studio (SQL Editor) do supabase.redpro.com.br
-- Inspirado no dashboard de criativos que a Tatá (@tata) mostrou em reel do IG (05/08/2026):
-- classificação automática por regras + cruzamento criativo x temperatura de público.
-- ============================================================

-- traf_criativos já existe (ver traf_snapshots.sql/histórico) — só adiciona as colunas que faltam
alter table traf_criativos add column if not exists roas numeric(6,2) not null default 0;
alter table traf_criativos add column if not exists receita numeric(10,2) not null default 0;
alter table traf_criativos add column if not exists adset_id text;
alter table traf_criativos add column if not exists campanha_id text;
alter table traf_criativos add column if not exists status text default 'ACTIVE';

-- Cruzamento criativo x temperatura de público (o que a Tatá chamou de "camada 2")
create table if not exists traf_criativos_publico (
  id            bigint generated always as identity primary key,
  dia           date not null,
  ad_id         text not null,
  adset_id      text not null,
  -- temperatura inferida do tipo de público do ad set — ver regra em ROUTINES-SETUP-GUIDE.md
  -- 'frio' (Advantage+/interesse amplo) | 'morno' (engajamento/vídeo) |
  -- 'quente' (visitantes de LP) | 'quentissimo' (checkout/carrinho)
  temperatura   text not null check (temperatura in ('frio','morno','quente','quentissimo')),
  gasto         numeric(10,2) not null default 0,
  purchases     integer not null default 0,
  receita       numeric(10,2) not null default 0,
  roas          numeric(6,2) not null default 0,
  criado_em     timestamptz not null default now(),
  unique (dia, ad_id, adset_id)
);

create index if not exists idx_traf_crt_publico_dia on traf_criativos_publico (dia desc);
create index if not exists idx_traf_crt_publico_ad on traf_criativos_publico (ad_id);

alter table traf_criativos_publico enable row level security;
drop policy if exists "service_all_traf_crt_publico" on traf_criativos_publico;
create policy "service_all_traf_crt_publico" on traf_criativos_publico
  for all using (true) with check (true);
