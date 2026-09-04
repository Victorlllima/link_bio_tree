-- Tabela singleton com o estado do ciclo vigente da Hermes Week.
-- Lida pelo webhook da Hotmart (e-mail de confirmação) e pelo script de
-- troca de nome do grupo. Escrita pelo Alfred toda sexta-feira (cron
-- "Cobranca Virada de Ciclo Hermes Week").
--
-- Rodar manualmente no SQL Editor do Supabase self-hosted (mesmo padrão
-- dos outros .sql soltos deste projeto — não há migrations formais).

create table if not exists ciclo_atual (
  id boolean primary key default true,
  data_inicio date not null,
  link_grupo text not null,
  atualizado_em timestamptz not null default now(),
  constraint ciclo_atual_singleton check (id)
);

alter table ciclo_atual enable row level security;
-- Sem policy: só a service key lê/escreve, mesmo padrão de garantia_marcos
-- e wpp_health_state. RLS ligado bloqueia anon/authenticated por padrão.

-- Seed inicial do ciclo 1 (14/09/2026) — ajustar antes de rodar se a data mudou.
insert into ciclo_atual (id, data_inicio, link_grupo)
values (true, '2026-09-14', 'https://chat.whatsapp.com/F3fKDtOH98MBbgkSroDt2G')
on conflict (id) do update set
  data_inicio = excluded.data_inicio,
  link_grupo = excluded.link_grupo,
  atualizado_em = now();
