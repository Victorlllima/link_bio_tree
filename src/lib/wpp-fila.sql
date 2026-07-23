-- Fila de disparo 1:1 em massa (src/lib/wpp-fila.ts).
-- Rodar uma vez no SQL editor do Supabase self-hosted (supabase.redpro.com.br).

create table if not exists wpp_fila (
  id            bigint generated always as identity primary key,
  campanha      text not null,              -- ex: "crmweek-c1-aula1"
  telefone      text not null,              -- só dígitos, DDI 55
  nome          text,
  status        text not null default 'pendente',  -- pendente | enviado | falhou
  erro          text,
  criado_em     timestamptz not null default now(),
  processado_em timestamptz,
  -- idempotência: a mesma pessoa não entra duas vezes na mesma campanha
  unique (campanha, telefone)
);

-- índice do caminho quente: "próximos pendentes desta campanha, em ordem"
create index if not exists wpp_fila_pendentes
  on wpp_fila (campanha, status, id)
  where status = 'pendente';
