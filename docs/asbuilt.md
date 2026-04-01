# RedPro Bio - Linktree Estilo Netflix

**Descrição:** Uma página de links no estilo Netflix, onde cada link é apresentado como um "filme" em uma vitrine premium. Visual escuro, elegante, com toques de neon e animações cinematográficas. Inclui rastreamento de cliques, captura de leads e integração com pixels de marketing.

**Stack Técnica:** HTML/CSS/JS + Supabase + Vercel

**Última atualização:** 2026-01-30 11:47

---

## Informações do Projeto

| Item | Valor |
|------|-------|
| **Supabase Project ID** | `srwizjnbelpulofqcdpz` |
| **Supabase URL** | `https://srwizjnbelpulofqcdpz.supabase.co` |
| **Região** | US West 2 |
| **Deploy** | Vercel (a configurar) |

---

## Cards / Links do Hub

| # | Título | Rota | Landing Page |
|---|--------|------|-------------|
| 1 | Método S.H.A.R.K. | `/metodo` | ✅ Página existe |
| 2 | Mentoria RedPro | `/mentoria` | 🔴 Pendente |
| 3 | RedPro In Company | `/in-company` | 🔴 Pendente |
| 4 | Fale com o RedPro | `/contato` | 🔴 Pendente |
| 5 | Newsletter | `/newsletter` | 🔴 Pendente |
| 6 | Contrate um Shark | `/contrate` | 🔴 Pendente |
| 7 | Redflix | `/redflix` | 🔴 Pendente |
| 8 | Eventos e Palestras | `/eventos` | 🔴 Pendente |

---

## Roadmap de Implementação

### 🔵 FASE 01: FUNDAÇÃO (Hub Principal)

**Status:** `✅ Completa`

**Progresso:** 8/8 tarefas concluídas (100%)

#### Tarefas:
- [x] Criar estrutura de pastas do projeto
- [x] Criar index.html com estrutura base
- [x] Criar styles.css com visual Netflix + neon
- [x] Criar script.js com interatividade
- [x] Implementar cards com hover cinematográfico
- [x] Implementar modal de detalhes
- [x] Tornar responsivo (mobile/tablet/desktop)
- [x] Testar localmente

**Notas da Implementação:**
- Visual: Preto (#0D0D0D), Vermelho Netflix (#E50914), degradê neon vermelho→azul
- Hover: Zoom 10-15%, glow neon, sombra pronunciada
- Modal: Overlay escuro, animação suave, botão "Acessar"

---

### 🟢 FASE 02: LANDING PAGES

**Status:** `🔄 Em andamento`

**Prioridade de desenvolvimento:**

| Prioridade | Página | Rota | Status |
|-----------|--------|------|--------|
| ✅ 0 | Método S.H.A.R.K. | `/metodo` | ✅ Concluída |
| ✅ 1 | Mentoria RedPro | `/mentoria` | ✅ Concluída |
| ✅ 2 | RedPro In Company | `/in-company` | ✅ Concluída |
| ✅ 3 | Fale com o RedPro | `/contato` | ✅ Concluída |
| ✅ 4 | Newsletter | `/newsletter` | ✅ Concluída |
| ✅ 5 | Contrate um Shark | `/contrate` | ✅ Concluída |
| 🔴 6 | Redflix | `/redflix` | ⏳ Pendente |
| — | Eventos e Palestras | `/eventos` | ⏳ Sem prioridade definida |

---

### 🟡 FASE 03: INTELIGÊNCIA (Analytics)

**Status:** `⏳ Aguardando Fase 02`

**Progresso:** 0/6 tarefas concluídas (0%)

#### Tarefas:
- [ ] Criar tabela `cards` no Supabase
- [ ] Criar tabela `clicks` no Supabase
- [ ] Criar tabela `visitors` no Supabase
- [ ] Integrar Supabase no frontend
- [ ] Implementar contagem de cliques
- [ ] Criar dashboard básico de analytics

---

### 🟠 FASE 04: CONVERSÃO

**Status:** `⏳ Aguardando Fase 03`

**Progresso:** 0/7 tarefas concluídas (0%)

#### Tarefas:
- [ ] Criar tabela `leads` no Supabase
- [ ] Implementar campo de captura de email/WhatsApp
- [ ] Implementar pop-up inteligente
- [ ] Adicionar suporte a Meta Pixel
- [ ] Adicionar suporte a Google Analytics 4
- [ ] Adicionar suporte a TikTok Pixel
- [ ] Configurar webhook para n8n

---

### 🔴 FASE 05: PRODUÇÃO

**Status:** `⏳ Aguardando Fase 04`

**Progresso:** 0/6 tarefas concluídas (0%)

#### Tarefas:
- [ ] Configurar projeto na Vercel
- [ ] Fazer deploy
- [ ] Configurar domínio (se disponível)
- [ ] Otimizar SEO (Open Graph, meta tags)
- [ ] Testes com Ravena
- [ ] Auditoria com Kerberos

---

## Histórico de Sessões

### Sessão 2026-01-30
**Início:** 11:16
**Trabalho Realizado:**
- Especificação criada por Shiva
- Planejamento criado por Hades
- Verificação do Supabase (projeto existente, banco vazio)

**Próximos Passos:**
- Atlas inicia FASE 01

---

## Pendências e Bloqueios

**Bloqueios Atuais:**
- Nenhum

**Pendências:**
- URLs de destino ainda não existem (páginas a criar futuramente)
- Imagens/thumbnails dos cards (Atlas vai gerar)

---

## Notas Técnicas

### Decisões de Arquitetura
- **HTML/CSS/JS puro:** Projeto simples não justifica framework pesado
- **Supabase como backend:** Analytics próprio, sem depender de terceiros
- **Vercel para deploy:** Gratuito, rápido, CI/CD automático

### Variáveis de Ambiente
```env
SUPABASE_URL=https://srwizjnbelpulofqcdpz.supabase.co
SUPABASE_ANON_KEY=[a configurar]
```

---

## Backups e Segurança

### Backups Criados
- Nenhum ainda

### Tags de Versão
- Nenhuma ainda

---

**Última Atualização:** 2026-01-30 às 11:47
**Atualizado por:** HADES (setup inicial)
