-- ============================================================================
--  Inversão da trava de aprovação (Red, 22/09/2026)
-- ----------------------------------------------------------------------------
--  ANTES: nada saía sem aprovado=true. Os 17 disparos do ciclo de agosto
--  morreram com status='expirado' e zero envios, porque ninguém clicou.
--
--  AGORA: o padrão é SAIR. O aviso chega 30 min antes no Telegram e o Red só
--  toca se quiser SEGURAR. Silêncio = aprovado.
--
--  Vale para TODOS os ciclos, inclusive as mensagens com link de compra
--  (decisão explícita do Red, 22/09).
-- ============================================================================

-- 1) Coluna do veto. `aprovado` continua existindo para aprovação explícita
--    (antecipar algo vetado), mas não é mais pré-requisito de envio.
ALTER TABLE disparos_grupo
  ADD COLUMN IF NOT EXISTS vetado_em timestamptz;

COMMENT ON COLUMN disparos_grupo.vetado_em IS
  'Quando o Red segurou este disparo. NULL = nunca vetado. O cron só não envia se status = vetado.';

COMMENT ON COLUMN disparos_grupo.aprovado IS
  'Aprovação EXPLÍCITA (opcional desde 22/09/2026). O envio NÃO depende mais disso — o padrão é enviar, e só status=vetado segura.';

-- 2) Status válidos, agora com vetado e atrasado.
--    aguardando → na fila, vai sair
--    aprovado   → aprovado explicitamente (antecipação); sai igual
--    vetado     → o Red segurou; NUNCA sai
--    enviado    → saiu
--    falhou     → tentou e a Evolution recusou
--    atrasado   → passou da tolerância; segurado por segurança
ALTER TABLE disparos_grupo DROP CONSTRAINT IF EXISTS disparos_grupo_status_chk;
ALTER TABLE disparos_grupo
  ADD CONSTRAINT disparos_grupo_status_chk
  CHECK (status IN ('aguardando','aprovado','vetado','enviado','falhou','atrasado','expirado'));

-- 3) Índice do caminho quente do cron (pendentes ordenados por horário).
CREATE INDEX IF NOT EXISTS disparos_grupo_fila_idx
  ON disparos_grupo (agendar_em)
  WHERE status IN ('aguardando','aprovado');

-- 4) Os 17 registros de agosto ficam como estão (status='expirado', histórico
--    real do que aconteceu). Não reabrir: aquele ciclo acabou.
