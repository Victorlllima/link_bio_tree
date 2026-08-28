---
name: migrar-chatgpt-claude
description: |
  Guia de migração do ChatGPT para o Claude sem recomeçar do zero: o que muda de verdade, o que
  levar junto, e o que fazer diferente. Use quando disser "migrar pro Claude", "vim do ChatGPT",
  "/migrar-chatgpt-claude".
---

# Migrar do ChatGPT pro Claude sem recomeçar do zero

Quem migra costuma repetir o mesmo erro: usar o Claude como se fosse ChatGPT com outro nome.
Funciona, mas você perde o que ele faz melhor.

Este guia é sobre o que **muda de verdade**, não sobre qual é melhor.

---

## PASSO 1 — Leve suas Custom Instructions

O que no ChatGPT é "Custom Instructions", no Claude tem dois lugares:

- **Claude.ai:** Configurações → Preferências pessoais
- **Claude Code:** arquivo `CLAUDE.md` na raiz do projeto

Copie suas instruções atuais e adapte: o Claude segue instrução de estilo com mais rigor, então
regra vaga ("seja conciso") rende menos que regra nomeada ("não abra resposta com introdução").

---

## PASSO 2 — Entenda a diferença de contexto

**ChatGPT:** conversa longa, memória entre chats, tudo num fio só.

**Claude:** janela de contexto grande, mas o contexto que importa é o que você **entrega**.
Colar o documento inteiro costuma render mais que descrever o documento.

Regra prática: se um humano precisaria ler aquilo para fazer a tarefa, cole aquilo.

---

## PASSO 3 — Projects em vez de conversa infinita

O que você resolvia com uma conversa gigante no ChatGPT, no Claude resolve melhor com
**Projects**: um espaço com arquivos de contexto fixos que valem para toda conversa dentro dele.

Use quando o mesmo contexto se repete (seu negócio, seu código, seu tom de voz).

---

## PASSO 4 — O que o Claude faz melhor (aproveite)

1. **Texto longo** — leitura e análise de documento grande sem perder o fio
2. **Código em contexto de projeto** — via Claude Code, ele lê os arquivos de verdade
3. **Seguir instrução de estilo** — regra escrita é respeitada com mais consistência
4. **Recusar com honestidade** — tende a dizer que não sabe em vez de inventar

## O que você vai sentir falta

1. **Geração de imagem nativa** — não tem; use ferramenta separada
2. **Ecossistema de GPTs prontos** — o equivalente (Projects + skills) exige montar o seu
3. **Navegação web em todo plano** — depende do plano e do modo

---

## PASSO 5 — Se você programa: instale o Claude Code

É onde a diferença fica grande. Ele lê e edita os arquivos do projeto de verdade, em vez de você
colar trecho por trecho.

```
npm install -g @anthropic-ai/claude-code
```

Depois, dentro da pasta do projeto: `claude`

Crie um `CLAUDE.md` na raiz com o contexto do projeto (stack, decisões tomadas, regras que não
podem ser quebradas). Ele lê isso sozinho em toda conversa nova.

---

## A migração em uma frase

Não traduza seu jeito de usar o ChatGPT. Traga suas instruções, entregue mais contexto, e use
Projects para o que se repete.
