-- Disparos automáticos NO GRUPO (broadcast do carrinho + trocas de nome).
--
-- Cada linha = um marco do dia (ex: 6h45 abre, 7h inscrições, 19h fecha 21h).
-- O cron /api/cron/disparos-grupo varre esta tabela; quando `agendar_em` chega:
--   1. se ainda não aprovado  → manda o pedido de aprovação no Telegram (link);
--   2. se aprovado            → troca o nome do grupo + posta o texto.
--
-- ⚠️ REGRA ABSOLUTA (Red 09/08): nada é enviado sem `aprovado = true`. O default
-- é false de propósito — o disparo nasce travado e só o Red libera.

create table if not exists public.disparos_grupo (
    id            bigint generated always as identity primary key,
    ciclo         text        not null,              -- ex: 'c2'
    tipo_grupo    text        not null,              -- 'carrinho' | 'semana'
    jid           text        not null,              -- 120363...@g.us
    agendar_em    timestamptz not null,              -- quando dispara (GMT-3 convertido p/ UTC)
    novo_nome     text,                              -- nome que o grupo passa a ter (null = não troca)
    texto         text,                              -- mensagem a postar (null = só troca nome)
    ordem         int         not null default 0,    -- ordem no dia (pra exibição)

    -- Aprovação (trava de segurança)
    aprovado      boolean     not null default false,
    aprovado_em   timestamptz,
    aprov_pedido_em timestamptz,                     -- quando o pedido foi ao Telegram (evita repetir)

    -- Execução + verificação de falha
    status        text        not null default 'aguardando', -- aguardando|aprovado|enviado|falhou|expirado
    key_id        text,                              -- key.id devolvido pela Evolution (rastreio de entrega)
    entrega       text,                              -- status de entrega lido depois (SERVER_ACK, etc)
    erro          text,
    nome_trocado  boolean     not null default false,
    enviado_em    timestamptz,

    criado_em     timestamptz not null default now(),
    atualizado_em timestamptz not null default now()
);

create index if not exists disparos_grupo_pendentes_idx
    on public.disparos_grupo (agendar_em)
    where status in ('aguardando', 'aprovado');

create unique index if not exists disparos_grupo_unico
    on public.disparos_grupo (ciclo, tipo_grupo, ordem);

-- Token de aprovação: em vez de guardar segredo por linha, o link de aprovação
-- usa HMAC(id + APROVACAO_SECRET). Sem coluna extra. (Verificação na rota.)

-- Mapa ciclo → grupo (opção A: JID derivado do link pela skill /atualiza-links).
create table if not exists public.grupos_ciclo (
    id         bigint generated always as identity primary key,
    ciclo      text not null,
    tipo_grupo text not null,               -- 'carrinho' | 'semana'
    jid        text not null,
    nome_grupo text,
    link       text,
    atualizado_em timestamptz not null default now(),
    unique (ciclo, tipo_grupo)
);

-- Recarrega o schema no PostgREST.
notify pgrst, 'reload schema';
