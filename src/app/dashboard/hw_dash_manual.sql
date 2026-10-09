-- Números do painel /dashboard que NÃO têm fonte automática (presença ao vivo
-- no YouTube, views únicos, duração das aulas, verba de distribuição, vendas
-- da Formação enquanto não existe produto na Hotmart, metas do ciclo).
-- Uma linha por (ciclo, chave). Escrito pela aba "Lançar números" do painel.
-- Aplicado em 09/10/2026 no Supabase self-hosted (supabase-db).

create table if not exists public.hw_dash_manual (
  ciclo date not null,          -- D0 do ciclo (segunda da Aula 1)
  chave text not null,          -- ex.: presenca_a1, unicos_a2, verba_distribuicao
  valor numeric,
  atualizado_em timestamptz not null default now(),
  primary key (ciclo, chave)
);

alter table public.hw_dash_manual enable row level security;
-- Sem policy: só a service key lê/escreve (mesmo padrão de ciclo_atual).
grant all on public.hw_dash_manual to service_role;
notify pgrst, 'reload schema';
