# vercel-breach-check — Auditoria de Segurança Pós-Breach da Vercel

Varre **todos os projetos da conta Vercel** do usuário via API, identifica environment variables
não marcadas como "Sensitive" que podem ter sido expostas no breach de abril/2026,
e gera um relatório `BREACH_CHECKLIST.md` com o passo a passo de rotação por serviço.

---

## Contexto do Incidente

Em abril/2026, a Vercel confirmou um breach via supply chain: o Context.ai foi comprometido por
Lumma Stealer, dando acesso ao Google Workspace de um funcionário e às **env vars não marcadas
como "Sensitive"** de clientes. O grupo ShinyHunters está vendendo os dados por $2M.

**Exposto:** env vars não-sensitive (API keys, tokens, DB credentials, signing keys), GitHub tokens, NPM tokens.
**Protegido:** env vars marcadas como `Sensitive` (criptografadas, inacessíveis).

Referência oficial: https://vercel.com/kb/bulletin/vercel-april-2026-security-incident

---

## WIZARD — Fluxo Interativo no Terminal

Conduzir o usuário passo a passo com mensagens claras. Nunca executar tudo de uma vez silenciosamente.

---

### PASSO 1 — Boas-vindas

Exibir:

```
╔══════════════════════════════════════════════════════════╗
║         VERCEL BREACH CHECK — Abril 2026                 ║
║  Vamos verificar se seus projetos foram afetados.        ║
╚══════════════════════════════════════════════════════════╝

Este wizard vai:
  1. Conectar na sua conta Vercel via API
  2. Varrer TODOS os seus projetos
  3. Identificar env vars potencialmente expostas
  4. Gerar um checklist de rotação por serviço

Tempo estimado: 1-2 minutos.
```

---

### PASSO 2 — Obter o Token da Vercel

Exibir:

```
─────────────────────────────────────────────────────────
PASSO 1/4 — Token da Vercel
─────────────────────────────────────────────────────────

Você precisa de um token de acesso pessoal da Vercel.

Como gerar:
  1. Acesse: https://vercel.com/account/tokens
  2. Clique em "Create Token"
  3. Nome sugerido: "breach-check" (pode deletar depois)
  4. Escopo: Full Account
  5. Copie o token gerado

Cole o token aqui quando estiver pronto:
```

Aguardar o usuário fornecer o token. Armazenar na variável `VERCEL_TOKEN`.

**Validar o token imediatamente:**

```bash
curl -s -H "Authorization: Bearer {VERCEL_TOKEN}" \
  "https://api.vercel.com/v2/user" | grep -q '"username"'
```

Se falhar → exibir:
```
❌ Token inválido ou sem permissão. Verifique e tente novamente.
```
Se ok → exibir:
```
✅ Token validado. Conectado como: {username}
```

---

### PASSO 3 — Listar todos os projetos

Exibir:
```
─────────────────────────────────────────────────────────
PASSO 2/4 — Buscando seus projetos na Vercel...
─────────────────────────────────────────────────────────
```

Chamar a API paginada:

```bash
# Buscar todos os projetos (paginar até não ter mais)
curl -s -H "Authorization: Bearer {VERCEL_TOKEN}" \
  "https://api.vercel.com/v9/projects?limit=100" 
```

Se houver `pagination.next`, continuar buscando até ter todos.

Exibir a lista encontrada:
```
✅ Encontrados N projetos:

  • projeto-1
  • projeto-2
  • projeto-3
  ...

Iniciando varredura de env vars...
```

---

### PASSO 4 — Varrer env vars de cada projeto

Exibir:
```
─────────────────────────────────────────────────────────
PASSO 3/4 — Analisando environment variables...
─────────────────────────────────────────────────────────
```

Para cada projeto, chamar:

```bash
curl -s -H "Authorization: Bearer {VERCEL_TOKEN}" \
  "https://api.vercel.com/v10/projects/{projectId}/env"
```

A resposta retorna cada env var com o campo `type`:
- `"type": "sensitive"` → **protegida** (não exposta)
- `"type": "encrypted"` → **protegida** (não exposta)
- `"type": "plain"` → **⚠️ potencialmente exposta**
- `"type": "secret"` → verificar se vinculado a Vercel Secrets antigo

Para cada variável `plain`, classificar pelo nome:

| Padrão no nome | Serviço | Risco |
|----------------|---------|-------|
| `STRIPE_SECRET`, `sk_live` | Stripe | 🔴 Crítico |
| `DATABASE_URL`, `POSTGRES`, `MYSQL`, `MONGODB` | Database | 🔴 Crítico |
| `SUPABASE_SERVICE_ROLE`, `SERVICE_ROLE` | Supabase | 🔴 Crítico |
| `ANTHROPIC`, `OPENAI`, `sk-` | IA | 🟠 Alto |
| `GITHUB_TOKEN`, `GH_TOKEN`, `ghp_` | GitHub | 🟠 Alto |
| `NPM_TOKEN`, `npm_` | NPM | 🟠 Alto |
| `NEXTAUTH_SECRET`, `AUTH_SECRET`, `JWT_SECRET` | Auth/JWT | 🟡 Médio |
| `WEBHOOK_SECRET`, `SIGNING_KEY` | Webhook | 🟡 Médio |
| `AWS_SECRET`, `AKIA` | AWS | 🔴 Crítico |

Exibir progresso por projeto:
```
  [1/N] projeto-alpha ............. 3 variáveis expostas ⚠️
  [2/N] projeto-beta .............. 0 variáveis expostas ✅
  [3/N] projeto-gamma ............. 7 variáveis expostas ⚠️
  ...
```

**Nunca exibir o valor das variáveis** — a API retorna `value: null` para variáveis sensitive e o valor real para plain. Se o valor vier, mostrar apenas `sk-abcd****` (primeiros 8 chars + `****`).

---

### PASSO 5 — Gerar o BREACH_CHECKLIST.md

Exibir:
```
─────────────────────────────────────────────────────────
PASSO 4/4 — Gerando checklist...
─────────────────────────────────────────────────────────
```

Criar `BREACH_CHECKLIST.md` no diretório atual:

```markdown
# Vercel Breach — Checklist de Segurança
> Gerado em: [DATA/HORA]
> Conta Vercel: [username]
> Projetos auditados: N
> Incidente: Vercel April 2026 Security Incident
> Referência: https://vercel.com/kb/bulletin/vercel-april-2026-security-incident

---

## Resumo

| Risco | Quantidade |
|-------|-----------|
| 🔴 Crítico | X |
| 🟠 Alto | Y |
| 🟡 Médio | Z |
| ✅ Protegidas (sensitive) | W |

---

## 🔴 Crítico — Rotacionar AGORA

| Projeto | Variável | Serviço | Ambiente | Ação |
|---------|----------|---------|----------|------|
| meu-projeto | DATABASE_URL | Postgres | Production | [Rotacionar →](link) |

## 🟠 Alto

| Projeto | Variável | Serviço | Ambiente | Ação |
|---------|----------|---------|----------|------|

## 🟡 Médio

| Projeto | Variável | Serviço | Ambiente | Ação |
|---------|----------|---------|----------|------|

---

## Checklist de Rotação por Serviço

### Supabase (service_role)
- [ ] https://supabase.com/dashboard → Settings → API → Rotate service_role key
- [ ] Atualizar na Vercel → marcar como **Sensitive**
- [ ] Redeploy obrigatório

### Stripe
- [ ] https://dashboard.stripe.com/apikeys → Rotacionar secret key
- [ ] Rotacionar webhook signing secret se houver
- [ ] Atualizar na Vercel → marcar como **Sensitive**
- [ ] Redeploy obrigatório

### Anthropic / OpenAI
- [ ] https://console.anthropic.com/settings/keys → Deletar key exposta → Criar nova
- [ ] https://platform.openai.com/api-keys → Deletar key exposta → Criar nova
- [ ] Atualizar na Vercel → marcar como **Sensitive**
- [ ] Redeploy obrigatório

### GitHub Tokens
- [ ] https://github.com/settings/tokens → Revogar tokens vinculados à Vercel
- [ ] Gerar novo token com escopo mínimo
- [ ] Atualizar na Vercel → marcar como **Sensitive**
- [ ] Redeploy obrigatório

### Database (DATABASE_URL)
- [ ] Rotacionar senha do usuário de banco
- [ ] Atualizar connection string na Vercel → marcar como **Sensitive**
- [ ] Verificar logs de acesso por queries suspeitas
- [ ] Redeploy obrigatório

### Auth/JWT Secrets
- [ ] Gerar novo valor: `openssl rand -base64 32`
- [ ] Atualizar na Vercel → marcar como **Sensitive**
- [ ] ⚠️ Usuários serão deslogados após redeploy
- [ ] Redeploy obrigatório

---

## Como marcar como Sensitive na Vercel

1. Acesse: https://vercel.com/[team]/[projeto]/settings/environment-variables
2. Edite a variável
3. Marque o checkbox **"Sensitive"**
4. Salve — o valor fica criptografado e invisível no dashboard

> ⚠️ IMPORTANTE: rotacionar sem fazer redeploy não resolve.
> Builds antigos continuam usando as credenciais antigas.

---

## Verificar Activity Log

https://vercel.com/[team]/settings/audit-log

Filtrar por: fevereiro–abril 2026 | IPs incomuns | leitura de env vars

---

*Gerado por vercel-breach-check*
*Referência: https://vercel.com/kb/bulletin/vercel-april-2026-security-incident*
```

---

### PASSO 6 — Resumo final no terminal

```
╔══════════════════════════════════════════════════════════╗
║                  SCAN CONCLUÍDO ✅                       ║
╚══════════════════════════════════════════════════════════╝

Projetos auditados : N
Variáveis expostas : X
  🔴 Crítico        : X1
  🟠 Alto           : X2
  🟡 Médio          : X3

📄 Checklist salvo em: BREACH_CHECKLIST.md

Próximo passo: abra o BREACH_CHECKLIST.md e comece
pelos itens 🔴 Crítico.

⚠️  Após cada rotação, faça um novo deploy na Vercel.
    Builds antigos continuam usando credenciais antigas.

Quer que eu te guie na rotação de algum serviço específico?
```

---

## Regras do agente

1. **Wizard interativo** — exibir cada passo antes de executar, nunca rodar tudo silenciosamente
2. **Nunca exibir valor completo** de token — mostrar apenas `VAR_NAME=sk-abcd****`
3. **Não rotacionar nada automaticamente** — orientar, o usuário age
4. **Token fornecido pelo usuário** → oferecer salvar no vault ao final: "Quer que eu salve esse token no vault para não precisar informar novamente?"
5. **Se a API retornar erro 403** → token sem permissão suficiente, pedir novo token com escopo Full Account
6. **Se não houver nenhuma variável exposta** → parabenizar e recomendar marcar todas as existentes como Sensitive por precaução

---

## Referências

- [Vercel April 2026 Security Incident](https://vercel.com/kb/bulletin/vercel-april-2026-security-incident)
- [Vercel API — List Projects](https://vercel.com/docs/rest-api/endpoints/projects#list-all-projects)
- [Vercel API — List Env Vars](https://vercel.com/docs/rest-api/endpoints/env-vars#list-environment-variables)
- [Sensitive Environment Variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables)
