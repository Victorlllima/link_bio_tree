-- Lista "QUERO SABER" da Imersão (slide 39, ponte do fim da noite 1, 25/11/2026).
-- Quem levanta a mão vira lista de quentes da equipe. Lida pela Amanda (service key, VPS).
create table if not exists quero_saber (
  id bigserial primary key,
  nome text not null,
  email text not null,          -- e-mail usado na compra do ingresso
  whatsapp text not null,
  interesse text,               -- squad | video | outro (opcional)
  origem text,                  -- utm_source/medium/campaign que veio no QR
  criado_em timestamptz not null default now(),
  constraint quero_saber_email unique (email)
);
alter table quero_saber enable row level security;
-- Sem policy: só a service key lê/escreve (padrão hermes_week_matriculas).
