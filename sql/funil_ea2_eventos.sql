create table if not exists funil_ea2_eventos (
  id bigserial primary key,
  criado_em timestamptz not null default now(),
  transacao text not null,
  evento text not null,
  etapa text not null,
  oferta text,
  produto_id text,
  valor numeric,
  email text,
  nome text,
  fone text,
  aviso_enviado boolean default false,
  unique (transacao, evento)
);
alter table funil_ea2_eventos enable row level security;
