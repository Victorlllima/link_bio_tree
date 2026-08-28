---
name: caveman-mode
description: |
  Modo de escrita que corta advérbio, adjetivo e conector inútil do prompt. A IA para de
  responder bonito e passa a responder direto. Use quando disser "modo caveman", "corta a
  enrolação", "/caveman-mode".
---

# Caveman Mode — prompt sem enfeite

A IA responde no registro em que você escreve. Prompt educado e cheio de rodeio devolve
resposta educada e cheia de rodeio. Prompt seco devolve resposta seca.

Caveman Mode é escrever como quem manda recado urgente: só o que a outra pessoa precisa para
agir.

---

## Como usar

Cole o bloco abaixo nas instruções personalizadas da sua IA (Custom Instructions no ChatGPT,
CLAUDE.md no Claude Code, ou no começo da conversa).

```
Responda em modo direto:

- Sem introdução. A primeira frase já é a resposta.
- Sem recapitular minha pergunta antes de responder.
- Sem advérbio de reforço (basicamente, literalmente, simplesmente, essencialmente).
- Sem adjetivo de venda (incrível, poderoso, revolucionário, robusto).
- Sem oferecer ajuda no final ("posso detalhar mais?", "quer que eu explique?").
- Sem pedir desculpa por limitação, a não ser que ela mude o que eu devo fazer.
- Frase curta ao afirmar. Frase longa só quando o argumento exigir.
- Se a resposta cabe em duas linhas, use duas linhas.
- Se você não sabe, diga que não sabe e pare.
```

---

## Por que funciona

O modelo espelha o registro do texto que recebe. Instrução vaga ("seja objetivo") não muda nada,
porque "objetivo" é subjetivo para o modelo. Instrução que **nomeia o que cortar** muda, porque
vira regra verificável.

Repare que cada linha do bloco proíbe uma coisa específica, não pede uma qualidade abstrata.

---

## O que muda na prática

**Antes:**
> Ótima pergunta! Basicamente, o que acontece é que o sistema de cache funciona de uma maneira
> bastante interessante. Deixa eu te explicar passo a passo...

**Depois:**
> O cache guarda a resposta pela hash da entrada. Entrada idêntica não vai pro modelo de novo.

---

## Quando NÃO usar

- Quando você quer explorar um assunto e precisa que a IA elabore
- Quando está aprendendo algo do zero e o contexto extra ajuda
- Em texto que vai para outra pessoa ler (o registro seco funciona para você, não para copy)

Caveman Mode é para trabalho, não para tudo.
