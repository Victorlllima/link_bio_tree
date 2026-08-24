---
name: auditoria-seguranca
description: |
  Audita a segurança de um projeto que foi construído com IA. Varre o código e as configurações
  atrás dos 12 pontos que mais expõem sistema em produção — RLS desligado, chave de API no
  frontend, CORS aberto, rota sem autenticação, segredo no repositório. Entrega um laudo com
  severidade, o arquivo e a linha exata, e o comando pra corrigir.
  Use quando disser "audita a segurança", "isso aqui tá seguro?", "/auditoria-seguranca",
  ou antes de subir qualquer coisa pra cliente.
---

# Auditoria de Segurança — o que a IA não checou por você

Você pediu um sistema. Ela entregou um sistema que funciona. Funcionar e estar seguro são
duas coisas diferentes, e ninguém verificou a segunda.

Esta skill verifica.

> Referência: numa auditoria de 1.400+ aplicações construídas com IA, **65% tinham falha de
> segurança e 58% tinham pelo menos uma crítica**. Em apps com Supabase, **88% estavam com
> Row Level Security inteiramente desabilitado.**

---

## Como rodar

Dentro da pasta do projeto:

```
/auditoria-seguranca
```

Ou peça: *"roda a auditoria de segurança nesse projeto"*.

---

## O que a skill faz

### PASSO 1 — Reconhecer o terreno

Antes de procurar problema, entender o que existe. Identifique e reporte:

1. **Stack** — leia `package.json`, `requirements.txt`, `go.mod`, `composer.json`
2. **Banco de dados** — Supabase, Postgres direto, Firebase, MongoDB, Prisma
3. **Framework** — Next.js, Vite, Express, FastAPI, Rails
4. **Onde roda** — Vercel, Netlify, VPS, Docker
5. **Autenticação** — se existe, e qual (Clerk, Auth.js, Supabase Auth, próprio)

Reporte em uma linha antes de continuar: `Stack detectada: <resumo>`.

Se o projeto não tiver nenhum desses arquivos, avise que não é um projeto de código e pare.

---

### PASSO 2 — Os 12 pontos

Verifique cada um. Para cada achado registre: **arquivo**, **linha**, **severidade**, **o que
acontece se ninguém arrumar**, e **como corrigir**.

#### 🔴 CRÍTICO — corrija antes de qualquer pessoa usar

**1 · Row Level Security desligado (Supabase/Postgres)**
- Procure em `migrations/`, `supabase/`, `*.sql`: tabelas criadas sem `ENABLE ROW LEVEL SECURITY`
- Procure `.from('` no client: qualquer tabela lida do browser sem RLS está aberta
- **O que acontece:** qualquer pessoa abre o DevTools, copia a request e lê a tabela inteira
- **Correção:** `ALTER TABLE <tabela> ENABLE ROW LEVEL SECURITY;` + policy por `auth.uid()`

**2 · Chave de API ou segredo no código do frontend**
- Procure por: `sk-`, `sk_live`, `ghp_`, `service_role`, `SUPABASE_SERVICE`, `STRIPE_SECRET`,
  `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
- Em `src/`, `app/`, `components/`, `pages/` — qualquer coisa que vá para o browser
- ⚠️ Em Next.js, **`NEXT_PUBLIC_*` vai para o browser**. Chave secreta com esse prefixo é vazamento
- **O que acontece:** a chave está no bundle. Qualquer visitante extrai e usa no seu crédito
- **Correção:** mova para variável server-side, revogue a chave exposta e gere outra

**3 · Segredo commitado no repositório**
- Verifique se `.env`, `.env.local`, `.env.production` estão no `.gitignore`
- Rode `git log --all --full-history -- .env` — se retornar commit, o segredo está no histórico
- **O que acontece:** quem clonar o repo tem suas credenciais, mesmo que você apague o arquivo hoje
- **Correção:** revogue TODAS as chaves expostas. Remover o arquivo não basta — o histórico guarda

**4 · Rota de API sem autenticação**
- Liste tudo em `app/api/`, `pages/api/`, `routes/`
- Para cada uma: existe verificação de sessão/token antes da lógica?
- Atenção especial a rotas que escrevem, deletam ou cobram
- **O que acontece:** qualquer pessoa chama a rota direto, sem passar pela sua interface
- **Correção:** verifique sessão no início do handler e retorne 401 quando não houver

---

#### 🟠 ALTO — corrija antes de produção

**5 · CORS liberado para qualquer origem**
- Procure `Access-Control-Allow-Origin: *` ou `cors()` sem configuração
- **O que acontece:** qualquer site chama sua API usando a sessão do seu usuário

**6 · Sem rate limit em rota cara**
- Rotas que chamam LLM, enviam e-mail, processam pagamento ou fazem upload
- **O que acontece:** um script roda sua fatura de API até o teto em minutos

**7 · Webhook sem verificação de assinatura**
- Procure handlers de webhook (Stripe, Hotmart, Meta) que não validam o header de assinatura
- **O que acontece:** qualquer um forja um evento de "pagamento aprovado"

**8 · Erro devolvendo stack trace para o usuário**
- Procure `catch` que retorna `error.message`, `error.stack` ou o objeto inteiro
- **O que acontece:** você entrega estrutura interna, caminho de arquivo e às vezes credencial

---

#### 🟡 MÉDIO — corrija em breve

**9 · Input do usuário indo direto para query**
- Concatenação de string em SQL, `$where` em Mongo, template literal em query
- **Correção:** query parametrizada, sempre

**10 · Upload sem validar tipo e tamanho**
- Procure handlers de upload sem checagem de MIME e sem limite de bytes

**11 · Headers de segurança ausentes**
- `Content-Security-Policy`, `X-Frame-Options`, `Strict-Transport-Security`
- Em Next.js: configure em `next.config.js` → `headers()`

**12 · Dependência com vulnerabilidade conhecida**
- Rode `npm audit --production` ou `pip-audit`
- Reporte apenas as de severidade alta ou crítica que tenham correção disponível

---

### PASSO 3 — O laudo

Entregue exatamente neste formato:

```
LAUDO DE AUDITORIA — <nome do projeto>
Stack: <resumo>
Data: <data>

🔴 CRÍTICO (N)
  [1] <ponto> — <arquivo>:<linha>
      O que acontece: <consequência concreta>
      Correção: <comando ou mudança exata>

🟠 ALTO (N)
  ...

🟡 MÉDIO (N)
  ...

✅ PASSOU (N de 12)
  <lista dos pontos que estão corretos>

────────────────────────────
DÍVIDA TOTAL: N pontos abertos
PRÓXIMA AÇÃO: <o item mais crítico, em uma linha>
```

---

## Regras de execução

- **Nunca invente achado.** Se não encontrar o padrão, marque como PASSOU. Auditoria que inventa
  problema é pior que auditoria nenhuma
- **Sempre cite arquivo e linha.** "Tem chave exposta" não serve. `src/lib/api.ts:14` serve
- **Não corrija sozinho.** Esta skill audita e reporta. A correção é decisão de quem opera —
  algumas mudanças quebram funcionalidade e precisam ser feitas com contexto
- **Se encontrar segredo exposto, avise imediatamente**, antes de terminar o resto do laudo.
  Chave vazada é urgência, não item de lista
- **Não envie nada para fora.** Tudo roda local. Nenhum trecho de código sai da máquina

---

## Depois do laudo

Cada ponto aberto é uma dívida com vencimento. Ela não some sozinha e fica mais cara com o tempo:
sistema com dívida técnica custa em média **300% mais para manter em 18 meses**.

Rode de novo depois de corrigir. E rode antes de cada entrega para cliente.

---

*Skill do @redpro.ia · A conta chega.*
