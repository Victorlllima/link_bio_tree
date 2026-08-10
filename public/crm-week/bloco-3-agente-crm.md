# BLOCO 3 — O agente comercial + conexão ao CRM

Aqui você constrói o cérebro. O aluno já tem o WhatsApp conectado (Bloco 2) e o
CRM da CRM Week rodando. Agora o Claude Code escreve um **agente** que:

1. **Recebe** cada mensagem que chega no WhatsApp (via webhook).
2. **Lê a conversa** e, com um LLM, entende o que o cliente quer e em que ponto
   da venda ele está.
3. **Move o card** desse cliente pro estágio certo do funil no CRM.
4. **Escreve um resumo** da conversa dentro do card.

> Este é o mesmo padrão do agente comercial que roda em produção no Grupo MPF
> (Bioete): um servidorzinho que recebe o webhook do WhatsApp, chama o LLM com
> "ferramentas" (mover funil, atualizar resumo) e escreve no CRM. A diferença é
> que aqui é enxuto, pro primeiro agente do aluno.

---

## O modelo mental (explique ao aluno, e entenda você)

```
Cliente manda msg no WhatsApp
   → Evolution/UZAPI dispara um WEBHOOK pro nosso agente
      → o agente pega o texto + o histórico da conversa
         → manda pro LLM: "em que estágio esse cliente está? resuma a conversa"
            → o LLM responde com o estágio + o resumo
               → o agente MOVE o card no CRM e SALVA o resumo
```

O LLM não conversa com o cliente (isso pode vir depois). Nesta primeira versão,
ele **observa** a conversa e **organiza o CRM** — que já é o que mais dá trabalho
manual pro aluno. Se ele quiser depois que o agente também RESPONDA o cliente, é
só um passo a mais (ver "Evoluções" no fim).

---

## Passo 3.1 — Levantar o que já existe (NÃO invente)

Antes de escrever, descubra a forma real do CRM do aluno. Cada CRM da CRM Week
pode ter nomes de tabela/coluna um pouco diferentes. **Leia o código/banco do CRM
dele** e confirme:

1. **Como o CRM guarda os cards?** Normalmente uma tabela tipo `deals`, `leads`
   ou `cards`, e uma de estágios (`stages`/`board_stages`) ou uma coluna de
   estágio no próprio card. Ache os nomes reais.
2. **Como se identifica o cliente?** Por telefone (`whatsapp`, `phone`,
   `whatsapp_id`)? É a chave que liga a conversa ao card.
3. **Onde vai o resumo?** Uma coluna tipo `resumo`, `summary`,
   `conversation_summary`, ou uma tabela de atividades/notas.
4. **Os estágios do funil.** Liste os nomes reais (ex: "Lead", "Necessidade",
   "Orçamento", "Venda"). O agente vai mover entre esses.
5. **Como escrever no banco.** Se o CRM tem uma API própria, use a API. Se não,
   escreve direto no Supabase com a service key (a mesma que o CRM usa).

> Faça isso lendo os arquivos do projeto do CRM do aluno (schema, `.env`,
> rotas de API). **Confirme com ele os nomes** antes de codar. Um agente que
> escreve na coluna errada é pior que agente nenhum.

---

## Passo 3.2 — As credenciais que o agente precisa

Monte um `.env` pro agente (numa pasta nova, ex: `/opt/agente-comercial` na VPS,
ou junto do CRM). Reúna:

```
# WhatsApp (do Bloco 2)
EVOLUTION_URL=<endereço da Evolution OU da UZAPI>
EVOLUTION_API_KEY=<a apikey do Bloco 2>
EVOLUTION_INSTANCE=comercial

# LLM — o aluno usa a PRÓPRIA chave (custo dele, centavos por conversa)
LLM_API_KEY=<chave do aluno>
LLM_PROVIDER=<openai | anthropic | groq>

# CRM (banco onde estão os cards)
CRM_SUPABASE_URL=<url do supabase do CRM dele>
CRM_SUPABASE_KEY=<service key do CRM dele>

# segurança do webhook
WEBHOOK_SECRET=<gere um segredo aleatório>
```

**Sobre a chave do LLM** (explique o custo honestamente ao aluno):
- Ele cria conta no provedor e pega uma chave. Paga só o que usar.
- **OpenAI** (`gpt-4o-mini`) ou **Groq** (Llama, tem free tier) são os mais baratos
  — cada análise de conversa custa **frações de centavo**. Um agente atendendo
  dezenas de clientes/dia gasta poucos reais no mês.
- Recomende começar com **Groq (grátis)** pra testar, e migrar pra OpenAI
  `gpt-4o-mini` se precisar de mais qualidade/volume. A chave é do aluno; nenhuma
  chave do Red entra aqui.

---

## Passo 3.3 — Escrever o agente (você faz isso)

Crie um servidor Node/TypeScript pequeno. A estrutura, espelhando o padrão real
do Bioete:

**a) Um endpoint de webhook** que a Evolution/UZAPI chama a cada mensagem:
```
POST /webhook/comercial
```
No handler:
1. Responda `200` na hora (pra Evolution não reenviar).
2. Ignore o que não interessa: mensagens de grupo (`@g.us`), mensagens que **nós**
   enviamos (`fromMe: true`), e duplicatas (guarde os `messageId` já vistos —
   a Evolution reenvia).
3. Extraia: telefone do cliente, nome (`pushName`), e o texto da mensagem.
   (Se vier áudio, dá pra transcrever com o LLM — mas deixe isso como evolução,
   não trave o aluno nisso no v1.)

**b) Montar o contexto da conversa.** Guarde o histórico por cliente (as últimas
N mensagens). Pode ser numa tabela simples ou no próprio Redis/Postgres. O LLM
decide melhor o estágio vendo a conversa, não só a última linha.

**c) Chamar o LLM com SAÍDA ESTRUTURADA.** Peça pro LLM devolver um JSON fixo —
isso é o que torna confiável. Exemplo de instrução (system prompt):
```
Você observa uma conversa de vendas no WhatsApp e organiza o CRM.
Os estágios do funil são: <LISTE OS ESTÁGIOS REAIS DO CRM DO ALUNO>.
Dada a conversa, responda SÓ um JSON:
{
  "estagio": "<um dos estágios acima>",
  "resumo": "<resumo curto do que o cliente quer e do ponto da conversa>",
  "nome_cliente": "<nome, se identificável>"
}
Não converse. Não invente. Se não der pra saber o estágio, use o primeiro.
```
Use o modo de "structured output"/JSON do provedor pra garantir que sempre volta
JSON válido.

**d) Escrever no CRM.** Com o JSON do LLM:
1. Ache (ou crie) o card do cliente pelo telefone.
2. **Mova** o card pro `estagio` que o LLM decidiu (resolva o `stage_id` pelo
   nome, como o Bioete faz — busca o estágio pelo label e usa o id).
3. **Salve** o `resumo` no card (coluna de resumo / nota / atividade).
4. Atualize a "última interação".

> No Bioete, isso são as ferramentas `buscarDealAtivo`, `moverFunil(dealId,
> stageName)` e `atualizarResumoConversa(dealId, resumo)`. Você vai escrever o
> equivalente pro CRM do aluno — a lógica é essa.

**e) Rodar 24/7.** Empacote o agente num container Docker (junto da Evolution, na
mesma VPS) ou como serviço. Ele precisa estar sempre no ar pra receber os webhooks.

---

## Passo 3.4 — Ligar o webhook do WhatsApp ao agente

Faça a Evolution/UZAPI mandar as mensagens pro agente.

**Evolution** (VPS): aponte o webhook da instância pro endpoint do agente:
```
curl -X POST "<EVOLUTION_URL>/webhook/set/comercial" \
  -H "apikey: <APIKEY>" -H "Content-Type: application/json" \
  -d '{"webhook":{"enabled":true,"url":"http://agente:3000/webhook/comercial","events":["MESSAGES_UPSERT"]}}'
```
(Se o agente roda no mesmo docker-compose, use o nome do serviço como host; senão,
o IP:porta.)

**UZAPI:** no painel/doc da UZAPI, configure o webhook de mensagens recebidas pra
apontar pro endpoint do agente. O formato do payload da UZAPI é diferente da
Evolution — ajuste o parser do webhook (passo 3.3.a) pro formato deles.

---

## Passo 3.5 — Testar (com o aluno, sem quebrar produção)

1. O aluno manda uma mensagem de um **outro** número pro WhatsApp comercial.
2. Confira nos logs do agente: recebeu o webhook, chamou o LLM, escreveu no CRM?
3. Abra o CRM: o card do cliente **apareceu/moveu** pro estágio certo e tem o
   **resumo**?
4. Mande mais mensagens simulando a evolução da venda (ex: "quero um orçamento")
   e veja o card **andar** no funil.

Se o card não moveu: cheque na ordem — webhook chegou? (logs) → LLM devolveu JSON
válido? → o nome do estágio bate com o do CRM? → a escrita no banco deu certo?
(permissão/coluna).

---

## Evoluções (ofereça ao aluno depois do v1 funcionar)

- **Agente que RESPONDE o cliente** (não só observa): adiciona uma tool de enviar
  mensagem pela Evolution/UZAPI e deixa o LLM conduzir o atendimento.
- **Transcrição de áudio:** cliente manda áudio → transcreve com Whisper (Groq
  tem) → entra igual texto.
- **Follow-up automático:** um cron que, se o cliente sumiu há X dias num estágio,
  o agente cutuca.
- **Transferir pra humano:** quando o LLM detecta que precisa de gente, ele
  notifica o aluno (Telegram/WhatsApp) com o resumo.

Cada uma é um passo isolado — só depois que o básico (mover card + resumo) estiver
sólido.

---

## Regras pra você (Claude Code do aluno)

- **Leia o CRM real do aluno antes de codar.** Nomes de tabela/coluna/estágio são
  a fonte de verdade — confirme, não presuma.
- **Structured output sempre.** O LLM tem que devolver JSON fixo, ou a escrita no
  CRM vira loteria.
- **Idempotência.** Guarde os `messageId` processados — a Evolution reenvia, e sem
  isso o agente processa a mesma mensagem várias vezes.
- **A chave do LLM é do aluno** e é secreta. Ele cria e cola; você não pede pra
  ver.
- **Teste com número de teste**, nunca com o cliente real na primeira vez.
- Um passo de cada vez. Só declare "pronto" quando um card mover de verdade no
  CRM com um resumo dentro.

Feito com 🦈 pela RedPro AI Academy.
