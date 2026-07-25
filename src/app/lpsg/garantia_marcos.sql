-- Protocolo de Garantia "Primeiro cliente em 90 dias" — registro dos 6 marcos por aluno.
-- Supabase self-hosted: rodar UMA VEZ no SQL Editor de supabase.redpro.com.br.
-- Segue o padrão do lpsg_checklist: estado por chave + upsert merge-duplicates + service key.
-- Diferença: aqui a chave é POR ALUNO (email) × marco — não global.

create table if not exists public.garantia_marcos (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- chave do aluno (casa com academy_matriculas.email / crm_week_matriculas)
  email        text not null,
  nome         text,

  -- qual dos 6 marcos (id estável — NUNCA mudar depois de criado, preserva progresso)
  -- 1=nicho_oferta · 2=material_prospeccao · 3=abordou_30 · 4=followups · 5=propostas · 6=aovivo
  marco_id     smallint not null check (marco_id between 1 and 6),

  done         boolean not null default false,
  prova_url    text,                    -- link/print da prova do marco (opcional)
  observacao   text,                    -- nota livre (ex: "abordou 32 empresas")

  -- um registro por aluno por marco
  unique (email, marco_id)
);

-- consultas: por aluno (ver progresso) e por marco (ver quem travou onde)
create index if not exists garantia_marcos_email_idx on public.garantia_marcos (email);
create index if not exists garantia_marcos_marco_idx on public.garantia_marcos (marco_id, done);

-- trigger pra manter updated_at
create or replace function public.touch_garantia_marcos()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_touch_garantia_marcos on public.garantia_marcos;
create trigger trg_touch_garantia_marcos
  before update on public.garantia_marcos
  for each row execute function public.touch_garantia_marcos();

-- RLS ligado: só a service key lê/escreve (mesmo padrão das tabelas de lead).
alter table public.garantia_marcos enable row level security;

-- VIEW de resumo por aluno: quantos marcos concluídos, elegível a reembolso?
-- (elegível = os 6 marcos done E ainda sem cliente fechado — o "sem cliente" é
--  marcado manualmente por Red/suporte; aqui a view só conta os marcos)
-- ⚠️ todos_concluidos exige os 6 marcos done — NÃO bool_and(done), que daria true
-- com "2 de 2 linhas done" quando só 2 marcos foram registrados (bug pego no teste 25/07).
create or replace view public.garantia_resumo as
select
  email,
  max(nome)                              as nome,
  count(*) filter (where done)           as marcos_concluidos,
  6                                      as marcos_total,
  (count(*) filter (where done)) = 6     as todos_concluidos,
  max(updated_at)                        as ultima_atividade
from public.garantia_marcos
group by email;
