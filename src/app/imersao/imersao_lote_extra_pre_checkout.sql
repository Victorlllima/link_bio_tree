-- Imersão (25 e 26/11/2026): lote extra (4) e pré-checkout da LP /imersao.
-- AINDA NÃO RODADA EM PRODUÇÃO. Rodar no Postgres do Supabase self-hosted (vps-redpro, supabase-db),
-- mesmo padrão de imersao_config.sql. Idempotente.

-- 1) lote_forcado aceita 4 (lote extra, ~R$ 57, abre acima de 50 ingressos).
alter table imersao_config drop constraint if exists imersao_config_lote;
alter table imersao_config add constraint imersao_config_lote
  check (lote_forcado is null or lote_forcado between 1 and 4);

-- 2) A view passa a reconhecer a oferta do lote extra.
--    PENDENTE: trocar 'OFERTA_LOTE_4' pelo código real quando a MIRA criar a oferta na Hotmart
--    (o mesmo código vai em LOTE_EXTRA.oferta, src/components/imersao/lote.ts).
--    Mantém o join com imersao_tokens (imersao_grupo_tokens.sql) e a ordem das colunas.
create or replace view imersao_inscritos as
select
  c.transacao, c.email, c.nome, c.whatsapp, c.valor, c.criado_em,
  c.payload->'data'->'purchase'->'offer'->>'code' as oferta,
  case c.payload->'data'->'purchase'->'offer'->>'code'
    when 'sn552kkr' then 1 when '2q6t3s89' then 2 when '95tgc1no' then 3
    when 'OFERTA_LOTE_4' then 4
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

-- 3) Pré-checkout: nome, e-mail e WhatsApp de quem clicou em comprar, antes da Hotmart.
--    Grava pela rota /api/imersao-pre-checkout (service key). Quem não comprar entra na
--    recuperação (cruzar por e-mail com imersao_inscritos).
create table if not exists imersao_pre_checkout (
  id bigint generated always as identity primary key,
  criado_em timestamptz not null default now(),
  nome text not null,
  email text not null,
  whatsapp text not null,
  lote int,
  oferta text,
  sck text,
  src text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  consentimento boolean not null default true,
  user_agent text
);
create index if not exists imersao_pre_checkout_email on imersao_pre_checkout (lower(email));
create index if not exists imersao_pre_checkout_criado on imersao_pre_checkout (criado_em desc);

alter table imersao_pre_checkout enable row level security;
revoke all on imersao_pre_checkout from anon, authenticated;
grant select, insert on imersao_pre_checkout to service_role;

revoke all on imersao_inscritos, imersao_vendas_por_lote from anon, authenticated;
grant select on imersao_inscritos, imersao_vendas_por_lote to service_role;
