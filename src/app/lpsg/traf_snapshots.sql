-- ============================================================
-- Tabela de snapshots diários do tráfego (dashboard /lpsg/metricas)
-- Rodar UMA VEZ no Supabase Studio (SQL Editor) do supabase.redpro.com.br
-- ============================================================

create table if not exists traf_snapshots (
  id            bigint generated always as identity primary key,
  dia           date not null,                    -- dia do snapshot (GMT-3), ex: 2026-07-15
  campanha_id   text not null default 'iaa',      -- 'iaa' | 'ingresso' | outra campanha
  -- métricas cruas da Meta (o que a API devolve)
  gasto         numeric(10,2) not null default 0, -- R$ gastos no dia
  impressoes    integer       not null default 0,
  alcance       integer       not null default 0,
  cliques       integer       not null default 0,
  link_clicks   integer       not null default 0, -- cliques no link (mais preciso que cliques totais)
  ctr           numeric(6,3)  not null default 0, -- %
  cpc           numeric(10,2) not null default 0, -- R$
  cpm           numeric(10,2) not null default 0, -- R$
  frequencia    numeric(6,2)  not null default 0,
  -- funil de conversão (eventos do pixel)
  page_views       integer not null default 0,
  view_content     integer not null default 0,
  initiate_checkout integer not null default 0,
  purchases        integer not null default 0,
  receita          numeric(10,2) not null default 0, -- R$ de vendas atribuídas
  -- metadados
  fonte         text not null default 'manual',   -- 'manual' (Claude puxou) | 'api' (automático)
  criado_em     timestamptz not null default now(),
  -- um snapshot por dia por campanha (o mais recente vence)
  unique (dia, campanha_id)
);

-- índice pra ordenar o histórico rápido
create index if not exists idx_traf_snapshots_dia on traf_snapshots (dia desc);

-- deixa o PostgREST enxergar a tabela sem RLS travar (mesma config do lpsg_checklist)
alter table traf_snapshots enable row level security;

-- policy: leitura e escrita liberadas via service_key (a API route usa service key, que ignora RLS,
-- mas criamos a policy explícita por segurança e consistência com o padrão do projeto)
drop policy if exists "service_all_traf" on traf_snapshots;
create policy "service_all_traf" on traf_snapshots
  for all using (true) with check (true);
