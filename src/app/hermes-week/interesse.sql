-- Ficha de interesse da Hermes Week: tabela `hermes_week_interesse` (renomeada de crm_week_status em 19/10/2026).
-- A separação entre os ciclos é a coluna `ciclo`.
--
-- A única coisa nova é a coluna `valor`: a pergunta de disposição a pagar no valor
-- ancorado (R$1.397), que é o termômetro do método Tabari. Divisão saudável esperada:
-- 20% "sim" / 60% "talvez" / 20% "não".
--
-- Rodar manualmente no SQL Editor do Supabase self-hosted (mesmo padrão dos outros
-- .sql soltos deste projeto — não há migrations formais).

alter table hermes_week_interesse add column if not exists valor text;

comment on column hermes_week_interesse.valor is
  'Resposta da pergunta de valor ancorado (sim | talvez | nao). Nula nos ciclos anteriores a 2026-09-28.';
