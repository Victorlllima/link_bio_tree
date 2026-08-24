---
name: raio-x-custo
description: |
  Calcula quanto custa de verdade manter um sistema de IA rodando. Encontra chamadas de LLM sem
  teto, retry sem limite, contexto sendo reenviado à toa, e falta de cache. Entrega o custo
  estimado por request, por usuário e por mês — e onde está o dinheiro vazando.
  Use quando disser "quanto custa isso rodando", "raio-x de custo", "/raio-x-custo".
---

# Raio-X de Custo — a fatura que ninguém abriu

Você sabe quanto custou construir. Sabe quanto custa manter?

A maioria descobre quando a fatura chega. Esta skill descobre antes.

> Isto é **dívida técnica**, não falha: cresce todo mês que ninguém mede. Sistema com dívida
> técnica custa em média **300% mais para manter em 18 meses**.

---

## Como rodar

Dentro da pasta do projeto: `/raio-x-custo`
Ou peça: *"faz o raio-x de custo desse projeto"*.

---

## PASSO 1 — Mapear as chamadas pagas

Encontre tudo que custa por uso:

1. **Chamadas de LLM** — procure `anthropic`, `openai`, `messages.create`, `chat.completions`,
   `generateText`, `streamText`
2. **Embeddings** — `embeddings.create`, `embed`, `vectorize`
3. **Storage e banco** — uploads, queries em loop, `SELECT *` em tabela grande
4. **Serviços de terceiro** — Resend, Twilio, transcrição, geração de imagem

Para cada uma, registre: **arquivo**, **linha**, **modelo/serviço**, e **o que dispara a chamada**
(request do usuário, cron, webhook, loop).

---

## PASSO 2 — Os 8 pontos onde o dinheiro vaza

#### 🔴 CRÍTICO

**1 · Chamada de LLM sem `max_tokens`**
- Sem teto, a resposta pode ir até o limite do modelo
- **Custa:** uma resposta que devia ter 200 tokens pode sair com 4.000. 20x o previsto
- **Correção:** defina `max_tokens` no valor que a sua UI realmente exibe

**2 · Retry sem limite ou sem backoff**
- Procure `retry`, `while`, `catch` que refaz a chamada
- **Custa:** cada tentativa é cobrada como chamada nova. Um erro persistente vira loop pago
- **Correção:** teto de 3 tentativas, com espera crescente entre elas

**3 · Rota cara sem autenticação e sem rate limit**
- Rota pública que chama LLM
- **Custa:** um script roda sua cota até o teto numa madrugada
- **Correção:** rate limit por IP e, se possível, exigir sessão

#### 🟠 ALTO

**4 · Contexto reenviado inteiro a cada mensagem**
- Histórico de conversa crescendo sem corte
- **Custa:** a conversa nº 20 custa 20x a nº 1. O custo cresce dentro da mesma sessão
- **Correção:** janela deslizante ou resumo do histórico antigo

**5 · Sem cache em pergunta repetida**
- Mesma pergunta, mesma resposta, cobrada toda vez
- **Custa:** em FAQ e busca, costuma ser a maior fatia da fatura
- **Correção:** cache por hash da entrada; prompt caching quando o provedor oferece

**6 · Modelo grande em tarefa pequena**
- Classificar, extrair campo, decidir sim/não usando o modelo mais caro
- **Custa:** até 10x o necessário
- **Correção:** modelo menor na tarefa mecânica; o grande onde há julgamento

#### 🟡 MÉDIO

**7 · Embedding recalculado sem necessidade**
- Reindexação do corpus inteiro quando só uma parte mudou
- **Custa:** pouco por vez, muito no acumulado
- **Correção:** indexe por diferença, não por varredura completa

**8 · Sem registro de consumo**
- Nenhum log de tokens por request
- **Custa:** você não descobre o vazamento — descobre a fatura
- **Correção:** registre `input_tokens` e `output_tokens` por chamada

---

## PASSO 3 — A conta

Estime com os preços vigentes do provedor. Se não tiver acesso a eles, peça ao operador.

```
RAIO-X DE CUSTO — <projeto>
Data: <data>

CHAMADAS PAGAS ENCONTRADAS: N
  <arquivo:linha> — <modelo> — disparada por <origem>

CUSTO ESTIMADO
  Por request:     ~<valor>
  Por usuário/mês: ~<valor>   (assumindo <N> requests/usuário — confirmar)
  Total/mês:       ~<valor>   (assumindo <N> usuários — confirmar)

ONDE O DINHEIRO VAZA
  🔴 <ponto> — <arquivo:linha> — desperdício estimado: <valor ou múltiplo>
  🟠 ...

SE NADA MUDAR
  Em 6 meses: ~<valor>
  Em 18 meses: ~<valor>   (referência de mercado: +300%)

────────────────────────────
MAIOR VAZAMENTO: <o item nº1, em uma linha>
```

---

## Regras de execução

- **Toda estimativa vem com a premissa declarada.** "R$400/mês" sem dizer quantos usuários é
  chute. "R$400/mês assumindo 100 usuários × 30 requests" é estimativa
- **Não invente preço de modelo.** Se não souber o valor vigente, peça. Número errado aqui é pior
  que número nenhum
- **Separe o que é medido do que é estimado.** Se houver log de tokens, use o dado real e diga que
  é real
- **Não otimize sozinha.** Esta skill mede e aponta. Trocar modelo ou cortar contexto muda a
  qualidade da saída, e essa decisão é de quem opera

---

*Skill do @redpro.ia · A conta chega.*
