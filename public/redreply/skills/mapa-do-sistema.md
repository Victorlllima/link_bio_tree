---
name: mapa-do-sistema
description: |
  Lê um projeto inteiro e explica o que cada parte faz, em português, para quem não escreveu o
  código. Entrega um mapa: por onde entra a requisição, onde o dado é gravado, o que depende do
  quê, e o que quebra se você mexer em cada peça.
  Use quando disser "explica esse projeto", "mapa do sistema", "/mapa-do-sistema",
  ou quando pegar um projeto que a IA construiu e você não sabe o que tem dentro.
---

# Mapa do Sistema — o que você tem nas mãos

Você pediu. Ela construiu. Funciona.

Se alguém perguntar como funciona por dentro, você responde ou muda de assunto?

> Isto é **dívida técnica**: cada semana que o sistema roda sem você entender, ele fica mais caro
> de decifrar. A IA pode fazer no seu lugar. Ela só não pode saber no seu lugar.

---

## Como rodar

Dentro da pasta do projeto: `/mapa-do-sistema`
Ou peça: *"faz o mapa desse sistema pra mim"*.

---

## PASSO 1 — O que é isto

Antes de detalhar, responda em quatro linhas:
1. **O que este sistema faz** — em uma frase, sem jargão
2. **Quem usa** — usuário final, admin, outro sistema
3. **Onde roda** — Vercel, VPS, local
4. **Do que depende para funcionar** — banco, APIs de terceiro, serviços pagos

Se alguma dessas não for respondível pelo código, diga qual e por quê.

---

## PASSO 2 — Os caminhos

### 2.1 Por onde entra
Liste cada porta de entrada:
- Páginas que o usuário abre
- Rotas de API — quem chama cada uma
- Webhooks — quem dispara
- Jobs agendados — com que frequência

Para cada uma: `<caminho> — <o que faz, em português> — <quem aciona>`

### 2.2 Onde o dado mora
- Tabelas existentes e o que cada uma guarda
- Quais são lidas pelo browser (risco) e quais só pelo servidor
- O que é gravado em arquivo, cache ou serviço externo

### 2.3 O que depende do quê
Monte a cadeia de dependência das partes principais:
```
<parte A> ──precisa de──> <parte B> ──precisa de──> <serviço externo>
```
Marque onde uma queda derruba o resto.

---

## PASSO 3 — O que quebra se você mexer

Para cada peça principal, responda:
- **Se eu apagar isto, o que para de funcionar?**
- **Se este serviço externo cair, o sistema continua de pé?**
- **Se eu mudar isto, o que mais precisa mudar junto?**

Esta seção é a mais útil do mapa. É o que separa "eu tenho um sistema" de "eu sei o que tenho".

---

## PASSO 4 — O que não dá para saber pelo código

Liste honestamente:
- Variáveis de ambiente usadas mas cujo valor você não vê
- Serviços chamados sem documentação no repositório
- Decisões que só quem escreveu saberia explicar
- Partes que parecem mortas — código que nada chama

> Código morto é dívida silenciosa: ninguém sabe se pode apagar, então fica.

---

## PASSO 5 — O mapa

```
MAPA DO SISTEMA — <projeto>
Data: <data>

O QUE É
  Faz: <uma frase>
  Usa: <quem>
  Roda em: <onde>
  Depende de: <lista>

ENTRADAS (N)
  <caminho> — <o que faz> — <quem aciona>

DADOS
  <tabela> — <o que guarda> — <lido por: browser | servidor>

CADEIA DE DEPENDÊNCIA
  <diagrama simples>

O QUE QUEBRA SE MEXER
  <peça> → derruba <o quê>

NÃO DÁ PRA SABER PELO CÓDIGO (N)
  <item> — <por que não dá>

CÓDIGO POSSIVELMENTE MORTO (N)
  <arquivo> — nada parece chamar

────────────────────────────
PARTE MAIS CRÍTICA: <a que derruba mais coisa se cair>
MAIOR ZONA CEGA: <o que ninguém consegue explicar>
```

---

## Regras de execução

- **Escreva para quem não programa.** "Middleware de autenticação" não serve; "o porteiro que
  confere se você está logado antes de deixar passar" serve
- **Não invente propósito.** Se um arquivo não deixa claro o que faz, diga que não deixa. Mapa
  com invenção é pior que mapa incompleto
- **Marque o que é suposição.** "Provavelmente serve para X" é aceitável se vier marcado
- **Não reorganize o projeto.** Esta skill lê e explica. Mover arquivo é outra conversa
- **Em projeto grande, comece pelo caminho principal** — a jornada mais comum do usuário — e
  diga o que ficou de fora

---

*Skill do @redpro.ia · A conta chega.*
