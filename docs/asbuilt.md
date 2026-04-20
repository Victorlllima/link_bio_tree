# RedPro Bio — Hub de Links Premium

**Descrição:** Hub central da marca RedPro — página de links premium (estilo Netflix) que conecta todos os produtos e serviços do ecossistema RedPro. Visual escuro, com identidade RedPro AI Academy (laranja, Bricolage Grotesque, #09090b).

**Stack Técnica:** Next.js 16 App Router + Tailwind CSS 4 + Framer Motion + Resend + Vercel

**Última atualização:** 2026-04-05

---

## Informações do Projeto

| Item | Valor |
|------|-------|
| **Repositório** | `github.com/Victorlllima/link_bio_tree` |
| **Branch principal** | `main` (deploy automático via Vercel) |
| **Domínio** | `www.redpro.com.br` |
| **Deploy** | Vercel (CI/CD via push no main) |
| **Supabase Project ID** | `srwizjnbelpulofqcdpz` (configurado, sem tabelas ativas) |
| **Email** | Resend (full-access key no vault global) |
| **Leads** | Resend Audience "Lista Leads" (`772bf76a-410e-49c0-8737-76f1c1279114`) |

---

## Cards / Links do Hub

| # | Título | Rota | Status |
|---|--------|------|--------|
| 1 | Método S.H.A.R.K. | `/metodo` | ✅ Ativo |
| 2 | Mentoria RedPro | `/mentoria` | ✅ Ativo |
| 3 | RedPro In Company | `/in-company` | ✅ Ativo |
| 4 | Fale com o RedPro | `/contato` | ✅ Ativo |
| 5 | Newsletter REDSHIFT | `/newsletter` | ✅ Ativo |
| 6 | Contrate um Shark | `/contrate` | ✅ Ativo |
| 7 | Eventos e Palestras | `/eventos` | 🔴 Pendente |
| 8 | Redflix | `/redflix` | 🔴 Pendente |

---

## Roadmap de Implementação

### ✅ FASE 01 — Fundação (Hub Principal)
**Status:** Completa

- [x] Estrutura Next.js 16 App Router
- [x] Design system RedPro AI Academy (laranja #f97316, Bricolage Grotesque, DM Sans, JetBrains Mono)
- [x] Cards estilo Netflix com modal de detalhes
- [x] Animações Framer Motion (hover, stagger, page transitions)
- [x] Responsividade completa
- [x] Deploy Vercel + domínio www.redpro.com.br

---

### ✅ FASE 02 — Landing Pages
**Status:** 6/8 concluídas

| # | Página | Rota | Status |
|---|--------|------|--------|
| 0 | Método S.H.A.R.K. | `/metodo` | ✅ Concluída |
| 1 | Mentoria RedPro | `/mentoria` | ✅ Concluída |
| 2 | RedPro In Company | `/in-company` | ✅ Concluída |
| 3 | Fale com o RedPro | `/contato` | ✅ Concluída |
| 4 | Newsletter REDSHIFT | `/newsletter` | ✅ Concluída |
| 5 | Contrate um Shark | `/contrate` | ✅ Concluída |
| 6 | Eventos e Palestras | `/eventos` | 🔴 Pendente (próxima) |
| 7 | Redflix | `/redflix` | 🔴 Pendente |

**Detalhes das páginas concluídas:**
- `/mentoria` — QualificationFlow em modal (5 steps), 3 planos de preço, timeline 30 dias
- `/in-company` — two-column layout, 4 módulos, 3 formatos (Workshop/Programa/Consultoria), formulário → `solutions@redpro.com.br`
- `/contato` — 5-column grid, seletor de tópicos, formulário → `contato@redpro.com.br`
- `/newsletter` — Hero tipográfico "RED/SHI/FT", capture simples, sem número exposto
- `/contrate` — Hero + how-it-works + SharkCarousel reutilizado

---

### ✅ FASE 03 — Email + Lead Capture
**Status:** Completa

- [x] Resend SDK integrado (full-access key no vault global)
- [x] 4 rotas API com envio duplo (notificação Red + confirmação lead): `/api/mentoria`, `/api/contact`, `/api/in-company`, `/api/newsletter`
- [x] 4 templates HTML transacionais em `src/lib/email-templates.ts`
- [x] Resend Audience "Lista Leads" — todos os leads salvos automaticamente com nome e email
- [x] Preview dos emails em `docs/email-preview.html`

---

### 🔴 FASE 04 — Landing Pages Pendentes
**Status:** Em andamento

#### `/eventos` — Eventos e Palestras
- [ ] Criar `src/app/eventos/page.tsx`
- [ ] Seções: hero palestrante, temas de palestra, formatos (presencial/online/híbrido), depoimentos, CTA para contratar
- [ ] Formulário de contratação → `contato@redpro.com.br` via Resend
- [ ] Adicionar card como ativo em `cards-section.tsx`

#### `/redflix` — Catálogo de Projetos
- [ ] Criar `src/app/redflix/page.tsx`
- [ ] Definir com Red: formato dos projetos (templates? projetos prontos? SaaS?)
- [ ] Integração com lista de projetos (Supabase ou estático)
- [ ] Adicionar card como ativo em `cards-section.tsx`

---

### 🟡 FASE 05 — Analytics e Conversão
**Status:** Aguardando priorização

- [ ] Criar tabelas `clicks` e `visitors` no Supabase
- [ ] Rastrear cliques nos cards do hub
- [ ] Integrar Meta Pixel (remarketing)
- [ ] Integrar Google Analytics 4
- [ ] Webhook para n8n (automação de leads)
- [ ] Pop-up de captura de email com timing inteligente

---

### 🟠 FASE 06 — Qualidade e SEO
**Status:** Aguardando Fase 04

- [ ] SEO: Open Graph por página (título, descrição, imagem)
- [ ] Favicon e ícones PWA
- [ ] Performance: lazy loading de componentes 3D pesados
- [ ] Testes com Ravena (Playwright): rotas, formulários, responsividade
- [ ] Auditoria com Kerberos: XSS, headers HTTP, secrets expostos, CORS

---

## Sugestões de Melhoria (backlog)

### UX / Produto
- [ ] **Página de obrigado pós-formulário** — atualmente o feedback é inline; uma rota `/obrigado` com social proof pode aumentar a percepção de valor
- [ ] **WhatsApp flutuante** — botão fixo no canto inferior direito em todas as páginas (sem expor o número, só o ícone)
- [ ] **Contador de alunos/clientes** — número animado no hero do hub ("X empresas transformadas")
- [ ] **Depoimentos reais** — seção de social proof no hub principal (atualmente só nas landing pages)
- [ ] **FAQ dinâmico** — perguntas frequentes na `/mentoria` e `/in-company` para reduzir objeções

### Técnico
- [ ] **Sitemap.xml e robots.txt** — necessários para indexação no Google
- [ ] **Middleware de rate limiting** nas rotas API (evitar spam nos formulários)
- [ ] **Validação de email** antes de adicionar à Audience do Resend (evitar bounces)
- [ ] **Honeypot nos formulários** — campo oculto para filtrar bots sem CAPTCHA
- [ ] **Tags por origem no Resend Audience** — atualmente todos os leads entram sem tag. Diferenciar: newsletter, mentoria, contato, in-company

### Conteúdo
- [ ] **Página `/redflix`** — definir formato: templates prontos? SaaS? Projetos open-source?
- [ ] **Vídeo de apresentação** — Red gravando um pitche de 30s para o hero do hub
- [ ] **Integração com calendário** — Calendly ou Cal.com para agendar sessão de diagnóstico direto da `/mentoria`

---

## Variáveis de Ambiente

```env
RESEND_API_KEY=<vault global: resend_api_key>
NEXT_PUBLIC_SUPABASE_URL=https://srwizjnbelpulofqcdpz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<a configurar>
```

---

## Histórico de Sessões

### Sessão 2026-01-30
- Especificação criada por Shiva
- Planejamento criado por Hades
- Hub principal (Fase 01) implementado por Atlas

### Sessão 2026-04-05
- CLAUDE.md criado com stack, arquitetura e contexto de negócio
- Fase 02: 6 landing pages implementadas (mentoria, in-company, contato, newsletter, contrate)
- Fase 03: Resend integrado com dual send (notificação + confirmação), 4 templates HTML, Resend Audiences
- Cards do hub atualizados — 6 páginas ativas com botão funcional
- Chave Resend atualizada para full-access (vault global + Vercel)
- Identidade visual RedPro AI Academy aplicada em todas as páginas

---

**Última Atualização:** 2026-04-05  
**Atualizado por:** HADES
