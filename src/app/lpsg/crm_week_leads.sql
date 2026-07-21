-- ============================================================
-- Tabelas das DUAS fichas do CRM Week (padrão Tabari)
-- Rodar UMA VEZ no Supabase Studio (SQL Editor) do supabase.redpro.com.br
--
-- 1. crm_week_matriculas → ficha de MATRÍCULA (pós-compra do ingresso, antes do evento)
--    Fonte Tabari: "1. confirma e-mail · 2. FICHA · 3. grupo backup"
--
-- 2. crm_week_status → ficha de INTERESSE / MQL (abre na aula 4, quinta)
--    Fonte Tabari: "Aula 4 pre-pitch sem preço + ficha de interesse (4 perguntas MQL)"
--    Quem preenche entra no carrinho às 6h50 (10min antes dos demais)
--
-- O campo `ciclo` permite rodar semana após semana sem misturar coortes.
-- ============================================================

-- ------------------------------------------------------------
-- 1. FICHA DE MATRÍCULA
-- ------------------------------------------------------------
create table if not exists crm_week_matriculas (
  id            bigint generated always as identity primary key,
  ciclo         text not null default '2026-07-27',  -- data da segunda que abre o ciclo
  -- identificação
  nome          text not null,
  email         text not null,
  whatsapp      text not null,
  -- contexto do aluno (adapta os exemplos das aulas)
  ocupacao      text,   -- clt | autonomo | empresa | entre-empregos | estudante
  nivel_ia      text,   -- nunca | basico | intermediario | avancado
  ja_construiu  text,   -- nunca | tentei-travei | terminei
  nicho         text,   -- livre, opcional
  objetivo      text,   -- nova-renda | atender-empresas | minha-empresa | carreira | aprender
  maior_duvida  text,   -- livre, opcional
  criado_em     timestamptz not null default now()
);

-- Um e-mail só se matricula uma vez por ciclo (repreenchimento atualiza, não duplica).
create unique index if not exists crm_week_matriculas_ciclo_email
  on crm_week_matriculas (ciclo, email);   -- coluna simples: o PostgREST nao casa on_conflict com indice de expressao (lower())

create index if not exists crm_week_matriculas_criado
  on crm_week_matriculas (criado_em desc);

-- ------------------------------------------------------------
-- 2. FICHA DE INTERESSE (MQL)
-- ------------------------------------------------------------
create table if not exists crm_week_status (
  id            bigint generated always as identity primary key,
  ciclo         text not null default '2026-07-27',
  -- identificação
  nome          text not null,
  email         text not null,
  whatsapp      text not null,
  -- as 4 perguntas MQL
  execucao      text,   -- no-ar | construindo | assistindo | atrasado
  intencao      text,   -- viver-disso | renda-extra | minha-empresa | nao-sei
  quando        text,   -- agora | mes | trimestre | sem-pressa
  trava         text,   -- livre (objeção pro pitch de domingo)
  -- qualificação calculada no servidor
  tag           text,   -- HOT | WARM | COLD
  score         integer not null default 0,  -- 0-9
  criado_em     timestamptz not null default now()
);

create unique index if not exists crm_week_status_ciclo_email
  on crm_week_status (ciclo, email);   -- idem: e-mail e normalizado (lowercase) na aplicacao

-- Ordenar os leads mais quentes primeiro é a consulta principal do painel.
create index if not exists crm_week_status_score
  on crm_week_status (ciclo, score desc, criado_em desc);

-- ------------------------------------------------------------
-- RLS: as tabelas são escritas/lidas só pela service key (rotas de API).
-- Nenhum acesso anônimo — os dados são pessoais (nome, e-mail, WhatsApp).
-- ------------------------------------------------------------
alter table crm_week_matriculas enable row level security;
alter table crm_week_status     enable row level security;
