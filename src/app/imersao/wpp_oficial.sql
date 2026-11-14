-- API oficial do WhatsApp (Meta): log de envios, config com interruptor e opt-out.
-- NÃO APLICADO. Aplicar só com ok do Red. Nada dispara sozinho: config.ligado nasce false.

create table if not exists wpp_oficial_config (
  id int primary key default 1 check (id = 1),
  ligado boolean not null default false,          -- interruptor geral do disparo
  limite_diario int not null default 250,         -- teto de destinatários únicos/dia (número novo da Salvy)
  atualizado_em timestamptz not null default now()
);
insert into wpp_oficial_config (id) values (1) on conflict do nothing;

create table if not exists wpp_oficial_envios (
  id bigserial primary key,
  template text not null,
  chave text not null,                            -- transacao + ':' + janela (ex.: HP123:noite1). Garante 1 envio por pessoa e momento
  transacao text,
  telefone text not null,
  status text not null default 'reservado',       -- reservado | enviado | entregue | lido | falhou
  wamid text,
  erro text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (template, chave)
);
create index if not exists wpp_oficial_envios_wamid on wpp_oficial_envios (wamid);
create index if not exists wpp_oficial_envios_dia on wpp_oficial_envios (criado_em);

create table if not exists wpp_oficial_optout (
  telefone text primary key,
  motivo text,
  criado_em timestamptz not null default now()
);

alter table wpp_oficial_config enable row level security;
alter table wpp_oficial_envios enable row level security;
alter table wpp_oficial_optout enable row level security;
