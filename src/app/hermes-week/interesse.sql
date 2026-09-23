-- Ficha de interesse da Hermes Week reaproveita a tabela `crm_week_status`
-- (mesmo motor, mesmo painel /lpsg). A separação entre os ciclos é a coluna `ciclo`:
--   CRM Week    -> '2026-07-27'
--   Hermes Week -> '2026-09-28'
--
-- A única coisa nova é a coluna `valor`: a pergunta de disposição a pagar no valor
-- ancorado (R$1.397), que é o termômetro do método Tabari. Divisão saudável esperada:
-- 20% "sim" / 60% "talvez" / 20% "não".
--
-- Rodar manualmente no SQL Editor do Supabase self-hosted (mesmo padrão dos outros
-- .sql soltos deste projeto — não há migrations formais).

alter table crm_week_status add column if not exists valor text;

comment on column crm_week_status.valor is
  'Resposta da pergunta de valor ancorado (sim | talvez | nao). Nula nos ciclos anteriores a 2026-09-28.';
