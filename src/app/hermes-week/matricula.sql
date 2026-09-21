-- Ficha de MATRÍCULA da Hermes Week (passo 2 da mensageria Tabari:
-- "1. confirma e-mail · 2. FICHA · 3. grupo").
--
-- Preenchida por quem JÁ comprou o ingresso, antes do evento começar.
-- Função: onboarding + contexto pro Red adaptar os exemplos das aulas.
-- NÃO confundir com a ficha de INTERESSE, que abre na Aula 4 e qualifica MQL
-- pro backend (De Um Agente a Um Squad R$697), que ainda não existe.
--
-- 21/09/2026: colunas profissao, gasto_mes e tempo_perdido criadas direto no
-- banco (alter table add column if not exists), porque o ciclo 1 já estava
-- rodando. Motivo: as perguntas antigas mapeavam a máquina e não a pessoa.
--
-- O `ciclo` vem de ciclo_atual.data_inicio, não é constante no código: a
-- Hermes Week é LPSG semanal e a mesma URL serve todos os ciclos.
--
-- Rodar manualmente no SQL Editor do Supabase self-hosted (mesmo padrão dos
-- outros .sql soltos deste projeto — não há migrations formais).

create table if not exists hermes_week_matriculas (
  id bigserial primary key,
  ciclo date not null,
  nome text not null,
  email text not null,
  whatsapp text,
  sistema text,
  ja_tentou text,
  onde_travou text,
  conta_ia text,
  o_que_quer text,
  maior_duvida text,        -- saiu do formulário em 21/09 (vai pra ficha de INTERESSE)
  profissao text,           -- 21/09: o que a pessoa faz
  gasto_mes text,           -- 21/09: quanto gasta por mês com IA hoje
  tempo_perdido text,       -- 21/09: horas por semana na tarefa que quer automatizar
  criado_em timestamptz not null default now(),
  constraint hermes_week_matriculas_ciclo_email unique (ciclo, email)
);

alter table hermes_week_matriculas enable row level security;
-- Sem policy: só a service key lê/escreve, mesmo padrão de ciclo_atual,
-- garantia_marcos e wpp_health_state. RLS ligado bloqueia anon/authenticated.

-- Uma pessoa pode voltar e refazer a ficha dentro do mesmo ciclo: o upsert
-- por (ciclo, email) sobrescreve em vez de duplicar.
create index if not exists hermes_week_matriculas_ciclo_idx
  on hermes_week_matriculas (ciclo, criado_em desc);
