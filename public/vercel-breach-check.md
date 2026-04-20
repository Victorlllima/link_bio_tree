# vercel-breach-check — Auditoria de Segurança Pós-Breach da Vercel

Detecta tokens e credenciais potencialmente expostos no incidente de segurança da Vercel (abril/2026),
orienta a rotação de cada serviço e gera um relatório `BREACH_CHECKLIST.md` no projeto atual.

## Quando usar

Ativar com `/vercel-breach-check` quando:
- O aluno quer saber se seu projeto foi afetado pelo breach da Vercel de abril/2026
- Precisa de orientação para rotacionar tokens e secrets
- Quer verificar quais env vars não estavam protegidas (não-sensitive)

---

## Contexto do Incidente (resumo para o agente)

Em abril/2026, a Vercel confirmou um breach via supply chain: o Context.ai (ferramenta de IA usada
por um funcionário) foi comprometido por Lumma Stealer, permitindo acesso ao Google Workspace da Vercel
e a **environment variables não marcadas como "Sensitive"**. O grupo ShinyHunters está vendendo os dados.

**O que foi exposto:**
- Env vars NÃO marcadas como `Sensitive` (API keys, tokens, DB credentials, signing keys)
- GitHub tokens vinculados a integrações Vercel
- NPM tokens
- Builds antigos ainda usam tokens velhos até novo redeploy

**O que estava protegido:**
- Env vars marcadas como `Sensitive` (criptografadas, não acessíveis)

---

## Fluxo de Execução

### FASE 1 — Detecção do ambiente

Verificar o que está disponível, sem assumir nada:

```bash
# Verifica se Vercel CLI está instalado
vercel --version 2>/dev/null || echo "VERCEL_CLI_NOT_FOUND"

# Verifica se há .vault-context (projeto RedPro)
cat .vault-context 2>/dev/null || echo "NO_VAULT_CONTEXT"
```

Informar ao usuário:
- Se Vercel CLI disponível → vai listar env vars do projeto na Vercel
- Se não → vai escanear apenas arquivos locais (igualmente útil)

---

### FASE 2 — Scan de arquivos locais

Buscar em todos os arquivos de env do projeto:

```bash
# Listar arquivos de env encontrados
ls -la .env* 2>/dev/null
ls -la **/.env* 2>/dev/null
```

Para cada arquivo encontrado, escanear padrões de tokens usando Grep:
- `ghp_[A-Za-z0-9_]{36}` → GitHub Personal Access Token
- `github_pat_[A-Za-z0-9_]{82}` → GitHub Fine-grained PAT
- `npm_[A-Za-z0-9]{36}` → NPM Token
- `sk-[A-Za-z0-9]{48}` → OpenAI API Key
- `sk_live_[A-Za-z0-9]{24,}` → Stripe Secret Key (live)
- `pk_live_[A-Za-z0-9]{24,}` → Stripe Publishable Key (live)
- `sbp_[A-Za-z0-9]{40}` → Supabase PAT
- `eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}` → JWT / Supabase Anon/Service Key
- `AKIA[0-9A-Z]{16}` → AWS Access Key
- `[sS]ecret[_-]?[kK]ey\s*=\s*.{8,}` → Generic secret key pattern
- `[pP]assword\s*=\s*.{8,}` → Generic password pattern
- `[dD]atabase[_-]?[uU]rl\s*=\s*.{8,}` → Database URL

**Regra:** Para cada match, exibir o nome da variável mas NUNCA o valor completo — mostrar apenas os primeiros 6 chars + `****` para confirmar que há algo ali sem expor o secret.

---

### FASE 3 — Verificação via Vercel CLI (se disponível)

Se `vercel --version` retornou sucesso:

```bash
# Listar env vars do projeto linkado
npx vercel env ls 2>/dev/null
```

Analisar a saída para identificar:
- Variáveis sem a marcação `[sensitive]` / `[encrypted]`
- Quantas variáveis existem por ambiente (Production, Preview, Development)

Se o projeto não estiver linkado à Vercel:
```bash
# Verificar se há .vercel/project.json
cat .vercel/project.json 2>/dev/null
```

Informar ao usuário se o projeto não está linkado — nesse caso, apenas o scan local se aplica.

---

### FASE 4 — Classificação de risco

Para cada token/secret encontrado, classificar:

| Classificação | Critério |
|---------------|----------|
| 🔴 CRÍTICO | Token de produção (live), DB URL de produção, chave de signing |
| 🟠 ALTO | GitHub token, NPM token, JWT de serviço |
| 🟡 MÉDIO | Token de preview/staging, chave de API com escopo limitado |
| 🟢 INFO | Variável suspeita mas provavelmente não secret (ex: NODE_ENV) |

---

### FASE 5 — Geração do BREACH_CHECKLIST.md

Criar o arquivo `BREACH_CHECKLIST.md` no diretório atual com:

```markdown
# Vercel Breach — Checklist de Segurança
> Gerado em: [DATA/HORA]
> Projeto: [nome do projeto]
> Incidente: Vercel April 2026 Security Incident

## Status Geral
- [ ] Scan concluído
- [ ] Tokens identificados
- [ ] Rotações necessárias: N

## Tokens Encontrados

### 🔴 Crítico — Rotacionar AGORA

| Variável | Serviço | Arquivo | Ação |
|----------|---------|---------|------|
| EXEMPLO_KEY | OpenAI | .env.production | [Rotacionar →](https://platform.openai.com/api-keys) |

### 🟠 Alto

| Variável | Serviço | Arquivo | Ação |
|----------|---------|---------|------|

### 🟡 Médio

| Variável | Serviço | Arquivo | Ação |
|----------|---------|---------|------|

## Checklist de Rotação por Serviço

### GitHub
- [ ] Acessar: https://github.com/settings/tokens
- [ ] Revogar tokens antigos vinculados à Vercel
- [ ] Gerar novo token com escopo mínimo necessário
- [ ] Atualizar na Vercel: Settings → Environment Variables
- [ ] Marcar como **Sensitive** ao salvar
- [ ] Fazer **redeploy** do projeto

### NPM
- [ ] Acessar: https://www.npmjs.com/settings/[username]/tokens
- [ ] Revogar token exposto
- [ ] Gerar novo Automation token (para CI/CD)
- [ ] Atualizar na Vercel e marcar como Sensitive
- [ ] Fazer redeploy

### OpenAI
- [ ] Acessar: https://platform.openai.com/api-keys
- [ ] Deletar a key exposta
- [ ] Criar nova key
- [ ] Atualizar na Vercel e marcar como Sensitive
- [ ] Fazer redeploy

### Supabase
- [ ] Acessar: https://supabase.com/dashboard/project/[project-id]/settings/api
- [ ] Rotacionar o `service_role` secret
- [ ] Atualizar JWT secret se necessário: Settings → General
- [ ] Atualizar todas as env vars na Vercel e marcar como Sensitive
- [ ] Fazer redeploy

### Stripe
- [ ] Acessar: https://dashboard.stripe.com/apikeys
- [ ] Rotacionar secret key (sk_live_*)
- [ ] Atualizar webhook secret se houver
- [ ] Atualizar na Vercel e marcar como Sensitive
- [ ] Fazer redeploy

### AWS
- [ ] Acessar: https://console.aws.amazon.com/iam/
- [ ] Desativar access key exposta
- [ ] Criar nova access key com política mínima
- [ ] Atualizar na Vercel e marcar como Sensitive
- [ ] Fazer redeploy

### Database (Postgres/MySQL/MongoDB)
- [ ] Rotacionar senha do usuário de banco
- [ ] Atualizar DATABASE_URL / connection string
- [ ] Marcar como Sensitive na Vercel
- [ ] Fazer redeploy
- [ ] Verificar logs de acesso por atividade suspeita

## Como marcar como Sensitive na Vercel

1. Acessar: https://vercel.com/[team]/[project]/settings/environment-variables
2. Clicar no ícone de edição da variável
3. Marcar o checkbox **"Sensitive"**
4. Salvar — o valor será criptografado e não poderá mais ser lido pelo dashboard

> ⚠️ Após rotacionar qualquer variável, é OBRIGATÓRIO fazer um novo deploy.
> Builds antigos continuam usando as credenciais antigas até o redeploy.

## Verificação de Activity Log

Acessar: https://vercel.com/[team]/settings/audit-log

Verificar por:
- Acessos entre fevereiro e abril de 2026
- IPs incomuns
- Deploy triggers não autorizados
- Leitura de environment variables

## Próximos Passos

- [ ] Rotacionar todos os itens marcados acima
- [ ] Fazer redeploy após cada rotação
- [ ] Configurar alertas de segurança no GitHub: Settings → Code security
- [ ] Instalar GitGuardian ou similar para detecção contínua de secrets

---
*Gerado por Claude Code — Skill vercel-breach-check*
*Referência: https://vercel.com/kb/bulletin/vercel-april-2026-security-incident*
```

---

### FASE 6 — Instruções finais ao usuário

Após gerar o checklist, apresentar um resumo claro:

```
✅ Scan concluído.
📄 Checklist salvo em: BREACH_CHECKLIST.md

Encontrados: N tokens para rotacionar
🔴 Crítico: X  |  🟠 Alto: Y  |  🟡 Médio: Z

Próximo passo: comece pelos itens 🔴 Crítico.
Cada item tem o link direto para rotacionar no serviço.

⚠️  Lembrete: após rotacionar, sempre faça um novo deploy na Vercel.
```

---

## Regras do agente ao executar esta skill

1. **Nunca exibir o valor completo de um token** — mostrar apenas `NOME_DA_VAR=sk-abcd****`
2. **Não rotacionar nada automaticamente** — a skill orienta, o usuário age
3. **Se não encontrar nenhum arquivo .env** → informar que o scan local não encontrou arquivos, mas recomendar verificar o dashboard da Vercel manualmente
4. **Se Vercel CLI não estiver disponível** → continuar normalmente com scan local, sem pedir para instalar
5. **Ao final**, sempre perguntar: "Quer que eu te guie na rotação de algum serviço específico passo a passo?"

---

## Referências

- [Vercel April 2026 Security Incident](https://vercel.com/kb/bulletin/vercel-april-2026-security-incident)
- [Sensitive Environment Variables — Vercel Docs](https://vercel.com/docs/environment-variables/sensitive-environment-variables)
- [Incident Response Playbook — GitHub](https://github.com/OpenSourceMalware/vercel-april2026-incident-response)
- [BleepingComputer — Vercel confirms breach](https://www.bleepingcomputer.com/news/security/vercel-confirms-breach-as-hackers-claim-to-be-selling-stolen-data/)
