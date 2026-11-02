-- Estado vivo da Imersão RedPro (25 e 26/11/2026) e contagem de ingressos por lote.
-- Lido pela LP /imersao e pela página de obrigado via PostgREST (service key, ISR de 60 s).
-- Rodar no Postgres do Supabase self-hosted (mesmo padrão de ciclo_atual.sql; não há migrations formais).
-- Idempotente: pode rodar de novo sem perder o que o Red ou o BEACON já gravaram.

create table if not exists imersao_config (
  id boolean primary key default true,
  lote_forcado int,                 -- null = a página calcula o lote pela data; 1, 2 ou 3 força o lote (esgotou antes)
  limite_lote int,                  -- null = sem limite real: a página não mostra "% vendido"
  link_grupo text,                  -- grupo da turma; vazio = obrigado mostra o aviso de suporte
  link_preinstalacao text,          -- guia de pré-instalação, quando existir
  encerrado boolean not null default false,
  atualizado_em timestamptz not null default now(),
  constraint imersao_config_singleton check (id),
  constraint imersao_config_lote check (lote_forcado is null or lote_forcado between 1 and 3),
  constraint imersao_config_limite check (limite_lote is null or limite_lote > 0)
);

alter table imersao_config enable row level security;
-- Sem policy: só a service key lê e escreve (garantia_marcos, ciclo_atual). anon e authenticated ficam sem acesso.
revoke all on imersao_config from anon, authenticated;

-- Semente: tudo neutro. link_grupo fica vazio até o Red/BEACON criar o grupo da Imersão.
insert into imersao_config (id) values (true) on conflict (id) do nothing;

-- Ingressos aprovados e ainda de pé (sem reembolso, cancelamento ou chargeback depois), com o lote da oferta.
-- Ofertas: sn552kkr = lote 1 (R$ 44), 2q6t3s89 = lote 2 (R$ 53), 95tgc1no = lote 3 (R$ 62). Produto 8852419.
create or replace view imersao_inscritos as
select
  c.transacao,
  c.email,
  c.nome,
  c.whatsapp,
  c.valor,
  c.criado_em,
  c.payload->'data'->'purchase'->'offer'->>'code' as oferta,
  case c.payload->'data'->'purchase'->'offer'->>'code'
    when 'sn552kkr' then 1
    when '2q6t3s89' then 2
    when '95tgc1no' then 3
  end as lote,
  c.payload->'data'->'purchase'->'origin'->>'sck' as sck,
  c.payload->'data'->'purchase'->'origin'->>'src' as src
from hotmart_compras c
where c.produto_id = '8852419'
  and c.evento = 'PURCHASE_APPROVED'
  and not exists (
    select 1 from hotmart_compras x
    where x.transacao = c.transacao
      and x.evento in ('PURCHASE_REFUNDED', 'PURCHASE_CANCELED', 'PURCHASE_CHARGEBACK')
  );

create or replace view imersao_vendas_por_lote as
select lote, count(*)::int as vendidos
from imersao_inscritos
where lote is not null
group by lote;

revoke all on imersao_inscritos, imersao_vendas_por_lote from anon, authenticated;
grant select on imersao_inscritos, imersao_vendas_por_lote to service_role;
