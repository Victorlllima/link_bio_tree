-- Mapeia qual vídeo do YouTube é qual aula de cada ciclo da Hermes Week.
-- Usada pelo cron /api/cron/dashboard-youtube para puxar peakConcurrentViewers
-- (pico de presença ao vivo) e a duração direto do YouTube Analytics, e gravar
-- em hw_dash_manual (presenca_a{n}, duracao_a{n}) — os mesmos campos que antes
-- só entravam manualmente pela aba "Lançar números" do painel.
-- Aplicado em 10/10/2026 no Supabase self-hosted (supabase-db).

create table if not exists public.hw_dash_youtube (
  ciclo    date not null,       -- D0 do ciclo (segunda da Aula 1)
  aula_n   int not null check (aula_n between 1 and 6), -- 1-5 = aulas, 6 = apresentação/domingo
  video_id text not null,       -- id do vídeo no YouTube (não listado, estreia programada)
  atualizado_em timestamptz not null default now(),
  primary key (ciclo, aula_n)
);

alter table public.hw_dash_youtube enable row level security;
grant all on public.hw_dash_youtube to service_role;
notify pgrst, 'reload schema';
