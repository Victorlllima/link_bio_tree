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
