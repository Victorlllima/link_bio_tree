---
name: teste-de-carga
description: |
  Descobre o que quebra no seu sistema quando o uso dobrar. Procura query sem índice, N+1,
  operação pesada no request, ausência de fila e de paginação — os pontos que funcionam com
  10 usuários e travam com 1.000.
  Use quando disser "isso aguenta se crescer", "teste de carga", "/teste-de-carga".
---

# Teste de Carga — funciona hoje, e amanhã?

Todo sistema funciona com um usuário. A pergunta é o que acontece na segunda-feira de manhã,
quando chegam todos de uma vez.

> Isto é **dívida técnica**: o custo de refazer sobe a cada feature nova construída em cima.
> De ~10.000 startups que subiram app feito com IA, **mais de 8.000 precisaram de resgate ou
> reconstrução** — a conta entre US$50k e US$500k.

---

## Como rodar

Dentro da pasta do projeto: `/teste-de-carga`
Ou peça: *"testa se esse projeto aguenta crescer"*.

---

## PASSO 1 — Mapear os caminhos quentes

Identifique o que roda com mais frequência:
1. Rotas chamadas em toda navegação
2. Queries executadas no carregamento de página
3. Operações disparadas por webhook
4. Jobs de cron

Sem isso, você otimiza o que ninguém usa.

---

## PASSO 2 — Os 10 pontos que quebram na escala

#### 🔴 CRÍTICO

**1 · Query sem índice em coluna de filtro**
- Procure `WHERE`, `.eq()`, `.filter()` em colunas sem índice declarado nas migrations
- **Quebra assim:** 100 registros = 5ms. 100.000 = 4s. O banco varre a tabela inteira toda vez
- **Correção:** `CREATE INDEX ON <tabela>(<coluna>);` nas colunas usadas em filtro e ordenação

**2 · N+1 — query dentro de loop**
- Procure `for`, `map`, `forEach` com `await` de banco lá dentro
- **Quebra assim:** listar 50 itens dispara 51 queries. Com 500, são 501
- **Correção:** uma query com `IN` ou `join`, não uma por item

**3 · Sem paginação**
- Procure `SELECT *`, `.select()` sem `.limit()` ou `.range()`
- **Quebra assim:** funciona até a tabela crescer; aí o payload estoura a memória
- **Correção:** limite obrigatório, com cursor ou offset

#### 🟠 ALTO

**4 · Operação pesada dentro do request**
- Envio de e-mail, geração de PDF, chamada de LLM, upload — tudo antes de responder
- **Quebra assim:** o usuário espera; sob concorrência, os requests empilham e estouram timeout
- **Correção:** responda primeiro, processe depois (fila ou background)

**5 · Sem fila para trabalho assíncrono**
- Webhook que processa tudo de forma síncrona
- **Quebra assim:** um pico de eventos derruba o endpoint e você perde evento sem saber
- **Correção:** receba, grave, responda 200, processe fora do request

**6 · Conexão de banco criada por request**
- `new Client()` dentro do handler
- **Quebra assim:** em serverless o pool esgota rápido e as conexões passam a ser recusadas
- **Correção:** use pooler (Supabase porta 6543, modo transaction) e reaproveite a conexão

**7 · Sem timeout em chamada externa**
- `fetch` sem `AbortSignal.timeout()`
- **Quebra assim:** o terceiro fica lento e o seu sistema trava junto

#### 🟡 MÉDIO

**8 · Sem cache no que muda pouco**
- Configuração, catálogo, dado calculado — recalculados a cada request

**9 · Arquivo servido pela aplicação**
- Imagem ou PDF passando pelo runtime em vez de CDN

**10 · Log de tudo em produção**
- `console.log` em caminho quente: custa I/O e enche o storage de log

---

## PASSO 3 — O laudo

```
TESTE DE CARGA — <projeto>
Data: <data>

CAMINHOS QUENTES: N identificados
  <rota/query> — chamada em <contexto>

🔴 QUEBRA PRIMEIRO (N)
  [1] <ponto> — <arquivo:linha>
      Hoje: <comportamento atual>
      Com 10x o uso: <o que acontece>
      Correção: <ação exata>

🟠 QUEBRA DEPOIS (N)
🟡 DEGRADA (N)

✅ AGUENTA (N de 10)

────────────────────────────
PONTO DE RUPTURA ESTIMADO: ~<N> usuários simultâneos
PRIMEIRO A QUEBRAR: <item, em uma linha>
```

---

## Regras de execução

- **Estimativa de ruptura vem com premissa declarada.** Se não der para estimar com o que está
  no código, diga que não dá e explique o que faltou medir
- **Não confunda lento com quebrado.** Query de 200ms é lenta; query que varre 1M de linhas em
  cada request é quebra iminente. Separe os dois
- **Não refatore sozinha.** Aponte. Mudar arquitetura sob suposição de crescimento que não veio
  também é desperdício
- **Se não houver caminho quente identificável** (projeto muito novo, sem tráfego), diga isso e
  aponte só os pontos estruturais

---

*Skill do @redpro.ia · A conta chega.*
