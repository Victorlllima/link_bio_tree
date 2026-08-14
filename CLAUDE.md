# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos Essenciais

```bash
npm run dev      # Servidor de desenvolvimento (localhost:3000)
npm run build    # Build de produção
npm run start    # Servidor de produção (após build)
npm run lint     # ESLint (sem --fix automático)
```

## Stack e Arquitetura

**Next.js 16 com App Router** — toda a navegação é baseada no diretório `src/app/`. Cada rota é uma pasta com `page.tsx`.

**Rotas existentes:**
- `/` — Home (hero + cards estilo Netflix)
- `/contrate` — Contratação/Shark Radar
- `/mentoria` — Fluxo de qualificação para mentoria
- `/in-company` — Treinamentos corporativos
- `/eventos` — Eventos
- `/newsletter` — Captura de leads
- `/contato` — Terminal AI interativo

**Componentes:** Organizados por feature em `src/components/`. Componentes de UI genéricos ficam em `src/components/ui/`. Componentes de página ficam em subpastas com o nome da rota (ex: `src/components/contrate/`).

**Utilitários:** `src/lib/utils.ts` exporta `cn()` — helper que combina `clsx` + `tailwind-merge` para classes condicionais do Tailwind.

## Tecnologias Visuais

O projeto usa 3D e animações pesadas:
- **Three.js + React Three Fiber + Drei** — cenas 3D diretamente no React
- **Spline** (`@splinetool/react-spline`) — designs 3D interativos embarcados
- **Framer Motion** — animações de layout e transição de páginas

Componentes com Three.js/Spline devem ser carregados com `dynamic(() => import(...), { ssr: false })` para evitar erros de SSR.

## Estilo e Tema

**Tailwind CSS 4** com variáveis CSS semânticas definidas em `src/app/globals.css`. Todas as cores do tema usam variáveis HSL via `var(--color-*)`. Nunca hardcodar cores — sempre referenciar as variáveis existentes.

**Paleta base do projeto:** Preto (`#0D0D0D`), Vermelho Netflix (`#E50914`), neon azul (`#00D4FF`), roxo (`#8B5CF6`).

## Variáveis de Ambiente

O projeto se integra ao Supabase (Project ID: `srwizjnbelpulofqcdpz`):
```
NEXT_PUBLIC_SUPABASE_URL=https://srwizjnbelpulofqcdpz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

As Fases 2-4 do roadmap (analytics, lead capture, deploy) ainda não foram implementadas — Supabase está configurado mas sem tabelas criadas.

## Contexto de Negócio

**RedPro Bio** é o hub central da marca RedPro — página de links premium (estilo Netflix) que conecta todos os produtos e serviços do ecossistema RedPro. Red é o fundador: engenheiro, gestor de tecnologia e empreendedor em IA.

**Produtos e status das landing pages:**

| Card | Descrição | Status |
|------|-----------|--------|
| **Método S.H.A.R.K.** | Curso de criação de apps com IA — produto principal de educação | ✅ Página existe |
| **Mentoria RedPro** | Mentoria individual/grupo com Red | 🔴 Pendente (prioridade 1) |
| **RedPro In Company** | Treinamentos corporativos de IA | 🔴 Pendente (prioridade 2) |
| **Fale com o RedPro** | Canal direto de contato | 🔴 Pendente (prioridade 3) |
| **Newsletter** | Conteúdo gratuito, dicas e novidades | 🔴 Pendente (prioridade 4) |
| **Contrate um Shark** | Marketplace de devs certificados pelo Método S.H.A.R.K. | 🔴 Pendente (prioridade 5) |
| **Redflix** | Catálogo de projetos prontos para faturar | 🔴 Pendente (prioridade 6) |
| **Eventos e Palestras** | Agenda de eventos com Red | 🔴 Pendente (sem prioridade definida) |

**Roadmap de landing pages (ordem de desenvolvimento):**
1. `/mentoria` — Mentoria RedPro
2. `/in-company` — RedPro In Company
3. `/contato` — Fale com o RedPro
4. `/newsletter` — Newsletter
5. `/contrate` — Contrate um Shark
6. `/redflix` — Redflix (rota ainda não existe)

Branch principal de desenvolvimento: `layout_v2` (não `main`).

---

## 📎 Assets do RedReply — convenção fixa

Todo arquivo que uma automação do RedReply entrega por DM (skill, guia, PDF,
checklist) mora aqui:

```
public/redreply/<nome-do-arquivo>
```

E fica público em:

```
https://redpro.com.br/redreply/<nome-do-arquivo>
```

Esse é o link que vai na automação — no campo `asset_url`, ou concatenado ao
`dm_template` quando a automação não usa flow.

**Por que aqui e não no próprio RedReply:** a rota `/r/[slug]` do RedReply lê
arquivos com `readFile()` do disco local. Isso funcionava no servidor antigo,
mas em Vercel o filesystem é efêmero — o arquivo sumiria no próximo deploy.
Servir de `public/` resolve: o arquivo vai junto no build e é estático.

**Ao adicionar um asset novo:**
1. Copiar o arquivo para `public/redreply/`
2. Commitar e dar push (a Vercel republica sozinha)
3. Conferir que a URL responde 200 antes de usar na automação

Arquivos já publicados:

| Arquivo | URL |
|---|---|
| `otimiza-pagina.md` | https://redpro.com.br/redreply/otimiza-pagina.md |

---

## ⚠️ Tailscale descontinuado (2026-08-04)

O Tailscale foi **removido** da infraestrutura. Os IPs `100.64.77.5` (servidor) e `100.69.142.117` (máquina local) estão **mortos** — qualquer referência a eles é legado e não funciona.

- **SSH:** `ssh -i ~/.ssh/id_ed25519 root@46.62.143.223`
- **Banco/APIs internas:** portas bloqueadas para a internet. Acesso apenas via **túnel SSH**:
  ```bash
  ssh -i ~/.ssh/id_ed25519 -L 5432:localhost:5432 root@46.62.143.223
  ```
- Nunca reintroduzir `100.64.77.5`, `100.64.0.0/10` ou dependência de VPN Tailscale neste projeto.
- Isso vale também para o **conteúdo do portfólio** (`src/app/portfolio/page.tsx`): não listar "Tailscale" na stack de nenhum projeto.
