-- Entrada no grupo da Imersão só por link nosso (QG 2.6, Pedido 9, Red 06/11/2026).
-- Cada comprador tem um token único; redpro.com.br/grupo/<token> confere e redireciona para o convite.
-- Rodar no Postgres do Supabase self-hosted (idempotente). Aplicado em 07/11/2026.

create table if not exists imersao_tokens (
  token     text primary key,
  transacao text not null unique,        -- transação do ingresso (8852419) ou, na Gravação sozinha, a da Gravação (8852453)
  grupo     text,                        -- 'principal' ou id em imersao_grupos_reserva; fixado no 1º clique
  criado_em timestamptz not null default now(),
  usado_em  timestamptz
);
create index if not exists imersao_tokens_grupo on imersao_tokens (grupo);

-- Grupos reserva (a AMANDA passa JID e link). O principal continua em imersao_config.link_grupo / grupo_jid.
create table if not exists imersao_grupos_reserva (
  id     text primary key,               -- 'r1', 'r2'...
  jid    text,
  link   text not null,
  limite int  not null default 900,
  ordem  int  not null,
  ativo  boolean not null default true
);
alter table imersao_config add column if not exists limite_grupo int not null default 900;

-- Token válido = compra aprovada e sem reembolso, cancelamento ou chargeback naquela transação.
create or replace view imersao_tokens_validos as
select t.token, t.transacao, t.grupo
from imersao_tokens t
where exists (select 1 from hotmart_compras c
              where c.transacao = t.transacao and c.evento = 'PURCHASE_APPROVED'
                and c.produto_id in ('8852419', '8852453'))
  and not exists (select 1 from hotmart_compras x
                  where x.transacao = t.transacao
                    and x.evento in ('PURCHASE_REFUNDED', 'PURCHASE_CANCELED', 'PURCHASE_CHARGEBACK'));

-- imersao_inscritos ganha a coluna token (no fim, para o create or replace aceitar).
create or replace view imersao_inscritos as
select
  c.transacao, c.email, c.nome, c.whatsapp, c.valor, c.criado_em,
  c.payload->'data'->'purchase'->'offer'->>'code' as oferta,
  case c.payload->'data'->'purchase'->'offer'->>'code'
    when 'sn552kkr' then 1 when '2q6t3s89' then 2 when '95tgc1no' then 3
  end as lote,
  c.payload->'data'->'purchase'->'origin'->>'sck' as sck,
  c.payload->'data'->'purchase'->'origin'->>'src' as src,
  t.token
from hotmart_compras c
left join imersao_tokens t on t.transacao = c.transacao
where c.produto_id = '8852419' and c.evento = 'PURCHASE_APPROVED'
  and not exists (select 1 from hotmart_compras x
                  where x.transacao = c.transacao
                    and x.evento in ('PURCHASE_REFUNDED', 'PURCHASE_CANCELED', 'PURCHASE_CHARGEBACK'));

alter table imersao_tokens enable row level security;
alter table imersao_grupos_reserva enable row level security;
revoke all on imersao_tokens, imersao_grupos_reserva, imersao_tokens_validos from anon, authenticated;
revoke all on imersao_inscritos from anon, authenticated;
grant select, insert, update on imersao_tokens to service_role;
grant select on imersao_grupos_reserva, imersao_tokens_validos, imersao_inscritos to service_role;

-- Backfill: um token por compra aprovada que ainda não tem (16 bytes aleatórios, base64url).
insert into imersao_tokens (token, transacao)
select translate(encode(gen_random_bytes(16), 'base64'), '+/=', '-_'), c.transacao
from hotmart_compras c
where c.evento = 'PURCHASE_APPROVED' and c.produto_id in ('8852419', '8852453')
  and not exists (select 1 from imersao_tokens t where t.transacao = c.transacao)
  -- Gravação que veio junto de um ingresso do mesmo e-mail não precisa de token próprio
  and not (c.produto_id = '8852453' and exists (
        select 1 from hotmart_compras i where lower(i.email) = lower(c.email)
          and i.produto_id = '8852419' and i.evento = 'PURCHASE_APPROVED'));
